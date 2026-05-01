// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API for Registration and Login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Huynh Doan Tan Phat
 *               email:
 *                 type: string
 *                 example: phat@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Invalid data or email already exists
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: phat@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Incorrect password
 *       404:
 *         description: Account does not exist
 */
router.post('/login', authController.login);

module.exports = router;