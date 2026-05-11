import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import api from '../../services/api'

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '—'

// ── Add / edit driver modal ──────────────────────────────────────────────────
function DriverModal({ driver, onClose, onSave }) {
  const isEdit = !!driver
  const [form, setForm] = useState({
    full_name: driver?.full_name || '',
    email:     driver?.email     || '',
    phone:     driver?.phone     || '',
    password:  '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.full_name || !form.email) { setError('Vui lòng điền đầy đủ họ tên và email'); return }
    if (!isEdit && !form.password)      { setError('Password is required when creating a new account'); return }
    setLoading(true); setError('')
    try {
      const payload = { full_name: form.full_name, email: form.email, phone: form.phone, role_id: 3 }
      if (form.password) payload.password = form.password
      if (isEdit) {
        await api.put(`/users/${driver.id}`, payload)
      } else {
        await api.post('/users', payload)
      }
      onSave()
    } catch (e) {
      setError(e.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const iCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none text-sm'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-display text-lg font-bold text-navy">
            {isEdit ? 'Update driver' : 'Add new driver'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name <span className="text-red-500">*</span></label>
            <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Nguyễn Văn A" className={iCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
            <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="taixe@gmail.com" type="email" disabled={isEdit} className={`${iCls} ${isEdit ? 'bg-gray-50 text-gray-400' : ''}`} />
            {isEdit && <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0905 xxx xxx" className={iCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isEdit ? 'New password (leave blank to keep current)' : 'Password *'}
            </label>
            <input value={form.password} onChange={e => set('password', e.target.value)} placeholder={isEdit ? 'Leave blank to keep current' : 'Minimum 6 characters'} type="password" className={iCls} />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition text-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 bg-navy hover:bg-navy-light disabled:bg-navy/40 text-white font-semibold rounded-xl transition text-sm">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add driver'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersManagePage() {
  const [drivers,  setDrivers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)   // null | 'add' | driver object
  const [toast,    setToast]    = useState('')

  const fetchDrivers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users?role_id=3')
      setDrivers(res.data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  const loadDrivers = async () => {
    await fetchDrivers()
  }

  loadDrivers()
}, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = () => {
    setModal(null)
    fetchDrivers()
    showToast('Saved successfully!')
  }

  const handleToggle = async (driver) => {
    const action = driver.is_active ? 'deactivate' : 'activate'
    if (!confirm(`Bạn có chắc muốn ${action} tài xế "${driver.full_name}"?`)) return
    try {
      await api.patch(`/users/${driver.id}/toggle-active`)
      fetchDrivers()
      showToast(`Driver ${action}d successfully`)
    } catch (e) {
      alert(e.response?.data?.message || 'An error occurred')
    }
  }

  const handleDelete = async (driver) => {
    if (!confirm(`Xoá tài xế "${driver.full_name}"?\nTài khoản sẽ bị vô hiệu hóa, dữ liệu lịch sử vẫn được giữ lại.`)) return
    try {
      await api.delete(`/users/${driver.id}`)
      fetchDrivers()
      showToast('Driver deleted successfully')
    } catch (e) {
      alert(e.response?.data?.message || 'An error occurred')
    }
  }

  const activeCount   = drivers.filter(d => d.is_active !== false).length
  const inactiveCount = drivers.filter(d => d.is_active === false).length

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Drivers</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {activeCount} active
              {inactiveCount > 0 && <span className="ml-2 text-red-400">• {inactiveCount} inactive</span>}
            </p>
          </div>
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add driver
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            {toast}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
              No drivers found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['#', 'Driver', 'Email', 'Phone', 'Created', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {drivers.map((d, i) => {
                    const active = d.is_active !== false
                    return (
                      <tr key={d.id} className={`hover:bg-gray-50/50 transition-colors ${!active ? 'opacity-60' : ''}`}>
                        <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${active ? 'bg-navy' : 'bg-gray-400'}`}>
                              {d.full_name?.charAt(0)?.toUpperCase() || 'T'}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{d.full_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{d.email}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{d.phone || '—'}</td>
                        <td className="px-5 py-4 text-sm text-gray-400">{fmt(d.created_at)}</td>
                        <td className="px-5 py-4">
                          {active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Deactivate
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {/* Edit */}
                            <button onClick={() => setModal(d)}
                              className="px-3 py-1.5 text-xs font-semibold bg-navy/5 hover:bg-navy text-navy hover:text-white border border-navy/20 hover:border-navy rounded-lg transition-all duration-200">
                              Edit
                            </button>
                            {/* Toggle active */}
                            <button onClick={() => handleToggle(d)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                                active
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                              }`}>
                              {active ? 'Deactivate' : 'Active'}
                            </button>
                            {/* Delete */}
                            <button onClick={() => handleDelete(d)}
                              className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all duration-200">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <DriverModal
          driver={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  )
}
