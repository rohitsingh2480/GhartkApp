import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiPhone } from 'react-icons/fi'
import { MdDeliveryDining } from 'react-icons/md'
import { authAPI } from '../../api/endpoints'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ emailOrPhone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data)
      toast.success(`Welcome back, ${res.data.name}! 🎉`)
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <div className="auth-logo-text">
            <MdDeliveryDining style={{ verticalAlign: 'middle', marginRight: 8 }} />
            GHARTK
          </div>
          <div className="auth-tagline">India's Hyperlocal Delivery App 🇮🇳</div>
        </div>

        <h2 className="auth-title">Welcome back!</h2>
        <p className="auth-subtitle">Sign in to order from local stores near you</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mobile / Email</label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="9876543210 or email"
                value={form.emailOrPhone}
                onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In 🔑'}
          </button>
        </form>

        <div style={{
          background: 'var(--bg)', borderRadius: 10, padding: '12px 16px',
          marginTop: 20, fontSize: '0.8rem', color: 'var(--text-muted)'
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Demo Credentials:</strong><br/>
          <strong>Admin:</strong> admin@ghartk.com / Admin@123<br/>
          <strong>Customer:</strong> rahul@gmail.com / Admin@123
        </div>

        <div className="auth-footer">
          New to GHARTK?{' '}
          <a onClick={() => navigate('/register')}>Create an account</a>
        </div>
      </div>
    </div>
  )
}
