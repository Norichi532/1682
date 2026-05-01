// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import the User model

// [POST] Register a new account
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already in use!' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user in the database
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({ 
      message: 'Registration successful!', 
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [POST] Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Account does not exist!' });
    }

    // 2. Check password (compare input with hashed password in DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password!' });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      user: { 
        id: user.id, 
        full_name: user.full_name, 
        email: user.email, 
        role_id: user.role_id 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };