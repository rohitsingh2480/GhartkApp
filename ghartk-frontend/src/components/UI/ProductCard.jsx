import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiStar, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi'
import { cartAPI } from '../../api/endpoints'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { cart, setCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const cartItem = cart?.items?.find((i) => i.productId === product.id)
  const qty = cartItem?.quantity || 0

  const handleAdd = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) { navigate('/login'); return }
    setLoading(true)
    try {
      const res = await cartAPI.addItem({ productId: product.id, quantity: 1 })
      setCart(res.data)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err?.message || 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e, newQty) => {
    e.stopPropagation()
    setLoading(true)
    try {
      const res = await cartAPI.updateItem(cartItem.id, { productId: product.id, quantity: newQty })
      setCart(res.data)
      if (newQty === 0) toast.success('Item removed from cart')
    } catch (err) {
      toast.error(err?.message || 'Failed to update cart')
    } finally {
      setLoading(false)
    }
  }

  const discountPercent = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div style={{ position: 'relative' }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-card-image"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
        ) : null}
        <div className="product-card-image-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
          🛒
        </div>
        {discountPercent > 0 && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--accent)', color: '#fff',
            fontSize: '0.72rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: '6px'
          }}>{discountPercent}% OFF</span>
        )}
        {!product.isAvailable && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ background: 'var(--danger)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.categoryName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div className={`veg-indicator ${product.isVeg ? 'veg' : 'non-veg'}`} />
          <div className="product-card-name">{product.name}</div>
        </div>
        {product.unit && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>{product.unit}</div>}
        <div className="product-card-rating">
          <FiStar size={11} fill="#FFB800" stroke="#FFB800" />
          <span>{product.rating?.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="add-to-cart-btn">
          <div className="product-card-pricing">
            <span className="product-price">{formatCurrency(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="product-mrp">{formatCurrency(product.mrp)}</span>
            )}
          </div>

          {product.isAvailable && (
            qty === 0 ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAdd}
                disabled={loading}
                style={{ padding: '8px 14px', minWidth: 64 }}
              >
                {loading ? '...' : <><FiPlus size={14} /> Add</>}
              </button>
            ) : (
              <div className="qty-controls" onClick={(e) => e.stopPropagation()}>
                <button className="qty-btn" onClick={(e) => handleUpdate(e, qty - 1)} disabled={loading}>-</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={(e) => handleUpdate(e, qty + 1)} disabled={loading}>+</button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
