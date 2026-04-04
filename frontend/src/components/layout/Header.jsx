import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
      <div className="flex items-center gap-6">
        
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-sm">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {user?.full_name || 'Admin'}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Role ID: {user?.role_id || 'N/A'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
          title="Đăng xuất"
        >
          <LogOut size={20} />
        </button>

      </div>
    </header>
  );
};

export default Header;