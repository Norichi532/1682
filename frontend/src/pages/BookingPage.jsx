import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Lịch trình' },
  { id: 2, label: 'Phương tiện' },
  { id: 3, label: 'Xác nhận' },
  { id: 4, label: 'Thanh toán' },
]

const GOLF_COURSES = [
  'BRG Da Nang Golf Resort',
  'Montgomerie Links Da Nang',
  'Ba Na Hills Golf Club',
  'Danang Golf Club',
  'Laguna Golf Lang Co',
]

const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + ' đ'
const fmtDT = (date, time) => {
  if (!date) return ''
  return new Date(`${date}T${time || '00:00'}`).toLocaleString('vi-VN', {
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

  const pickupLabel = catId === 1
    ? (data.direction === 'from_airport' ? 'Sân bay Đà Nẵng' : data.pickup_location)
    : data.pickup_location

  return (
    <div className="bg-navy rounded-2xl p-6 text-white sticky top-20">
      <h3 className="text-ochre font-semibold text-xs uppercase tracking-widest mb-5">Tóm tắt đặt xe</h3>
      <div className="space-y-4">

        <SummaryRow icon={icon} label="Dịch vụ" value={product?.product_name} always />

        {pickupLabel && (
          <SummaryRow icon="📍" label="Đón tại" value={pickupLabel} />
        )}
        {catId === 3 && data.golf_course && (
          <SummaryRow icon="⛳" label="Sân golf" value={data.golf_course} />
        )}
        {data.date && (
          <SummaryRow icon="📅" label="Thời gian" value={fmtDT(data.date, data.time)} />
        )}
        {step >= 2 && data.model_name && (
          <SummaryRow icon="🚌" label="Phương tiện" value={data.model_name} />
        )}

        {step >= 2 && data.price > 0 && (
          <div className="pt-4 mt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Tạm tính</span>
              <span className="text-ochre font-bold text-xl">{fmt(data.price)}</span>
            </div>
            <p className="text-white/30 text-xs mt-1">Giá cuối sẽ được xác nhận sau</p>
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

// ─── Step 1: Lịch trình ───────────────────────────────────────────────────────
function Step1Schedule({ catId, data, onChange, error }) {
  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none transition text-navy font-body text-sm"

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Lịch trình & Địa điểm</h2>

      {/* Airport: chiều đi selector */}
      {catId === 1 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Chiều đi</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'from_airport', label: '✈ Sân bay → Khách sạn' },
              { value: 'to_airport',   label: '🏨 Khách sạn → Sân bay' },
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

      {/* Golf: chiều đi selector */}
      {catId === 3 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-2">Chiều đi</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'to_golf',   label: '🏌 Khách sạn → Sân golf' },
              { value: 'from_golf', label: '🔄 Sân golf → Khách sạn' },
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

      {/* Địa chỉ khách sạn — Airport & Golf & Tour */}
      {catId === 1 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            {data.direction === 'from_airport' ? 'Địa chỉ khách sạn (điểm trả)' : 'Địa chỉ khách sạn (điểm đón)'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ochre">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <input type="text" value={data.pickup_location} onChange={e => onChange('pickup_location', e.target.value)}
              placeholder="Tên khách sạn hoặc địa chỉ..." className={inp + ' pl-10'} />
          </div>
        </div>
      )}

      {catId === 2 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Địa chỉ đón <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ochre">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <input type="text" value={data.pickup_location} onChange={e => onChange('pickup_location', e.target.value)}
              placeholder="Khách sạn, địa chỉ nơi ở..." className={inp + ' pl-10'} />
          </div>
        </div>
      )}

      {catId === 3 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Địa chỉ khách sạn <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ochre">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <input type="text" value={data.pickup_location} onChange={e => onChange('pickup_location', e.target.value)}
              placeholder="Tên khách sạn hoặc địa chỉ..." className={inp + ' pl-10'} />
          </div>
        </div>
      )}

      {/* Golf course selector */}
      {catId === 3 && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Chọn sân golf <span className="text-red-500">*</span></label>
          <select value={data.golf_course} onChange={e => onChange('golf_course', e.target.value)} className={inp}>
            <option value="">-- Chọn sân golf --</option>
            {GOLF_COURSES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      )}

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Ngày đi <span className="text-red-500">*</span></label>
          <input type="date" value={data.date} onChange={e => onChange('date', e.target.value)}
            min={(() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().split('T')[0] })()} className={inp} />
          <p className="text-xs text-gray-400 mt-1">Vui lòng đặt trước ít nhất 3 ngày</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Giờ đón <span className="text-red-500">*</span></label>
          <input type="time" value={data.time} onChange={e => onChange('time', e.target.value)} className={inp} />
        </div>
      </div>

      {/* Passengers + Days (tour) / Golf bags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Số hành khách</label>
          <input type="number" min="1" max="45" value={data.passengers}
            onChange={e => onChange('passengers', parseInt(e.target.value))} className={inp} />
        </div>
        {catId === 2 && (
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Số ngày</label>
            <input type="number" min="1" max="30" value={data.days}
              onChange={e => onChange('days', parseInt(e.target.value))} className={inp} />
          </div>
        )}
        {catId === 3 && (
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Số túi golf</label>
            <input type="number" min="0" max="20" value={data.golf_bags}
              onChange={e => onChange('golf_bags', parseInt(e.target.value))} className={inp} />
          </div>
        )}
      </div>

      {/* Flight code — airport chiều đến */}
      {catId === 1 && data.direction === 'from_airport' && (
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Mã chuyến bay</label>
          <input type="text" value={data.flight_code} onChange={e => onChange('flight_code', e.target.value)}
            placeholder="VD: VN123, QH456" className={inp} />
          <p className="text-xs text-gray-400 mt-1">Nhập để chúng tôi theo dõi giờ hạ cánh thực tế</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Ghi chú</label>
        <textarea value={data.notes} onChange={e => onChange('notes', e.target.value)}
          rows={3} placeholder="Yêu cầu đặc biệt, điểm dừng thêm..."
          className={inp + ' resize-none'} />
      </div>

      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

// ─── Step 2: Phương tiện ──────────────────────────────────────────────────────
function Step2Vehicle({ pricesByModel, data, onChange, error }) {
  const models = Object.values(pricesByModel)

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Chọn phương tiện</h2>
      <p className="text-gray-500 text-sm">Chọn dòng xe phù hợp với đoàn của bạn</p>

      <div className="space-y-3">
        {models.map(model => {
          const price = model.prices[0]?.price || 0
          const selected = data.model_id === model.id
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => { onChange('model_id', model.id); onChange('model_name', model.model_name); onChange('price', price) }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                selected ? 'border-ochre bg-ochre/5' : 'border-gray-100 hover:border-gray-200 bg-white'
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
                <p className={`font-bold text-base ${selected ? 'text-navy' : 'text-gray-800'}`}>{model.model_name}</p>
                <p className="text-gray-500 text-sm">{model.num_seats} hành khách</p>
                {Array.isArray(model.features) && model.features.length > 0 && (
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{model.features.slice(0,3).join(' · ')}</p>
                )}
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-lg ${selected ? 'text-ochre' : 'text-ochre'}`}>{fmt(price)}</p>
                <p className="text-gray-400 text-xs">/chuyến</p>
              </div>

              {/* Selected indicator */}
              {selected && (
                <div className="w-6 h-6 rounded-full bg-ochre flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

// ─── Step 3: Xác nhận ─────────────────────────────────────────────────────────
function Step3Confirm({ product, data, onChange, error }) {
  const catId = product?.category?.id
  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none transition text-navy font-body text-sm"
  const readOnly = "w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 text-sm font-body"

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Thông tin liên hệ</h2>

      {/* Contact info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Họ tên <span className="text-red-500">*</span></label>
          <input type="text" value={data.full_name} onChange={e => onChange('full_name', e.target.value)} placeholder="Nguyễn Văn A" className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
          <input type="tel" value={data.phone} onChange={e => onChange('phone', e.target.value)} placeholder="0901234567" className={inp} />
        </div>
      </div>

      {/* Booking summary review */}
      <div className="mt-4 p-5 bg-mist/50 rounded-2xl border border-gray-100 space-y-3">
        <h3 className="font-semibold text-navy text-sm mb-3">Kiểm tra lại thông tin</h3>
        <InfoRow label="Dịch vụ" value={product?.product_name} />
        <InfoRow label="Điểm đón" value={
          catId === 1 && data.direction === 'from_airport' ? 'Sân bay Đà Nẵng' : data.pickup_location
        } />
        {catId === 1 && data.direction === 'from_airport' && data.pickup_location && (
          <InfoRow label="Điểm trả" value={data.pickup_location} />
        )}
        {catId === 3 && data.golf_course && <InfoRow label="Sân golf" value={data.golf_course} />}
        <InfoRow label="Thời gian" value={fmtDT(data.date, data.time)} />
        <InfoRow label="Phương tiện" value={`${data.model_name} (${data.passengers} khách)`} />
        {catId === 3 && data.golf_bags > 0 && <InfoRow label="Túi golf" value={`${data.golf_bags} túi`} />}
        {catId === 2 && <InfoRow label="Số ngày" value={`${data.days} ngày`} />}
        {catId === 1 && data.flight_code && <InfoRow label="Chuyến bay" value={data.flight_code} />}
        {data.notes && <InfoRow label="Ghi chú" value={data.notes} />}
        <div className="pt-3 border-t border-gray-200 flex justify-between">
          <span className="text-gray-500 text-sm">Tổng tiền</span>
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

// ─── Step 4: Thanh toán ───────────────────────────────────────────────────────
function Step4Payment({ data, submitting, onSubmit, error, success }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-navy">Phương thức thanh toán</h2>

      {/* COD option */}
      <div className="border-2 border-ochre bg-ochre/5 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-ochre/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-navy">Thanh toán khi đến nơi (COD)</p>
          <p className="text-gray-500 text-sm mt-0.5">Thanh toán trực tiếp cho tài xế sau khi hoàn thành chuyến đi</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-ochre flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>

      {/* Final price */}
      <div className="p-5 bg-mist/50 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Tổng thanh toán</span>
          <span className="font-display text-3xl font-bold text-ochre">{fmt(data.price)}</span>
        </div>
        <p className="text-gray-400 text-xs mt-2">Giá đã bao gồm thuế và phí phát sinh. Thanh toán bằng tiền mặt.</p>
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
        className="w-full py-4 bg-ochre hover:bg-ochre-light disabled:bg-ochre/50 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Đang xử lý...</>
        ) : '✓ Xác nhận đặt xe'}
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
      .then(res => setProduct(res.data.data))
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
      if (!data.pickup_location.trim()) return 'Vui lòng nhập địa chỉ đón'
      if (catId === 3 && !data.golf_course) return 'Vui lòng chọn sân golf'
      if (!data.date) return 'Vui lòng chọn ngày đi'
      if (data.date) {
        const minDate = new Date(); minDate.setDate(minDate.getDate() + 3); minDate.setHours(0,0,0,0)
        if (new Date(data.date) < minDate) return 'Ngày đi phải cách hôm nay ít nhất 3 ngày'
      }
      if (!data.time) return 'Vui lòng chọn giờ đón'
    }
    if (step === 2) {
      if (!data.model_id) return 'Vui lòng chọn phương tiện'
    }
    if (step === 3) {
      if (!data.full_name.trim()) return 'Vui lòng nhập họ tên'
      if (!data.phone.trim()) return 'Vui lòng nhập số điện thoại'
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
        if (data.flight_code) additional_data.flight_code = data.flight_code
      }
      if (catId === 2) {
        additional_data.days = data.days
      }
      if (catId === 3) {
        additional_data.golf_course = data.golf_course
        additional_data.golf_bags = data.golf_bags
      }

      await api.post('/bookings', {
        product_id: parseInt(productId),
        model_id: data.model_id,
        start_time: startTime,
        additional_data,
      })

      setSuccess('Đặt xe thành công! Chúng tôi sẽ liên hệ xác nhận sớm.')
      setTimeout(() => navigate('/my-orders'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt xe thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-navy/20 border-t-ochre rounded-full animate-spin" />
      </div>
    </PublicLayout>
  )

  if (!product) return (
    <PublicLayout>
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">Không tìm thấy dịch vụ.</p>
        <button onClick={() => navigate('/services')} className="px-6 py-2.5 bg-navy text-white rounded-xl">Quay lại</button>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-navy py-10 px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Đặt xe</h1>
        <p className="text-white/50 text-sm">Điền thông tin để đặt xe du lịch</p>
      </div>

      <div className="bg-mist/30 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <ProgressBar step={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                {step === 1 && <Step1Schedule catId={catId} data={data} onChange={onChange} error={error} />}
                {step === 2 && <Step2Vehicle pricesByModel={pricesByModel} data={data} onChange={onChange} error={error} />}
                {step === 3 && <Step3Confirm product={product} data={data} onChange={onChange} error={error} />}
                {step === 4 && <Step4Payment data={data} submitting={submitting} onSubmit={handleSubmit} error={error} success={success} />}

                {/* Navigation */}
                {step < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    <button onClick={step === 1 ? () => navigate(`/services/${productId}`) : handleBack}
                      className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-navy transition font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                      Quay lại
                    </button>
                    <button onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-2.5 bg-navy hover:bg-navy-light text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                      Tiếp theo
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                )}

                {step === 4 && !success && (
                  <button onClick={handleBack}
                    className="flex items-center gap-2 mt-4 text-gray-400 hover:text-navy transition text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    Quay lại chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BookingSummary product={product} data={data} step={step} />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
