import React from 'react';
import { Bus, Map, CalendarCheck, TrendingUp, Users, Clock } from 'lucide-react';

// Mock data for UI before API integration
const statCards = [
  { title: 'Total Tours', value: '124', icon: Map, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%', isUp: true },
  { title: 'Available Vehicles', value: '38/45', icon: Bus, color: 'text-green-600', bg: 'bg-green-100', trend: '+5%', isUp: true },
  { title: 'This Week Schedule', value: '26', icon: CalendarCheck, color: 'text-orange-600', bg: 'bg-orange-100', trend: '-2%', isUp: false },
  { title: 'New Customers', value: '840', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+18%', isUp: true },
];

const recentTours = [
  { id: '#TR-2401', name: 'Da Nang - Hoi An 3D2N', date: '15/04/2026', status: 'In Progress', vehicle: '45 Seats' },
  { id: '#TR-2402', name: 'Nha Trang - Island Tour', date: '16/04/2026', status: 'Upcoming', vehicle: '29 Seats' },
  { id: '#TR-2403', name: 'Da Lat - Cloud Hunting', date: '18/04/2026', status: 'Upcoming', vehicle: '16 Seats' },
  { id: '#TR-2404', name: 'Sapa - Fansipan 2D1N', date: '10/04/2026', status: 'Completed', vehicle: '45 Seats' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Today's operational status of PhuOngtravel</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                {stat.trend}
                <TrendingUp className={`w-4 h-4 ${!stat.isUp && 'rotate-180'}`} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tour Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Tours</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Tour ID</th>
                  <th className="px-6 py-3 font-medium">Tour Name</th>
                  <th className="px-6 py-3 font-medium">Departure Date</th>
                  <th className="px-6 py-3 font-medium">Vehicle</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {recentTours.map((tour, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{tour.id}</td>
                    <td className="px-6 py-4 font-medium">{tour.name}</td>
                    <td className="px-6 py-4">{tour.date}</td>
                    <td className="px-6 py-4 text-gray-500">{tour.vehicle}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${tour.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                          tour.status === 'Upcoming' ? 'bg-orange-100 text-orange-700' : 
                          'bg-green-100 text-green-700'}`}
                      >
                        {tour.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">System Activity</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin updated 45-seat vehicle</p>
                <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <Map className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New tour created successfully</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Customer booked 5 tickets to Da Nang</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;