import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatCurrency } from '../../utils/helpers'
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

const EMPTY_PRODUCT = { categoryId: '', name: '', description: '', imageUrl: '', price: '', mrp: '', stockQty: 0, unit: '', isAvailable: true, isFeatured: false, isVeg: true }

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, query],
    queryFn: () => adminAPI.getProducts({ page, size: 15, query }),
  })

  const { data: catData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminAPI.getCategories(),
  })

  const products = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0
  const categories = catData?.data || []

  const openAdd = () => { setEditing(null); setForm(EMPTY_PRODUCT); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({ categoryId: p.categoryId, name: p.name, description: p.description || '', imageUrl: p.imageUrl || '', price: p.price, mrp: p.mrp || '', stockQty: p.stockQty, unit: p.unit || '', isAvailable: p.isAvailable, isFeatured: p.isFeatured, isVeg: p.isVeg })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await adminAPI.updateProduct(editing, form)
      else await adminAPI.createProduct(form)
      queryClient.invalidateQueries(['admin-products'])
      setShowModal(false)
      toast.success(editing ? 'Product updated!' : 'Product created!')
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete product "${name}"?`)) return
    try {
      await adminAPI.deleteProduct(id)
      queryClient.invalidateQueries(['admin-products'])
      toast.success('Product deleted!')
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Products</h1>
          <p style={{ color: '#888', fontSize: '0.88rem' }}>{data?.data?.totalElements || 0} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search products..."
            value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} />
        </div>
      </div>

      <div className="admin-table-card">
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#f5f5f5', flexShrink: 0 }}
                        onError={(e) => e.target.style.background = '#f5f5f5'} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.categoryName}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(p.price)}</div>
                    {p.mrp > p.price && <div style={{ fontSize: '0.75rem', color: '#888', textDecoration: 'line-through' }}>{formatCurrency(p.mrp)}</div>}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: p.stockQty <= 10 ? '#FF9500' : p.stockQty === 0 ? '#FF3B30' : '#333' }}>
                      {p.stockQty}
                    </span>
                    {p.stockQty <= 10 && p.stockQty > 0 && <span className="badge badge-warning" style={{ marginLeft: 6, fontSize: '0.65rem' }}>Low</span>}
                  </td>
                  <td>
                    <span className={`badge ${p.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {p.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                    {p.isFeatured && <span className="badge badge-primary" style={{ marginLeft: 4, fontSize: '0.65rem' }}>★ Featured</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" style={{ color: '#007AFF' }} onClick={() => openEdit(p)} title="Edit"><FiEdit size={15} /></button>
                      <button className="btn-icon" style={{ color: '#FF3B30' }} onClick={() => handleDelete(p.id, p.name)} title="Delete"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page===0} onClick={() => setPage(p=>p-1)}>‹</button>
          {Array.from({length: Math.min(totalPages,7)}, (_,i) => (
            <button key={i} className={`page-btn${page===i?' active':''}`} onClick={() => setPage(i)}>{i+1}</button>
          ))}
          <button className="page-btn" disabled={page>=totalPages-1} onClick={() => setPage(p=>p+1)}>›</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="form-label">Category *</label>
                    <select className="form-select" required value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.iconEmoji} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Product name" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description..." style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  <div>
                    <label className="form-label">Price (₹) *</label>
                    <input className="form-input" type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="form-label">MRP (₹)</label>
                    <input className="form-input" type="number" step="0.01" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="form-label">Stock Qty *</label>
                    <input className="form-input" type="number" required value={form.stockQty} onChange={e => setForm({...form, stockQty: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Unit</label>
                  <input className="form-input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="kg, pcs, litre..." />
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { key: 'isAvailable', label: 'Available' },
                    { key: 'isFeatured', label: 'Featured' },
                    { key: 'isVeg', label: 'Vegetarian' },
                  ].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500 }}>
                      <input type="checkbox" checked={form[key]} onChange={e => setForm({...form, [key]: e.target.checked})}
                        style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
