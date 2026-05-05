import { useState, useEffect, useMemo } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import AdminLayout from './AdminLayout'
import api from '../../services/api'

dayjs.locale('vi')
const localizer = dayjsLocalizer(dayjs)

const STATUS_COLORS = {
  PENDING:     { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  CONFIRMED:   { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  IN_PROGRESS: { bg: '#EDE9FE', border: '#8B5CF6', text: '#5B21B6' },
  COMPLETED:   { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
  CANCELLED:   { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
}
const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang thực hiện', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
}

const MESSAGES = {
  today: 'Hôm nay', previous: '‹', next: '›',
  month: 'Tháng', week: 'Tuần', day: 'Ngày', agenda: 'Lịch',
  date: 'Ngày', time: 'Giờ', event: 'Sự kiện',
  noEventsInRange: 'Không có chuyến xe nào trong khoảng này.',
  showMore: total => `+${total} chuyến nữa`,
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    api.get('/bookings').then(res => {
      setBookings(res.data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  // Chuyển booking thành events cho calendar
  const events = useMemo(() => bookings
    .filter(b => b.start_time && b.status !== 'CANCELLED')
    .map(b => {
      const start = new Date(b.start_time)
      const end   = b.end_time ? new Date(b.end_time) : new Date(start.getTime() + 3 * 60 * 60 * 1000)
      const plate = b.assigned_car?.license_plate || (b.additional_data?.external_car?.license_plate) || '—'
      const driver = b.assigned_driver?.full_name || b.additional_data?.external_car?.driver_name || 'Chưa gán'
      return {
        id: b.id,
        title: `🚗 ${plate} · ${driver}`,
        start, end,
        status: b.status,
        booking: b,
      }
    }), [bookings])

  const eventStyleGetter = (event) => {
    const c = STATUS_COLORS[event.status] || STATUS_COLORS.PENDING
    return {
      style: {
        backgroundColor: c.bg,
        borderLeft: `4px solid ${c.border}`,
        color: c.text,
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        padding: '2px 6px',
        boxShadow: 'none',
      }
    }
  }

  const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + ' đ'
  const fmtDT = (d) => d ? dayjs(d).format('HH:mm DD/MM/YYYY') : '—'

  return (
    <AdminLayout title="Lịch điều phối xe">
      <div className="space-y-4">

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-semibold text-navy mr-2">Trạng thái:</span>
          {Object.entries(STATUS_LABELS).filter(([k]) => k !== 'CANCELLED').map(([key, label]) => {
            const c = STATUS_COLORS[key]
            return (
              <div key={key} className="flex items-center gap-1.5 text-sm">
                <div className="w-3 h-3 rounded-sm border-l-4" style={{ background: c.bg, borderColor: c.border }} />
                <span style={{ color: c.text }} className="font-medium">{label}</span>
              </div>
            )
          })}
          <div className="ml-auto text-xs text-gray-400">
            Tổng: <span className="font-semibold text-navy">{events.length} chuyến</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4" style={{ height: 680 }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-navy/20 border-t-ochre rounded-full animate-spin" />
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              messages={MESSAGES}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={e => setSelected(e.booking)}
              popup
              style={{ height: '100%' }}
            />
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-navy">Chi tiết chuyến xe</h2>
                <p className="text-xs text-gray-400 mt-0.5">#{selected.id?.slice(0, 8)}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Trạng thái</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: STATUS_COLORS[selected.status]?.bg,
                    color: STATUS_COLORS[selected.status]?.text,
                    border: `1px solid ${STATUS_COLORS[selected.status]?.border}`
                  }}>
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Khách hàng */}
              <Row label="Khách hàng" value={selected.customer?.full_name} />
              <Row label="SĐT" value={selected.customer?.phone} />
              <Row label="Dịch vụ" value={selected.product?.product_name} />
              <Row label="Giờ đón" value={fmtDT(selected.start_time)} />
              <Row label="Giờ kết thúc" value={fmtDT(selected.end_time)} />

              <div className="h-px bg-gray-100" />

              {/* Xe & Tài xế */}
              {selected.assigned_car ? (
                <>
                  <Row label="Biển số" value={selected.assigned_car.license_plate} />
                  <Row label="Tài xế" value={selected.assigned_driver?.full_name} />
                  <Row label="SĐT tài xế" value={selected.assigned_driver?.phone} />
                </>
              ) : selected.additional_data?.external_car ? (
                <>
                  <Row label="Xe ngoài" value={selected.additional_data.external_car.license_plate} />
                  <Row label="Tài xế" value={selected.additional_data.external_car.driver_name} />
                  <Row label="Đơn vị" value={selected.additional_data.external_car.vendor} />
                </>
              ) : (
                <p className="text-gray-400 italic text-xs">Chưa gán xe & tài xế</p>
              )}

              <div className="h-px bg-gray-100" />
              <Row label="Tổng tiền" value={fmt(selected.total_price)} highlight />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

function Row({ label, value, highlight }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-400 flex-shrink-0">{label}</span>
      <span className={`font-semibold text-right ${highlight ? 'text-ochre text-base' : 'text-navy'}`}>{value}</span>
    </div>
  )
}
