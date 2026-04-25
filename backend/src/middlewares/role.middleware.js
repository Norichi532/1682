const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Chưa xác thực' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
  }
  next();
};

module.exports = authorize;
