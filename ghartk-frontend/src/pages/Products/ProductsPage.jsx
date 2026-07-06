import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiSearch, FiSliders } from 'react-icons/fi'
import { productAPI, categoryAPI } from '../../api/endpoints'
import ProductCard from '../../components/UI/ProductCard'
import { ProductCardSkeleton } from '../../components/UI/Skeletons'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)

  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : null
  const query = searchParams.get('q') || ''
  const sortBy = searchParams.get('sort') || ''

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', categoryId, query, sortBy, page],
    queryFn: () => productAPI.getAll({ categoryId, query, sortBy, page, size: 12 }),
  })

  const products = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
    setPage(0)
  }

  const selectedCategory = categories?.data?.find(c => c.id === categoryId)

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
            {query ? `Search: "${query}"` : selectedCategory ? selectedCategory.name : 'All Products'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {data?.data?.totalElements || 0} products found
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card card-body" style={{ marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiSliders size={16} /> Filters
              </h3>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Search</label>
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="form-input"
                    style={{ paddingLeft: 36, fontSize: '0.88rem' }}
                    placeholder="Search products..."
                    defaultValue={query}
                    onKeyDown={(e) => e.key === 'Enter' && setFilter('q', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Category</label>
                <select className="form-select" style={{ fontSize: '0.88rem' }}
                  value={categoryId || ''} onChange={(e) => setFilter('category', e.target.value)}>
                  <option value="">All Categories</option>
                  {categories?.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.iconEmoji} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Sort By</label>
                <select className="form-select" style={{ fontSize: '0.88rem' }}
                  value={sortBy} onChange={(e) => setFilter('sort', e.target.value)}>
                  <option value="">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {(categoryId || query || sortBy) && (
                <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 16 }}
                  onClick={() => { setSearchParams({}); setPage(0) }}>
                  Clear Filters
                </button>
              )}
            </div>

            {/* Categories quick links */}
            <div className="card card-body">
              <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.9rem' }}>Categories</h4>
              {categories?.data?.map((c) => (
                <div key={c.id}
                  onClick={() => setFilter('category', c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                    cursor: 'pointer', borderBottom: '1px solid var(--border-light)',
                    color: c.id === categoryId ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: c.id === categoryId ? 600 : 400, fontSize: '0.88rem',
                    transition: 'color 0.2s',
                  }}>
                  <span>{c.iconEmoji}</span>
                  <span>{c.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.productCount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div>
            <div className="products-grid">
              {isLoading
                ? Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.length === 0
                  ? (
                    <div style={{ gridColumn: '1/-1' }}>
                      <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <div className="empty-state-title">No products found</div>
                        <div className="empty-state-text">Try adjusting your filters or search term</div>
                        <button className="btn btn-primary" onClick={() => { setSearchParams({}); setPage(0) }}>
                          View All Products
                        </button>
                      </div>
                    </div>
                  )
                  : products.map((p) => <ProductCard key={p.id} product={p} />)
              }
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                  <button key={i} className={`page-btn${page === i ? ' active' : ''}`}
                    onClick={() => setPage(i)}>{i + 1}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
