import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'

const STATUS_STYLES = {
  PENDING:     { label: 'Chờ thanh toán', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  CONFIRMED:   { label: 'Đã xác nhận',    cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  IN_PROGRESS: { label: 'Đang đi',        cls: 'bg-purple-50 text-purple-700 border border-purple-200' },
  COMPLETED:   { label: 'Hoàn thành',     cls: 'bg-green-50 text-green-700 border border-green-200' },
  CANCELLED:   { label: 'Đã hủy',         cls: 'bg-red-50 text-red-700 border border-red-200' },
}

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)}
        className={`text-3xl transition-transform hover:scale-110 ${s <= value ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}>
        ★
      </button>
    ))}
  </div>
)

// Tính thông tin hoàn tiền hiển thị phía client (chỉ để preview, backend xử lý thực tế)
const getRefundPreview = (startTime) => {
  const diff = (new Date(startTime) - new Date()) / (1000 * 60 * 60 * 24)
  if (diff >= 3)  return { percent: 100, label: 'Hoàn 100% cọc' }
  if (diff >= 1)  return { percent: 50,  label: 'Hoàn 50% cọc' }
  return { percent: 0, label: 'Không hoàn tiền' }
}

export default function MyOrdersPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal]   = useState(null)
  const [cancelModal, setCancelModal]   = useState(null)
  const [rating, setRating]             = useState(5)
  const [comment, setComment]           = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [cancelling, setCancelling]     = useState(false)
  const [reviewedIds, setReviewedIds]   = useState(new Set())
  const [payments, setPayments]         = useState({})   // bookingId → payment

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my')
      const data = res.data.data || []
      setBookings(data)
      const reviewed = new Set(data.filter(b => b.review).map(b => b.id))
      setReviewedIds(reviewed)

      // Load payment info for PENDING / CONFIRMED bookings
      const cancelable = data.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED')
      const paymentMap = {}
      await Promise.allSettled(cancelable.map(async (b) => {
        try {
          const p = await api.get(`/payments/booking/${b.id}`)
          paymentMap[b.id] = p.data.data
        } catch { /* no payment yet */ }
      }))
      setPayments(paymentMap)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const openReview = (booking) => {
    setReviewModal({ booking_id: booking.id, product_name: booking.product?.product_name })
    setRating(5)
    setComment('')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/reviews', { booking_id: reviewModal.booking_id, rating, comment })
      setReviewedIds(prev => new Set([...prev, reviewModal.booking_id]))
      setReviewModal(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Gửi đánh giá thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const openCancel = (booking) => {
    const payment = payments[booking.id]
    const refund  = payment ? getRefundPreview(booking.start_time) : null
    setCancelModal({ booking, payment, refund })
  }

  const confirmCancel = async () => {
    if (!cancelModal) return
    setCancelling(true)
    try {
      await api.post(`/payments/cancel/${cancelModal.booking.id}`)
      setCancelModal(null)
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Hủy đơn thất bại. Vui lòng thử lại.')
    } finally {
      setCancelling(false)
    }
  }

  const retryPayment = async (booking) => {
    try {
      const res = await api.post('/payments/create-payment-url', { booking_id: booking.id })
      if (res.data.paymentUrl) window.location.href = res.data.paymentUrl
    } catch (err) {
      alert(err.response?.data?.message || 'Không tạo được link thanh toán')
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : ''
  const formatCurrency = (v) => new Intl.NumberFormat('vi-VN').format(v) + ' đ'

  return (
    <PublicLayout>
      {/* Page header */}
      <div className="bg-navy py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-ochre text-sm font-semibold uppercase tracking-widest mb-2">Tài khoản</p>
          <h1 className="font-display text-3xl font-bold text-white">Đơn đặt xe của tôi</h1>
        </div>
      </div>

      <div className="bg-mist/30 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-navy/20 border-t-ochre rounded-full animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-mist flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-5 font-body">Bạn chưa có đơn đặt xe nào.</p>
              <button onClick={() => navigate('/services')}
                className="px-8 py-3 bg-navy hover:bg-navy-light text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg">
                Khám phá dịch vụ
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => {
                const st       = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING
                const canReview  = booking.status === 'COMPLETED' && !reviewedIds.has(booking.id) && !booking.review
                const canCancel  = booking.status === 'PENDING' || booking.status === 'CONFIRMED'
                const payment    = payments[booking.id]
                // PENDING + no payment hoặc payment chưa SUCCESS → cho retry
                const needsPay   = booking.status === 'PENDING' && (!payment || payment.status === 'PENDING')

                return (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div>
                        <h3 className="font-display font-bold text-navy text-lg">{booking.product?.product_name}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">{booking.car_model?.model_name}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${st.cls}`}>{st.label}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5 p-4 bg-mist/40 rounded-xl">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Ngày đón</p>
                        <p className="font-semibold text-navy">{formatDate(booking.start_time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Tổng tiền</p>
                        <p className="font-bold text-ochre text-base">{formatCurrency(booking.total_price)}</p>
                      </div>
                      {payment && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Đã cọc</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(payment.amount)}</p>
                        </div>
                      )}
                      {booking.assigned_car && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Biển số</p>
                          <p className="font-semibold text-navy">{booking.assigned_car.license_plate}</p>
                        </div>
                      )}
                      {booking.assigned_driver && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Tài xế</p>
                          <p className="font-semibold text-navy">{booking.assigned_driver.full_name}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    {(canCancel || canReview || needsPay || booking.review) && (
                      <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center gap-3">
                        {/* Retry payment if PENDING and no payment */}
                        {needsPay && (
                          <button onClick={() => retryPayment(booking)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200">
                            💳 Thanh toán cọc
                          </button>
                        )}

                        {/* Cancel button */}
                        {canCancel && (
                          <button onClick={() => openCancel(booking)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-all duration-200">
                            ✕ Hủy đơn
                          </button>
                        )}

                        {/* Review */}
                        {booking.review ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-yellow-400">{'★'.repeat(booking.review.rating)}{'☆'.repeat(5 - booking.review.rating)}</span>
                            {booking.review.comment && (
                              <span className="italic text-gray-400">"{booking.review.comment}"</span>
                            )}
                          </div>
                        ) : canReview && (
                          <button onClick={() => openReview(booking)}
                            className="flex items-center gap-2 px-4 py-2 bg-ochre/10 hover:bg-ochre/20 text-ochre border border-ochre/30 rounded-xl text-sm font-semibold transition-all duration-200">
                            ⭐ Viết đánh giá
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirm Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-navy text-center mb-1">Xác nhận hủy đơn</h2>
            <p className="text-gray-500 text-sm text-center mb-5">{cancelModal.booking.product?.product_name}</p>

            {cancelModal.payment && cancelModal.refund && (
              <div className={`p-4 rounded-xl mb-5 text-sm ${
                cancelModal.refund.percent === 100 ? 'bg-green-50 border border-green-200 text-green-800'
                : cancelModal.refund.percent === 50 ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-semibold mb-1">Chính sách hoàn tiền:</p>
                <p>Số tiền đã cọc: <strong>{new Intl.NumberFormat('vi-VN').format(cancelModal.payment.amount)} đ</strong></p>
                <p className="mt-1">→ {cancelModal.refund.label}
                  {cancelModal.refund.percent > 0 && (
                    <strong> ({new Intl.NumberFormat('vi-VN').format(
                      Math.floor(cancelModal.payment.amount * cancelModal.refund.percent / 100)
                    )} đ)</strong>
                  )}
                </p>
              </div>
            )}

            {!cancelModal.payment && (
              <div className="p-4 rounded-xl mb-5 text-sm bg-gray-50 border border-gray-200 text-gray-600">
                Đơn chưa thanh toán cọc. Hủy đơn sẽ không phát sinh hoàn tiền.
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setCancelModal(null)} disabled={cancelling}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium">
                Đóng
              </button>
              <button onClick={confirmCancel} disabled={cancelling}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl transition font-bold">
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Đánh giá chuyến đi</h2>
            <p className="text-gray-500 text-sm mb-6">{reviewModal.product_name}</p>

            <form onSubmit={submitReview} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Mức độ hài lòng</label>
                <StarPicker value={rating} onChange={setRating} />
                <p className="text-sm text-ochre mt-1 font-medium">
                  {['', 'Rất tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'][rating]}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Nhận xét của bạn</label>
                <textarea
                  value={comment} onChange={e => setComment(e.target.value)}
                  rows={4} placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre resize-none text-sm font-body transition"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium">
                  Hủy
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-navy hover:bg-navy-light disabled:bg-navy/50 text-white rounded-xl transition-all duration-200 font-bold">
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PublicLayout>
  )
}
