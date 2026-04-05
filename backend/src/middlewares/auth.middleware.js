const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Lấy token từ header Authorization (dạng: Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này!' });
  }

  try {
    // 2. Xác thực token bằng Secret Key trong .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Lưu thông tin user vào request để các hàm sau sử dụng
    req.user = decoded; 
    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

// Middleware phân quyền theo Role (Dựa trên role_id trong DB: 1-Admin, 2-Staff, 3-Driver, 4-Customer)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này!' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };