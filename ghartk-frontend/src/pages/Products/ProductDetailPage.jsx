import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiStar, FiArrowLeft, FiShoppingCart } from 'react-icons/fi'
import { productAPI, cartAPI } from '../../api/endpoints'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { cart, setCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [qty, setQty] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id),
  })

  const product = data?.data

  const cartItem = cart?.items?.find((i) => i.productId === Number(id))
  const cartQty = cartItem?.quantity || 0

  const handleAdd = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setLoading(true)
    try {
      const res = await cartAPI.addItem({ productId: Number(id), quantity: qty })
      setCart(res.data)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err?.message || 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (newQty) => {
    setLoading(true)
    try {
      const res = await cartAPI.updateItem(cartItem.id, { productId: Number(id), quantity: newQty })
      setCart(res.data)
      if (newQty === 0) toast.success('Item removed')
    } catch (err) {
      toast.error(err?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
          <div>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton skeleton-text" style={{ width: `${80-i*10}%`, marginBottom: 16 }} />)}
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return null
  const discountPercent = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
        <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 16, background: 'var(--bg-secondary)' }}
              onError={(e) => { e.target.src = ''; e.target.style.background = 'var(--bg-secondary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className={`veg-indicator ${product.isVeg ? 'veg' : 'non-veg'}`} />
              <span className="badge badge-primary">{product.categoryName}</span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>{product.name}</h1>
            {product.unit && <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{product.unit}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFF8E1', padding: '4px 10px', borderRadius: 20 }}>
                <FiStar size={13} fill="#FFB800" stroke="#FFB800" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.rating?.toFixed(1)}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>({product.reviewCount} reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatCurrency(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatCurrency(product.mrp)}
                  </span>
                  <span className="badge badge-success">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            {product.description && (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>
                {product.description}
              </p>
            )}

            <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
              {product.stockQty > 0 && product.stockQty <= 20 && (
                <span className="badge badge-warning">Only {product.stockQty} left!</span>
              )}
              {!product.isAvailable && <span className="badge badge-danger">Out of Stock</span>}
              {product.isAvailable && product.stockQty > 20 && <span className="badge badge-success">✓ In Stock</span>}
              {product.isFeatured && <span className="badge badge-primary">⭐ Featured</span>}
            </div>

            {product.isAvailable && (
              <div style={{ marginTop: 24 }}>
                {cartQty === 0 ? (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-secondary)', borderRadius: 12, padding: '8px 16px' }}>
                      <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                      <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleAdd} disabled={loading} style={{ flex: 1 }}>
                      {loading ? 'Adding...' : <><FiShoppingCart /> Add to Cart</>}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="qty-controls" style={{ padding: '8px 12px' }}>
                      <button className="qty-btn" onClick={() => handleUpdate(cartQty - 1)} disabled={loading}>-</button>
                      <span className="qty-value" style={{ fontSize: '1.1rem', padding: '0 8px' }}>{cartQty}</span>
                      <button className="qty-btn" onClick={() => handleUpdate(cartQty + 1)} disabled={loading}>+</button>
                    </div>
                    <button className="btn btn-outline" onClick={() => navigate('/cart')}>
                      <FiShoppingCart /> View Cart
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 24, padding: 16, background: 'var(--bg)', borderRadius: 12, display: 'flex', gap: 20 }}>
              {[['🚚', 'Free delivery', 'On orders above ₹499'],
                ['⏱️', '30-45 min', 'Fast delivery'],
                ['🔄', 'Easy returns', '24h return policy']].map(([icon, title, sub]) => (
                <div key={title} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
