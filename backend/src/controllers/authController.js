// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const querystring = require('querystring');
const { Op } = require('sequelize');
const { User } = require('../models');
const { sendNewPassword, sendWelcomeEmail } = require('../utils/mailer');

// ── Google OAuth helpers ────────────────────────────────────────────────────
function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = querystring.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname, path: urlObj.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)) } catch(e) { reject(e) } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsGet(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname, path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)) } catch(e) { reject(e) } });
    });
    req.on('error', reject);
    req.end();
  });
}

// [GET] GOOGLE REDIRECT — chuyển user sang trang đăng nhập Google
const googleAuth = (req, res) => {
  const params = querystring.stringify({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  process.env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

// [GET] GOOGLE CALLBACK — nhận code, đổi token, tìm/tạo user, trả JWT
const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);

    // 1. Đổi code lấy access_token
    const tokenData = await httpsPost('https://oauth2.googleapis.com/token', {
      code,
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:  process.env.GOOGLE_CALLBACK_URL,
      grant_type:    'authorization_code',
    });
    if (tokenData.error) return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);

    // 2. Lấy thông tin user từ Google
    const profile = await httpsGet('https://www.googleapis.com/oauth2/v2/userinfo', tokenData.access_token);
    if (!profile.email) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`);

    // 3. Tìm hoặc tạo user
    let isNewUser = false;
    let user = await User.findOne({ where: { email: profile.email } });
    if (!user) {
      user = await User.create({
        full_name:  profile.name || profile.email.split('@')[0],
        email:      profile.email,
        avatar_url: profile.picture || null,
        google_id:  profile.id,
        role_id:    2,
        password:   null,  // tài khoản Google không có password
      });
      isNewUser = true;
    } else if (!user.google_id) {
      // Tài khoản email đã tồn tại → liên kết Google
      await user.update({ google_id: profile.id, avatar_url: user.avatar_url || profile.picture });
    }

    if (user.is_active === false) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=account_disabled`);
    }

    // Gửi email chào mừng nếu tài khoản mới
    if (isNewUser) {
      sendWelcomeEmail(user.email, user.full_name).catch(err =>
        console.error('Google welcome email error:', err.message)
      );
    }

    // 4. Tạo JWT và redirect về frontend
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userData = encodeURIComponent(JSON.stringify({
      id: user.id, full_name: user.full_name, email: user.email,
      role_id: user.role_id, phone: user.phone, avatar_url: user.avatar_url,
      is_google: !!user.google_id   // flag để frontend biết user dùng Google
    }));
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&user=${userData}`);
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// [POST] REGISTER
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid @gmail.com address!' });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters and include a letter, number, and special character!'
      });
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits and start with 0!' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use!' });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number is already in use!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      full_name, email, password: hashedPassword, phone, role_id: 2
    });

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(email, full_name).catch(err =>
      console.error('Welcome email failed:', err.message)
    );

    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name, role_id: newUser.role_id }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// [POST] LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password!' });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        phone: user.phone,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// [GET] GET ME
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'full_name', 'email', 'phone', 'avatar_url', 'role_id', 'created_at']
    });
    if (!user) return res.status(404).json({ message: 'User not found!' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [PATCH] UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body;
    const userId = req.user.id;

    if (!full_name && !phone) {
      return res.status(400).json({ message: 'At least one field is required.' });
    }

    if (phone) {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone must be 10 digits starting with 0!' });
      }
      const existingPhone = await User.findOne({ where: { phone, id: { [Op.ne]: userId } } });
      if (existingPhone) {
        return res.status(400).json({ message: 'Phone number is already in use!' });
      }
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: { id: user.id, full_name: user.full_name, email: user.email, phone: user.phone, role_id: user.role_id }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during profile update', error: error.message });
  }
};

// [PATCH] CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both oldPassword and newPassword are required.' });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters and include a letter, number, and special character!'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect!' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during password change', error: error.message });
  }
};

// [POST] FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums  = '0123456789';
    const specs = '!@#$%^&*';
    const all   = chars + chars.toUpperCase() + nums + specs;
    let newPass =
      chars[Math.floor(Math.random() * chars.length)] +
      chars.toUpperCase()[Math.floor(Math.random() * chars.length)] +
      nums[Math.floor(Math.random() * nums.length)] +
      specs[Math.floor(Math.random() * specs.length)];
    for (let i = 0; i < 4; i++) {
      newPass += all[Math.floor(Math.random() * all.length)];
    }
    newPass = newPass.split('').sort(() => Math.random() - 0.5).join('');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);
    await user.save();

    await sendNewPassword(email, newPass);

    res.status(200).json({ message: 'A new password has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during forgot password', error: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, forgotPassword, googleAuth, googleCallback };
