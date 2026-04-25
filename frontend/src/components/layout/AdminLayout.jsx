import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Tổng quan', end: true },
  { to: '/dashboard/vehicles', label: 'Xe' },
  { to: '/dashboard/tours', label: 'Tour' },
  { to: '/dashboard/schedules', label: 'Lịch' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <span className="font-bold text-blue-700 text-lg">Phương Tourist</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t text-xs text-gray-500">
          <p className="truncate">{user?.full_name || user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full text-left text-red-500 hover:text-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
