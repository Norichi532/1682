import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Map, CalendarCheck } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 tracking-tight">
          PhuOngtravel
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <LayoutDashboard size={20} />
          <span>Tổng quan</span>
        </NavLink>

        <NavLink 
          to="/dashboard/vehicles" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <Car size={20} />
          <span>Quản lý Xe</span>
        </NavLink>

        <NavLink 
          to="/dashboard/tours" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <Map size={20} />
          <span>Quản lý Tour</span>
        </NavLink>

        <NavLink 
          to="/dashboard/schedules" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <CalendarCheck size={20} />
          <span>Xếp lịch</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;