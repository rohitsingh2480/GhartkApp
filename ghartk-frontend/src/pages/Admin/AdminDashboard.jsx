import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatCurrency, formatDate, getStatusBadgeClass, getOrderStatusInfo } from '../../utils/helpers'
import { DashboardSkeleton } from '../../components/UI/Skeletons'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard(),
    refetchInterval: 30000,
  })
  const d = data?.data

  if (isLoading) return <DashboardSkeleton />

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(d?.totalRevenue || 0), sub: `Today: ${formatCurrency(d?.todaysRevenue || 0)}`, icon: '💰', color: '#FF6B00' },
    { label: 'Total Orders', value: d?.totalOrders || 0, sub: `Today: ${d?.todaysOrders || 0} orders`, icon: '📦', color: '#007AFF' },
    { label: 'Total Customers', value: d?.totalUsers || 0, sub: 'Registered users', icon: '👥', color: '#00C853' },
    { label: 'Pending Orders', value: d?.pendingOrders || 0, sub: `${d?.deliveredOrders || 0} delivered`, icon: '⏳', color: '#FF9500' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: '#888', fontSize: '0.88rem' }}>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="kpi-grid">
        {kpis.map(({ label, value, sub, icon, color }) => (
          <div key={label} className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">{label}</div>
                <div className="kpi-value" style={{ color }}>{value}</div>
                <div style={{ fontSize: '0.78rem', color: '#888' }}>{sub}</div>
              </div>
              <div style={{ fontSize: '2rem' }}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="kpi-card" style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Total Products', value: d?.totalProducts || 0, icon: '🛒' },
            { label: 'Low Stock', value: d?.lowStockCount || 0, icon: '⚠️' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Delivery Performance</div>
          <div style={{ marginTop: 12 }}>
            {[
              { label: 'Delivered', count: d?.deliveredOrders || 0, color: '#00C853' },
              { label: 'Pending', count: d?.pendingOrders || 0, color: '#FF9500' },
              { label: 'Cancelled', count: (d?.totalOrders || 0) - (d?.deliveredOrders || 0) - (d?.pendingOrders || 0), color: '#FF3B30' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: '0.83rem', color: '#555' }}>{label}</span>
                </div>
                <span style={{ fontWeight: 700, color }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-table-card">
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8E8E8' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Orders</h3>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }} onClick={() => navigate('/admin/orders')}>
            View All →
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th>
            </tr>
          </thead>
          <tbody>
            {d?.recentOrders?.slice(0, 8).map((order) => {
              const si = getOrderStatusInfo(order.status)
              return (
                <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/orders`)}>
                  <td><span style={{ fontWeight: 600, color: '#FF6B00' }}>#{order.orderNumber?.slice(-8)}</span></td>
                  <td>{order.customerName}</td>
                  <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                  <td><span className={`badge ${getStatusBadgeClass(order.status)}`}>{si.emoji} {si.label}</span></td>
                  <td style={{ color: '#888' }}>{formatDate(order.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
