import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi'
import { MdDeliveryDining } from 'react-icons/md'
import { authAPI } from '../../api/endpoints'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data)
      toast.success('Account created! Welcome to GHARTK 🎉')
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.')
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

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join thousands of happy customers across India</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { icon: <FiUser />, label: 'Full Name', key: 'name', placeholder: 'Rahul Sharma', type: 'text' },
            { icon: <FiMail />, label: 'Email Address', key: 'email', placeholder: 'rahul@gmail.com', type: 'email' },
            { icon: <FiPhone />, label: 'Mobile Number', key: 'phone', placeholder: '9876543210', type: 'tel' },
            { icon: <FiLock />, label: 'Password', key: 'password', placeholder: 'Min 6 characters', type: 'password' },
          ].map(({ icon, label, key, placeholder, type }) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  {icon}
                </span>
                <input
                  type={type}
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account 🚀'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a onClick={() => navigate('/login')}>Sign in</a>
        </div>
      </div>
    </div>
  )
}
