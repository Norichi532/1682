import { useState, useEffect } from 'react'
import AdminLayout from '../admin/AdminLayout'
import api from '../../services/api'

const STATUS_CONFIG = {
  PENDING:     { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  CONFIRMED:   { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800',   dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In Progress',    color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  COMPLETED:   { label: 'Complete',   color: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
  CANCELLED:   { label: 'Cancelled',       color: 'bg-red-100 text-red-800',     dot: 'bg-red-400' },
}

const DRIVER_NEXT_STATUS = {
  CONFIRMED:   { next: 'IN_PROGRESS', label: '🚗 Start Trip', color: 'bg-orange-500 hover:bg-orange-600 text-white' },
  IN_PROGRESS: { next: 'COMPLETED',   label: '✅ Complete trip', color: 'bg-green-600 hover:bg-green-700 text-white' },
}

function formatDateTime(dt) {
  return dt ? new Date(dt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—'
}

export default function SchedulePage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)

  useEffect(() => { fetchSchedule() }, [])

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const res = await api.get('/bookings/driver')
      setBookings(res.data.data || [])
    } catch { setError('Failed to load schedule') }
    finally { setLoading(false) }
  }

  const handleUpdateStatus = async () => {
    if (!confirmModal) return
    const { booking, nextStatus } = confirmModal
    setUpdating(booking.id)
    try {
      await api.patch(`/bookings/${booking.id}/driver-status`, { status: nextStatus })
      setConfirmModal(null)
      fetchSchedule()
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed')
      setConfirmModal(null)
    } finally { setUpdating(null) }
  }

  const today = new Date().toDateString()
  const activeBookings   = bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))
  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.start_time) > new Date() && new Date(b.start_time).toDateString() !== today)
  const doneBookings     = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status))

  const BookingCard = ({ b }) => {
    const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING
    const nextAction = DRIVER_NEXT_STATUS[b.status]
    const isUpdating = updating === b.id

    return (
      <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${b.status === 'IN_PROGRESS' ? 'border-orange-500' : b.status === 'CONFIRMED' ? 'border-blue-500' : 'border-gray-200'} overflow-hidden`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-mono mb-1">#{b.id?.slice(0, 8).toUpperCase()}</p>
              <h3 className="font-bold text-gray-900 text-base">{b.product?.product_name}</h3>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}/>
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">📅 Pickup time</p>
              <p className="text-sm font-semibold text-gray-800">{formatDateTime(b.start_time)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">🚌 Assigned vehicle</p>
              <p className="text-sm font-semibold text-gray-800">{b.assigned_car?.license_plate || '—'}</p>
              <p className="text-xs text-gray-400">{b.assigned_car?.color}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">👤 Customer</p>
              <p className="text-sm font-semibold text-gray-800">{b.customer?.full_name}</p>
              <a href={`tel:${b.customer?.phone}`} className="text-xs text-blue-600 hover:underline">{b.customer?.phone}</a>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">🚗 Vehicle type</p>
              <p className="text-sm font-semibold text-gray-800">{b.car_model?.model_name}</p>
              <p className="text-xs text-gray-400">{b.car_model?.num_seats} seats</p>
            </div>
          </div>

          {b.additional_data && Object.keys(b.additional_data).length > 0 && (
            <div className="bg-blue-50 rounded-xl p-3 mb-4 space-y-1">
              {b.additional_data.flight_code && <p className="text-sm text-gray-700">✈️ <span className="font-medium">Flight code:</span> {b.additional_data.flight_code}</p>}
              {b.additional_data.golf_bags && <p className="text-sm text-gray-700">⛳ <span className="font-medium">Golf bags:</span> {b.additional_data.golf_bags}</p>}
              {b.additional_data.passengers && <p className="text-sm text-gray-700">👥 <span className="font-medium">Passengers:</span> {b.additional_data.passengers}</p>}
            </div>
          )}

          {b.notes && (
            <div className="bg-yellow-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">📝 Notes</p>
              <p className="text-sm text-gray-700">{b.notes}</p>
            </div>
          )}

          {nextAction && (
            <button disabled={isUpdating}
              onClick={() => setConfirmModal({ booking: b, nextStatus: nextAction.next, label: nextAction.label })}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition ${nextAction.color} ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {isUpdating ? 'Updating...' : nextAction.label}
            </button>
          )}
          {b.status === 'COMPLETED' && (
            <div className="text-center py-2 text-sm text-green-600 font-semibold">✅ Trip completed</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <AdminLayout title="My Schedule">
      <div className="max-w-3xl mx-auto space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-700">✕</button>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
            <p className="text-gray-400 text-sm">Loading schedule...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">🗓️</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No trips assigned</h2>
            <p className="text-gray-400 text-sm">Admin will assign trips to you when new bookings arrive</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total trips',    value: bookings.length,                                           color: 'text-blue-600' },
                { label: 'Active',         value: activeBookings.length,                                     color: 'text-orange-600' },
                { label: 'Complete',     value: doneBookings.filter(b => b.status === 'COMPLETED').length, color: 'text-green-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {activeBookings.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">🔴 In Progress</h2>
                <div className="space-y-4">{activeBookings.map(b => <BookingCard key={b.id} b={b} />)}</div>
              </div>
            )}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">📋 Upcoming</h2>
                <div className="space-y-4">{upcomingBookings.map(b => <BookingCard key={b.id} b={b} />)}</div>
              </div>
            )}
            {doneBookings.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">✅ Completed</h2>
                <div className="space-y-4">{doneBookings.map(b => <BookingCard key={b.id} b={b} />)}</div>
              </div>
            )}
          </>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">{confirmModal.nextStatus === 'IN_PROGRESS' ? '🚗' : '✅'}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirmModal.nextStatus === 'IN_PROGRESS' ? 'Start Trip?' : 'Complete trip?'}
              </h3>
              <p className="text-sm text-gray-500">
                {confirmModal.nextStatus === 'IN_PROGRESS'
                  ? 'Confirm you are starting this trip.'
                  : 'Confirm the trip is complete. The customer will be notified.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm">Cancel</button>
              <button onClick={handleUpdateStatus}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition ${confirmModal.nextStatus === 'IN_PROGRESS' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
