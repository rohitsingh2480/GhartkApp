import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MdDeliveryDining } from 'react-icons/md'
import { FiArrowRight } from 'react-icons/fi'
import { productAPI, categoryAPI } from '../../api/endpoints'
import ProductCard from '../../components/UI/ProductCard'
import { ProductCardSkeleton } from '../../components/UI/Skeletons'

export default function HomePage() {
  const navigate = useNavigate()

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: () => categoryAPI.getAll() })
  const { data: featData, isLoading: featLoading } = useQuery({ queryKey: ['featured'], queryFn: () => productAPI.getFeatured() })

  const categories = catData?.data || []
  const featured = featData?.data || []

  return (
    <div className="page-wrapper" style={{ paddingTop: 70 }}>
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div>
            <div className="hero-tag">
              <MdDeliveryDining size={14} /> India's #1 Hyperlocal Delivery
            </div>
            <h1>Groceries & Food<br />Delivered in<br /><span style={{ color: '#FFE580' }}>30 Minutes</span> 🚀</h1>
            <p className="hero-subtitle">
              Fresh groceries, hot food, medicines – everything from your neighbourhood, delivered instantly!
            </p>
            <div className="hero-actions">
              <button className="btn-hero btn-hero-primary" onClick={() => navigate('/products')}>
                Order Now 🛒
              </button>
              <button className="btn-hero btn-hero-outline" onClick={() => navigate('/products?sort=rating')}>
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
            { num: '500+', label: 'Products' },
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

      {/* Categories */}
      <div className="section" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <span className="section-link" onClick={() => navigate('/products')}>View All <FiArrowRight /></span>
          </div>
          <div className="categories-scroll">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card"
                onClick={() => navigate(`/products?category=${cat.id}`)}>
                <div className="category-icon">{cat.iconEmoji}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Offer Banner */}
      <div className="section">
        <div className="container">
          <div className="offer-banner">
            <div className="offer-text">
              <div className="offer-title">🎉 First Order Special!</div>
              <div className="offer-subtitle">Get ₹50 off on your first order above ₹299</div>
            </div>
            <div className="offer-code">
              <div className="offer-code-label">USE CODE</div>
              <div className="offer-code-value">GHARTK50</div>
            </div>
            <div className="offer-badge">50% OFF<br/><span style={{ fontSize: '0.75rem', fontWeight: 400 }}>up to ₹100</span></div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Products</h2>
            <span className="section-link" onClick={() => navigate('/products?sort=rating')}>See All <FiArrowRight /></span>
          </div>
          <div className="products-grid">
            {featLoading
              ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p) => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </div>

      {/* Why GHARTK */}
      <div className="section" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>Why Choose GHARTK? 💪</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24 }}>
            {[
              { icon: '🏪', title: 'Local Stores', desc: 'Support local businesses and get fresh products from nearby shops' },
              { icon: '⚡', title: 'Ultra Fast', desc: '30-minute delivery guaranteed! Track your order live' },
              { icon: '💰', title: 'Best Prices', desc: 'Lowest prices with zero hidden charges. Free delivery above ₹499' },
              { icon: '🌱', title: 'Fresh Always', desc: 'Quality checked products sourced fresh daily from local vendors' },
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
          <p style={{ fontSize: '0.85rem', marginBottom: 20 }}>India's Hyperlocal Delivery Platform 🇮🇳</p>
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
