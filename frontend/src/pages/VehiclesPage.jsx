import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'

function ModelCard({ model, index, onClick }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const features = Array.isArray(model.features) ? model.features : []

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md hover-lift cursor-pointer overflow-hidden group transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${(index % 3) * 120}ms` }}
    >
      <div className="h-56 overflow-hidden bg-mist relative">
        {model.image_url
          ? <img src={model.image_url} alt={model.model_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
        }
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-navy/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
            {model.num_seats} chỗ ngồi
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-navy mb-3 group-hover:text-ochre transition-colors duration-200">
          {model.model_name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{model.description}</p>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {features.slice(0, 3).map((f, i) => (
              <span key={i} className="px-2.5 py-1 bg-mist text-navy text-xs rounded-full font-medium">{f}</span>
            ))}
            {features.length > 3 && (
              <span className="px-2.5 py-1 bg-mist text-gray-400 text-xs rounded-full">+{features.length - 3}</span>
            )}
          </div>
        )}
        <button className="w-full py-2.5 border-2 border-navy text-navy font-semibold rounded-xl group-hover:bg-navy group-hover:text-white transition-all duration-200">
          Xem chi tiết
        </button>
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/car-models').then(res => {
      setModels(res.data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative bg-navy py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, hsl(38,92%,45%) 0%, transparent 50%)' }} />
        {/* Decorative car silhouette */}
        <div className="absolute right-8 bottom-0 opacity-5">
          <svg className="w-96 h-48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
          </svg>
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-ochre font-body text-sm font-semibold uppercase tracking-widest mb-3">Phương tiện</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">Đội xe của chúng tôi</h1>
          <p className="text-white/70 font-body text-lg max-w-2xl mx-auto">
            Toàn bộ phương tiện đều màu trắng, được bảo dưỡng định kỳ và trang bị đầy đủ tiện nghi để đảm bảo an toàn và thoải mái.
          </p>
        </div>
      </div>

      {/* Fleet grid */}
      <div className="bg-mist/40">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-96 bg-white rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {models.map((model, index) => (
                <ModelCard key={model.id} model={model} index={index} onClick={() => navigate(`/vehicles/${model.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA strip */}
      <div className="bg-navy py-14 px-4 text-center">
        <h2 className="font-display text-2xl font-bold text-white mb-3">Sẵn sàng di chuyển?</h2>
        <p className="text-white/60 mb-6">Chọn tuyến đường và dòng xe phù hợp với bạn.</p>
        <button onClick={() => navigate('/services')}
          className="px-8 py-3 bg-ochre hover:bg-ochre-light text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
          Xem dịch vụ
        </button>
      </div>
    </PublicLayout>
  )
}
