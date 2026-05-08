import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'

const CATEGORY_META = {
  1: {
    hero: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200',
    intro: 'Professional, punctual airport transfer service with experienced drivers. We monitor actual flight status to adjust pickup times accordingly.',
  },
  2: {
    hero: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200',
    intro: 'Khám phá vẻ đẹp Đà Nẵng – Hội An – Huế và vùng lân cận cùng xe du lịch tiện nghi. Tài xế am hiểu địa bàn, sẵn sàng tư vấn lịch trình phù hợp.',
  },
  3: {
    hero: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200',
    intro: 'Xe đưa đón sân golf cao cấp, phục vụ hội viên và khách vip các sân golf lớn tại Đà Nẵng. Xe rộng rãi, khoang chứa túi golf tiêu chuẩn.',
  },
}

const formatCurrency = (v) => new Intl.NumberFormat('en-GB').format(v) + ' VND'

function ProductCard({ product, index, onClick, getMinPrice }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md hover-lift cursor-pointer overflow-hidden group transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <div className="h-48 overflow-hidden bg-mist">
        {product.image_url
          ? <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" /></svg>
            </div>
        }
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-navy text-lg mb-2 line-clamp-2 group-hover:text-ochre transition-colors duration-200">{product.product_name}</h3>
        {product.address && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 text-ochre flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">{product.address}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-ochre font-bold text-xl">From {formatCurrency(getMinPrice(product.prices))}</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-ochre transition-colors">
            Details
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const meta = CATEGORY_META[parseInt(categoryId)] || CATEGORY_META[1]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products?category_id=${categoryId}`)
        ])
        const cats = catRes.data.data || []
        setCategory(cats.find(c => c.id === parseInt(categoryId)) || null)
        setProducts(prodRes.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId])

  const getMinPrice = (prices) => {
    if (!prices?.length) return 0
    return Math.min(...prices.map(p => parseFloat(p.price)))
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative h-80 md:h-[420px] overflow-hidden">
        <img src={meta.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/50" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 max-w-5xl mx-auto text-white">
          {loading ? (
            <div className="h-10 w-64 bg-white/20 rounded animate-pulse mb-3" />
          ) : (
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{category?.category_name}</h1>
          )}
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl font-body">{meta.intro}</p>
        </div>
      </div>

      {/* Products */}
      <div className="bg-mist/40 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="font-display text-2xl font-bold text-navy mb-8">
            {loading ? '' : `${products.length} routes available`}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No services found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onClick={() => navigate(`/services/${product.id}`)}
                  getMinPrice={getMinPrice}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
