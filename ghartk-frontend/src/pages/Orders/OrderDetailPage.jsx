import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft, FiPhone } from 'react-icons/fi'
import { orderAPI } from '../../api/endpoints'
import { formatCurrency, formatDate, getOrderStatusInfo } from '../../utils/helpers'

const STEPS = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']
const STEP_LABELS = { PLACED: 'Placed', CONFIRMED: 'Confirmed', PREPARING: 'Preparing', OUT_FOR_DELIVERY: 'On the way', DELIVERED: 'Delivered' }
const STEP_ICONS = { PLACED: '📋', CONFIRMED: '✅', PREPARING: '👨‍🍳', OUT_FOR_DELIVERY: '🛵', DELIVERED: '🎉' }

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getById(id),
    refetchInterval: (data) => {
      const status = data?.data?.status
      return ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(status) ? 30000 : false
    },
  })

  const order = data?.data
  if (isLoading) return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30 }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 150, borderRadius: 16, marginBottom: 16 }} />)}
      </div>
    </div>
  )
  if (!order) return null

  const statusInfo = getOrderStatusInfo(order.status)
  const currentStep = STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30, paddingBottom: 40, maxWidth: 680 }}>
        <button className="btn btn-ghost" onClick={() => navigate('/orders')} style={{ marginBottom: 20 }}>
          <FiArrowLeft /> Back to Orders
        </button>

        {/* Status Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ padding: '24px', background: isCancelled ? '#FFEBEE' : 'linear-gradient(135deg, #FF6B00, #FF8C00)', borderRadius: '16px 16px 0 0', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>{statusInfo.emoji}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isCancelled ? 'var(--danger)' : '#fff', marginBottom: 4 }}>
              {statusInfo.label}
            </div>
            <div style={{ fontSize: '0.88rem', color: isCancelled ? 'var(--danger)' : 'rgba(255,255,255,0.85)' }}>
              Order #{order.orderNumber} • {formatDate(order.createdAt)}
            </div>
          </div>

          {!isCancelled && (
            <div style={{ padding: '24px 20px' }}>
              <div className="status-stepper">
                {STEPS.map((step, idx) => (
                  <div key={step} className={`step${idx <= currentStep ? ' active' : ''}${idx < currentStep ? ' completed' : ''}`}>
                    <div className="step-circle">{STEP_ICONS[step]}</div>
                    <div className="step-label">{STEP_LABELS[step]}</div>
                  </div>
                ))}
              </div>
              {order.estimatedDelivery && currentStep < 4 && (
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ⏱️ Estimated delivery: <strong style={{ color: 'var(--primary)' }}>{order.estimatedDelivery}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div className="card card-body" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1rem' }}>📍 Delivery Address</h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{order.customerName}</strong><br />
            {order.deliveryAddress?.line1}
            {order.deliveryAddress?.line2 && `, ${order.deliveryAddress.line2}`}<br />
            {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}, {order.deliveryAddress?.state}
          </div>
          {order.customerPhone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <FiPhone size={13} /> {order.customerPhone}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', fontWeight: 700 }}>
            🛍️ Order Items ({order.items?.length})
          </div>
          {order.items?.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
              <img src={item.productImage} alt={item.productName}
                style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', background: 'var(--bg-secondary)', flexShrink: 0 }}
                onError={(e) => e.target.style.background = 'var(--bg-secondary)'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.productName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 2 }}>
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(item.totalPrice)}</div>
            </div>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="card card-body" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>💰 Bill Details</h3>
          {[
            ['Item Total', order.subtotal],
            ['Delivery Fee', order.deliveryFee],
            ['Packaging Fee', order.packagingFee],
          ].map(([label, val]) => (
            <div key={label} className="summary-row">
              <span>{label}</span>
              <span>{Number(val) === 0 && label === 'Delivery Fee' ? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>FREE</span> : formatCurrency(val)}</span>
            </div>
          ))}
          {order.discount > 0 && (
            <div className="summary-row">
              <span>Discount</span><span style={{ color: 'var(--accent)' }}>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <hr className="summary-divider" />
          <div className="summary-total">
            <span>Total Paid</span>
            <span style={{ color: 'var(--primary)' }}>{formatCurrency(order.total)}</span>
          </div>
          <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Payment: <strong style={{ color: 'var(--text-primary)' }}>{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}</strong>
          </div>
          {order.notes && (
            <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Note: {order.notes}
            </div>
          )}
        </div>

        <button className="btn btn-outline btn-full" onClick={() => navigate('/products')}>
          🛒 Order Again
        </button>
      </div>
    </div>
  )
}
