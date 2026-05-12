import { useState, useEffect, useRef } from 'react'
import AdminLayout from './AdminLayout'
import ImageUpload from '../../components/ImageUpload'
import api from '../../services/api'

const EMPTY_FORM = { model_name: '', num_seats: '', description: '', features: '', image_url: '', images: [] }

export default function CarModelsManagePage() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModel, setEditModel] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const galleryInputRef = useRef()

  const fetchModels = async () => {
    try {
      setLoading(true)
      const res = await api.get('/car-models')
      setModels(res.data.data || [])
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }

   
  useEffect(() => {
  const loadModels = async () => {
    await fetchModels()
  }

  loadModels()
}, [])

  const openCreate = () => { setEditModel(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true) }
  const openEdit = (m) => {
    setEditModel(m)
    setForm({
      model_name: m.model_name, num_seats: m.num_seats, description: m.description || '',
      features: Array.isArray(m.features) ? m.features.join(', ') : (m.features || ''),
      image_url: m.image_url || '',
      images: Array.isArray(m.images) ? m.images : []
    })
    setError(''); setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const featuresArr = form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : []
      const payload = {
        model_name: form.model_name, num_seats: parseInt(form.num_seats),
        description: form.description, features: featuresArr,
        image_url: form.image_url, images: form.images || []
      }
      if (editModel) await api.put(`/car-models/${editModel.id}`, payload)
      else await api.post('/car-models', payload)
      setModalOpen(false); fetchModels()
    } catch (e) { setError(e.response?.data?.message || 'An error occurred') }
    finally { setSaving(false) }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploadingGallery(true)
    try {
      const urls = await Promise.all(files.map(async file => {
        const formData = new FormData()
        formData.append('image', file)
        const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        return res.data.url
      }))
      setForm(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }))
    } catch { setError('Failed to upload gallery images') }
    finally { setUploadingGallery(false); e.target.value = '' }
  }

  const removeGalleryImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/car-models/${id}`); setDeleteConfirm(null); fetchModels() }
    catch (e) { setError(e.response?.data?.message || 'Delete failed') }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="flex justify-end">
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add vehicle model
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {models.map(m => (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                {/* Image */}
                <div className="relative h-44 bg-linear-to-br from-gray-700 to-gray-900 overflow-hidden">
                  {m.image_url
                    ? <img src={m.image_url} alt={m.model_name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    : <div className="flex items-center justify-center h-full">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                  }
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{m.num_seats} seats</div>
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
                    <button onClick={() => openEdit(m)} className="flex-1 py-2 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 rounded-lg transition font-medium">Edit</button>
                    <button onClick={() => setDeleteConfirm(m)} className="flex-1 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-medium">Delete</button>
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
              <h2 className="text-lg font-bold text-gray-900">{editModel ? 'Edit Vehicle Model' : 'Add New Vehicle Model'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Model name *</label>
                  <input value={form.model_name} onChange={e => setForm({...form, model_name: e.target.value})} required placeholder="vd: Ford Transit"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of seats *</label>
                  <input type="number" value={form.num_seats} onChange={e => setForm({...form, num_seats: e.target.value})} required min={1} placeholder="16"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Vehicle model description..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amenities (comma-separated)</label>
                <input value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Wi-Fi, Air Conditioning, USB Charging"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <ImageUpload label="Main image" value={form.image_url} onChange={url => setForm({...form, image_url: url})} />
              </div>

              {/* Image Gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Gallery</label>
                {form.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-4 text-center cursor-pointer transition"
                >
                  {uploadingGallery ? (
                    <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Đang upload...
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">+ Add gallery photos <span className="text-xs text-gray-400">(select multiple at once)</span></p>
                  )}
                </div>
                <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition text-sm font-medium">
                  {saving ? 'Saving...' : (editModel ? 'Update' : 'Create model')}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete vehicle model?</h3>
            <p className="text-sm text-gray-500 mb-6">Vehicle model <strong>{deleteConfirm.model_name}</strong> and all related vehicles will be permanently deleted.</p>
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
