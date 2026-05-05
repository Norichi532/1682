import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import ImageUpload from '../../components/ImageUpload'
import api from '../../services/api'

const EMPTY_FORM = { category_id: '', product_name: '', description: '', address: '', image_url: '', prices: [] }
const CAT_ICONS = { 1: '✈️', 2: '🗺️', 3: '⛳' }

export default function ProductsManagePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [carModels, setCarModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchAll()
    api.get('/categories').then(r => setCategories(r.data.data || []))
    api.get('/car-models').then(r => {
      const models = r.data.data || []
      setCarModels(models)
    })
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products')
      setProducts(res.data.data || [])
    } catch { setError('Không thể tải dữ liệu') }
    finally { setLoading(false) }
  }

  const initPrices = (models, existingPrices = []) =>
    models.map(m => ({ model_id: m.id, model_name: m.model_name, num_seats: m.num_seats, price: existingPrices.find(p => p.model_id === m.id)?.price || '' }))

  const openCreate = () => {
    setEditProduct(null)
    setForm({ ...EMPTY_FORM, prices: initPrices(carModels) })
    setError(''); setModalOpen(true)
  }
  const openEdit = (p) => {
    setEditProduct(p)
    setForm({
      category_id: p.category_id, product_name: p.product_name, description: p.description || '',
      address: p.address || '', image_url: p.image_url || '',
      prices: initPrices(carModels, p.prices || [])
    })
    setError(''); setModalOpen(true)
  }

  const handlePriceChange = (modelId, value) => {
    setForm(f => ({ ...f, prices: f.prices.map(p => p.model_id === modelId ? { ...p, price: value } : p) }))
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const prices = form.prices.filter(p => p.price !== '' && p.price !== null).map(p => ({ model_id: p.model_id, price: parseFloat(p.price) }))
      const payload = { category_id: parseInt(form.category_id), product_name: form.product_name, description: form.description, address: form.address, image_url: form.image_url, prices }
      if (editProduct) await api.put(`/products/${editProduct.id}`, payload)
      else await api.post('/products', payload)
      setModalOpen(false); fetchAll()
    } catch (e) { setError(e.response?.data?.message || 'Có lỗi xảy ra') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/products/${id}`); setDeleteConfirm(null); fetchAll() }
    catch (e) { setError(e.response?.data?.message || 'Xóa thất bại') }
  }

  const formatPrice = v => v ? new Intl.NumberFormat('vi-VN').format(v) + ' đ' : '—'

  const filtered = products.filter(p => {
    const matchCat = filterCat === 'all' || p.category_id === parseInt(filterCat)
    const matchSearch = !search || p.product_name?.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <AdminLayout>
      <div className="space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterCat('all')} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filterCat === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setFilterCat(String(c.id))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filterCat === String(c.id) ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}>
                {CAT_ICONS[c.id]} {c.category_name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm dịch vụ, địa điểm..."
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" />
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Thêm dịch vụ
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400 text-sm">Chưa có dịch vụ nào</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dịch vụ</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Danh mục</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Địa điểm</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bảng giá</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.product_name} className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                          : <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{CAT_ICONS[p.category_id]}</div>
                        }
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{p.product_name}</p>
                          {p.description && <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{p.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {p.category?.category_name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 max-w-xs">
                      <span className="line-clamp-2">{p.address || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {(p.prices || []).sort((a,b) => a.car_model?.num_seats - b.car_model?.num_seats).map(pr => (
                          <div key={pr.id} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 w-16">{pr.car_model?.num_seats} chỗ:</span>
                            <span className="font-semibold text-blue-600">{formatPrice(pr.price)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 rounded-lg transition font-medium">Sửa</button>
                        <button onClick={() => setDeleteConfirm(p)} className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-medium">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-gray-400">Tổng: {filtered.length} dịch vụ</p>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editProduct ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên dịch vụ *</label>
                  <input value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} required
                    placeholder="vd: Đưa đón sân bay Đà Nẵng – Nội thành"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục *</label>
                  <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{CAT_ICONS[c.id]} {c.category_name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa điểm / Lộ trình</label>
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="vd: Sân bay Đà Nẵng → Trung tâm thành phố"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>

              {/* Price list */}
              {form.prices.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bảng giá (VNĐ)</label>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
                    {form.prices.map(p => (
                      <div key={p.model_id} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-32 flex-shrink-0">{p.model_name} ({p.num_seats} chỗ)</span>
                        <input type="number" value={p.price} onChange={e => handlePriceChange(p.model_id, e.target.value)}
                          min={0} placeholder="0"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                        <span className="text-xs text-gray-400 flex-shrink-0">đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ImageUpload label="Ảnh dịch vụ" value={form.image_url} onChange={url => setForm({...form, image_url: url})} />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Hủy</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition text-sm font-medium">
                  {saving ? 'Đang lưu...' : (editProduct ? 'Cập nhật' : 'Tạo dịch vụ')}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa dịch vụ?</h3>
            <p className="text-sm text-gray-500 mb-6">Dịch vụ <strong>{deleteConfirm.product_name}</strong> và bảng giá liên quan sẽ bị xóa vĩnh viễn.</p>
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
