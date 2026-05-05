import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.data)
        const revRes = await api.get(`/reviews/product/${id}`)
        setReviews(revRes.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleBooking = () => {
    if (!user) { navigate('/login'); return }
    if (user.role_id !== 2) {
      alert('Chỉ tài khoản khách hàng mới có thể đặt xe.')
      return
    }
    navigate(`/booking/${id}`)
  }

  const getMinPrice = () => {
    if (!product?.prices?.length) return null
    return Math.min(...product.prices.map(p => parseFloat(p.price)))
  }

  const formatCurrency = (v) => new Intl.NumberFormat('vi-VN').format(v) + ' đ'

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-navy/20 border-t-ochre rounded-full animate-spin" />
      </div>
    </PublicLayout>
  )

  if (!product) return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
        <button onClick={() => navigate('/services')} className="mt-4 px-6 py-2.5 bg-navy text-white rounded-xl hover:bg-navy-light transition">
          Quay lại dịch vụ
        </button>
      </div>
    </PublicLayout>
  )

  const minPrice = getMinPrice()

  return (
    <PublicLayout>
      {/* Hero banner */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-navy">
        {product.image_url && (
          <>
            <img src={product.image_url} alt={product.product_name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/95 to-navy/50" />
          </>
        )}
        <div className="relative z-10 h-full flex flex-col justify-end pb-10 px-6 max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Quay lại
          </button>
          {product.category?.category_name && (
            <span className="inline-flex w-fit px-3 py-1 bg-ochre/20 border border-ochre/40 text-ochre text-xs font-semibold rounded-full mb-3">
              {product.category.category_name}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{product.product_name}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: main info */}
          <div className="lg:col-span-2 space-y-10">

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5">
              {product.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span className="font-body">{product.address}</span>
                </div>
              )}
              {avgRating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <span className="font-semibold text-navy">{avgRating}</span>
                  <span className="text-gray-400 text-sm">({reviews.length} đánh giá)</span>
                </div>
              )}
            </div>

            {/* Product image (full width on mobile) */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-mist h-72 lg:hidden">
              {product.image_url
                ? <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/></svg>
                  </div>
              }
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-4">Mô tả dịch vụ</h2>
                <p className="text-gray-600 leading-relaxed font-body text-base">{product.description}</p>
              </div>
            )}

            {/* Highlights */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-5">Điểm nổi bật</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🛡️', title: 'An toàn', desc: 'Xe được kiểm định định kỳ, tài xế được đào tạo chuyên nghiệp' },
                  { icon: '⏰', title: 'Đúng giờ', desc: 'Cam kết đón đúng giờ, theo dõi thực tế chuyến đi' },
                  { icon: '💼', title: 'Tài xế lịch sự', desc: 'Am hiểu địa bàn, thái độ phục vụ chuyên nghiệp' },
                  { icon: '💰', title: 'Giá minh bạch', desc: 'Không phát sinh chi phí ẩn, thanh toán sau khi đến nơi' },
                ].map(h => (
                  <div key={h.title} className="flex gap-3 p-4 bg-mist/50 rounded-xl">
                    <span className="text-2xl">{h.icon}</span>
                    <div>
                      <p className="font-semibold text-navy text-sm">{h.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-6">
                Đánh giá khách hàng
                {reviews.length > 0 && <span className="ml-2 text-lg text-gray-400 font-normal font-body">({reviews.length})</span>}
              </h2>
              {reviews.length === 0 ? (
                <div className="bg-mist/50 rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
                  Chưa có đánh giá nào. Hãy là người đầu tiên!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {review.customer?.full_name?.charAt(0)?.toUpperCase() || 'K'}
                          </div>
                          <div>
                            <p className="font-semibold text-navy text-sm">{review.customer?.full_name || 'Khách hàng'}</p>
                            <p className="text-gray-400 text-xs">{new Date(review.created_at).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-base ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 text-sm leading-relaxed pl-13" style={{ paddingLeft: '3.25rem' }}>{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky CTA card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Image on desktop */}
              <div className="hidden lg:block rounded-2xl overflow-hidden shadow-lg bg-mist h-52">
                {product.image_url
                  ? <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/></svg>
                    </div>
                }
              </div>

              {/* CTA card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                {minPrice && (
                  <div className="mb-5">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Giá từ</p>
                    <p className="font-display text-3xl font-bold text-ochre">{formatCurrency(minPrice)}</p>
                    <p className="text-gray-400 text-sm mt-0.5">Thanh toán khi đến nơi · Không phụ thu</p>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  className="w-full py-4 bg-ochre hover:bg-ochre-light text-white font-bold text-lg rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  Đặt xe ngay →
                </button>

                {!user && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Cần <button onClick={() => navigate('/login')} className="text-ochre underline">đăng nhập</button> để đặt xe
                  </p>
                )}

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                  {[
                    'Xác nhận đặt xe trong 30 phút',
                    'Miễn phí hủy trước 24 giờ',
                    'Hỗ trợ 24/7 qua điện thoại',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
