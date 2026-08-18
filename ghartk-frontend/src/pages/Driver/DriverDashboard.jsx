import { useState, useEffect, useRef } from 'react'
import { driverAPI } from '../../api/endpoints'
import useAuthStore from '../../store/authStore'
import { FiNavigation, FiPackage, FiDollarSign, FiCheckCircle, FiLogOut, FiHome } from 'react-icons/fi'
import { MdDeliveryDining, MdLocationOn } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function DriverDashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [availableOrders, setAvailableOrders] = useState([])
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const locationRef = useRef(null)

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      locationRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          driverAPI.updateLocation(pos.coords.latitude, pos.coords.longitude).catch(() => {})
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 5000 }
      )
    } else if (locationRef.current) {
      navigator.geolocation.clearWatch(locationRef.current)
    }
    return () => {
      if (locationRef.current) navigator.geolocation.clearWatch(locationRef.current)
    }
  }, [isOnline])

  const fetchDashboard = async () => {
    try {
      const [dashRes, ordersRes] = await Promise.all([
        driverAPI.getDashboard(),
        driverAPI.getAvailableOrders(),
      ])
      setDashboard(dashRes.data)
      setIsOnline(dashRes.data?.isOnline || false)
      setAvailableOrders(ordersRes.data?.content || ordersRes.data || [])
    } catch {
      // silent fail on auto-refresh
    } finally {
      setLoading(false)
    }
  }

  const handleToggleOnline = async () => {
    try {
      await driverAPI.toggleStatus()
      setIsOnline((prev) => !prev)
      toast.success(isOnline ? 'You are now Offline' : 'You are now Online 🟢')
      fetchDashboard()
    } catch {
      toast.error('Could not update status')
    }
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      await driverAPI.acceptOrder(orderId)
      toast.success(`Order #${orderId} accepted!`)
      fetchDashboard()
    } catch {
      toast.error('Could not accept order')
    }
  }

  const handleUpdateDelivery = async (deliveryId, status) => {
    try {
      await driverAPI.updateDeliveryStatus(deliveryId, status)
      toast.success(`Marked as ${status.replace(/_/g, ' ')}`)
      fetchDashboard()
    } catch {
      toast.error('Could not update delivery')
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}><div style={{ color: '#fff' }}>Loading...</div></div>

  const stats = [
    { label: "Today's Deliveries", value: dashboard?.todayDeliveries ?? 0, icon: <FiPackage />, color: '#06b6d4' },
    { label: "Today's Earnings", value: `₹${(dashboard?.todayEarnings || 0).toFixed(2)}`, icon: <FiDollarSign />, color: '#10b981' },
    { label: 'Total Deliveries', value: dashboard?.totalDeliveries ?? 0, icon: <FiCheckCircle />, color: '#8b5cf6' },
    { label: 'Total Earnings', value: `₹${(dashboard?.totalEarnings || 0).toFixed(2)}`, icon: <FiNavigation />, color: '#f59e0b' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MdDeliveryDining size={26} color="#06b6d4" />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>GHARTK Driver</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Hey, {user?.name}!</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', padding: '8px 12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <FiHome size={14} />
          </button>
          <button onClick={() => { logout(); navigate('/login') }} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '8px 12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <FiLogOut size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: 520, margin: '0 auto' }}>
        {/* Online Toggle */}
        <div style={{ background: isOnline ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${isOnline ? '#10b981' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
              {isOnline ? '🟢 You\'re Online' : '🔴 You\'re Offline'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 4 }}>
              {isOnline ? 'Receiving delivery requests' : 'Go online to accept orders'}
            </div>
          </div>
          <button
            onClick={handleToggleOnline}
            style={{
              background: isOnline ? '#ef4444' : '#10b981',
              border: 'none',
              color: '#fff',
              padding: '12px 22px',
              borderRadius: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${s.color}33`, borderRadius: 14, padding: '16px' }}>
              <div style={{ color: s.color, fontSize: '1.1rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.74rem', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active delivery */}
        {dashboard?.activeDelivery && (
          <div style={{ background: 'rgba(6,182,212,0.1)', border: '1.5px solid #06b6d4', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MdLocationOn color="#06b6d4" size={20} />
              <span style={{ color: '#06b6d4', fontWeight: 700 }}>Active Delivery</span>
            </div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Order #{dashboard.activeDelivery.orderId}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 16 }}>
              Status: {dashboard.activeDelivery.status?.replace(/_/g, ' ')}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {dashboard.activeDelivery.status === 'ASSIGNED' && (
                <button
                  onClick={() => handleUpdateDelivery(dashboard.activeDelivery.id, 'PICKED_UP')}
                  style={{ flex: 1, background: '#f59e0b', border: 'none', color: '#fff', padding: '12px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                  📦 Mark Picked Up
                </button>
              )}
              {dashboard.activeDelivery.status === 'PICKED_UP' && (
                <button
                  onClick={() => handleUpdateDelivery(dashboard.activeDelivery.id, 'DELIVERED')}
                  style={{ flex: 1, background: '#10b981', border: 'none', color: '#fff', padding: '12px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                  ✅ Mark Delivered
                </button>
              )}
            </div>
          </div>
        )}

        {/* Available Orders */}
        {isOnline && availableOrders.length > 0 && (
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: '0.95rem' }}>
              📋 Available Orders ({availableOrders.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableOrders.map((order) => (
                <div key={order.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>Order #{order.id}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: 4 }}>
                        ₹{order.totalAmount} • {order.items?.length || 0} item(s)
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', border: 'none', color: '#fff', padding: '10px 18px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem' }}>
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOnline && availableOrders.length === 0 && !dashboard?.activeDelivery && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🛵</div>
            <div>Waiting for orders...</div>
          </div>
        )}
      </div>
    </div>
  )
}
