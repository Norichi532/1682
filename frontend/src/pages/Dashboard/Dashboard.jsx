import { Bus, Map as MapIcon, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Tổng số Tour', value: '124', icon: MapIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Xe sẵn sàng', value: '38/45', icon: Bus, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Khách hàng', value: '840', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Tăng trưởng', value: '+18%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-2">Dưới đây là tình hình hoạt động của PhuOngtravel hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}>
              <item.icon className={item.color} size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center py-20">
        <p className="text-gray-400 italic">Biểu đồ thống kê chi tiết đang được phát triển...</p>
      </div>
    </div>
  );
};

export default Dashboard;