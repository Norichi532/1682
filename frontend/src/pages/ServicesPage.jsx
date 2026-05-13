import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'

function ProductCard({ product, index, onClick, formatCurrency, getMinPrice }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
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
      <div className="relative h-52 overflow-hidden bg-mist">
        {product.image_url ? (
          <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.category?.category_name && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-navy/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {product.category.category_name}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-navy mb-2 line-clamp-2 group-hover:text-ochre transition-colors duration-200">
          {product.product_name}
        </h3>
        {product.address && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 text-ochre shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">{product.address}</span>
          </div>
        )}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
            <p className="text-ochre font-bold text-xl">{formatCurrency(getMinPrice(product.prices))}</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-ochre transition-colors duration-200">
            View details
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ])
        setCategories(categoriesRes.data.data || [])
        setProducts(productsRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category?.id === parseInt(selectedCategory)
    const matchSearch = !search || p.product_name?.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const getMinPrice = (prices) => {
    if (!prices || prices.length === 0) return 0
    return Math.min(...prices.map(p => parseFloat(p.price)))
  }

  const formatCurrency = (value) => new Intl.NumberFormat('en-GB').format(value) + ' VND'

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative bg-navy py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(38,92%,45%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(214,32%,91%) 0%, transparent 40%)' }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-ochre font-body text-sm font-semibold uppercase tracking-widest mb-3">Explore</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-white/70 font-body text-lg max-w-xl mx-auto">
            Professional tour vehicles — airport transfers, sightseeing tours and special journeys
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === 'all' ? 'bg-navy text-white shadow-md' : 'bg-mist text-navy hover:bg-navy/10'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat.id.toString() ? 'bg-navy text-white shadow-md' : 'bg-mist text-navy hover:bg-navy/10'
                }`}
              >
                {cat.category_name}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services or locations..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy w-64 transition"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-mist/40 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 py-14">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No services found in this category.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">{filteredProducts.length} services</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={() => navigate(`/services/${product.id}`)}
                    formatCurrency={formatCurrency}
                    getMinPrice={getMinPrice}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
