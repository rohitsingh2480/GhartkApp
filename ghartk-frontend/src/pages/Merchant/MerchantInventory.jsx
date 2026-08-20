import { useState, useEffect } from 'react'
import { merchantAPI } from '../../api/endpoints'
import { FiToggleLeft, FiToggleRight, FiEdit3 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function MerchantInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [editingPrice, setEditingPrice] = useState(null)
  const [priceValue, setPriceValue] = useState('')

  useEffect(() => {
    fetchProducts()
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
    if (isNaN(qty) || qty < 0) {
      toast.error('Enter a valid quantity')
      return
    }
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
    if (isNaN(price) || price <= 0) {
      toast.error('Enter a valid price greater than 0')
      return
    }
    try {
      await merchantAPI.updateProductPrice(id, price)
      toast.success('Price updated!')
      setEditingPrice(null)
      fetchProducts()
    } catch {
      toast.error('Failed to update price')
    }
  }

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 20 }}>📦 Inventory Manager</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Product', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#f1f5f9' }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{product.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{product.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {editingPrice === product.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={priceValue}
                          onChange={(e) => setPriceValue(e.target.value)}
                          style={{ width: 80, padding: '5px 8px', border: '1.5px solid var(--primary)', borderRadius: 8, fontSize: '0.9rem' }}
                          autoFocus
                        />
                        <button onClick={() => handlePriceSave(product.id)}
                          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Save
                        </button>
                        <button onClick={() => setEditingPrice(null)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: '#0f3460' }}>₹{product.price}</span>
                        <button onClick={() => { setEditingPrice(product.id); setPriceValue(product.price ?? '') }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                          <FiEdit3 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {editingStock === product.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          type="number"
                          value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          style={{ width: 70, padding: '5px 8px', border: '1.5px solid var(--primary)', borderRadius: 8, fontSize: '0.9rem' }}
                          autoFocus
                        />
                        <button onClick={() => handleStockSave(product.id)}
                          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Save
                        </button>
                        <button onClick={() => setEditingStock(null)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontWeight: 700,
                          color: product.stockQty > 10 ? '#10b981' : product.stockQty > 0 ? '#f59e0b' : '#ef4444'
                        }}>
                          {product.stockQty ?? '—'}
                        </span>
                        <button onClick={() => { setEditingStock(product.id); setStockValue(product.stockQty ?? 0) }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                          <FiEdit3 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: product.available ? '#dcfce7' : '#fee2e2',
                      color: product.available ? '#16a34a' : '#dc2626',
                      padding: '4px 10px', borderRadius: 99, fontSize: '0.74rem', fontWeight: 600
                    }}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleToggle(product.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: product.available ? '#10b981' : '#94a3b8' }}
                      title="Toggle availability"
                    >
                      {product.available ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
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
    </div>
  )
}
