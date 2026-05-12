import { useEffect, useRef, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useNavigate } from 'react-router-dom'

const EMAIL = 'phuongtouristcar.dev@gmail.com'

function CopyEmailCard() {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover-lift text-left cursor-pointer border-none"
      style={{ outline: 'none' }}
      title="Bấm để sao chép email"
    >
      <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ochre uppercase tracking-wide mb-1 font-semibold">Email</p>
        <p className="font-semibold text-navy text-sm truncate">{EMAIL}</p>
        <p className="text-xs mt-1" style={{ color: copied ? '#22c55e' : '#9ca3af' }}>
          {copied ? '✓ Đã sao chép!' : 'Bấm để sao chép'}
        </p>
      </div>
    </button>
  )
}

const STATS = [
  { value: '5+', label: 'Years of experience' },
  { value: '50+', label: 'Trips per month' },
  { value: '3', label: 'Vehicle types' },
  { value: '100%', label: 'Trained drivers' },
]

const VALUES = [
  { icon: '🛡️', title: 'Safe', desc: 'Vehicles are regularly inspected, drivers are trained in safe driving and emergency handling.' },
  { icon: '⏰', title: 'On Time', desc: 'We monitor actual flight schedules and traffic conditions to ensure punctual pickup.' },
  { icon: '💼', title: 'Professional', desc: 'Drivers are well-dressed, courteous, and familiar with Da Nang and surrounding areas.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'Published rates by vehicle type and route, no hidden charges.' },
]

function AnimatedCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, hsl(38,92%,45%) 0%, transparent 50%), radial-gradient(circle at 75% 25%, hsl(214,32%,91%) 0%, transparent 40%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-ochre text-sm font-semibold uppercase tracking-widest mb-3 font-body">About PhuOng Tourist Car</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            PhuOng Tourist Car
          </h1>
          <p className="text-white/70 font-body text-lg leading-relaxed max-w-2xl mx-auto">
            Professional tour car service provider in Da Nang, specializing in airport transfers, sightseeing tours and special journeys for individuals and groups.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <AnimatedCard key={s.label} delay={i * 80}>
              <div className="text-center p-4">
                <div className="font-display text-4xl font-extrabold text-ochre mb-1">{s.value}</div>
                <div className="text-gray-500 text-sm font-body">{s.label}</div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <AnimatedCard>
          <h2 className="font-display text-3xl font-bold text-navy mb-5">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4 font-body">
            PhuOng Tourist Car was founded with the goal of providing convenient, safe, and reliable transport services in the coastal city of Da Nang — one of Vietnam's top destinations.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 font-body">
            With a fleet ranging from 7-seater to 45-seater vehicles, we serve groups of all sizes to meet all travel needs.
          </p>
          <p className="text-gray-600 leading-relaxed font-body">
            All vehicles are clean, regularly maintained and fully equipped with modern amenities to deliver the best experience for passengers.
          </p>
        </AnimatedCard>
        <AnimatedCard delay={150}>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-72 group">
            <img
              src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"
              alt="PhuOng Tourist Car"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </AnimatedCard>
      </div>

      {/* Values */}
      <div className="bg-mist/50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedCard>
            <h2 className="font-display text-3xl font-bold text-navy text-center mb-12">Core Values</h2>
          </AnimatedCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <AnimatedCard key={v.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center hover-lift">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-display font-bold text-navy mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-body">{v.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address */}
        <AnimatedCard delay={0}>
          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover-lift">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-ochre uppercase tracking-wide mb-1 font-semibold">Địa chỉ</p>
              <p className="font-semibold text-navy text-sm">09 Tiên Sơn 06, Đà Nẵng</p>
            </div>
          </div>
        </AnimatedCard>

        {/* Phone */}
        <AnimatedCard delay={80}>
          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover-lift">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.07 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.95 5.95l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-ochre uppercase tracking-wide mb-1 font-semibold">Hotline</p>
              <p className="font-semibold text-navy text-sm">0335 966 977</p>
            </div>
          </div>
        </AnimatedCard>

        {/* Email – click to copy */}
        <AnimatedCard delay={160}>
          <CopyEmailCard />
        </AnimatedCard>
      </div>


      {/* CTA */}
      <div className="bg-navy py-16 px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Book?</h2>
        <p className="text-white/60 font-body mb-8">Browse our services and choose the right route for you.</p>
        <button
          onClick={() => navigate('/services')}
          className="px-10 py-3.5 bg-ochre hover:bg-ochre-light text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          View Services →
        </button>
      </div>
    </PublicLayout>
  )
}
