import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatDate } from '../../utils/helpers'
import { FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [togglingId, setTogglingId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, query],
    queryFn: () => adminAPI.getUsers({ page, size: 15, query }),
  })

  const users = data?.data?.content || []
  const totalPages = data?.data?.totalPages || 0

  const handleToggle = async (userId, name, isActive) => {
    if (!confirm(`${isActive ? 'Deactivate' : 'Activate'} user "${name}"?`)) return
    setTogglingId(userId)
    try {
      await adminAPI.toggleUserStatus(userId)
      queryClient.invalidateQueries(['admin-users'])
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}!`)
    } catch (err) {
      toast.error(err?.message || 'Action failed')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Customers</h1>
          <p style={{ color: '#888', fontSize: '0.88rem' }}>{data?.data?.totalElements || 0} registered customers</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by name, email or phone..."
            value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} />
        </div>
      </div>

      <div className="admin-table-card">
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>👥</div>
            <div style={{ fontWeight: 600 }}>No customers found</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Customer</th><th>Phone</th><th>Email</th><th>Addresses</th><th>Joined</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id}>
                  <td style={{ color: '#888', fontSize: '0.82rem' }}>{page * 15 + idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td style={{ fontSize: '0.82rem', color: '#555' }}>{user.email || '—'}</td>
                  <td style={{ textAlign: 'center' }}>{user.addresses?.length || 0}</td>
                  <td style={{ color: '#888', fontSize: '0.8rem' }}>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${user.isActive ? '' : 'btn-secondary'}`}
                      style={user.isActive ? { color: 'var(--danger)', background: '#FFEBEE' } : {}}
                      disabled={togglingId === user.id}
                      onClick={() => handleToggle(user.id, user.name, user.isActive)}
                    >
                      {togglingId === user.id ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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
    </div>
  )
}
