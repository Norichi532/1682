const User = require('../user/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Thêm role_id vào destructuring
    const { email, password, full_name, phone, role_id } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Gọi hàm create với role_id
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      full_name,
      phone,
      role_id: role_id || 4, // Nếu không gửi role_id, mặc định gán = 4 (Customer)
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      user,
    });
  } catch (error) {
    console.error('Lỗi chi tiết từ DB:', error); // Sửa lại log để dễ nhìn hơn
    res.status(500).json({ message: 'Lỗi server' });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra đầu vào
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu!' });
    }

    // 2. Tìm user trong database (Dùng lại hàm findByEmail đã viết)
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // 3. So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // 4. Tạo JWT Token
    // SỬA Ở ĐÂY: Đổi role thành role_id
    const payload = {
      id: user.id,
      role_id: user.role_id 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // 5. Trả về kết quả
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id // SỬA Ở ĐÂY: Đổi role thành role_id
      }
    });

  } catch (error) {
    console.error('Lỗi Login:', error);
    res.status(500).json({ message: 'Lỗi server nội bộ' });
  }
};