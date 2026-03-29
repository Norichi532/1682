const express = require('express');
const { register, login } = require('./auth.controller');

const router = express.Router();
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
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 0123456789
 *               role_id:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Invalid input data
 */
router.post('/register', register);
router.post('/login', login);

module.exports = router;