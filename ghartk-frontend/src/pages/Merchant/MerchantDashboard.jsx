import { useState, useEffect } from 'react'
import { merchantAPI } from '../../api/endpoints'
import { FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiClock, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function MerchantDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        merchantAPI.getAnalytics(),
        merchantAPI.getOrders({ page: 0, size: 5, status: 'PLACED,CONFIRMED,PREPARING' }),
      ])
      setAnalytics(analyticsRes.data)
      setRecentOrders(ordersRes.data?.content || ordersRes.data || [])
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await merchantAPI.updateOrderStatus(orderId, status)
      toast.success(`Order marked as ${status}`)
      fetchData()
    } catch {
      toast.error('Failed to update order')
    }
  }

  const statusColor = {
    PLACED: '#f59e0b',
    CONFIRMED: '#3b82f6',
    PREPARING: '#8b5cf6',
    OUT_FOR_DELIVERY: '#06b6d4',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
  }

  const nextStatus = {
    PLACED: 'CONFIRMED',
    CONFIRMED: 'PREPARING',
    PREPARING: 'OUT_FOR_DELIVERY',
  }

  const nextLabel = {
    PLACED: 'Confirm',
    CONFIRMED: 'Start Preparing',
    PREPARING: 'Mark Ready',
  }

  if (loading) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 20, color: '#1e293b' }}>
        🏪 Store Dashboard
      </h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Orders', value: analytics?.totalOrders ?? '—', icon: <FiShoppingBag />, color: '#3b82f6' },
          { label: "Today's Orders", value: analytics?.todayOrders ?? '—', icon: <FiClock />, color: '#f59e0b' },
          { label: 'Total Revenue', value: analytics?.totalRevenue ? `₹${analytics.totalRevenue.toFixed(2)}` : '—', icon: <FiDollarSign />, color: '#10b981' },
          { label: "Today's Revenue", value: analytics?.todayRevenue ? `₹${analytics.todayRevenue.toFixed(2)}` : '—', icon: <FiTrendingUp />, color: '#8b5cf6' },
          { label: 'Delivered', value: analytics?.deliveredOrders ?? '—', icon: <FiCheck />, color: '#06b6d4' },
          { label: 'Active Products', value: analytics?.activeProducts ?? '—', icon: <FiPackage />, color: '#f43f5e' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.07)', border: `1px solid ${s.color}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
              <div style={{ background: `${s.color}18`, color: s.color, padding: 10, borderRadius: 12, fontSize: '1.1rem' }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incoming orders */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16, color: '#1e293b' }}>⚡ Active Orders</h3>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>No active orders right now 🎉</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>Order #{order.id}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                    {order.totalAmount ? `₹${order.totalAmount}` : ''} • {order.items?.length || 0} items
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status], padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                  {nextStatus[order.status] && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, nextStatus[order.status])}
                      style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {nextLabel[order.status]}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
