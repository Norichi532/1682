const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý tài khoản (admin)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy tất cả users, filter theo role_id (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role_id
 *         in: query
 *         schema: { type: integer, enum: [1, 2, 3] }
 *         description: 1=Admin, 2=Khách hàng, 3=Tài xế
 *     responses:
 *       200: { description: Danh sách users }
 *   post:
 *     summary: Tạo tài khoản mới (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, password]
 *             properties:
 *               full_name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               role_id: { type: integer, default: 3 }
 *     responses:
 *       201: { description: Tạo thành công }
 *       400: { description: Email đã tồn tại }
 */
router.get('/', verifyToken, verifyRole([1]), ctrl.getAllUsers);
router.post('/', verifyToken, verifyRole([1]), ctrl.createUser);

/**
 * @swagger
 * /api/users/drivers:
 *   get:
 *     summary: Lấy danh sách tài xế (dùng cho dropdown gán xe)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Danh sách tài xế }
 */
router.get('/drivers', verifyToken, verifyRole([1]), ctrl.getDrivers);
router.get('/available-drivers', verifyToken, verifyRole([1]), ctrl.getAvailableDrivers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               phone: { type: string }
 *               role_id: { type: integer }
 *               password: { type: string, description: "Để trống nếu không đổi" }
 *     responses:
 *       200: { description: Cập nhật thành công }
 *   delete:
 *     summary: Xóa tài khoản (admin, không thể tự xóa mình)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Xóa thành công }
 *       400: { description: Không thể xóa chính mình }
 */
router.put('/:id', verifyToken, verifyRole([1]), ctrl.updateUser);
router.delete('/:id', verifyToken, verifyRole([1]), ctrl.deleteUser);
router.patch('/:id/toggle-active', verifyToken, verifyRole([1]), ctrl.toggleActive);

module.exports = router;
