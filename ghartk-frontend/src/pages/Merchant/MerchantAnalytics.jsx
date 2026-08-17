import { useState, useEffect } from 'react'
import { merchantAPI } from '../../api/endpoints'
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiPackage } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function MerchantAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    merchantAPI.getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading analytics...</div>
  if (!data) return null

  const metrics = [
    { label: 'Total Orders', value: data.totalOrders, icon: <FiShoppingBag />, color: '#3b82f6', bg: '#eff6ff' },
    { label: "Today's Orders", value: data.todayOrders, icon: <FiTrendingUp />, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Total Revenue', value: `₹${(data.totalRevenue || 0).toFixed(2)}`, icon: <FiDollarSign />, color: '#10b981', bg: '#ecfdf5' },
    { label: "Today's Revenue", value: `₹${(data.todayRevenue || 0).toFixed(2)}`, icon: <FiTrendingUp />, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Delivered Orders', value: data.deliveredOrders, icon: <FiPackage />, color: '#06b6d4', bg: '#ecfeff' },
    { label: 'Cancelled Orders', value: data.cancelledOrders, icon: <FiShoppingBag />, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Avg Order Value', value: `₹${(data.avgOrderValue || 0).toFixed(2)}`, icon: <FiDollarSign />, color: '#f97316', bg: '#fff7ed' },
    { label: 'Active Products', value: data.activeProducts, icon: <FiPackage />, color: '#0ea5e9', bg: '#f0f9ff' },
  ]

  const deliveryRate = data.totalOrders > 0
    ? ((data.deliveredOrders / data.totalOrders) * 100).toFixed(1)
    : 0

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 20 }}>📊 Store Analytics</h2>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: m.bg, border: `1px solid ${m.color}33`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.77rem', color: '#64748b', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              </div>
              <div style={{ background: `${m.color}22`, color: m.color, padding: 10, borderRadius: 12, fontSize: '1.1rem' }}>
                {m.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery success rate */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.07)', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16, color: '#1e293b' }}>Delivery Success Rate</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 14, overflow: 'hidden' }}>
            <div style={{ width: `${deliveryRate}%`, background: 'linear-gradient(90deg, #10b981, #059669)', height: '100%', borderRadius: 99, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#10b981', minWidth: 60, textAlign: 'right' }}>
            {deliveryRate}%
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.77rem', color: '#94a3b8' }}>
          {data.deliveredOrders} delivered out of {data.totalOrders} total orders
        </div>
      </div>

      {/* Top products */}
      {data.topProducts && data.topProducts.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16, color: '#1e293b' }}>🔥 Top Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>{p.productName}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#0f3460' }}>{p.totalSold} sold</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
