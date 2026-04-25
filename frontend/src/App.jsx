import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import VehicleManagement from './pages/Dashboard/Vehicles/VehicleManagement';
import TourManagement from './pages/Dashboard/Tour/TourManagement';

// NÂNG CẤP: Chuyển PrivateRoute thành ProtectedRoute có kiểm tra quyền
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Lấy thêm 'user' từ Redux để biết role_id của người dùng
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  
  const userRole = Number(user?.role_id);

  // Dùng biến userRole vào bên trong hàm includes
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("Bạn không có quyền truy cập vào chức năng này!");
    // Đá về trang chủ của dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Hợp lệ hoàn toàn -> Cho phép render Component con
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. PUBLIC ROUTES (Ai cũng vào được) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register - coming soon</div>} />

        {/* 2. PRIVATE ROUTES (Cấu trúc lồng nhau) */}
        <Route
          path="/dashboard"
          element={
            // Vòng bảo vệ 1: Phải đăng nhập mới được vào khu vực Dashboard
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          
          {/* Trang tổng quan: Đã vào được Dashboard là xem được */}
          <Route index element={<Dashboard />} />
          
          {/* Vòng bảo vệ 2: TRẠM KIỂM SOÁT ĐẶC BIỆT */}
          {/* Chỉ Admin (role_id: 1) và Staff (role_id: 2) mới được quản lý xe */}
          <Route 
            path="vehicles" 
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <VehicleManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Các trang khác chưa phân quyền nghiêm ngặt thì tạm để trống allowedRoles */}
          <Route 
            path="tours" 
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <TourManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="schedules"
          />
        </Route>

        {/* 3. TRANG CHỦ PUBLIC */}
        <Route path="/" element={<HomePage />} />
        
        {/* 4. TRANG 404 (Tùy chọn) */}
        <Route path="*" element={<div className="p-10 text-center">404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  );
}

export default App;