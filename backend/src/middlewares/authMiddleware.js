// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware 1: Kiểm tra xem user có vé (Token) hợp lệ không
const verifyToken = (req, res, next) => {
  // Lấy token từ header của request (Định dạng: Bearer <token>)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Giải mã token bằng chìa khóa bí mật
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gắn thông tin user (id, role_id) vào request để các Controller phía sau có thể dùng
    req.user = decoded; 
    
    // Cho phép đi tiếp vào Controller
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware 2: Kiểm tra quyền (Role) - Ví dụ: Chỉ Admin (1) mới được qua
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    // req.user đã được gán từ hàm verifyToken ở trên
    if (!req.user || !allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };