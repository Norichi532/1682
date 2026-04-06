import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 1. IN RA ĐỂ BẮT BỆNH: Bạn hãy F12 mở tab Console xem dòng này in ra gì nhé!
  console.log("Thông tin User từ Redux:", user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. SỬA LẠI ĐIỀU KIỆN CHỖ NÀY:
  // - Thêm Number() để ép kiểu dữ liệu thành số (đề phòng backend trả về chuỗi "1")
  // - Thêm user?.role_id để an toàn
  const userRole = Number(user?.role_id); 

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("Bạn không có quyền truy cập vào chức năng này!");
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu bạn dùng children (trong file App.jsx) thì return children, 
  // nếu dùng Outlet (bọc Component ngoài Routes) thì return <Outlet />
  return children ? children : <Outlet />; 
};

export default ProtectedRoute;