export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton skeleton-image" />
      <div style={{ padding: 14 }}>
        <div className="skeleton skeleton-text" style={{ width: '40%' }} />
        <div className="skeleton skeleton-title" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: 12 }} />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton skeleton-title" style={{ width: '30%' }} />
        <div className="skeleton skeleton-text" style={{ width: '20%' }} />
      </div>
      <div className="skeleton skeleton-text" style={{ width: '70%' }} />
      <div className="skeleton skeleton-text" style={{ width: '50%' }} />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div>
      <div className="kpi-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="kpi-card">
            <div className="skeleton skeleton-text" style={{ width: '50%' }} />
            <div className="skeleton" style={{ height: 40, width: '70%', marginBottom: 8 }} />
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
