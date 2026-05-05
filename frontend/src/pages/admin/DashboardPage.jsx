import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import api from '../../services/api'

export default function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings')
        const allBookings = res.data.data || []
        setBookings(allBookings)

        // Calculate stats
        const pending = allBookings.filter(b => b.status === 'PENDING').length
        const inProgress = allBookings.filter(b => b.status === 'IN_PROGRESS').length
        const completed = allBookings.filter(b => b.status === 'COMPLETED').length

        setStats({
          total: allBookings.length,
          pending,
          inProgress,
          completed,
        })
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
        setError('Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const getStatusBadgeColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-orange-100 text-orange-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'IN_PROGRESS': 'Đang thực hiện',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
    }
    return labels[status] || status
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Tổng đơn"
              value={stats.total}
              color="bg-blue-100"
            />
            <StatCard
              icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Chờ xác nhận"
              value={stats.pending}
              color="bg-yellow-100"
            />
            <StatCard
              icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Đang thực hiện"
              value={stats.inProgress}
              color="bg-orange-100"
            />
            <StatCard
              icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Hoàn thành"
              value={stats.completed}
              color="bg-green-100"
            />
          </div>
        )}

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Đơn gần nhất</h2>
          </div>

          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              Chưa có đơn đặt xe nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Khách</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dịch vụ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày đặt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.slice(0, 10).map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.customer?.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.product?.product_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.created_at)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">{formatCurrency(booking.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
