import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiShoppingBag, FiBox, FiLogOut, FiHome, FiBarChart2 } from 'react-icons/fi'
import { MdStorefront } from 'react-icons/md'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/merchant', icon: <FiGrid />, label: 'Dashboard', end: true },
  { path: '/merchant/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { path: '/merchant/inventory', icon: <FiBox />, label: 'Inventory' },
  { path: '/merchant/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
]

export default function MerchantLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ background: 'linear-gradient(180deg, #0f3460 0%, #16213e 100%)' }}>
        <div className="admin-sidebar-logo">
          <MdStorefront size={24} />
          <span>GHARTK <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: '0.75rem' }}>Store</span></span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Shop Owner</div>
            </div>
          </div>
          <button className="admin-nav-item" style={{ width: '100%', borderRadius: 8, color: 'rgba(255,59,48,0.8)', padding: '10px 12px' }}
            onClick={handleLogout}>
            <FiLogOut className="admin-nav-icon" /> Logout
          </button>
          <button className="admin-nav-item" style={{ width: '100%', borderRadius: 8, padding: '10px 12px' }}
            onClick={() => navigate('/')}>
            <FiHome className="admin-nav-icon" /> Go to Store
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>Merchant Panel</div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>
            GHARTK • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
