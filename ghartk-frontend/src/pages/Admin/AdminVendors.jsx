import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { FiPlus, FiMapPin, FiToggleLeft, FiToggleRight, FiUser, FiPhone, FiMail, FiX } from 'react-icons/fi'
import { MdStorefront } from 'react-icons/md'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  merchantName: '',
  email: '',
  phone: '',
  password: 'Vendor@123',
  storeName: '',
  storeDescription: '',
  pincode: '',
  city: '',
  addressLine1: '',
  logoUrl: '',
}

const CITY_MAP = {
  '110049': 'New Delhi', '110001': 'New Delhi', '110016': 'New Delhi',
  '110017': 'New Delhi', '110048': 'New Delhi', '248001': 'Dehradun',
  '248002': 'Dehradun', '400001': 'Mumbai', '560001': 'Bengaluru',
  '600001': 'Chennai', '700001': 'Kolkata', '500001': 'Hyderabad',
  '302001': 'Jaipur', '380001': 'Ahmedabad', '411001': 'Pune',
}

export default function AdminVendors() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [filterPincode, setFilterPincode] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: () => adminAPI.getAllStores(),
  })

  const allStores = data?.data || []
  const stores = allStores.filter(s =>
    !filterPincode.trim() || s.pincode?.includes(filterPincode.trim())
  )

  const handlePincodeChange = (pin) => {
    const val = pin.replace(/\D/g, '').slice(0, 6)
    const autoCity = CITY_MAP[val] || form.city
    setForm(f => ({ ...f, pincode: val, city: val.length === 6 ? (CITY_MAP[val] || f.city) : f.city }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.merchantName.trim()) { toast.error('Merchant name is required'); return }
    if (!form.email.includes('@')) { toast.error('Valid email is required'); return }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit mobile required'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (!form.storeName.trim()) { toast.error('Store name is required'); return }
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) { toast.error('Valid 6-digit pincode required'); return }
    if (!form.city.trim()) { toast.error('City is required'); return }

    setSaving(true)
    try {
      await adminAPI.onboardMerchant(form)
      queryClient.invalidateQueries(['admin-stores'])
      setShowModal(false)
      setForm(EMPTY_FORM)
      toast.success(`Vendor "${form.merchantName}" onboarded! Store "${form.storeName}" is live in ${form.pincode}.`)
    } catch (err) {
      toast.error(err?.message || 'Failed to onboard vendor')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id, name, isActive) => {
    if (!confirm(`${isActive ? 'Deactivate' : 'Activate'} store "${name}"?`)) return
    setTogglingId(id)
    try {
      await adminAPI.toggleStoreStatus(id)
      queryClient.invalidateQueries(['admin-stores'])
      toast.success(`Store ${isActive ? 'deactivated' : 'activated'}!`)
    } catch (err) {
      toast.error(err?.message || 'Action failed')
    } finally {
      setTogglingId(null)
    }
  }

  const grouped = stores.reduce((acc, s) => {
    const pin = s.pincode || 'Unknown'
    if (!acc[pin]) acc[pin] = []
    acc[pin].push(s)
    return acc
  }, {})

  const activeCount = allStores.filter(s => s.isActive ?? s.active ?? true).length
  const pincodes = [...new Set(allStores.map(s => s.pincode).filter(Boolean))]
  const cities = [...new Set(allStores.map(s => s.city).filter(Boolean))]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MdStorefront size={22} style={{ color: '#FF6B00' }} /> Vendor & Store Management
          </h1>
          <p style={{ color: '#888', fontSize: '0.88rem', marginTop: 4 }}>
            Onboard local merchants by pincode. Vendors manage their own products &amp; inventory.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowModal(true) }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
          <FiPlus size={16} /> Onboard New Vendor
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Stores', value: allStores.length, icon: '🏪', color: '#3b82f6' },
          { label: 'Active Stores', value: activeCount, icon: '✅', color: '#10b981' },
          { label: 'Pincodes', value: pincodes.length, icon: '📍', color: '#FF6B00' },
          { label: 'Cities', value: cities.length, icon: '🏙️', color: '#8b5cf6' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.6rem' }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pincode Filter */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 260 }}>
          <FiMapPin style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#FF6B00' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Filter by pincode..."
            value={filterPincode} maxLength={6}
            onChange={e => setFilterPincode(e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>

      {/* Stores Grouped by Pincode */}
      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Loading stores...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 14, padding: 60, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏪</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
            {filterPincode ? `No stores in pincode ${filterPincode}` : 'No stores registered yet'}
          </div>
          <p style={{ color: '#888', marginBottom: 20, fontSize: '0.9rem' }}>
            Click "Onboard New Vendor" to register the first local merchant for a pincode area.
          </p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Onboard First Vendor
          </button>
        </div>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([pin, pinStores]) => (
          <div key={pin} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid rgba(255,107,0,0.15)' }}>
              <FiMapPin style={{ color: '#FF6B00' }} size={18} />
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>📍 Pincode {pin}</span>
              <span style={{ color: '#888', fontSize: '0.84rem' }}>
                {pinStores[0]?.city ? `— ${pinStores[0].city}` : ''} &nbsp;·&nbsp; {pinStores.length} store{pinStores.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {pinStores.map(store => {
                const active = store.isActive ?? store.active ?? true
                return (
                  <div key={store.id} style={{
                    background: '#fff', borderRadius: 14, padding: '20px 22px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
                    border: `1.5px solid ${active ? '#e2e8f0' : '#fee2e2'}`,
                    opacity: active ? 1 : 0.75, position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', top: 14, right: 16,
                      background: active ? '#dcfce7' : '#fee2e2',
                      color: active ? '#16a34a' : '#dc2626',
                      fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase',
                    }}>{active ? 'Active' : 'Inactive'}</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #0f3460, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <MdStorefront size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{store.name}</div>
                        {store.description && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{store.description}</div>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.82rem', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiUser size={12} style={{ color: '#888' }} />
                        <span>{store.merchantName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiMail size={12} style={{ color: '#888' }} />
                        <span style={{ wordBreak: 'break-all' }}>{store.merchantEmail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiPhone size={12} style={{ color: '#888' }} />
                        <span>{store.merchantPhone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiMapPin size={12} style={{ color: '#FF6B00' }} />
                        <span>{store.addressLine1 ? `${store.addressLine1}, ` : ''}{store.city} – <strong>{store.pincode}</strong></span>
                      </div>
                    </div>

                    <button onClick={() => handleToggle(store.id, store.name, active)}
                      disabled={togglingId === store.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center',
                        background: active ? '#fee2e2' : '#dcfce7', color: active ? '#dc2626' : '#16a34a',
                        border: 'none', borderRadius: 8, padding: '7px 0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                      }}>
                      {togglingId === store.id ? '...' : active ? <><FiToggleRight size={15} /> Deactivate Store</> : <><FiToggleLeft size={15} /> Activate Store</>}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      {/* ── Onboard Modal ──────────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 560, width: '100%', padding: '26px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <FiX size={20} />
            </button>

            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 4 }}>🏪 Onboard Local Vendor</h2>
            <p style={{ color: '#64748b', fontSize: '0.83rem', marginBottom: 22 }}>
              Create a merchant account + store for a specific delivery pincode. The vendor will log in and manage their own product catalog.
            </p>

            <form onSubmit={handleSave}>
              {/* Merchant Account */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', marginBottom: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                  👤 Merchant Account Credentials
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name *</label>
                    <input className="form-input" placeholder="Amit Kumar" value={form.merchantName}
                      onChange={e => setForm(f => ({ ...f, merchantName: e.target.value }))} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Mobile Number *</label>
                    <input className="form-input" placeholder="9876543210" maxLength={10} value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Address *</label>
                    <input className="form-input" type="email" placeholder="vendor@shop.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Login Password *</label>
                    <input className="form-input" placeholder="Min 6 characters" value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                  </div>
                </div>
              </div>

              {/* Store Details */}
              <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '14px 16px', marginBottom: 16, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                  🏪 Store Details
                </div>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Store / Shop Name *</label>
                  <input className="form-input" placeholder="e.g. Hauz Khas Fresh Grocers" value={form.storeName}
                    onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} required />
                </div>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Store Description</label>
                  <input className="form-input" placeholder="e.g. Organic vegetables and daily essentials" value={form.storeDescription}
                    onChange={e => setForm(f => ({ ...f, storeDescription: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>📍 Delivery Pincode *</label>
                    <input className="form-input" placeholder="110049" maxLength={6} value={form.pincode}
                      style={{ fontWeight: 700, letterSpacing: 2 }}
                      onChange={e => handlePincodeChange(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>City *</label>
                    <input className="form-input" placeholder="New Delhi" value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Store Address</label>
                  <input className="form-input" placeholder="e.g. Shop 12, Hauz Khas Village Market" value={form.addressLine1}
                    onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))} />
                </div>
              </div>

              <div style={{ background: '#eff6ff', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem', color: '#1d4ed8', marginBottom: 20, border: '1px solid #bfdbfe', lineHeight: 1.6 }}>
                ℹ️ After onboarding, the vendor logs in at <strong>/login</strong> and lands directly on their Store Dashboard to add products and manage orders for their pincode.
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ fontWeight: 700, minWidth: 140 }}>
                  {saving ? 'Onboarding...' : '🚀 Onboard Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
