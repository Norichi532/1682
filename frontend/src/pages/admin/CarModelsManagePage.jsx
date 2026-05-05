import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import ImageUpload from '../../components/ImageUpload'
import api from '../../services/api'

const EMPTY_FORM = { model_name: '', num_seats: '', description: '', features: '', image_url: '' }

export default function CarModelsManagePage() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModel, setEditModel] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { fetchModels() }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const res = await api.get('/car-models')
      setModels(res.data.data || [])
    } catch { setError('Không thể tải dữ liệu') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditModel(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true) }
  const openEdit = (m) => {
    setEditModel(m)
    setForm({
      model_name: m.model_name, num_seats: m.num_seats, description: m.description || '',
      features: Array.isArray(m.features) ? m.features.join(', ') : (m.features || ''),
      image_url: m.image_url || ''
    })
    setError(''); setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const featuresArr = form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : []
      const payload = { model_name: form.model_name, num_seats: parseInt(form.num_seats), description: form.description, features: featuresArr, image_url: form.image_url }
      if (editModel) await api.put(`/car-models/${editModel.id}`, payload)
      else await api.post('/car-models', payload)
      setModalOpen(false); fetchModels()
    } catch (e) { setError(e.response?.data?.message || 'Có lỗi xảy ra') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/car-models/${id}`); setDeleteConfirm(null); fetchModels() }
    catch (e) { setError(e.response?.data?.message || 'Xóa thất bại') }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="flex justify-end">
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Thêm dòng xe
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {models.map(m => (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                  {m.image_url
                    ? <img src={m.image_url} alt={m.model_name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    : <div className="flex items-center justify-center h-full">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                  }
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{m.num_seats} chỗ</div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{m.model_name}</h3>
                  {m.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{m.description}</p>}
                  {Array.isArray(m.features) && m.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {m.features.map(f => (
                        <span key={f} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="flex-1 py-2 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 rounded-lg transition font-medium">Chỉnh sửa</button>
                    <button onClick={() => setDeleteConfirm(m)} className="flex-1 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-medium">Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editModel ? 'Chỉnh sửa dòng xe' : 'Thêm dòng xe mới'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên dòng xe *</label>
                  <input value={form.model_name} onChange={e => setForm({...form, model_name: e.target.value})} required placeholder="vd: Ford Transit"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số chỗ ngồi *</label>
                  <input type="number" value={form.num_seats} onChange={e => setForm({...form, num_seats: e.target.value})} required min={1} placeholder="16"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Mô tả về dòng xe..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiện ích (phân cách bằng dấu phẩy)</label>
                <input value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Wi-Fi, Điều hòa, USB Charging"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <ImageUpload label="Ảnh dòng xe" value={form.image_url} onChange={url => setForm({...form, image_url: url})} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Hủy</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition text-sm font-medium">
                  {saving ? 'Đang lưu...' : (editModel ? 'Cập nhật' : 'Tạo dòng xe')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa dòng xe?</h3>
            <p className="text-sm text-gray-500 mb-6">Dòng xe <strong>{deleteConfirm.model_name}</strong> và tất cả xe liên quan sẽ bị xóa.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Hủy</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition text-sm font-medium">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
