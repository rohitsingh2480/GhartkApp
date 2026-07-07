import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { cartAPI } from '../../api/endpoints'
import useCartStore from '../../store/cartStore'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, setCart } = useCartStore()

  const { isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get().then((res) => { setCart(res.data); return res }),
  })

  const handleUpdate = async (item, newQty) => {
    try {
      const res = await cartAPI.updateItem(item.id, { productId: item.productId, quantity: newQty })
      setCart(res.data)
      if (newQty === 0) toast.success('Item removed')
    } catch (err) {
      toast.error(err?.message || 'Failed to update cart')
    }
  }

  const handleClear = async () => {
    if (!confirm('Clear all items from cart?')) return
    try {
      await cartAPI.clear()
      setCart(null)
      toast.success('Cart cleared')
    } catch {}
  }

  if (isLoading) return (
    <div className="page-wrapper">
      <div className="container cart-page">
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12, marginBottom: 12 }} />)}
      </div>
    </div>
  )

  const items = cart?.items || []

  if (items.length === 0) return (
    <div className="page-wrapper">
      <div className="container cart-page">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <div className="empty-state-title">Your cart is empty</div>
          <div className="empty-state-text">Add some delicious items to get started!</div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
            <FiShoppingBag /> Explore Products
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container cart-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            🛒 My Cart <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>({cart?.itemCount} items)</span>
          </h1>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={handleClear}>
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="card">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="cart-item-image"
                  onError={(e) => { e.target.src = ''; e.target.style.background = 'var(--bg-secondary)' }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.productName}</div>
                  <div className="cart-item-price">{formatCurrency(item.unitPrice)} each</div>
                  {!item.isAvailable && <div className="badge badge-danger" style={{ marginTop: 4 }}>Unavailable</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(item.totalPrice)}
                  </span>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => handleUpdate(item, item.quantity - 1)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleUpdate(item, item.quantity + 1)} disabled={item.quantity >= item.stockQty}>+</button>
                  </div>
                  {item.quantity >= item.stockQty && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--warning)' }}>Max stock reached</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="order-summary-card">
            <div className="order-summary-title">Order Summary</div>

            {cart?.freeDelivery ? (
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                🎉 You get FREE delivery!
              </div>
            ) : (
              <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.83rem', color: 'var(--primary)', fontWeight: 500 }}>
                Add {formatCurrency(499 - (cart?.subtotal || 0))} more for FREE delivery
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal</span><span>{formatCurrency(cart?.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>
                {cart?.freeDelivery
                  ? <span className="free-delivery-badge">FREE</span>
                  : formatCurrency(cart?.deliveryFee)}
              </span>
            </div>
            <div className="summary-row">
              <span>Packaging Fee</span><span>{formatCurrency(cart?.packagingFee)}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>{formatCurrency(cart?.total)}</span>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <button
              className="btn btn-ghost btn-full"
              style={{ marginTop: 10 }}
              onClick={() => navigate('/products')}
            >
              + Add More Items
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
