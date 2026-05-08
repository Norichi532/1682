import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    api.get(`/car-models/${id}`)
      .then(res => setModel(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-navy/20 border-t-ochre rounded-full animate-spin" />
      </div>
    </PublicLayout>
  )

  if (!model) return (
    <PublicLayout>
      <div className="text-center py-24 text-gray-500">Vehicle not found.</div>
    </PublicLayout>
  )

  const features = Array.isArray(model.features) ? model.features : []
  const gallery = Array.isArray(model.images) && model.images.length > 0
    ? model.images
    : model.image_url ? [model.image_url] : []

  return (
    <PublicLayout>
      {/* Top banner */}
      <div className="bg-navy/5 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/vehicles')} className="flex items-center gap-1.5 text-navy hover:text-ochre text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to vehicles
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-12">

        {/* ── Name + badges ── */}
        <div className="text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">{model.model_name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-2 bg-ochre/10 text-ochre font-semibold rounded-xl text-sm border border-ochre/20">
              {model.num_seats} seats
            </span>
          </div>
        </div>

        {/* ── Gallery ── */}
        <div className="space-y-3">
          {/* Main photo */}
          <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-900 h-80 md:h-[420px] flex items-center justify-center">
            {gallery.length > 0
              ? <img src={gallery[activeImg]} alt={model.model_name} className="w-full h-full object-contain transition-all duration-300" />
              : <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                  </svg>
                </div>
            }
          </div>
          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activeImg ? 'border-ochre scale-105 shadow-md' : 'border-gray-200 hover:border-ochre/50'
                  }`}
                >
                  <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-contain bg-gray-900" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Description + amenities ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Description */}
          {model.description && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-3">Overview</h2>
              <p className="text-gray-600 leading-relaxed font-body">{model.description}</p>
            </div>
          )}

          {/* Amenities */}
          {features.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                On-board amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-mist/50 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-ochre/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span className="text-sm text-navy font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <button
            onClick={() => navigate('/services')}
            className="px-10 py-4 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg font-body"
          >
            View routes using this vehicle →
          </button>
        </div>
      </div>
    </PublicLayout>
  )
}
