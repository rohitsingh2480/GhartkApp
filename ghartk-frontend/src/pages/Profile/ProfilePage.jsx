import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit, FiChevronRight } from 'react-icons/fi'
import { userAPI } from '../../api/endpoints'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userAPI.getMe(),
  })
  const profile = data?.data

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    setLoading(true)
    try {
      const res = await userAPI.updateProfile({ name: name.trim() })
      updateUser({ name: res.data.name })
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="page-wrapper" style={{ paddingTop: 70, paddingBottom: 40 }}>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">{initial}</div>
        {editing ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderRadius: 30, textAlign: 'center', fontWeight: 600, color: '#111', maxWidth: 220 }}
              autoFocus
            />
            <button className="btn btn-sm" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}
              onClick={handleSave} disabled={loading}>
              {loading ? '...' : 'Save'}
            </button>
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
              onClick={() => { setEditing(false); setName(user?.name) }}>Cancel</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-phone">{user?.phone}</div>
            {user?.email && <div className="profile-phone">{user?.email}</div>}
            <button style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: '0.82rem', cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, margin: '10px auto 0' }}
              onClick={() => setEditing(true)}>
              <FiEdit size={13} /> Edit Name
            </button>
          </div>
        )}
      </div>

      <div className="container" style={{ maxWidth: 640 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, margin: '24px 0' }}>
          {[
            { label: 'Total Orders', value: profile?.addresses?.length !== undefined ? '...' : '0', icon: '📦' },
            { label: 'Addresses', value: profile?.addresses?.length || 0, icon: '📍' },
            { label: 'Member Since', value: new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), icon: '📅' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="profile-menu">
          {[
            { icon: <FiPackage />, label: 'My Orders', sub: 'View order history & track orders', action: () => navigate('/orders') },
            { icon: <FiMapPin />, label: 'Saved Addresses', sub: `${profile?.addresses?.length || 0} saved`, action: () => navigate('/checkout') },
            { icon: <FiUser />, label: 'Account Details', sub: 'Email, phone & password', action: () => {} },
          ].map(({ icon, label, sub, action }) => (
            <div key={label} className="profile-menu-item" onClick={action}>
              <div className="profile-menu-icon" style={{ color: 'var(--primary)' }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
              </div>
              <FiChevronRight className="profile-menu-arrow" />
            </div>
          ))}
        </div>

        <div className="profile-menu">
          <div className="profile-menu-item danger" onClick={handleLogout}>
            <div className="profile-menu-icon"><FiLogOut /></div>
            <span>Logout</span>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16 }}>
          GHARTK v1.0.0 • Made with ❤️ for Bharat 🇮🇳
        </p>
      </div>
    </div>
  )
}
