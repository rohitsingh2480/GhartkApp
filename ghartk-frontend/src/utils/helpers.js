export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0'
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export const getOrderStatusInfo = (status) => {
  const map = {
    PLACED:           { label: 'Order Placed', color: '#007AFF', emoji: '📋', step: 0 },
    CONFIRMED:        { label: 'Confirmed',     color: '#FF9500', emoji: '✅', step: 1 },
    PREPARING:        { label: 'Preparing',     color: '#FF6B00', emoji: '👨‍🍳', step: 2 },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: '#00C853', emoji: '🛵', step: 3 },
    DELIVERED:        { label: 'Delivered',     color: '#00C853', emoji: '🎉', step: 4 },
    CANCELLED:        { label: 'Cancelled',     color: '#FF3B30', emoji: '❌', step: -1 },
  }
  return map[status] || { label: status, color: '#999', emoji: '📦', step: 0 }
}

export const getStatusBadgeClass = (status) => {
  const map = {
    PLACED: 'badge-info',
    CONFIRMED: 'badge-warning',
    PREPARING: 'badge-warning',
    OUT_FOR_DELIVERY: 'badge-success',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger',
  }
  return map[status] || 'badge-secondary'
}

export const timeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}
