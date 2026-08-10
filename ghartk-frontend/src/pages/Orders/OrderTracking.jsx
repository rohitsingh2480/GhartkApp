import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderAPI } from '../../api/endpoints'
import { FiArrowLeft, FiMapPin, FiPackage } from 'react-icons/fi'
import { MdDeliveryDining } from 'react-icons/md'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

const STATUS_COLOR = {
  PLACED: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PREPARING: '#8b5cf6',
  OUT_FOR_DELIVERY: '#06b6d4',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
}

const STATUS_ICON = {
  PLACED: '🛒',
  CONFIRMED: '✅',
  PREPARING: '🔥',
  OUT_FOR_DELIVERY: '🛵',
  DELIVERED: '🎉',
  CANCELLED: '❌',
}

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const wsRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchOrder()
    intervalRef.current = setInterval(fetchOrder, 8000)
    return () => {
      clearInterval(intervalRef.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [id])

  useEffect(() => {
    if (order?.status === 'OUT_FOR_DELIVERY') {
      connectWebSocket()
    }
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [order?.status])

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id)
      setOrder(res.data)
    } catch {
      toast.error('Order not found')
    } finally {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    if (wsRef.current) return // already connected
    try {
      const wsUrl = `ws://localhost:8080/api/ws/track?orderId=${id}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => console.log('WS connected for tracking')
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.lat && data.lng) {
            setDriverLocation({ lat: data.lat, lng: data.lng })
          }
        } catch {}
      }
      ws.onerror = () => console.warn('WS tracking disconnected')
      ws.onclose = () => { wsRef.current = null }
    } catch (e) {
      console.warn('WebSocket not available:', e.message)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  if (!order) return (
    <div style={{ textAlign: 'center', padding: 80 }}>Order not found</div>
  )

  const currentStep = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
          <FiArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontWeight: 700, color: '#1e293b' }}>Order #{order.id}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Live Tracking</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ background: `${STATUS_COLOR[order.status]}20`, color: STATUS_COLOR[order.status], padding: '5px 12px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700 }}>
            {STATUS_ICON[order.status]} {order.status?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px' }}>
        {/* Map / Driver location placeholder */}
        {order.status === 'OUT_FOR_DELIVERY' && (
          <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: 20, padding: '24px', marginBottom: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'rgba(6,182,212,0.08)', borderRadius: '50%', transform: 'translate(60px, -60px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#06b6d4', padding: 10, borderRadius: 12, animation: 'pulse 2s infinite' }}>
                <MdDeliveryDining size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Driver En Route</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                  {driverLocation ? `📍 ${driverLocation.lat.toFixed(4)}, ${driverLocation.lng.toFixed(4)}` : 'Fetching live location...'}
                </div>
              </div>
            </div>
            {/* Visual map simulation */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 60%, rgba(6,182,212,0.15) 0%, transparent 60%)', borderRadius: 14 }} />
              {driverLocation ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', animation: 'bounce 1s infinite' }}>🛵</div>
                  <div style={{ color: '#06b6d4', fontSize: '0.78rem', marginTop: 6, fontWeight: 600 }}>
                    Live coordinates received
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🗺️</div>
                  <div style={{ fontSize: '0.8rem' }}>Connecting to driver...</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        {!isCancelled && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 20, color: '#1e293b' }}>Order Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStep
                const isCurrent = i === currentStep
                const isLast = i === STATUS_STEPS.length - 1
                return (
                  <div key={step} style={{ display: 'flex', gap: 14 }}>
                    {/* Line + circle */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: isDone ? STATUS_COLOR[step] || '#10b981' : '#e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: isCurrent ? `0 0 0 4px ${STATUS_COLOR[step] || '#10b981'}30` : 'none',
                        transition: 'all 0.3s',
                        fontSize: '0.75rem'
                      }}>
                        {isDone ? '✓' : <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />}
                      </div>
                      {!isLast && <div style={{ width: 2, height: 28, background: i < currentStep ? '#10b981' : '#e2e8f0', transition: 'background 0.3s' }} />}
                    </div>
                    {/* Label */}
                    <div style={{ paddingBottom: isLast ? 0 : 20, paddingTop: 4 }}>
                      <div style={{ fontWeight: isCurrent ? 700 : 500, color: isDone ? '#1e293b' : '#94a3b8', fontSize: '0.88rem' }}>
                        {STATUS_ICON[step]} {step.replace(/_/g, ' ')}
                      </div>
                      {isCurrent && <div style={{ fontSize: '0.74rem', color: STATUS_COLOR[step] || '#10b981', marginTop: 2 }}>Current status</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', borderRadius: 16, padding: 24, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>❌</div>
            <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '1rem' }}>Order Cancelled</div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: 4 }}>This order was cancelled. Contact support if needed.</div>
          </div>
        )}

        {/* Order Summary */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: '#1e293b' }}>
            <FiPackage style={{ marginRight: 8 }} />Order Details
          </h3>
          {order.items?.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#475569', fontSize: '0.88rem' }}>{item.productName} × {item.quantity}</span>
              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>₹{item.totalPrice}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 800, color: '#1e293b' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount}</span>
          </div>
          {order.deliveryAddress && (
            <div style={{ marginTop: 14, padding: '12px', background: '#f8fafc', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <FiMapPin color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {order.deliveryAddress}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  )
}
