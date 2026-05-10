import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Vehicle' },
  { id: 3, label: 'Confirm' },
  { id: 4, label: 'Payment' },
]

const GOLF_COURSES = [
  'BRG Da Nang Golf Resort',
  'Montgomerie Links Da Nang',
  'Ba Na Hills Golf Club',
  'Danang Golf Club',
  'Laguna Golf Lang Co',
]

const fmt = (v) => new Intl.NumberFormat('en-GB').format(v) + ' VND'
const fmtDT = (date, time) => {
  if (!date) return ''
  return new Date(`${date}T${time || '00:00'}`).toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step > s.id ? 'bg-ochre text-white'
              : step === s.id ? 'bg-navy text-white ring-4 ring-navy/20'
              : 'bg-gray-100 text-gray-400'
            }`}>
              {step > s.id
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                : s.id}
            </div>
            <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${step === s.id ? 'text-navy' : 'text-gray-400'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-14 md:w-20 h-0.5 mb-5 mx-1 transition-all duration-500 ${step > s.id ? 'bg-ochre' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Sidebar Summary ──────────────────────────────────────────────────────────
function BookingSummary({ product, data, step }) {
  const catId = product?.category?.id
  const icon = catId === 1 ? '✈️' : catId === 3 ? '⛳' : '🗺️'

  // Airport: from_airport → pickup at airport, else pickup at pickup_location
  const pickupLabel = catId === 1
    ? (data.direction === 'from_airport' ? 'Sân bay Đà Nẵng' : data.pickup_location)
    : catId === 3
      ? (data.direction === 'from_golf' ? data.golf_course : data.pickup_location)
      : data.pickup_location

  const dropLabel = catId === 1
    ? (data.direction === 'from_airport' ? data.pickup_location : 'Sân bay Đà Nẵng')
    : catId === 3
      ? (data.direction === 'from_golf' ? data.pickup_location : data.golf_course)
      : null

  return (
    <div className="bg-navy rounded-2xl p-6 text-white sticky top-20">
      <h3 className="text-ochre font-semibold text-xs uppercase tracking-widest mb-5">Booking Summary</h3>
      <div className="space-y-4">

        <SummaryRow icon={icon} label="Service" value={product?.product_name} always />

        {pickupLabel && (
          <SummaryRow icon="📍" label="Pickup" value={pickupLabel} />
        )}
        {dropLabel && (
          <SummaryRow
            icon={catId === 3 ? (data.direction === 'from_golf' ? '🏨' : '⛳') : '🏁'}
            label={catId === 3 ? (data.direction === 'from_golf' ? 'Drop-off' : 'Golf Course') : 'Drop-off'}
            value={dropLabel}
          />
        )}
        {catId === 1 && (
          <SummaryRow icon="🛂" label="Terminal" value={data.terminal === 'domestic' ? 'Domestic' : 'International'} />
        )}
        {catId === 2 && product?.num_days && (
          <SummaryRow icon="🗓" label="Duration" value={`${product.num_days} days`} />
        )}
        {data.date && (
          <SummaryRow icon="📅" label="Date & Time" value={fmtDT(data.date, data.time)} />
        )}
        {step >= 2 && data.model_name && (
          <SummaryRow icon="🚌" label="Vehicle" value={data.model_name} />
        )}

        {step >= 2 && data.price > 0 && (
          <div className="pt-4 mt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Estimated total</span>
              <span className="text-ochre font-bold text-xl">{fmt(data.price)}</span>
            </div>
            <p className="text-white/30 text-xs mt-1">Final price confirmed after selection</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ icon, label, value, always }) {
  if (!always && !value) return null
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">{icon}</div>
      <div>
        <p className="text-white/40 text-xs">{label}</p>
        <p className="font-semibold text-sm leading-snug">{value || '—'}</p>
      </div>
    </div>
  )
}

// Chuyển "07h30" → "07:30" cho input[type=time]
const parseItineraryTime = (t) => t ? t.replace('h', ':') : ''

// ─── Step 1: Schedule ───────────────────────────────────────────────────────
function Step1Schedule({ catId, data, onChange, error, numDays, itinerary }) {
  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none transition text-navy font-body text-sm"

  // Lấy giờ đón từ mục đầu tiên của Ngày 1 trong lịch trình tour
  const tourPickupTime = catId === 2
    ? parseItineraryTime(itinerary?.[0]?.items?.[0]?.time)
    : null

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Schedule & Location</h2>

      {/* Airport: direction selector */}
      {catId === 1 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'from_airport', label: '✈ Airport → Hotel' },
              { value: 'to_airport',   label: '🏨 Hotel → Airport' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('direction', opt.value)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 text-left ${
                  data.direction === opt.value
                    ? 'border-ochre bg-ochre/5 text-navy'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Golf: direction selector */}
      {catId === 3 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'to_golf',   label: '🏌 Hotel → Golf Course' },
              { value: 'from_golf', label: '🔄 Golf Course → Hotel' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('direction', opt.value)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 text-left ${
                  data.direction === opt.value
                    ? 'border-ochre bg-ochre/5 text-navy'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hotel address — Airport & Golf & Tour */}
      {catId === 1 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            {data.direction === 'from_airport' ? 'Hotel address (drop-off)' : 'Hotel address (pickup)'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ochre">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <input type="text" value={data.pickup_location} onChange={e => onChange('pickup_location', e.target.value)}
              placeholder="Hotel name or address..." className={inp + ' pl-10'} />
          </div>
        </div>
      )}

      {catId === 2 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Pickup address <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ochre">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <input type="text" value={data.pickup_location} onChange={e => onChange('pickup_location', e.target.value)}
              placeholder="Hotel or accommodation address..." className={inp + ' pl-10'} />
          </div>
        </div>
      )}

      {catId === 3 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Hotel address <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ochre">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <input type="text" value={data.pickup_location} onChange={e => onChange('pickup_location', e.target.value)}
              placeholder="Hotel name or address..." className={inp + ' pl-10'} />
          </div>
        </div>
      )}

      {/* Golf course selector */}
      {catId === 3 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Select golf course <span className="text-red-500">*</span></label>
          <select value={data.golf_course} onChange={e => onChange('golf_course', e.target.value)} className={inp}>
            <option value="">-- Select golf course --</option>
            {GOLF_COURSES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      )}

      {/* Date + Time */}
      {catId === 2 ? (
        /* Tour: chỉ chọn ngày, giờ lấy tự động từ lịch trình */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Tour start date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.date}
              onChange={e => {
                onChange('date', e.target.value)
                // Luôn giữ giờ đúng theo lịch trình khi đổi ngày
                if (tourPickupTime) onChange('time', tourPickupTime)
              }}
              min={(() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().split('T')[0] })()}
              className={inp}
            />
            <p className="text-xs text-gray-400 mt-1">Please book at least 3 days in advance</p>
          </div>

          {/* Giờ đón tự động từ lịch trình */}
          {tourPickupTime && (
            <div className="flex items-center gap-3 p-4 bg-ochre/5 border border-ochre/20 rounded-xl">
              <div className="w-9 h-9 bg-ochre/10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">🕐</div>
              <div>
                <p className="text-sm font-semibold text-navy">Pickup at {tourPickupTime}</p>
                <p className="text-xs text-gray-400">Fixed by tour schedule — Day 1 departure time</p>
              </div>
            </div>
          )}

          {/* Preview lịch trình từng ngày */}
          {itinerary?.length > 0 && (
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-navy/5 border-b border-gray-100">
                <p className="text-xs font-semibold text-navy uppercase tracking-wide">📋 Tour schedule overview</p>
              </div>
              <div className="divide-y divide-gray-50">
                {itinerary.map(day => {
                  const firstItem = day.items?.[0]
                  const lastItem = day.items?.[day.items.length - 1]
                  return (
                    <div key={day.day} className="flex items-start gap-3 px-4 py-3">
                      <div className="w-14 flex-shrink-0">
                        <span className="text-xs font-bold text-ochre">Day {day.day}</span>
                        {firstItem?.time && (
                          <p className="text-[11px] text-gray-400 mt-0.5">{parseItineraryTime(firstItem.time)}</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-navy leading-snug">{day.label}</p>
                        {firstItem && (
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{firstItem.desc}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Airport / Golf: chọn ngày + giờ tự do */
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Departure date <span className="text-red-500">*</span></label>
            <input type="date" value={data.date} onChange={e => onChange('date', e.target.value)}
              min={(() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().split('T')[0] })()} className={inp} />
            <p className="text-xs text-gray-400 mt-1">Please book at least 3 days in advance</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Pickup time <span className="text-red-500">*</span></label>
            <input type="time" value={data.time} onChange={e => onChange('time', e.target.value)} className={inp} />
          </div>
        </div>
      )}

      {/* Passengers + Days (tour) / Golf bags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Passengers</label>
          <input type="number" min="1" max="45" value={data.passengers}
            onChange={e => onChange('passengers', parseInt(e.target.value) || 1)} className={inp} />
          {data.passengers > 45 && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">
              ⚠️ Groups over 45 passengers please contact our hotline <strong>0335 966 977</strong> for special booking assistance.
            </p>
          )}
        </div>
        {catId === 1 && (
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Terminal</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'international', label: '🌍 International' },
                { value: 'domestic',      label: '🏠 Domestic' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange('terminal', opt.value)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all duration-200 text-center ${
                    data.terminal === opt.value
                      ? 'border-ochre bg-ochre/5 text-navy'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {catId === 2 && numDays && (
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Tour days</label>
            <div className={inp + ' bg-gray-50 text-gray-600 cursor-not-allowed flex items-center gap-2'}>
              <span>🗓</span>
              <span className="font-semibold">{numDays} day(s)</span>
              <span className="text-xs text-gray-400 ml-1">(fixed by the tour program)</span>
            </div>
          </div>
        )}
        {catId === 3 && (
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Golf bags</label>
            <input type="number" min="0" max="20" value={data.golf_bags}
              onChange={e => onChange('golf_bags', parseInt(e.target.value))} className={inp} />
          </div>
        )}
      </div>

      {/* Flight code — airport direction */}
      {catId === 1 && data.direction === 'from_airport' && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Flight code</label>
          <input type="text" value={data.flight_code} onChange={e => onChange('flight_code', e.target.value)}
            placeholder="VD: VN123, QH456" className={inp} />
          <p className="text-xs text-gray-400 mt-1">Enter so we can monitor your actual landing time</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Notes</label>
        <textarea value={data.notes} onChange={e => onChange('notes', e.target.value)}
          rows={3} placeholder="Special requests, additional stops..."
          className={inp + ' resize-none'} />
      </div>

      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

// ─── Step 2: Vehicle ──────────────────────────────────────────────────────────
function Step2Vehicle({ pricesByModel, data, onChange, error, catId }) {
  const models = Object.values(pricesByModel)
  const passengers = data.passengers || 1
  const golfBags = data.golf_bags || 0

  // Calculate effective capacity: 1 golf bag = 1 seat
  const effectiveCapacity = (numSeats) =>
    catId === 3 ? numSeats - golfBags : numSeats

  const suitable = models.filter(m => effectiveCapacity(m.num_seats) >= passengers)
  const unsuitable = models.filter(m => effectiveCapacity(m.num_seats) < passengers)

  const VehicleCard = ({ model, disabled }) => {
    const price = model.prices[0]?.price || 0
    const selected = data.model_id === model.id
    const effCap = effectiveCapacity(model.num_seats)

    return (
      <button
        key={model.id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          onChange('model_id', model.id)
          onChange('model_name', model.model_name)
          onChange('price', price)
        }}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
          disabled
            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
            : selected
              ? 'border-ochre bg-ochre/5'
              : 'border-gray-100 hover:border-gray-200 bg-white'
        }`}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? 'bg-ochre/10' : 'bg-gray-50'}`}>
          {model.image_url
            ? <img src={model.image_url} alt={model.model_name} className="w-10 h-10 object-cover rounded-lg" />
            : <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-bold text-base ${selected ? 'text-navy' : disabled ? 'text-gray-400' : 'text-gray-800'}`}>
              {model.model_name}
            </p>
            {!disabled && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Suitable</span>
            )}
            {disabled && (
              <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Not enough space</span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {model.num_seats} seats
            {catId === 3 && golfBags > 0 && (
              <span className="text-gray-400"> · {effCap} seats left after {golfBags} golf bags</span>
            )}
          </p>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-lg ${disabled ? 'text-gray-400' : 'text-ochre'}`}>{fmt(price)}</p>
          <p className="text-gray-400 text-xs">/trip</p>
        </div>

        {/* Selected indicator */}
        {selected && !disabled && (
          <div className="w-6 h-6 rounded-full bg-ochre flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Select vehicle</h2>
      <p className="text-gray-500 text-sm">
        Select a vehicle for your group of <strong>{passengers} people</strong>
        {catId === 3 && golfBags > 0 && <> and <strong>{golfBags} golf bags</strong></>}
      </p>

      {suitable.length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          ⚠️ No suitable vehicle for your group. Please contact hotline <strong>0335 966 977</strong> for special booking assistance.
        </div>
      )}

      <div className="space-y-3">
        {suitable.map(model => <VehicleCard key={model.id} model={model} disabled={false} />)}
        {unsuitable.length > 0 && suitable.length > 0 && (
          <p className="text-xs text-gray-400 pt-1">Vehicles with insufficient capacity for your group:</p>
        )}
        {unsuitable.map(model => <VehicleCard key={model.id} model={model} disabled={true} />)}
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

// ─── Step 3: Confirm ─────────────────────────────────────────────────────────
function Step3Confirm({ product, data, onChange, error }) {
  const catId = product?.category?.id
  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none transition text-navy font-body text-sm"
  const readOnly = "w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 text-sm font-body"

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Contact information</h2>

      {/* Contact info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Full name <span className="text-red-500">*</span></label>
          <input type="text" value={data.full_name} onChange={e => onChange('full_name', e.target.value)} placeholder="Nguyễn Văn A" className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Phone number <span className="text-red-500">*</span></label>
          <input type="tel" value={data.phone} onChange={e => onChange('phone', e.target.value)} placeholder="0901234567" className={inp} />
        </div>
      </div>

      {/* Booking summary review */}
      <div className="mt-4 p-5 bg-mist/50 rounded-2xl border border-gray-100 space-y-3">
        <h3 className="font-semibold text-navy text-sm mb-3">Review your information</h3>
        <InfoRow label="Service" value={product?.product_name} />
        <InfoRow label="Pickup" value={
          catId === 1 && data.direction === 'from_airport' ? 'Sân bay Đà Nẵng' : data.pickup_location
        } />
        {catId === 1 && data.direction === 'from_airport' && data.pickup_location && (
          <InfoRow label="Drop-off" value={data.pickup_location} />
        )}
        {catId === 3 && data.golf_course && <InfoRow label="Golf course" value={data.golf_course} />}
        <InfoRow label="Date & Time" value={fmtDT(data.date, data.time)} />
        <InfoRow label="Vehicle" value={`${data.model_name} (${data.passengers} passengers)`} />
        {catId === 3 && data.golf_bags > 0 && <InfoRow label="Golf bags" value={`${data.golf_bags} bags`} />}
        {catId === 2 && product?.num_days && <InfoRow label="Days" value={`${product.num_days} days`} />}
        {catId === 1 && data.flight_code && <InfoRow label="Flight" value={data.flight_code} />}
        {data.notes && <InfoRow label="Notes" value={data.notes} />}
        <div className="pt-3 border-t border-gray-200 flex justify-between">
          <span className="text-gray-500 text-sm">Total price</span>
          <span className="text-ochre font-bold text-xl">{fmt(data.price)}</span>
        </div>
      </div>

      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-gray-400 flex-shrink-0">{label}</span>
      <span className="text-navy font-medium text-right">{value}</span>
    </div>
  )
}

// ─── Step 4: Payment ─────────────────────────────────────────────────────────
function Step4Payment({ data, submitting, onSubmit, error, success }) {
  const deposit = Math.floor(data.price * 0.3)
  const remaining = data.price - deposit

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Confirm & Pay Deposit</h2>

      {/* VNPay info card */}
      <div className="border-2 border-blue-500 bg-blue-50 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-blue-900">Pay via VNPay</p>
          <p className="text-blue-700 text-sm mt-0.5">Pay a 30% deposit to confirm your trip. The remaining balance is paid directly to the driver upon completion.</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="p-5 bg-mist/50 rounded-2xl border border-gray-100 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total trip value</span>
          <span className="font-semibold text-navy">{fmt(data.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Deposit now (30%)</span>
          <span className="font-bold text-blue-600">{fmt(deposit)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
          <span className="text-gray-500">Pay on completion</span>
          <span className="font-semibold text-gray-700">{fmt(remaining)}</span>
        </div>
      </div>

      {/* Refund policy */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <p className="font-semibold mb-1">📋 Deposit refund policy on cancellation:</p>
        <ul className="space-y-0.5 text-amber-700">
          <li>• 3+ days before: Full 100% refund</li>
          <li>• 1–3 days before: 50% refund</li>
          <li>• Under 24 hours: No refund</li>
        </ul>
      </div>

      {error && <ErrorMsg msg={error} />}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          {success}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting || !!success}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</>
        ) : `💳 Pay deposit ${fmt(deposit)} via VNPay`}
      </button>
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
      {msg}
    </div>
  )
}

// ─── Main BookingPage ─────────────────────────────────────────────────────────
export default function BookingPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const [data, setData] = useState({
    // Step 1
    direction: 'from_airport',
    pickup_location: '',
    golf_course: '',
    date: '',
    time: '',
    passengers: 1,
    days: 1,
    golf_bags: 0,
    terminal: 'international',
    flight_code: '',
    notes: '',
    // Step 2
    model_id: null,
    model_name: '',
    price: 0,
    // Step 3
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  })

  useEffect(() => {
    api.get(`/products/${productId}`)
      .then(res => {
        const p = res.data.data
        setProduct(p)
        // Tour: tự động set giờ đón từ lịch trình ngay khi load xong
        if (p?.category?.id === 2 && p?.itinerary?.[0]?.items?.[0]?.time) {
          const autoTime = parseItineraryTime(p.itinerary[0].items[0].time)
          setData(prev => ({ ...prev, time: autoTime }))
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productId])

  const onChange = (key, val) => {
    setData(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  const catId = product?.category?.id

  // Build pricesByModel for step 2
  const pricesByModel = {}
  product?.prices?.forEach(p => {
    if (!pricesByModel[p.car_model.id]) {
      pricesByModel[p.car_model.id] = { ...p.car_model, prices: [] }
    }
    pricesByModel[p.car_model.id].prices.push(p)
  })

  // Validate before next step
  const validate = () => {
    if (step === 1) {
      if (!data.pickup_location.trim()) return 'Please enter pickup address'
      if (catId === 3 && !data.golf_course) return 'Please select a golf course'
      if (!data.date) return 'Please select a departure date'
      if (data.date) {
        const minDate = new Date(); minDate.setDate(minDate.getDate() + 3); minDate.setHours(0,0,0,0)
        if (new Date(data.date) < minDate) return 'Departure date must be at least 3 days from today'
      }
      if (!data.time) return 'Please select pickup time'
      if (!data.passengers || data.passengers < 1) return 'Passenger count must be at least 1'
      if (data.passengers > 45) return 'Groups over 45 passengers please contact hotline 0335 966 977 for special booking assistance'
      if (catId === 3) {
        const needed = data.passengers + (data.golf_bags || 0)
        const maxSeats = Math.max(...Object.values(pricesByModel).map(m => m.num_seats || 0), 0)
        if (maxSeats > 0 && needed > maxSeats) return `Total passengers (${data.passengers}) + golf bags (${data.golf_bags}) = ${needed} exceeds maximum capacity (${maxSeats} seats). Please contact hotline 0335 966 977.`
      }
    }
    if (step === 2) {
      if (!data.model_id) return 'Please select a vehicle'
    }
    if (step === 3) {
      if (!data.full_name.trim()) return 'Vui lòng nhập họ tên'
      if (!data.phone.trim()) return 'Please enter your phone number'
    }
    return ''
  }

  const handleNext = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setError('')
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const startTime = new Date(`${data.date}T${data.time}`).toISOString()

      const additional_data = {
        direction: data.direction,
        pickup_location: data.pickup_location,
        passengers: data.passengers,
        notes: data.notes,
        contact_name: data.full_name,
        contact_phone: data.phone,
      }
      if (catId === 1) {
        additional_data.terminal = data.terminal || 'international'
        if (data.flight_code) additional_data.flight_code = data.flight_code
      }
      // Tour: num_days is taken from product (handled by backend)
      if (catId === 3) {
        additional_data.golf_course = data.golf_course
        additional_data.golf_bags = data.golf_bags
      }

      // Step 1: Create booking
      const bookingRes = await api.post('/bookings', {
        product_id: parseInt(productId),
        model_id: data.model_id,
        start_time: startTime,
        additional_data,
      })
      const bookingId = bookingRes.data.data?.id

      if (!bookingId) throw new Error('Failed to get booking ID')

      // Step 2: Create VNPay payment URL (30% deposit)
      const payRes = await api.post('/payments/create-payment-url', { booking_id: bookingId })
      const paymentUrl = payRes.data.paymentUrl

      if (!paymentUrl) throw new Error('Failed to create payment link')

      setSuccess('Redirecting to VNPay payment gateway...')
      // Redirect to VNPay
      setTimeout(() => { window.loc