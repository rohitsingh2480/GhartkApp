import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderAPI } from '../../api/endpoints'
import { formatCurrency, formatDate, getOrderStatusInfo, getStatusBadgeClass } from '../../utils/helpers'
import { OrderCardSkeleton } from '../../components/UI/Skeletons'
import { FiPackage } from 'react-icons/fi'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => orderAPI.getAll({ page, size: 10 }),
  })

  const orders = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30, paddingBottom: 40, maxWidth: 800 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>My Orders</h1>

        {isLoading
          ? Array(4).fill(0).map((_, i) => <OrderCardSkeleton key={i} />)
          : orders.length === 0
            ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-title">No orders yet</div>
                <div className="empty-state-text">Start shopping to see your orders here!</div>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
                  <FiPackage /> Start Shopping
                </button>
              </div>
            )
            : orders.map((order) => {
                const statusInfo = getOrderStatusInfo(order.status)
                return (
                  <div key={order.id} className="card" style={{ marginBottom: 16, cursor: 'pointer' }}
                    onClick={() => navigate(`/orders/${order.id}`)}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>#{order.orderNumber}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {statusInfo.emoji} {statusInfo.label}
                      </span>
                    </div>
                    <div style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                        {order.items?.slice(0,2).map(i => i.productName).join(', ')}
                        {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} • {order.paymentMethod}
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(order.total)}</div>
                      </div>
                    </div>
                    {(order.status === 'PLACED' || order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'OUT_FOR_DELIVERY') && (
                      <div style={{ padding: '12px 20px', background: 'var(--primary-light)', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{statusInfo.emoji}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {statusInfo.label} • Est. {order.estimatedDelivery}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })
        }

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`page-btn${page === i ? ' active' : ''}`} onClick={() => setPage(i)}>{i+1}</button>
            ))}
            <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  )
}
