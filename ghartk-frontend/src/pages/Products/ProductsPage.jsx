import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiSearch, FiSliders, FiMapPin, FiX } from 'react-icons/fi'
import { MdStorefront } from 'react-icons/md'
import { productAPI, categoryAPI, storeAPI } from '../../api/endpoints'
import useLocationStore from '../../store/locationStore'
import ProductCard from '../../components/UI/ProductCard'
import { ProductCardSkeleton } from '../../components/UI/Skeletons'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)

  const { pincode, city, selectedStoreId, setSelectedStore, availableStores, setAvailableStores } = useLocationStore()

  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : null
  const query = searchParams.get('q') || ''
  const sortBy = searchParams.get('sort') || ''
  const urlStoreId = searchParams.get('storeId') ? Number(searchParams.get('storeId')) : null
  const activeStoreId = urlStoreId || selectedStoreId

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll(),
  })

  // Fetch local stores for this pincode
  const { data: storesData } = useQuery({
    queryKey: ['stores', pincode],
    queryFn: () => storeAPI.getAll({ pincode }),
  })

  useEffect(() => {
    if (storesData?.data) {
      setAvailableStores(storesData.data)
    }
  }, [storesData])

  // Fetch products filtered strictly by local pincode and active store!
  const { data, isLoading } = useQuery({
    queryKey: ['products', pincode, activeStoreId, categoryId, query, sortBy, page],
    queryFn: () => productAPI.getAll({
      pincode,
      storeId: activeStoreId,
      categoryId,
      query,
      sortBy,
      page,
      size: 12
    }),
  })

  const products = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0
  const localStores = storesData?.data || availableStores || []

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
    setPage(0)
  }

  const handleStoreChange = (storeId, storeName) => {
    setSelectedStore(storeId, storeName)
    setFilter('storeId', storeId ? String(storeId) : null)
  }

  const selectedCategory = categories?.data?.find(c => c.id === categoryId)
  const activeStoreObj = localStores.find(s => s.id === activeStoreId)

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
        {/* Hyperlocal Filter Info Bar */}
        <div style={{
          background: 'rgba(255, 107, 0, 0.08)',
          borderRadius: 12,
          padding: '12px 18px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          border: '1px solid rgba(255, 107, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
            <FiMapPin style={{ color: '#FF6B00' }} size={18} />
            <span>Showing vendors delivering to: <strong>{pincode} ({city})</strong></span>
            {activeStoreObj && (
              <span style={{
                background: '#0f3460',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                Store: {activeStoreObj.name}
                <FiX style={{ cursor: 'pointer' }} onClick={() => handleStoreChange(null)} />
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ⚡ 30-Minute Local Delivery
          </div>
        </div>

        {/* Local Stores Filter Bar */}
        {localStores.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>
              Select Vendor / Store in {pincode}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => handleStoreChange(null)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: !activeStoreId ? '2px solid #FF6B00' : '1px solid var(--border)',
                  background: !activeStoreId ? '#FF6B00' : 'var(--card-bg)',
                  color: !activeStoreId ? '#fff' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                🏪 All Stores ({localStores.length})
              </button>
              {localStores.map(store => {
                const isSelected = activeStoreId === store.id
                return (
                  <button
                    key={store.id}
                    onClick={() => handleStoreChange(store.id, store.name)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: isSelected ? '2px solid #0f3460' : '1px solid var(--border)',
                      background: isSelected ? '#0f3460' : 'var(--card-bg)',
                      color: isSelected ? '#fff' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <MdStorefront size={15} />
                    <span>{store.name}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({store.pincode})</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
              {query ? `Search: "${query}"` : selectedCategory ? selectedCategory.name : activeStoreObj ? activeStoreObj.name : 'All Products'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {data?.data?.totalElements || 0} items available for {pincode}
            </p>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setFilter('sort', e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.84rem'
              }}
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card card-body" style={{ marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiSliders size={16} /> Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  className={`filter-item ${!categoryId ? 'active' : ''}`}
                  onClick={() => setFilter('category', null)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: !categoryId ? 700 : 500,
                    background: !categoryId ? 'rgba(255,107,0,0.1)' : 'transparent',
                    color: !categoryId ? '#FF6B00' : 'var(--text-primary)'
                  }}
                >
                  All Categories
                </div>
                {categories?.data?.map((cat) => (
                  <div
                    key={cat.id}
                    className={`filter-item ${categoryId === cat.id ? 'active' : ''}`}
                    onClick={() => setFilter('category', cat.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: categoryId === cat.id ? 700 : 500,
                      background: categoryId === cat.id ? 'rgba(255,107,0,0.1)' : 'transparent',
                      color: categoryId === cat.id ? '#FF6B00' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <span>{cat.iconEmoji}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {isLoading ? (
              <div className="products-grid">
                {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="card card-body" style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏪</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No products found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 20px' }}>
                  No items match this filter from vendors serving pincode <strong>{pincode}</strong>. Try changing your delivery pincode or category.
                </p>
                <button className="btn btn-outline btn-sm" onClick={() => { handleStoreChange(null); setFilter('category', null); }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        className={`btn btn-sm ${page === idx ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPage(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
