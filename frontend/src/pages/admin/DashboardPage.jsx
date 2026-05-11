import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import api from '../../services/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const fmt = (v) => new Intl.NumberFormat('en-GB').format(v) + ' VND'
const fmtShort = (v) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'tr'
  if (v >= 1_000) return (v / 1_000).toFixed(0) + 'k'
  return v
}

const STATUS_COLORS = {
  PENDING:     '#F59E0B',
  CONFIRMED:   '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  COMPLETED:   '#10B981',
  CANCELLED:   '#EF4444',
}
const STATUS_LABELS = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
}

const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']

function StatCard({ icon, title, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-navy mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

const CustomTooltipRevenue = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-navy mb-1">{label}</p>
        <p className="text-ochre font-bold">{fmt(payload[0].value)}</p>
        <p className="text-gray-400">{payload[1]?.value || 0} bookings</p>
      </div>
    )
  }
  return null
}

const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
        <p className="text-navy font-bold">{payload[0].value} bookings</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bookings').then(res => {
      setBookings(res.data.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  // ── Calculate stats ──────────────────────────────────────────────────────────
  const total     = bookings.length
  const pending   = bookings.filter(b => b.status === 'PENDING').length
  const completed = bookings.filter(b => b.status === 'COMPLETED').length
  const revenue   = bookings.filter(b => b.status === 'COMPLETED')
                            .reduce((s, b) => s + parseFloat(b.total_price || 0), 0)

  // ── Revenue and bookings by month (current year) ────────────────────────────
  const currentYear = new Date().getFullYear()
  const monthlyData = MONTHS.map((month, i) => {
    const inMonth = bookings.filter(b => {
      const d = new Date(b.created_at)
      return d.getFullYear() === currentYear && d.getMonth() === i
    })
    const rev = inMonth.filter(b => b.status === 'COMPLETED')
                       .reduce((s, b) => s + parseFloat(b.total_price || 0), 0)
    return { month, revenue: rev, orders: inMonth.length }
  })

  // ── Booking status breakdown (Pie chart) ────────────────────────────────────────
  const pieData = Object.entries(STATUS_LABELS).map(([key, name]) => ({
    name, value: bookings.filter(b => b.status === key).length,
    fill: STATUS_COLORS[key]
  })).filter(d => d.value > 0)

  // ── Recent bookings ─────────────────────────────────────────────────────────
  const recent = [...bookings].slice(0, 8)

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-navy/20 border-t-ochre rounded-full animate-spin" />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            color="bg-blue-50"
            title="Total bookings"
            value={total}
            sub="All statuses"
            icon={<svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
          />
          <StatCard
            color="bg-yellow-50"
            title="Pending"
            value={pending}
            sub="Need action"
            icon={<svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <StatCard
            color="bg-green-50"
            title="Completed"
            value={completed}
            sub={`Rate ${total ? Math.round(completed/total*100) : 0}%`}
            icon={<svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <StatCard
            color="bg-ochre/10"
            title="Revenue"
            value={fmt(revenue)}
            sub="From completed bookings"
            icon={<svg className="w-7 h-7 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
        </div>

        {/* ── Monthly revenue chart ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-display text-lg font-bold text-navy mb-6">
            Revenue & Bookings by Month ({currentYear})
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={fmtShort} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltipRevenue />} />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#C9A84C" radius={[6,6,0,0]} />
              <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#1B2A4A" radius={[6,6,0,0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 rounded-sm bg-ochre" /> Revenue
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 rounded-sm bg-navy opacity-70" /> Orders
            </div>
          </div>
        </div>

        {/* ── Pie chart + recent bookings table ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Booking status pie chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display text-lg font-bold text-navy mb-4">Booking Status Breakdown</h2>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data available</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      dataKey="value" paddingAngle={3}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                        <span className="text-gray-500">{d.name}</span>
                      </div>
                      <span className="font-semibold text-navy">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recent bookings table */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display text-lg font-bold text-navy mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {recent.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
              ) : recent.map(b => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-mist/40 transition">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {b.customer?.full_name?.charAt(0)?.toUpperCase() || 'K'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{b.customer?.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{b.product?.product_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-ochre">{fmt(b.total_price)}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: STATUS_COLORS[b.status] + '20', color: STATUS_COLORS[b.status] }}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
