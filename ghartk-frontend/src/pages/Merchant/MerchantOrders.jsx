import { useState, useEffect } from 'react'
import { merchantAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

const STATUS_FLOW = {
  PLACED: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'OUT_FOR_DELIVERY',
}

const STATUS_LABEL = {
  PLACED: '⏳ Confirm Order',
  CONFIRMED: '🔥 Start Preparing',
  PREPARING: '📦 Mark Ready',
}

const STATUS_COLOR = {
  PLACED: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PREPARING: '#8b5cf6',
  OUT_FOR_DELIVERY: '#06b6d4',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
}

export default function MerchantOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ACTIVE')

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 15000) // auto-refresh every 15s
    return () => clearInterval(interval)
  }, [filter])

  const fetchOrders = async () => {
    try {
      const statusParam = filter === 'ACTIVE' ? 'PLACED,CONFIRMED,PREPARING' : filter
      const res = await merchantAPI.getOrders({ page: 0, size: 50, status: statusParam })
      setOrders(res.data?.content || res.data || [])
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id, status) => {
    try {
      await merchantAPI.updateOrderStatus(id, status)
      toast.success('Order updated!')
      fetchOrders()
    } catch {
      toast.error('Update failed')
    }
  }

  const tabs = ['ACTIVE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 20 }}>📋 Orders Board</h2>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 99,
              border: '1.5px solid',
              borderColor: filter === tab ? 'var(--primary)' : '#e2e8f0',
              background: filter === tab ? 'var(--primary)' : '#fff',
              color: filter === tab ? '#fff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', background: '#fff', borderRadius: 14 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <div>No orders in this category</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: '20px 24px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                border: `1.5px solid ${STATUS_COLOR[order.status] || '#e2e8f0'}33`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Order #{order.id}</span>
                    <span style={{
                      background: `${STATUS_COLOR[order.status]}22`,
                      color: STATUS_COLOR[order.status],
                      padding: '3px 10px',
                      borderRadius: 99,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    👤 {order.userName || 'Customer'} &nbsp;•&nbsp; 💰 ₹{order.totalAmount}
                    &nbsp;•&nbsp; 🛍️ {order.items?.length || 0} item(s)
                  </div>
                  {order.items && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {order.items.map((item) => (
                        <span key={item.id} style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: 6, fontSize: '0.76rem', color: '#475569' }}>
                          {item.productName} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {STATUS_FLOW[order.status] && (
                    <button
                      onClick={() => handleUpdate(order.id, STATUS_FLOW[order.status])}
                      style={{
                        background: 'linear-gradient(135deg, var(--primary), #6366f1)',
                        color: '#fff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: 10,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                      }}
                    >
                      {STATUS_LABEL[order.status]}
                    </button>
                  )}
                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button
                      onClick={() => handleUpdate(order.id, 'CANCELLED')}
                      style={{
                        background: '#fff',
                        color: '#ef4444',
                        border: '1.5px solid #ef4444',
                        padding: '9px 14px',
                        borderRadius: 10,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
