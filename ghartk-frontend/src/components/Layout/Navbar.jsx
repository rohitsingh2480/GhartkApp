import { useState, useEffect, useRef } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSettings, FiSun, FiMoon } from 'react-icons/fi'
import { MdDeliveryDining } from 'react-icons/md'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { cartAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
  const { itemCount, setCart } = useCartStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('ghartk_theme') || 'light')
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ghartk_theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      cartAPI.get().then((res) => setCart(res.data)).catch(() => {})
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    try {
      logout()
      setDropdownOpen(false)
      toast.success('Logged out successfully')
      navigate('/')
    } catch {}
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <MdDeliveryDining size={28} />
          GHARTK
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <FiSearch className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search groceries, food, snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} title="Toggle theme">
            {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>

          {isAuthenticated && (
            <button className="cart-btn" onClick={() => navigate('/cart')}>
              <FiShoppingCart size={18} />
              <span>Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>}
            </button>
          )}

          {isAuthenticated ? (
            <div className="dropdown" ref={dropdownRef}>
              <div className="user-avatar" onClick={() => setDropdownOpen(o => !o)} title={user?.name}>
                {initial}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.phone || user?.email}</div>
                  </div>
                  <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false) }}>
                    <FiUser size={15} /> My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate('/orders'); setDropdownOpen(false) }}>
                    <FiPackage size={15} /> My Orders
                  </button>
                  {isAdmin() && (
                    <button className="dropdown-item" onClick={() => { navigate('/admin'); setDropdownOpen(false) }}>
                      <FiSettings size={15} /> Admin Panel
                    </button>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
