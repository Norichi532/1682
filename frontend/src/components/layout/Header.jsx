import { User, LogOut, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      <div className="text-sm text-gray-500 font-medium">
        Hệ thống Quản trị / <span className="text-gray-900">Admin</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">Nguyễn Văn Admin</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Quản lý cấp cao</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User size={20} />
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors ml-2">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;