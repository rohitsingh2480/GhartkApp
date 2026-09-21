import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MdDeliveryDining, MdStorefront } from 'react-icons/md'
import { FiArrowRight, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import { productAPI, categoryAPI, storeAPI } from '../../api/endpoints'
import useLocationStore from '../../store/locationStore'
import ProductCard from '../../components/UI/ProductCard'
import { ProductCardSkeleton } from '../../components/UI/Skeletons'

export default function HomePage() {
  const navigate = useNavigate()
  const { pincode, city, selectedStoreId, setSelectedStore } = useLocationStore()

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll()
  })

  const { data: storesData } = useQuery({
    queryKey: ['stores', pincode],
    queryFn: () => storeAPI.getAll({ pincode })
  })

  const { data: featData, isLoading: featLoading } = useQuery({
    queryKey: ['featured', pincode, selectedStoreId],
    queryFn: () => productAPI.getFeatured({ pincode, storeId: selectedStoreId })
  })

  const categories = catData?.data || []
  const localStores = storesData?.data || []
  const featured = featData?.data || []

  return (
    <div className="page-wrapper" style={{ paddingTop: 70 }}>
      {/* Hyperlocal Area Alert Bar */}
      <div style={{
        background: 'rgba(255, 107, 0, 0.08)',
        borderBottom: '1px solid rgba(255, 107, 0, 0.2)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        fontSize: '0.88rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiMapPin style={{ color: '#FF6B00' }} size={16} />
          Delivering to Pincode: <strong style={{ color: '#FF6B00' }}>{pincode}</strong> ({city})
        </span>
        <span style={{ color: 'var(--text-muted)' }}>•</span>
        <span>
          {localStores.length > 0
            ? `🏪 ${localStores.length} local store(s) ready to deliver in 30 mins`
            : `⚠️ No stores currently registered in pincode ${pincode}`}
        </span>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div>
            <div className="hero-tag">
              <MdDeliveryDining size={14} /> India's #1 Hyperlocal Delivery
            </div>
            <h1>Groceries & Food<br />Delivered in<br /><span style={{ color: '#FFE580' }}>30 Minutes</span> 🚀</h1>
            <p className="hero-subtitle">
              Fresh groceries, hot food, medicines – sourced directly from your neighbourhood vendors in <strong>{city} ({pincode})</strong>!
            </p>
            <div className="hero-actions">
              <button className="btn-hero btn-hero-primary" onClick={() => navigate(`/products?pincode=${pincode}`)}>
                Order Now 🛒
              </button>
              <button className="btn-hero btn-hero-outline" onClick={() => navigate(`/products?pincode=${pincode}&sort=rating`)}>
                Top Picks ⭐
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-illustration">🛵</div>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { num: '10K+', label: 'Happy Customers' },
            { num: '500+', label: 'Local Products' },
            { num: '30 min', label: 'Avg Delivery' },
            { num: '4.8 ★', label: 'App Rating' },
          ].map(({ num, label }) => (
            <div key={label} className="hero-stat">
              <div>
                <div className="hero-stat-num">{num}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Stores in Pincode Section */}
      <div className="section" style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdStorefront size={24} style={{ color: '#FF6B00' }} />
                Local Stores in Your Area ({pincode})
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Choose a store to browse items exclusively from that neighbourhood merchant
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            {/* All Stores chip */}
            <button
              onClick={() => setSelectedStore(null)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: selectedStoreId === null ? '2px solid #FF6B00' : '1px solid var(--border)',
                background: selectedStoreId === null ? '#FF6B00' : 'var(--bg-secondary)',
                color: selectedStoreId === null ? '#fff' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              🏪 All Local Stores ({localStores.length})
            </button>

            {/* Individual stores */}
            {localStores.map((store) => {
              const isSelected = selectedStoreId === store.id
              return (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id, store.name)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 20,
                    border: isSelected ? '2px solid #0f3460' : '1px solid var(--border)',
                    background: isSelected ? '#0f3460' : 'var(--bg-secondary)',
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: isSelected ? '0 2px 8px rgba(15,52,96,0.25)' : 'none'
                  }}
                >
                  <MdStorefront size={16} />
                  <span>{store.name}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)'
                  }}>
                    {store.pincode}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="section" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <span className="section-link" onClick={() => navigate(`/products?pincode=${pincode}`)}>View All <FiArrowRight /></span>
          </div>
          <div className="categories-scroll">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card"
                onClick={() => navigate(`/products?category=${cat.id}&pincode=${pincode}`)}>
                <div className="category-icon">{cat.iconEmoji}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">⭐ Featured in Pincode {pincode}</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Products available right now for instant 30-minute delivery
              </p>
            </div>
            <span className="section-link" onClick={() => navigate(`/products?pincode=${pincode}&sort=rating`)}>
              See All <FiArrowRight />
            </span>
          </div>

          {featured.length === 0 && !featLoading ? (
            <div className="card card-body" style={{ textAlign: 'center', padding: 40, marginTop: 20 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏬</div>
              <h3 style={{ fontWeight: 700, marginBottom: 6 }}>No featured products found in this area</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                We could not find items for pincode <strong>{pincode}</strong>. Try switching to <strong>110059</strong>, <strong>110049</strong>, <strong>248001</strong>, or <strong>248002</strong> from the top bar.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {featLoading
                ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : featured.map((p) => <ProductCard key={p.id} product={p} />)
              }
            </div>
          )}
        </div>
      </div>

      {/* Why GHARTK */}
      <div className="section" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>Why Choose GHARTK? 💪</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24 }}>
            {[
              { icon: '🏪', title: 'Local Stores Only', desc: 'Orders are fulfilled exclusively by neighbourhood merchants in your pincode' },
              { icon: '⚡', title: 'Ultra Fast', desc: '30-minute delivery guaranteed! Track your driver live on the map' },
              { icon: '💰', title: 'Best Prices', desc: 'Direct merchant rates with zero markups. Free delivery above ₹499' },
              { icon: '🌱', title: 'Fresh Always', desc: 'Quality checked produce sourced fresh daily from verified local vendors' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card card-body" style={{ textAlign: 'center', padding: 28 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111', color: 'rgba(255,255,255,0.6)', padding: '40px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
            <MdDeliveryDining style={{ verticalAlign: 'middle', marginRight: 6 }} />
            GHARTK
          </div>
          <p style={{ fontSize: '0.85rem', marginBottom: 20 }}>India's Hyperlocal Multi-Store Delivery Platform 🇮🇳</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: '0.82rem', flexWrap: 'wrap' }}>
            {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Partner with Us'].map(link => (
              <span key={link} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
                onMouseOver={e => e.target.style.color = 'var(--primary)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                {link}
              </span>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: '0.8rem' }}>© 2024 GHARTK. Made with ❤️ for Bharat</p>
        </div>
      </footer>
    </div>
  )
}
