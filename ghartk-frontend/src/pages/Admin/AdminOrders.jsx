import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatCurrency, formatDate, getStatusBadgeClass, getOrderStatusInfo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']

export default function AdminOrders() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => adminAPI.getOrders({ page, size: 15, status: statusFilter }),
  })

  const orders = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus)
      queryClient.invalidateQueries(['admin-orders'])
      queryClient.invalidateQueries(['admin-dashboard'])
      toast.success('Order status updated!')
    } catch (err) {
      toast.error(err?.message || 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Orders Management</h1>
          <p style={{ color: '#888', fontSize: '0.88rem' }}>{data?.data?.totalElements || 0} total orders</p>
        </div>
        <select className="form-select" style={{ width: 200 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0) }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{getOrderStatusInfo(s).emoji} {getOrderStatusInfo(s).label}</option>)}
        </select>
      </div>

      <div className="admin-table-card">
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
            <div style={{ fontWeight: 600 }}>No orders found</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th>
                <th>Payment</th><th>Time</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const si = getOrderStatusInfo(order.status)
                return (
                  <tr key={order.id}>
                    <td><span style={{ fontWeight: 700, color: '#FF6B00' }}>#{order.orderNumber?.slice(-8)}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#888' }}>{order.customerPhone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {order.items?.slice(0,2).map(i => i.productName).join(', ')}
                        {order.items?.length > 2 && ` +${order.items.length-2}`}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(order.total)}</td>
                    <td><span style={{ fontSize: '0.8rem', color: '#555' }}>{order.paymentMethod}</span></td>
                    <td style={{ color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(order.createdAt)}</td>
                    <td><span className={`badge ${getStatusBadgeClass(order.status)}`}>{si.emoji} {si.label}</span></td>
                    <td>
                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <select
                          style={{ fontSize: '0.8rem', padding: '5px 8px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}
                          disabled={updatingId === order.id}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{getOrderStatusInfo(s).label}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p-1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
            <button key={i} className={`page-btn${page===i?' active':''}`} onClick={() => setPage(i)}>{i+1}</button>
          ))}
          <button className="page-btn" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)}>›</button>
        </div>
      )}
    </div>
  )
}
