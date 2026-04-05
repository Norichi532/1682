import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar cố định bên trái */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header trên cùng */}
        <Header />
        
        {/* Nội dung thay đổi theo từng trang (Dashboard, Vehicles, v.v.) */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;