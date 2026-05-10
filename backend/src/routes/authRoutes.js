// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, password, phone]
 *             properties:
 *               full_name: { type: string, example: Nguyen Van A }
 *               email: { type: string, example: vana@gmail.com }
 *               password: { type: string, example: "Pass@123" }
 *               phone: { type: string, example: "0901234567" }
 *     responses:
 *       201: { description: Registered successfully }
 *       400: { description: Validation error or email already exists }
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@phuongtravel.vn }
 *               password: { type: string, example: "Admin@123" }
 *     responses:
 *       200: { description: Login successful, returns JWT token }
 *       400: { description: Invalid password }
 *       404: { description: User not found }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Returns user profile }
 *       401: { description: Unauthorized }
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update user profile (name, phone)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Profile updated }
 */
router.patch('/profile', verifyToken, authController.updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Password changed }
 */
router.patch('/change-password', verifyToken, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;

// ── Google OAuth ─────────────────────────────────────────────────────────────
router.get('/google',          authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
