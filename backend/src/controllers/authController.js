// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// [POST] Register a new user
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // ==========================================
    // 1. DATA VALIDATION (KIỂM TRA ĐẦU VÀO)
    // ==========================================

    // 1.1 Kiểm tra Email phải có đuôi @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid @gmail.com address!' });
    }

    // 1.2 Kiểm tra Password: Ít nhất 6 ký tự, gồm chữ, số và ký tự đặc biệt
    // (?=.*[a-zA-Z]) : Phải có ít nhất 1 chữ cái
    // (?=.*\d)       : Phải có ít nhất 1 chữ số
    // (?=.*[\W_])    : Phải có ít nhất 1 ký tự đặc biệt
    // .{6,}          : Độ dài tối thiểu là 6
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long and include a letter, a number, and a special character!' 
      });
    }

    // ==========================================
    // 2. DATABASE CHECKS (KIỂM TRA TRÙNG LẶP)
    // ==========================================

    // 2.1 Kiểm tra Email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use!' });
    }

    // 2.2 Kiểm tra Số điện thoại đã tồn tại chưa (nếu người dùng có nhập phone)
    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({ message: 'Phone number is already in use!' });
      }
    }

    // ==========================================
    // 3. XỬ LÝ LƯU DỮ LIỆU
    // ==========================================

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu User mới vào Database
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({ 
      message: 'User registered successfully!', 
      user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// [POST] Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // 2. Compare entered password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password!' });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      user: { id: user.id, full_name: user.full_name, email: user.email, role_id: user.role_id } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = { register, login };