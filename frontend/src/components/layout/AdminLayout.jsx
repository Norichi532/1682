import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar nằm cố định bên trái */}
      <Sidebar />
      
      {/* Khu vực nội dung chính nằm bên phải */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header nằm trên cùng của khu vực nội dung */}
        <Header />
        
        {/* Main Content Area (Nơi chứa các trang Dashboard, Vehicles, Tours...) */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;