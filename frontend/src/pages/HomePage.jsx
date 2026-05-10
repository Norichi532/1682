import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'

/* ─── Inline SVG icons (no lucide-react needed) ─── */
function IconArrowRight({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}
function IconChevronRight({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
function IconUsers({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 11-4 0 2 2 0 014 0zM7 16a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}
function IconStar({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
function IconMapPin({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

/* ─── Category meta for services section ─── */
const CATEGORY_META = [
  { id: 1, icon: '✈️', iconBg: 'bg-sky-100', tag: 'Most Popular',
    description: 'Professional Da Nang airport transfer service, always on time. Drivers monitor actual flight schedules.' },
  { id: 2, icon: '🗺️', iconBg: 'bg-emerald-50', tag: 'Experience',
    description: 'Explore Da Nang, Hoi An, Hue and Central Vietnam destinations on flexible itineraries.' },
  { id: 3, icon: '⛳', iconBg: 'bg-lime-50', tag: 'Premium',
    description: 'Transfer to top golf courses in Da Nang. Spacious vehicles with ample room for golf equipment.' },
]

const VEHICLE_SPECS = {
  16: ['16 seats', 'Free Wi-Fi', 'Dual air conditioning'],
  29: ['29 seats', 'Premium cushioned seats', 'Entertainment screen'],
  45: ['45 seats', 'Aircraft-style seats', 'Private restroom'],
}
const VEHICLE_TAGS = { 16: 'Popular', 29: 'Large Group', 45: 'Big Tour' }

/* ─── ServiceCard with IntersectionObserver ─── */
function ServiceCard({ cat, index, onClick }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group bg-white rounded-2xl border border-gray-100 p-8 hover-lift cursor-pointer transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 ${cat.iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
          {cat.icon}
        </div>
        <span className="text-xs text-ochre font-semibold font-body tracking-wider uppercase px-3 py-1 bg-ochre/10 rounded-full">
          {cat.tag}
        </span>
      </div>
      <h3 className="font-display font-bold text-navy text-xl mb-3">{cat.category_name}</h3>
      <p className="text-gray-500 text-sm font-body leading-relaxed mb-6">{cat.description || cat.descriptionFallback}</p>
      <div className="flex items-center gap-2 text-navy-light font-semibold text-sm font-body group-hover:text-ochre transition-colors duration-200">
        View details
        <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
      <div className="mt-6 h-0.5 bg-gradient-to-r from-ochre/0 via-ochre/40 to-ochre/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  )
}

/* ─── VehicleCard with hover reveal ─── */
function VehicleCard({ model, index, onClick }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const specs = VEHICLE_SPECS[model.num_seats] || [`${model.num_seats} seats`]
  const tag = VEHICLE_TAGS[model.num_seats] || ''
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 200}ms`, height: '320px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
        style={{
          backgroundImage: model.image_url ? `url(${model.image_url})` : undefined,
          backgroundColor: !model.image_url ? 'hsl(222,47%,11%)' : undefined,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />
      {/* Overlay */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        hovered
          ? 'bg-gradient-to-t from-navy/95 via-navy/60 to-navy/20'
          : 'bg-gradient-to-t from-navy/85 via-navy/50 to-transparent'
      }`} />
      {/* Tag */}
      {tag && (
        <div className="absolute top-5 right-5 bg-ochre text-white text-xs font-semibold px-3 py-1.5 rounded-full font-body">
          {tag}
        </div>
      )}
      {/* Default: seats count */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-white text-center transition-all duration-300 ${
        hovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}>
        <span className="font-display font-bold text-8xl leading-none">{model.num_seats}</span>
        <span className="font-body text-lg text-white/80 mt-1">seats</span>
        <span className="font-body text-sm text-white/60 mt-2 tracking-wide">{model.model_name}</span>
      </div>
      {/* Hover: specs panel */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy via-navy/95 to-transparent pt-12 pb-6 px-6 transition-all duration-300 ${
        hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="text-ochre text-xs font-semibold tracking-widest uppercase font-body mb-2">{model.model_name}</div>
        <h3 className="font-display font-bold text-white text-2xl mb-4">{model.num_seats} seats</h3>
        <div className="space-y-2">
          {specs.map(spec => (
            <div key={spec} className="flex items-center gap-2 text-white/80 text-sm font-body">
              <div className="w-1.5 h-1.5 bg-ochre rounded-full flex-shrink-0" />
              {spec}
            </div>
          ))}
        </div>
        <button className="mt-5 flex items-center gap-2 text-ochre text-sm font-semibold font-body hover:gap-3 transition-all duration-200">
          View details <IconChevronRight />
        </button>
      </div>
    </div>
  )
}

/* ─── ReasonCard with IntersectionObserver ─── */
const REASONS = [
  { icon: '🛡️', title: 'Absolute Safety', description: 'Professionally trained drivers, regularly maintained vehicles, full insurance coverage.' },
  { icon: '⏰', title: 'Always On Time', description: 'Committed to punctuality, tracking actual schedules so you never have to wait.' },
  { icon: '💰', title: 'Transparent Pricing', description: 'Clear upfront quotes, no hidden fees. Full VAT invoices available.' },
  { icon: '📞', title: '24/7 Support', description: 'Our support team is always available 24 hours a day, 7 days a week.' },
]
function ReasonCard({ reason, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`group p-8 rounded-2xl bg-mist/50 hover:bg-sky-50 border border-transparent hover:border-ochre/20 transition-all duration-500 cursor-default ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
        {reason.icon}
      </div>
      <h3 className="font-display font-bold text-navy text-xl mb-3">{reason.title}</h3>
      <p className="text-gray-500 text-sm font-body leading-relaxed">{reason.description}</p>
    </div>
  )
}

/* ─── Main Page ─── */
export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [carModels, setCarModels] = useState([])

  // Hero parallax + entrance
  const [loaded, setLoaded] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  // Section title visibility
  const servicesTitleRef = useRef(null)
  const [servicesTitleVisible, setServicesTitleVisible] = useState(false)
  const fleetTitleRef = useRef(null)
  const [fleetTitleVisible, setFleetTitleVisible] = useState(false)
  const whyTitleRef = useRef(null)
  const [whyTitleVisible, setWhyTitleVisible] = useState(false)

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || [])).catch(() => {})
    api.get('/car-models').then(r => setCarModels(r.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll) }
  }, [])

  useEffect(() => {
    const obs = (ref, setter) => {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true) }, { threshold: 0.3 })
      if (ref.current) o.observe(ref.current)
      return o
    }
    const o1 = obs(servicesTitleRef, setServicesTitleVisible)
    const o2 = obs(fleetTitleRef, setFleetTitleVisible)
    const o3 = obs(whyTitleRef, setWhyTitleVisible)
    return () => { o1.disconnect(); o2.disconnect(); o3.disconnect() }
  }, [])

  // Merge API categories with local meta
  const enrichedCategories = categories.map(cat => {
    const meta = CATEGORY_META.find(m => m.id === cat.id) || CATEGORY_META[0]
    return { ...cat, ...meta, descriptionFallback: meta.description }
  })

  return (
    <PublicLayout>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax bg */}
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=85"
            alt="Luxury van"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        </div>

        {/* Ambient orb */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="max-w-3xl">

            {/* Badge — click to show address + Google Maps */}
            <div className="relative mb-8" style={{ transitionDelay: '0ms' }}>
              <button
                onClick={() => setShowMap(prev => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ochre/40 bg-ochre/10 hover:bg-ochre/20 transition-all duration-300 cursor-pointer ${
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <IconMapPin className="w-3.5 h-3.5 text-ochre" />
                <span className="text-ochre text-xs font-medium tracking-wider uppercase font-body">
                  Đà Nẵng City
                </span>
                <span className="text-ochre/60 text-xs ml-1">{showMap ? '▲' : '▼'}</span>
              </button>

              {showMap && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden w-80">
                  <div className="p-3 bg-navy flex items-center gap-2">
                    <IconMapPin className="w-4 h-4 text-ochre flex-shrink-0" />
                    <span className="text-white text-sm font-medium">09 Tiên Sơn 06, Đà Nẵng</span>
                  </div>
                  <iframe
                    title="PhuOng Tourist Car Location"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15338.458848133352!2d108.219678!3d16.03356!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219ec293e0f41%3A0x330d92c67b97833d!2zMDkgVGnDqm4gU8ahbiA2LCBIw7JhIEPGsOG7nW5nLCDEkMOgIE7hur1uZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2sus!4v1778403459070!5m2!1svi!2sus"
                    width="320"
                    height="200"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>

            {/* Heading */}
            <div
              className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '150ms' }}
            >
              <h1 className="font-display text-white leading-tight tracking-tight">
                <span className="block text-3xl lg:text-5xl font-normal text-white/80 mb-2">Tour Car Service</span>
                {/* Ochre rule — above DA NANG heading */}
                <div
                  className={`h-0.5 bg-gradient-to-r from-ochre to-transparent mb-3 transition-all duration-700 ${
                    loaded ? 'opacity-100 w-32' : 'opacity-0 w-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                />
                <span className="block text-6xl lg:text-8xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>ĐÀ NẴNG</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className={`text-white/70 text-lg lg:text-xl font-body font-light leading-relaxed max-w-xl transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              We provide professional, safe, and comfortable tour car services for all your travel needs.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap items-center gap-4 mt-10 transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '650ms' }}
            >
              <button
                onClick={() => navigate('/services')}
                className="group flex items-center gap-3 bg-ochre hover:bg-ochre-light text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 font-body pulse-glow"
              >
                View Services
                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/vehicles')}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base border border-white/20 backdrop-blur-sm transition-all duration-300 font-body"
              >
                Our Fleet
              </button>
            </div>

            {/* Stats */}
            <div
              className={`flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-white/10 transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {[
                { value: '500+', label: 'Trips/month' },
                { value: '98%', label: 'Satisfied Customers' },
                { value: '10+', label: 'Years Experience' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-bold text-ochre">{stat.value}</div>
                  <div className="text-white/60 text-sm font-body mt-0.5">{stat.label}</div>
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-auto">
                {[...Array(5)].map((_, i) => <IconStar key={i} className="w-4 h-4 text-ochre" />)}
                <span className="text-white/60 text-sm font-body ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-ochre rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-24 lg:py-32 bg-mist/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={servicesTitleRef}
            className={`text-center mb-16 transition-all duration-700 ${servicesTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-ochre text-xs font-semibold tracking-widest uppercase font-body block mb-4">Services</span>
            <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl tracking-tight mb-4">Our Services</h2>
            <p className="text-gray-500 text-lg font-body max-w-xl mx-auto leading-relaxed">
              Every journey is a memorable experience with our professional driver team
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {enrichedCategories.map((cat, i) => (
              <ServiceCard
                key={cat.id}
                cat={cat}
                index={i}
                onClick={() => navigate(`/services/cat/${cat.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLEET ═══ */}
      <section id="fleet" className="py-24 lg:py-32 bg-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={fleetTitleRef}
            className={`text-center mb-16 transition-all duration-700 ${fleetTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-ochre text-xs font-semibold tracking-widest uppercase font-body block mb-4">Our Vehicles</span>
            <h2 className="font-display font-bold text-white text-4xl lg:text-5xl tracking-tight mb-4">Our Vehicles</h2>
            <p className="text-white/60 text-lg font-body max-w-xl mx-auto leading-relaxed">
              Modern vehicles, regularly serviced, ensuring absolute comfort and safety
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {carModels.map((model, i) => (
              <VehicleCard
                key={model.id}
                model={model}
                index={i}
                onClick={() => navigate(`/vehicles/${model.id}`)}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/vehicles')}
              className="inline-flex items-center gap-3 border border-ochre/50 text-ochre hover:bg-ochre hover:text-white px-8 py-4 rounded-2xl font-semibold text-sm font-body transition-all duration-300"
            >
              <IconUsers className="w-5 h-5" />
              View Vehicle Details
            </button>
          </div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section id="about" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={whyTitleRef}
            className={`text-center mb-16 transition-all duration-700 ${whyTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-ochre text-xs font-semibold tracking-widest uppercase font-body block mb-4">Our Promise</span>
            <h2 className="font-display font-bold text-navy text-4xl lg:text-5xl tracking-tight mb-4">Why Choose Us?</h2>
            <p className="text-gray-500 text-lg font-body max-w-xl mx-auto leading-relaxed">
              With over 10 years of experience, we understand how important your journey is
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REASONS.map((reason, i) => (
              <ReasonCard key={reason.title} reason={reason} index={i} />
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-navy to-navy-light p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-center lg:text-left">
              <h3 className="font-display font-bold text-white text-3xl lg:text-4xl mb-3">Ready for Your Journey?</h3>
              <p className="text-white/60 font-body text-lg">Book today and enjoy special offers</p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <a
                href="tel:+84335966977"
                className="flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-6 py-3.5 rounded-2xl font-semibold text-sm font-body transition-all duration-200"
              >
                📞 Call Now
              </a>
              <button
                onClick={() => navigate('/services')}
                className="bg-ochre hover:bg-ochre-light text-white px-8 py-3.5 rounded-2xl font-semibold text-sm font-body transition-all duration-200"
              >
                View Services
              </button>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
