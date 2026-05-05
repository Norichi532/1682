import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import api from '../../services/api'

// ─── Constants ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:     { label: 'Chờ xác nhận',   cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  CONFIRMED:   { label: 'Đã xác nhận',    cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
  IN_PROGRESS: { label: 'Đang thực hiện', cls: 'bg-purple-100 text-purple-700 border border-purple-200' },
  COMPLETED:   { label: 'Hoàn thành',     cls: 'bg-green-100 text-green-700 border border-green-200' },
  CANCELLED:   { label: 'Đã hủy',         cls: 'bg-red-100 text-red-700 border border-red-200' },
}
const STATUS_TABS = ['all', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const fmt   = (v) => new Intl.NumberFormat('vi-VN').format(v) + ' đ'
const fmtDT = (d) => d ? new Date(d).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'

// ─── Helpers ────────────────────────────────────────────────────────────────
function DetailRow({ label, value, highlight }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 text-sm flex-shrink-0 w-36">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? 'text-ochre font-bold text-base' : 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-gray-50/60 rounded-xl p-5">
      <h3 className="font-semibold text-navy text-sm mb-3 flex items-center gap-2">
        <span>{icon}</span>{title}
      </h3>
      {children}
    </div>
  )
}

// ─── Booking Detail Modal ────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose, onRefresh }) {
  const [availableCars,    setAvailableCars]    = useState([])
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [useExternal,      setUseExternal]      = useState(false)
  const [assignForm,       setAssignForm]       = useState({ car_id: '', driver_id: '' })
  const [extForm,          setExtForm]          = useState({ license_plate: '', car_type: '', driver_name: '', driver_phone: '', vendor: '' })
  const [assigning,        setAssigning]        = useState(false)
  const [actionError,      setActionError]      = useState('')
  const [actionSuccess,    setActionSuccess]    = useState('')

  useEffect(() => {
    if (booking.status === 'PENDING') {
      const modelId = booking.car_model?.id
      const carUrl  = modelId ? `/cars/available?model_id=${modelId}` : '/cars/available'
      api.get(carUrl).then(r => setAvailableCars(r.data.data || [])).catch(console.error)
      api.get('/users/available-drivers').then(r => setAvailableDrivers(r.data.data || [])).catch(console.error)
    }
  }, [booking])

  const ad     = booking.additional_data || {}
  const extCar = ad.external_car
  const catId  = booking.product?.category_id || booking.product?.category?.id

  const directionLabel = () => {
    if (catId === 1) return ad.direction === 'from_airport' ? '✈ Sân bay → Khách sạn' : '🏨 Khách sạn → Sân bay'
    if (catId === 3) return ad.direction === 'to_golf'      ? '🏌 Khách sạn → Sân golf' : '🔄 Sân golf → Khách sạn'
    return null
  }

  const handleAssign = async () => {
    setAssigning(true); setActionError('')
    try {
      if (useExternal) {
        const { license_plate, driver_name, driver_phone } = extForm
        if (!license_plate || !driver_name || !driver_phone) {
          setActionError('Biển số xe, tên tài xế và SĐT là bắt buộc'); setAssigning(false); return
        }
        await api.patch(`/bookings/${booking.id}/assign`, { external_car_info: extForm })
      } else {
        if (!assignForm.car_id || !assignForm.driver_id) {
          setActionError('Vui lòng chọn xe và tài xế'); setAssigning(false); return
        }
        await api.patch(`/bookings/${booking.id}/assign`, {
          car_id:    parseInt(assignForm.car_id),  // Car ID là integer
          driver_id: assignForm.driver_id,          // Driver ID là UUID — không parseInt
        })
      }
      setActionSuccess('Gán xe thành công!')
      setTimeout(() => { onRefresh(); onClose() }, 1200)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gán xe thất bại')
    } finally {
      setAssigning(false)
    }
  }

  const handleStatus = async (newStatus) => {
    setActionError('')
    try {
      await api.patch(`/bookings/${booking.id}/status`, { status: newStatus })
      setActionSuccess(`Đã cập nhật: ${STATUS_CONFIG[newStatus]?.label}`)
      setTimeout(() => { onRefresh(); onClose() }, 1200)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const iCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none text-sm'
  const st   = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Chi tiết đặt xe</h2>
            <p className="text-gray-400 text-sm mt-0.5">#{booking.id?.toString().slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="px-7 py-5 space-y-6">

          {/* Khách hàng */}
          <Section title="Thông tin khách hàng" icon="👤">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg">
                {booking.customer?.full_name?.charAt(0)?.toUpperCase() || 'K'}
              </div>
              <div>
                <p className="font-bold text-navy text-base">{booking.customer?.full_name}</p>
                <p className="text-gray-400 text-sm">{booking.customer?.email}</p>
              </div>
            </div>
            <DetailRow label="Số điện thoại"  value={ad.contact_phone || booking.customer?.phone} />
            <DetailRow label="Họ tên liên hệ" value={ad.contact_name} />
          </Section>

          {/* Dịch vụ & Lịch trình */}
          <Section title="Dịch vụ & Lịch trình" icon="📋">
            <DetailRow label="Dịch vụ"       value={booking.product?.product_name} />
            <DetailRow label="Danh mục"       value={booking.product?.category?.category_name} />
            <DetailRow label="Dòng xe"        value={booking.car_model?.model_name} />
            <DetailRow label="Ngày & Giờ đón" value={fmtDT(booking.start_time)} />
            {directionLabel() && <DetailRow label="Chiều đi" value={directionLabel()} />}
            <DetailRow label="Điểm đón"       value={ad.pickup_location} />
            {catId === 3 && <DetailRow label="Sân golf"      value={ad.golf_course} />}
            {catId === 1 && ad.flight_code && <DetailRow label="Mã chuyến bay" value={ad.flight_code} />}
            <DetailRow label="Số hành khách"  value={ad.passengers ? `${ad.passengers} người` : null} />
            {catId === 3 && <DetailRow label="Số túi golf"   value={ad.golf_bags != null ? `${ad.golf_bags} túi` : null} />}
            {catId === 2 && <DetailRow label="Số ngày"       value={ad.days ? `${ad.days} ngày` : null} />}
            {ad.notes && <DetailRow label="Ghi chú"          value={ad.notes} />}
            <DetailRow label="Tổng tiền"      value={fmt(booking.total_price)} highlight />
          </Section>

          {/* Xe & Tài xế */}
          <Section title="Xe & Tài xế" icon="🚌">
            {extCar ? (
              <>
                <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  🔄 Xe ngoài
                </div>
                <DetailRow label="Biển số"          value={extCar.license_plate} />
                <DetailRow label="Loại xe"          value={extCar.car_type} />
                <DetailRow label="Tài xế"           value={extCar.driver_name} />
                <DetailRow label="SĐT tài xế"       value={extCar.driver_phone} />
                <DetailRow label="Đơn vị cho thuê"  value={extCar.vendor} />
              </>
            ) : booking.assigned_driver ? (
              <>
                <DetailRow label="Tài xế"     value={booking.assigned_driver.full_name} />
                <DetailRow label="SĐT tài xế" value={booking.assigned_driver.phone} />
                <DetailRow label="Biển số xe" value={booking.assigned_car?.license_plate} />
                <DetailRow label="Màu xe"     value={booking.assigned_car?.color} />
              </>
            ) : (
              <p className="text-gray-400 text-sm py-2">Chưa gán xe và tài xế</p>
            )}
          </Section>

          {/* Admin Actions */}
          <div className="border-t-2 border-dashed border-gray-100 pt-5">
            <h3 className="font-semibold text-navy text-sm uppercase tracking-wider mb-4">Hành động</h3>

            {actionError && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {actionSuccess}
              </div>
            )}

            {/* PENDING — gán xe */}
            {booking.status === 'PENDING' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Cần gán xe và tài xế
                  </p>
                  <button
                    onClick={() => { setUseExternal(v => !v); setActionError('') }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      useExternal ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    🔄 {useExternal ? 'Đang dùng xe ngoài' : 'Dùng xe ngoài'}
                  </button>
                </div>

                {/* Xe nội bộ */}
                {!useExternal && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Chọn xe <span className="text-red-500">*</span></label>
                      <select
                        value={assignForm.car_id}
                        onChange={e => {
                          const carId = e.target.value
                          const car   = availableCars.find(c => c.id === parseInt(carId))
                          setAssignForm(f => ({ ...f, car_id: carId, driver_id: car?.driver?.id?.toString() || '' }))
                        }}
                        className={iCls}
                      >
                        <option value="">-- Chọn xe khả dụng --</option>
                        {availableCars.map(car => (
                          <option key={car.id} value={car.id}>
                            {car.license_plate} • {car.color} ({car.model_info?.model_name}) — {car.driver?.full_name || 'Chưa có tài xế'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tài xế <span className="text-red-500">*</span>
                        <span className="ml-1 text-xs text-gray-400 font-normal">(có thể đổi tài xế khác)</span>
                      </label>
                      <select
                        value={assignForm.driver_id}
                        onChange={e => setAssignForm(f => ({ ...f, driver_id: e.target.value }))}
                        className={iCls}
                      >
                        <option value="">-- Chọn tài xế đang rảnh --</option>
                        {availableDrivers.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.full_name} — {d.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Xe ngoài */}
                {useExternal && (
                  <div className="space-y-3 bg-orange-50/60 rounded-xl p-4 border border-orange-100">
                    <p className="text-xs text-orange-600 font-semibold">Thông tin xe thuê ngoài</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Biển số xe <span className="text-red-500">*</span></label>
                        <input value={extForm.license_plate} onChange={e => setExtForm(f => ({ ...f, license_plate: e.target.value }))}
                          placeholder="VD: 43C-005.55" className={iCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Loại xe</label>
                        <input value={extForm.car_type} onChange={e => setExtForm(f => ({ ...f, car_type: e.target.value }))}
                          placeholder="VD: Toyota Hiace 16 chỗ" className={iCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tên tài xế <span className="text-red-500">*</span></label>
                        <input value={extForm.driver_name} onChange={e => setExtForm(f => ({ ...f, driver_name: e.target.value }))}
                          placeholder="Họ và tên" className={iCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">SĐT tài xế <span className="text-red-500">*</span></label>
                        <input value={extForm.driver_phone} onChange={e => setExtForm(f => ({ ...f, driver_phone: e.target.value }))}
                          placeholder="0905 xxx xxx" className={iCls} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Đơn vị cho thuê</label>
                        <input value={extForm.vendor} onChange={e => setExtForm(f => ({ ...f, vendor: e.target.value }))}
                          placeholder="Tên công ty / cá nhân cho thuê xe" className={iCls} />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAssign}
                  disabled={assigning}
                  className="w-full py-2.5 bg-navy hover:bg-navy-light disabled:bg-navy/40 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
                >
                  {assigning ? 'Đang xử lý...' : useExternal ? '🔄 Gán xe ngoài & Xác nhận' : '✓ Gán xe & Xác nhận đặt xe'}
                </button>
              </div>
            )}

            {/* CONFIRMED */}
            {booking.status === 'CONFIRMED' && (
              <button onClick={() => handleStatus('CANCELLED')}
                className="w-full py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition text-sm">
                ✕ Hủy đặt xe
              </button>
            )}

            {/* IN_PROGRESS */}
            {booking.status === 'IN_PROGRESS' && (
              <div className="flex gap-3">
                <button onClick={() => handleStatus('COMPLETED')}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition text-sm">
                  ✓ Hoàn thành
                </button>
                <button onClick={() => handleStatus('CANCELLED')}
                  className="flex-1 py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition text-sm">
                  ✕ Hủy
                </button>
              </div>
            )}

            {/* COMPLETED / CANCELLED */}
            {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
              <p className="text-gray-400 text-sm text-center py-2">Đơn này đã kết thúc, không thể thay đổi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BookingsManagePage() {
  const [bookings,       setBookings]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [detailBooking,  setDetailBooking]  = useState(null)
  const [allCounts,      setAllCounts]      = useState({})

  useEffect(() => { fetchBookings() }, [selectedStatus])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res  = await api.get('/bookings')
      const data = res.data.data || []
      // Counts always from full list
      const counts = data.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc }, {})
      setAllCounts(counts)
      setBookings(selectedStatus === 'all' ? data : data.filter(b => b.status === selectedStatus))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt xe</h1>
            <p className="text-gray-500 text-sm mt-0.5">{bookings.length} đơn</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map(s => {
            const cfg    = STATUS_CONFIG[s]
            const active = selectedStatus === s
            const count  = allCounts[s]
            return (
              <button key={s} onClick={() => setSelectedStatus(s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  active ? 'bg-navy text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy/30'
                }`}>
                {s === 'all' ? 'Tất cả' : cfg?.label}
                {s !== 'all' && count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Không có đơn đặt xe nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['#', 'Khách hàng', 'Dịch vụ', 'Dòng xe', 'Ngày đi', 'Tổng tiền', 'Tài xế / Xe', 'Trạng thái', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b, i) => {
                    const st     = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING
                    const extCar = b.additional_data?.external_car
                    return (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {b.customer?.full_name?.charAt(0)?.toUpperCase() || 'K'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{b.customer?.full_name}</p>
                              <p className="text-gray-400 text-xs">{b.customer?.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700 max-w-[160px] leading-snug">{b.product?.product_name}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{b.car_model?.model_name}</td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700">{new Date(b.start_time).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })}</p>
                          <p className="text-xs text-gray-400">{new Date(b.start_time).toLocaleDateString('vi-VN')}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-ochre">{fmt(b.total_price)}</span>
                        </td>
                        <td className="px-5 py-4">
                          {extCar ? (
                            <div>
                              <p className="text-xs font-semibold text-orange-600">🔄 Xe ngoài</p>
                              <p className="text-xs text-gray-400">{extCar.license_plate} — {extCar.driver_name}</p>
                            </div>
                          ) : b.assigned_driver ? (
                            <div>
                              <p className="text-sm font-medium text-gray-700">{b.assigned_driver.full_name}</p>
                              <p className="text-xs text-gray-400">{b.assigned_car?.license_plate}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300 italic">Chưa gán</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => setDetailBooking(b)}
                            className="px-4 py-1.5 bg-navy/5 hover:bg-navy text-navy hover:text-white border border-navy/20 hover:border-navy text-xs font-semibold rounded-lg transition-all duration-200">
                            Chi tiết
                          </button>
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

      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onRefresh={fetchBookings}
        />
      )}
    </AdminLayout>
  )
}
