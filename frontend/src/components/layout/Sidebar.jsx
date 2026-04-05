import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Map, CalendarCheck } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Tổng quan", end: true },
    { to: "/dashboard/vehicles", icon: Car, label: "Quản lý Xe" },
    { to: "/dashboard/tours", icon: Map, label: "Quản lý Tour" },
    { to: "/dashboard/schedules", icon: CalendarCheck, label: "Xếp lịch" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 text-2xl font-bold text-blue-600 tracking-tight">
        PhuOngtravel
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            end={item.end}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 
              ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;