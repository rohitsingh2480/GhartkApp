import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatDate } from '../../utils/helpers'
import { FiPlus, FiPhone, FiMail, FiX, FiCheckCircle, FiSearch, FiToggleLeft, FiToggleRight, FiShield } from 'react-icons/fi'
import { MdTwoWheeler, MdDeliveryDining } from 'react-icons/md'
import toast from 'react-hot-toast'

const EMPTY_DRIVER_FORM = {
  name: '',
  email: '',
  phone: '',
  password: 'Driver@123',
  vehicleType: 'BIKE',
  licensePlate: '',
  city: 'New Delhi',
}

const VEHICLE_ICONS = {
  BIKE: '🏍️',
  SCOOTER: '🛵',
  EV: '⚡',
  CYCLE: '🚲',
}

export default function AdminDrivers() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_DRIVER_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterVehicle, setFilterVehicle] = useState('ALL')
  const [togglingId, setTogglingId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: () => adminAPI.getAllDrivers(),
  })

  const allDrivers = data?.data || []

  const filteredDrivers = allDrivers.filter((d) => {
    const matchesSearch =
      !search.trim() ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.phone?.includes(search) ||
      d.licensePlate?.toLowerCase().includes(search.toLowerCase())
    const matchesVehicle = filterVehicle === 'ALL' || d.vehicleType === filterVehicle
    return matchesSearch && matchesVehicle
  })

  const totalDrivers = allDrivers.length
  const onlineDrivers = allDrivers.filter((d) => d.isOnline).length
  const busyDrivers = allDrivers.filter((d) => d.status === 'ACTIVE_DELIVERY').length

  const handleSaveDriver = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Driver name is required'); return }
    if (!form.email.includes('@')) { toast.error('Valid email is required'); return }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit mobile number required'); return }
    if (form.vehicleType !== 'CYCLE' && !form.licensePlate.trim()) {
      toast.error('Vehicle license plate is required')
      return
    }

    const payload = {
      ...form,
      licensePlate: form.vehicleType === 'CYCLE' && !form.licensePlate.trim() ? 'BICYCLE' : form.licensePlate.trim(),
    }

    setSaving(true)
    try {
      await adminAPI.onboardDriver(payload)
      queryClient.invalidateQueries(['admin-drivers'])
      setShowModal(false)
      setForm(EMPTY_DRIVER_FORM)
      toast.success(`Delivery Partner "${form.name}" onboarded successfully! 🚀`)
    } catch (err) {
      toast.error(err?.message || 'Failed to onboard delivery partner')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (driver) => {
    setTogglingId(driver.id)
    try {
      await adminAPI.toggleDriverStatus(driver.id)
      queryClient.invalidateQueries(['admin-drivers'])
      toast.success(`Driver "${driver.name}" status updated`)
    } catch (err) {
      toast.error(err?.message || 'Could not update driver status')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <MdTwoWheeler style={{ color: 'var(--primary)' }} /> Delivery Fleet & Partners
          </h1>
          <p style={{ color: '#888', fontSize: '0.88rem', marginTop: 4 }}>
            Onboard, monitor duty status, and manage GHARTK hyper-local delivery fleet
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, fontWeight: 700 }}
        >
          <FiPlus size={18} /> Onboard Delivery Partner
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Fleet</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{totalDrivers}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>Registered partners</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '18px 20px', borderRadius: 16, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600, textTransform: 'uppercase' }}>🟢 Online Now</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', marginTop: 4 }}>{onlineDrivers}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 2 }}>Ready for pickup</div>
        </div>
        <div style={{ background: '#eff6ff', padding: '18px 20px', borderRadius: 16, border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600, textTransform: 'uppercase' }}>🛵 On Run / Busy</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e40af', marginTop: 4 }}>{busyDrivers}</div>
          <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: 2 }}>Active deliveries in progress</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>🔴 Offline</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#475569', marginTop: 4 }}>{totalDrivers - onlineDrivers}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>Off-duty partners</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 36, borderRadius: 12 }}
            placeholder="Search driver by name, phone, plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'BIKE', 'SCOOTER', 'EV', 'CYCLE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterVehicle(type)}
              style={{
                background: filterVehicle === type ? 'var(--primary)' : '#f1f5f9',
                color: filterVehicle === type ? '#fff' : '#475569',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {type === 'ALL' ? 'All Vehicles' : `${VEHICLE_ICONS[type] || ''} ${type}`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Loading fleet...</div>
        ) : filteredDrivers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛵</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>No delivery partners found</div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
              Click "Onboard Delivery Partner" to register riders to your fleet.
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Contact</th>
                <th>Vehicle & Plate</th>
                <th>Duty Status</th>
                <th>Lifetime Deliveries</th>
                <th>Total Earned</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {d.name ? d.name.charAt(0).toUpperCase() : 'D'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{d.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Driver ID: #{d.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiPhone size={12} color="#0284c7" /> {d.phone}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <FiMail size={12} /> {d.email}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#334155',
                      }}
                    >
                      {VEHICLE_ICONS[d.vehicleType] || '🛵'} {d.vehicleType} • {d.licensePlate || 'N/A'}
                    </span>
                  </td>
                  <td>
                    {d.isOnline ? (
                      d.status === 'ACTIVE_DELIVERY' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#dbeafe', color: '#1d4ed8', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d4ed8' }} /> On Run
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#dcfce7', color: '#15803d', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} /> Online (Available)
                        </span>
                      )
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} /> Offline
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{d.totalDeliveries || 0}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>orders fulfilled</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#16a34a' }}>₹{(d.totalEarnings || 0).toFixed(2)}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>payout earned</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: d.isActive ? '#ecfdf5' : '#fef2f2',
                        color: d.isActive ? '#059669' : '#dc2626',
                      }}
                    >
                      {d.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(d)}
                      disabled={togglingId === d.id}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: d.isActive ? '#10b981' : '#94a3b8',
                        fontSize: '1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title={d.isActive ? 'Deactivate driver' : 'Activate driver'}
                    >
                      {d.isActive ? <FiToggleRight color="#10b981" /> : <FiToggleLeft color="#94a3b8" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Onboard Driver Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              maxWidth: 500,
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MdTwoWheeler color="var(--primary)" size={22} /> Onboard Delivery Partner
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Register rider to enable order delivery assignment
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDriver} style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Driver Full Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Ramesh Verma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Mobile Number (10 Digits) *</label>
                  <input
                    className="form-input"
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="driver@ghartk.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Initial Password *</label>
                  <input
                    className="form-input"
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Operating City</label>
                  <input
                    className="form-input"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>Vehicle Type *</label>
                  <select
                    className="form-select"
                    value={form.vehicleType}
                    onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  >
                    <option value="BIKE">🏍️ Motorcycle / Bike</option>
                    <option value="SCOOTER">🛵 Scooter</option>
                    <option value="EV">⚡ Electric Vehicle (EV)</option>
                    <option value="CYCLE">🚲 Bicycle</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                    Vehicle Plate / Reg No. {form.vehicleType === 'CYCLE' ? '(Optional for Bicycle)' : '*'}
                  </label>
                  <input
                    className="form-input"
                    placeholder={form.vehicleType === 'CYCLE' ? 'Not Applicable (Bicycle)' : 'e.g. DL 09 AB 4321'}
                    value={form.licensePlate}
                    onChange={(e) => setForm({ ...form, licensePlate: e.target.value.toUpperCase() })}
                    required={form.vehicleType !== 'CYCLE'}
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, fontSize: '0.75rem', color: '#64748b', marginBottom: 20 }}>
                💡 Partner can log in via <code>/login</code> using this email/phone & password and toggle duty online to start accepting delivery orders immediately.
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn"
                  style={{ background: '#f1f5f9', color: '#475569', borderRadius: 10, fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ borderRadius: 10, fontWeight: 700, padding: '10px 24px' }}
                >
                  {saving ? 'Onboarding...' : 'Onboard Partner 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
