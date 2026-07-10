import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const EMPTY = { name: '', description: '', imageUrl: '', iconEmoji: '🛒', isActive: true, sortOrder: 0 }

export default function AdminCategories() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminAPI.getCategories(),
  })
  const categories = data?.data || []

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (c) => { setEditing(c.id); setForm({ name: c.name, description: c.description||'', imageUrl: c.imageUrl||'', iconEmoji: c.iconEmoji||'🛒', isActive: c.isActive, sortOrder: c.sortOrder }); setShowModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await adminAPI.updateCategory(editing, form)
      else await adminAPI.createCategory(form)
      queryClient.invalidateQueries(['admin-categories'])
      queryClient.invalidateQueries(['categories'])
      setShowModal(false)
      toast.success(editing ? 'Category updated!' : 'Category created!')
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? All products in it must be reassigned first.`)) return
    try {
      await adminAPI.deleteCategory(id)
      queryClient.invalidateQueries(['admin-categories'])
      toast.success('Category deleted!')
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Categories</h1>
          <p style={{ color: '#888', fontSize: '0.88rem' }}>{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Category</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 }}>
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />)
        ) : categories.map((cat) => (
          <div key={cat.id} className="card" style={{ border: `2px solid ${cat.isActive ? 'var(--border-light)' : '#FFE0E0'}` }}>
            <div style={{ padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: cat.isActive ? 'var(--primary-light)' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                {cat.iconEmoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{cat.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2 }}>{cat.productCount} products</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>Sort: {cat.sortOrder}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}>
                <FiEdit size={13} /> Edit
              </button>
              <button className="btn btn-sm" style={{ color: 'var(--danger)', background: '#FFEBEE' }} onClick={() => handleDelete(cat.id, cat.name)}>
                <FiTrash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 14 }}>
                  <div>
                    <label className="form-label">Category Name *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Fresh Fruits" />
                  </div>
                  <div>
                    <label className="form-label">Emoji *</label>
                    <input className="form-input" required value={form.iconEmoji} onChange={e => setForm({...form, iconEmoji: e.target.value})} style={{ textAlign: 'center', fontSize: '1.4rem' }} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Category description..." style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="form-label">Sort Order</label>
                    <input className="form-input" type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})}
                        style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                      Active
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
