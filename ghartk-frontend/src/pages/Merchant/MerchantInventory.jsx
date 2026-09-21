import { useState, useEffect } from 'react'
import { merchantAPI } from '../../api/endpoints'
import { categoryAPI } from '../../api/endpoints'
import { FiToggleLeft, FiToggleRight, FiEdit3, FiPlus, FiX, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const EMPTY_PRODUCT = {
  categoryId: '',
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  mrp: '',
  stockQty: 50,
  unit: '1 kg',
  isAvailable: true,
  isFeatured: false,
  isVeg: true,
}

export default function MerchantInventory() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [editingPrice, setEditingPrice] = useState(null)
  const [priceValue, setPriceValue] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT)
  const [savingProduct, setSavingProduct] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await merchantAPI.getProducts({ page: 0, size: 100 })
      setProducts(res.data?.content || res.data || [])
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll()
      setCategories(res.data || [])
    } catch {}
  }

  const handleToggle = async (id) => {
    try {
      await merchantAPI.toggleProductAvailability(id)
      toast.success('Availability updated')
      fetchProducts()
    } catch {
      toast.error('Failed to toggle')
    }
  }

  const handleStockSave = async (id) => {
    const qty = parseInt(stockValue, 10)
    if (isNaN(qty) || qty < 0) { toast.error('Enter a valid quantity'); return }
    try {
      await merchantAPI.updateProductStock(id, qty)
      toast.success('Stock updated!')
      setEditingStock(null)
      fetchProducts()
    } catch {
      toast.error('Failed to update stock')
    }
  }

  const handlePriceSave = async (id) => {
    const price = parseFloat(priceValue)
    if (isNaN(price) || price <= 0) { toast.error('Enter a valid price greater than 0'); return }
    try {
      await merchantAPI.updateProductPrice(id, price)
      toast.success('Price updated!')
      setEditingPrice(null)
      fetchProducts()
    } catch {
      toast.error('Failed to update price')
    }
  }

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm(EMPTY_PRODUCT)
    setShowProductModal(true)
  }

  const openEditProduct = (p) => {
    setEditingProduct(p.id)
    setProductForm({
      categoryId: p.categoryId || '',
      name: p.name || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      price: p.price || '',
      mrp: p.mrp || '',
      stockQty: p.stockQty ?? 0,
      unit: p.unit || '1 kg',
      isAvailable: p.isAvailable ?? true,
      isFeatured: p.isFeatured ?? false,
      isVeg: p.isVeg ?? true,
    })
    setShowProductModal(true)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    if (!productForm.categoryId) { toast.error('Please select a category'); return }
    if (!productForm.name.trim()) { toast.error('Product name is required'); return }
    if (!productForm.price || parseFloat(productForm.price) <= 0) { toast.error('Valid price is required'); return }
    setSavingProduct(true)
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        mrp: productForm.mrp ? parseFloat(productForm.mrp) : parseFloat(productForm.price),
        categoryId: parseInt(productForm.categoryId, 10),
        stockQty: parseInt(productForm.stockQty, 10) || 0,
      }
      if (editingProduct) {
        await merchantAPI.updateProduct(editingProduct, payload)
        toast.success('Product updated!')
      } else {
        await merchantAPI.createProduct(payload)
        toast.success('Product added to your store! 🎉')
      }
      setShowProductModal(false)
      fetchProducts()
    } catch (err) {
      toast.error(err?.message || 'Failed to save product')
    } finally {
      setSavingProduct(false)
    }
  }

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}" from your store?`)) return
    try {
      await merchantAPI.deleteProduct(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 2 }}>📦 Inventory & Products</h2>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            Manage your store catalog. Add, price, and stock products that customers in your area can order.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openAddProduct}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading your inventory...</div>
      ) : products.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 14, padding: 60, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No products yet</div>
          <p style={{ color: '#888', marginBottom: 20, fontSize: '0.9rem' }}>
            Your store is live but has no products. Add your first product so customers in your pincode can order from you!
          </p>
          <button className="btn btn-primary" onClick={openAddProduct}>
            <FiPlus /> Add First Product
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Product */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#f1f5f9' }}
                          onError={(e) => { e.target.style.display = 'none' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{product.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{product.unit}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#64748b' }}>
                    {product.categoryName || '—'}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '14px 16px' }}>
                    {editingPrice === product.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input type="number" step="0.01" value={priceValue}
                          onChange={(e) => setPriceValue(e.target.value)}
                          style={{ width: 80, padding: '5px 8px', border: '1.5px solid var(--primary)', borderRadius: 8, fontSize: '0.9rem' }} autoFocus />
                        <button onClick={() => handlePriceSave(product.id)}
                          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Save
                        </button>
                        <button onClick={() => setEditingPrice(null)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: '#0f3460' }}>₹{product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.mrp}</span>
                        )}
                        <button onClick={() => { setEditingPrice(product.id); setPriceValue(product.price ?? '') }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                          <FiEdit3 size={13} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Stock */}
                  <td style={{ padding: '14px 16px' }}>
                    {editingStock === product.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input type="number" value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          style={{ width: 70, padding: '5px 8px', border: '1.5px solid var(--primary)', borderRadius: 8, fontSize: '0.9rem' }} autoFocus />
                        <button onClick={() => handleStockSave(product.id)}
                          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Save
                        </button>
                        <button onClick={() => setEditingStock(null)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: product.stockQty > 10 ? '#10b981' : product.stockQty > 0 ? '#f59e0b' : '#ef4444' }}>
                          {product.stockQty ?? '—'}
                        </span>
                        <button onClick={() => { setEditingStock(product.id); setStockValue(product.stockQty ?? 0) }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                          <FiEdit3 size={13} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: (product.isAvailable ?? product.available) ? '#dcfce7' : '#fee2e2',
                      color: (product.isAvailable ?? product.available) ? '#16a34a' : '#dc2626',
                      padding: '4px 10px', borderRadius: 99, fontSize: '0.74rem', fontWeight: 600
                    }}>
                      {(product.isAvailable ?? product.available) ? 'Available' : 'Hidden'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => handleToggle(product.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: (product.isAvailable ?? product.available) ? '#10b981' : '#94a3b8' }}
                        title="Toggle availability">
                        {(product.isAvailable ?? product.available) ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button onClick={() => openEditProduct(product)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}
                        title="Edit product">
                        <FiEdit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id, product.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete product">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No products found</div>
          )}
        </div>
      )}

      {/* ── Add / Edit Product Modal ─────────────────────────────────────── */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowProductModal(false)}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 560, width: '100%', padding: '26px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowProductModal(false)} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <FiX size={20} />
            </button>

            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 4 }}>
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 22 }}>
              {editingProduct
                ? 'Update this product in your store catalog.'
                : 'This product will appear for customers in your pincode area.'}
            </p>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Product Name *</label>
                  <input className="form-input" placeholder="e.g. Fresh Tomatoes (1 kg)" value={productForm.name}
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Category *</label>
                  <select className="form-input" value={productForm.categoryId}
                    onChange={e => setProductForm(f => ({ ...f, categoryId: e.target.value }))} required>
                    <option value="">Select category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.iconEmoji} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Unit / Pack Size</label>
                  <input className="form-input" placeholder="e.g. 1 kg, 500 g, 1 litre" value={productForm.unit}
                    onChange={e => setProductForm(f => ({ ...f, unit: e.target.value }))} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Selling Price (₹) *</label>
                  <input className="form-input" type="number" step="0.01" placeholder="0.00" value={productForm.price}
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>MRP / Original Price (₹)</label>
                  <input className="form-input" type="number" step="0.01" placeholder="0.00 (optional)" value={productForm.mrp}
                    onChange={e => setProductForm(f => ({ ...f, mrp: e.target.value }))} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Stock Quantity</label>
                  <input className="form-input" type="number" placeholder="50" value={productForm.stockQty}
                    onChange={e => setProductForm(f => ({ ...f, stockQty: e.target.value }))} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                  <textarea className="form-input" rows={2} placeholder="Short description of the product..." value={productForm.description}
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                    style={{ resize: 'vertical', minHeight: 60 }} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Product Image URL</label>
                  <input className="form-input" placeholder="https://images.unsplash.com/..." value={productForm.imageUrl}
                    onChange={e => setProductForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 22, marginTop: 8 }}>
                {[
                  { label: '🟢 Available', key: 'isAvailable' },
                  { label: '⭐ Featured', key: 'isFeatured' },
                  { label: '🌿 Veg', key: 'isVeg' },
                ].map(({ label, key }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input type="checkbox" checked={!!productForm[key]}
                      onChange={e => setProductForm(f => ({ ...f, [key]: e.target.checked }))}
                      style={{ width: 16, height: 16, accentColor: '#FF6B00' }} />
                    {label}
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingProduct} style={{ fontWeight: 700, minWidth: 130 }}>
                  {savingProduct ? 'Saving...' : editingProduct ? 'Update Product' : '➕ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
