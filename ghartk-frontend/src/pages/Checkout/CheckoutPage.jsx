import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiPlus, FiMapPin, FiCreditCard } from 'react-icons/fi'
import { userAPI, orderAPI } from '../../api/endpoints'
import useCartStore from '../../store/cartStore'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, clearCartStore } = useCartStore()
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [notes, setNotes] = useState('')
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: 'Home', line1: '', line2: '', city: '', state: 'Maharashtra', pincode: '', isDefault: false
  })

  const { data: addressData, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => userAPI.getAddresses(),
    onSuccess: (res) => {
      const def = res.data?.find(a => a.isDefault)
      if (def && !selectedAddressId) setSelectedAddressId(def.id)
    },
  })
  const addresses = addressData?.data || []

  if (!selectedAddressId && addresses.length > 0) {
    const def = addresses.find(a => a.isDefault) || addresses[0]
    setSelectedAddressId(def.id)
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const res = await userAPI.addAddress(newAddress)
      setSelectedAddressId(res.data.id)
      setShowAddAddress(false)
      refetch()
      toast.success('Address added!')
    } catch (err) {
      toast.error(err?.message || 'Failed to add address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { toast.error('Please select a delivery address'); return }
    if (!cart?.items?.length) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      const res = await orderAPI.place({ addressId: selectedAddressId, paymentMethod, notes })
      clearCartStore()
      toast.success('🎉 Order placed successfully!')
      navigate(`/orders/${res.data.id}`)
    } catch (err) {
      toast.error(err?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const items = cart?.items || []

  return (
    <div className="page-wrapper">
      <div className="container checkout-page">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 28 }}>Checkout</h1>

        <div className="checkout-layout">
          <div>
            {/* Delivery Address */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <div className="checkout-section-num">1</div>
                <div className="checkout-section-title"><FiMapPin style={{ marginRight: 6 }} />Delivery Address</div>
              </div>
              <div className="checkout-section-body">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-option${selectedAddressId === addr.id ? ' selected' : ''}`}
                    onClick={() => setSelectedAddressId(addr.id)}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: `2px solid ${selectedAddressId === addr.id ? 'var(--primary)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                    }}>
                      {selectedAddressId === addr.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center' }}>
                        {addr.label}
                        {addr.isDefault && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Default</span>}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                        {addr.city} - {addr.pincode}, {addr.state}
                      </div>
                    </div>
                  </div>
                ))}

                {!showAddAddress ? (
                  <button className="btn btn-outline btn-sm" onClick={() => setShowAddAddress(true)}>
                    <FiPlus /> Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddAddress} style={{ marginTop: 16, padding: 16, background: 'var(--bg)', borderRadius: 12 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 14 }}>New Address</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="form-label">Label</label>
                        <select className="form-select" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})}>
                          {['Home','Work','Other'].map(l => <option key={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Pincode</label>
                        <input className="form-input" placeholder="400001" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address Line 1</label>
                      <input className="form-input" placeholder="House no, Street" required value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="form-label">City</label>
                        <input className="form-input" placeholder="Mumbai" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                      </div>
                      <div>
                        <label className="form-label">State</label>
                        <input className="form-input" placeholder="Maharashtra" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddAddress(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <div className="checkout-section-num">2</div>
                <div className="checkout-section-title"><FiCreditCard style={{ marginRight: 6 }} />Payment Method</div>
              </div>
              <div className="checkout-section-body">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'ONLINE', label: 'Pay Online', icon: '💳', desc: 'UPI, Net Banking, Cards (Coming Soon)' },
                ].map((opt) => (
                  <div key={opt.value} className={`payment-option${paymentMethod === opt.value ? ' selected' : ''}`}
                    onClick={() => setPaymentMethod(opt.value)}>
                    <input type="radio" readOnly checked={paymentMethod === opt.value} />
                    <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 16 }}>
                  <label className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Any special delivery instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <div className="order-summary-title">Order Summary</div>
            <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.88rem', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.productName} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(cart?.subtotal)}</span></div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{cart?.freeDelivery ? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>FREE</span> : formatCurrency(cart?.deliveryFee)}</span>
            </div>
            <div className="summary-row"><span>Packaging</span><span>{formatCurrency(cart?.packagingFee)}</span></div>
            <hr className="summary-divider" />
            <div className="summary-total">
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary)' }}>{formatCurrency(cart?.total)}</span>
            </div>

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--accent-light)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--accent)', display: 'flex', gap: 8, alignItems: 'center' }}>
              ⏱️ Estimated delivery: <strong>30-45 mins</strong>
            </div>

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16 }}
              onClick={handlePlaceOrder} disabled={loading || !selectedAddressId}>
              {loading ? 'Placing Order...' : `Place Order • ${formatCurrency(cart?.total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
