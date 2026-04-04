import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // Đã import trang Tổng quan

// 1. Bạn cần Import bộ khung Layout vừa tạo vào đây
import AdminLayout from './components/layout/AdminLayout';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register - coming soon</div>} />

        {/* PRIVATE ROUTES (Cần đăng nhập) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {/* 2. Lắp AdminLayout vào thay cho dòng chữ cũ */}
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* 3. Các trang con bên dưới sẽ được nhét tự động vào cái lỗ <Outlet /> trong AdminLayout */}
          
          {/* ĐÃ SỬA: Thay thế dòng chữ tạm thời bằng giao diện Dashboard xịn */}
          <Route 
            index 
            element={<Dashboard />} 
          />
          
          <Route 
            path="vehicles" 
            element={<div className="text-2xl font-bold text-gray-800">🚗 Quản lý Xe (Đang phát triển...)</div>} 
          />
          <Route 
            path="tours" 
            element={<div className="text-2xl font-bold text-gray-800">🗺️ Quản lý Tour (Đang phát triển...)</div>} 
          />
          <Route 
            path="schedules" 
            element={<div className="text-2xl font-bold text-gray-800">📅 Xếp lịch điều phối (Đang phát triển...)</div>} 
          />
        </Route>

        {/* ROUTE MẶC ĐỊNH */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;