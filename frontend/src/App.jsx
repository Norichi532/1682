import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Auth/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register - coming soon</div>} />

        {/* 2. PRIVATE ROUTES (Cấu trúc lồng nhau) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Nội dung hiển thị vào Outlet của AdminLayout */}
          <Route index element={<Dashboard />} />
          
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
            element={<div className="text-2xl font-bold text-gray-800">📅 Xếp lịch (Đang phát triển...)</div>} 
          />
        </Route>

        {/* 3. MẶC ĐỊNH: Chuyển hướng về login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 4. TRANG 404 (Tùy chọn) */}
        <Route path="*" element={<div className="p-10 text-center">404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  );
}

export default App;