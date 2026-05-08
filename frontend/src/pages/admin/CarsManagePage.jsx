import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import api from '../../services/api'

const STATUS_LABELS = { AVAILABLE: 'Available', MAINTENANCE: 'Maintenance', INACTIVE: 'Inactive' }
const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-700',
  MAINTENANCE: 'bg-yellow-100 text-yellow-700',
  INACTIVE: 'bg-red-100 text-red-700'
}
const EMPTY_FORM = { model_id: '', driver_id: '', license_plate: '', color: '', status: 'AVAILABLE' }

export default function CarsManagePage() {
  const [cars, setCars] = useState([])
  const [carModels, setCarModels] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAll()
    api.get('/car-models').then(r => setCarModels(r.data.data || []))
    api.get('/users/drivers').then(r => setDrivers(r.data.data || []))
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await api.get('/cars')
      setCars(res.data.data || [])
    } catch (e) { setError('Failed to load vehicles') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditCar(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true) }
  const openEdit = (c) => {
    setEditCar(c)
    setForm({ model_id: c.model_id, driver_id: c.driver_id || '', license_plate: c.license_plate, color: c.color || '', status: c.status })
    setError(''); setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const payload = { ...form, model_id: parseInt(form.model_id), driver_id: form.driver_id || null }
      if (editCar) await api.put(`/cars/${editCar.id}`, payload)
      else await api.post('/cars', payload)
      setModalOpen(false); fetchAll()
    } catch (e) { setError(e.response?.data?.message || 'An error occurred') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/cars/${id}`); setDeleteConfirm(null); fetchAll() }
    catch (e) { setError(e.response?.data?.message || 'Delete failed') }
  }

  const filtered = cars.filter(c =>
    !search || c.license_plate?.toLowerCase().includes(search.toLowerCase()) || c.model_info?.model_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search license plate, vehicle model..."
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add new vehicle
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400 text-sm">No vehicles found</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#','License plate','Vehicle model','Seats','Color','Driver','Status',''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((car, i) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 text-sm text-gray-400">{i+1}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-900 tracking-wider text-sm">{car.license_plate}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{car.model_info?.model_name || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{car.model_info?.num_seats} seats</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{car.color || '—'}</td>
                    <td className="px-5 py-3.5 text-sm">
                      {car.driver ? (
                        <div>
                          <p className="font-medium text-gray-800">{car.driver.full_name}</p>
                          <p className="text-xs text-gray-400">{car.driver.phone}</p>
                        </div>
                      ) : <span className="text-gray-400 text-xs">Unassigned</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[car.status] || 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[car.status] || car.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(car)} className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 rounded-lg transition font-medium">Edit</button>
                        <button onClick={() => setDeleteConfirm(car)} className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-gray-400">Total: {filtered.length} vehicles</p>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fivehiclesd inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editCar ? 'Edit vehicle' : 'Add new vehicle'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle model *</label>
                <select value={form.model_id} onChange={e => setForm({...form, model_id: e.target.value})} required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">-- Select vehicle model --</option>
                  {carModels.map(m => <option key={m.id} value={m.id}>{m.model_name} ({m.num_seats} seats)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">License plate vehicles *</label>
                <input value={form.license_plate} onChange={e => setForm({...form, license_plate: e.target.value})} required placeholder="vd: 43A-12345"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle color</label>
                <input value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="e.g. White"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Driver</label>
                <select value={form.driver_id} onChange={e => setForm({...form, driver_id: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">-- Not assigned --</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.full_name} {d.phone ? `(${d.phone})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition text-sm font-medium">
                  {saving ? 'Saving...' : (editCar ? 'Update' : 'Add vehicle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fivehiclesd inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this vehicle?</h3>
            <p className="text-sm text-gray-500 mb-6">Vehicle <strong>{deleteConfirm.license_plate}</strong> will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
