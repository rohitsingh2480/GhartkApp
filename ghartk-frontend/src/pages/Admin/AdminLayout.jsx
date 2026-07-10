import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { MdDeliveryDining } from 'react-icons/md'
import { FiGrid, FiShoppingBag, FiBox, FiTag, FiUsers, FiLogOut, FiHome } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
  { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { path: '/admin/products', icon: <FiBox />, label: 'Products' },
  { path: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { path: '/admin/users', icon: <FiUsers />, label: 'Customers' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <MdDeliveryDining size={24} />
          <span>GHARTK <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: '0.75rem' }}>Admin</span></span>
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

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Administrator</div>
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
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>Admin Panel</div>
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
