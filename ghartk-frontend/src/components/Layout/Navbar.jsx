import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiSearch, FiShoppingCart, FiUser, FiLogOut, FiPackage,
  FiSettings, FiSun, FiMoon, FiBox, FiBarChart2, FiMapPin,
  FiChevronDown, FiX, FiCheck
} from 'react-icons/fi'
import { MdDeliveryDining, MdStorefront } from 'react-icons/md'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useLocationStore from '../../store/locationStore'
import { cartAPI, storeAPI, userAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, isMerchant, isDriver, logout } = useAuthStore()
  const { itemCount, setCart } = useCartStore()
  const { pincode, city, setPincode, setAvailableStores } = useLocationStore()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [inputPincode, setInputPincode] = useState(pincode)
  const [userAddresses, setUserAddresses] = useState([])
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
      cartAPI.get()
        .then((res) => {
          if (res?.data) setCart(res.data)
        })
        .catch(() => {})

      userAPI.getAddresses()
        .then((res) => {
          if (res?.data) setUserAddresses(res.data)
        })
        .catch(() => {})
    }
  }, [isAuthenticated])

  // Fetch active stores whenever pincode changes
  useEffect(() => {
    storeAPI.getAll({ pincode })
      .then((res) => {
        if (res?.data) setAvailableStores(res.data)
      })
      .catch(() => {})
  }, [pincode])

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

  const handleApplyPincode = (newPin, newCity = null) => {
    if (!newPin || newPin.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit Indian pincode')
      return
    }
    const cleanPin = newPin.trim()
    setPincode(cleanPin, newCity)
    setLocationModalOpen(false)
    toast.success(`Location set to ${cleanPin}! Showing local vendors.`);
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <MdDeliveryDining size={28} />
            GHARTK
          </div>

          {/* Hyperlocal Delivery Pincode Selector */}
          <div
            className="navbar-location-btn"
            onClick={() => { setInputPincode(pincode); setLocationModalOpen(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 24,
              background: 'rgba(255, 107, 0, 0.08)',
              border: '1px solid rgba(255, 107, 0, 0.25)',
              transition: 'all 0.2s ease',
            }}
            title="Change Delivery Pincode & Local Stores"
          >
            <FiMapPin style={{ color: '#FF6B00', flexShrink: 0 }} size={16} />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                Delivering to
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800, color: '#FF6B00', fontSize: '0.88rem' }}>
                <span>{pincode}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8rem' }}>({city})</span>
                <FiChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <FiSearch className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search groceries, food, snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} title="Toggle theme">
              {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
            </button>

            {/* Merchant Quick Access */}
            {isAuthenticated && isMerchant?.() && (
              <button
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #0f3460, #16213e)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 2px 8px rgba(15,52,96,0.3)',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/merchant')}
              >
                <MdStorefront size={17} /> Store Panel
              </button>
            )}

            {/* Driver Quick Access */}
            {isAuthenticated && isDriver?.() && (
              <button
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontWeight: 600,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/driver')}
              >
                <MdDeliveryDining size={18} /> Driver Console
              </button>
            )}

            {/* Admin Quick Access */}
            {isAuthenticated && isAdmin?.() && (
              <button
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontWeight: 600,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/admin')}
              >
                <FiSettings size={15} /> Admin
              </button>
            )}

            {/* Cart Button */}
            {isAuthenticated && (
              <button className="cart-btn" onClick={() => navigate('/cart')}>
                <FiShoppingCart size={18} />
                <span>Cart</span>
                {itemCount > 0 && <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>}
              </button>
            )}

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="dropdown" ref={dropdownRef}>
                <div className="user-avatar" onClick={() => setDropdownOpen(o => !o)} title={user?.name}>
                  {initial}
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{user?.name}</span>
                        {user?.role && (
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 12,
                            background: user.role === 'MERCHANT' ? '#0f3460' : user.role === 'ADMIN' ? '#7c3aed' : user.role === 'DRIVER' ? '#059669' : '#e0f2fe',
                            color: user.role === 'CUSTOMER' ? '#0369a1' : '#ffffff',
                            textTransform: 'uppercase'
                          }}>
                            {user.role}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{user?.phone || user?.email}</div>
                    </div>

                    {/* Merchant Management Links */}
                    {isMerchant?.() && (
                      <>
                        <div style={{ padding: '6px 16px 2px', fontSize: '0.72rem', fontWeight: 700, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Store Management
                        </div>
                        <button className="dropdown-item" style={{ fontWeight: 600, color: '#0f3460' }} onClick={() => { navigate('/merchant'); setDropdownOpen(false) }}>
                          <MdStorefront size={16} /> Store Dashboard
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/merchant/orders'); setDropdownOpen(false) }}>
                          <FiPackage size={15} /> Store Orders
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/merchant/inventory'); setDropdownOpen(false) }}>
                          <FiBox size={15} /> Inventory & Stock
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/merchant/analytics'); setDropdownOpen(false) }}>
                          <FiBarChart2 size={15} /> Store Analytics
                        </button>
                        <div className="dropdown-divider" />
                      </>
                    )}

                    {/* Driver Console Links */}
                    {isDriver?.() && (
                      <>
                        <div style={{ padding: '6px 16px 2px', fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Delivery Console
                        </div>
                        <button className="dropdown-item" style={{ fontWeight: 600, color: '#059669' }} onClick={() => { navigate('/driver'); setDropdownOpen(false) }}>
                          <MdDeliveryDining size={17} /> Driver Dashboard
                        </button>
                        <div className="dropdown-divider" />
                      </>
                    )}

                    {/* Admin Links */}
                    {isAdmin?.() && (
                      <>
                        <button className="dropdown-item" style={{ fontWeight: 600, color: '#7c3aed' }} onClick={() => { navigate('/admin'); setDropdownOpen(false) }}>
                          <FiSettings size={15} /> Admin Portal
                        </button>
                        <div className="dropdown-divider" />
                      </>
                    )}

                    {/* Customer Links */}
                    <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false) }}>
                      <FiUser size={15} /> My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { navigate('/orders'); setDropdownOpen(false) }}>
                      <FiPackage size={15} /> My Orders
                    </button>
                    
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

      {/* Pincode & Location Selector Modal */}
      {locationModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
        onClick={() => setLocationModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--card-bg, #fff)',
              borderRadius: 20,
              maxWidth: 480,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255,107,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF6B00'
                }}>
                  <FiMapPin size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Choose Delivery Area</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Products and stores are filtered to your local neighbourhood
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Input Form */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>
                Enter 6-Digit Pincode
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  maxLength={6}
                  value={inputPincode}
                  placeholder="e.g. 248001"
                  onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: 2
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyPincode(inputPincode);
                  }}
                />
                <button
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 700 }}
                  onClick={() => handleApplyPincode(inputPincode)}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Quick Select Preset Areas */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>
                Available Store Hubs
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { pin: '248001', name: 'Dehradun Central', store: 'GHARTK Central Store (1,280+ items)' },
                  { pin: '248002', name: 'Rajpur Road / Subhash Nagar', store: 'Doon Spices & Organic Hub' },
                  { pin: '110049', name: 'Hauz Khas, New Delhi', store: 'Hauz Khas Fresh Market (16 items)' },
                  { pin: '110059', name: 'Dwarka, New Delhi', store: "Rohit's Store" },
                ].map(area => (
                  <div
                    key={area.pin}
                    onClick={() => handleApplyPincode(area.pin, area.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: pincode === area.pin ? '2px solid #FF6B00' : '1px solid var(--border-light)',
                      background: pincode === area.pin ? 'rgba(255,107,0,0.06)' : 'var(--bg-secondary, #f8f9fa)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📍 {area.pin}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>({area.name})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#FF6B00', marginTop: 2, fontWeight: 600 }}>
                        🏪 {area.store}
                      </div>
                    </div>
                    {pincode === area.pin && (
                      <span style={{ color: '#FF6B00', fontWeight: 700 }}><FiCheck size={18} /></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Addresses if logged in */}
            {userAddresses.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>
                  Your Saved Addresses
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
                  {userAddresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => handleApplyPincode(addr.pincode, addr.city)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border-light)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.84rem'
                      }}
                    >
                      <div>
                        <strong>{addr.label}:</strong> {addr.line1}, {addr.city} - <strong>{addr.pincode}</strong>
                      </div>
                      {pincode === addr.pincode && <FiCheck style={{ color: '#FF6B00' }} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
