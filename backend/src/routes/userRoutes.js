const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quan ly tai khoan (admin)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lay tat ca users, filter theo role_id (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role_id
 *         in: query
 *         schema: { type: integer, enum: [1, 2, 3] }
 *         description: 1=Admin, 2=Khach hang, 3=Tai xe
 *     responses:
 *       200: { description: Danh sach users }
 *   post:
 *     summary: Tao tai khoan moi (admin)
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
 *       201: { description: Tao thanh cong }
 *       400: { description: Email da ton tai }
 */
router.get('/', verifyToken, verifyRole([1]), ctrl.getAllUsers);
router.post('/', verifyToken, verifyRole([1]), ctrl.createUser);

/**
 * @swagger
 * /api/users/drivers:
 *   get:
 *     summary: Lay danh sach tai xe (dung cho dropdown gan xe)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Danh sach tai xe }
 */
router.get('/drivers', verifyToken, verifyRole([1]), ctrl.getDrivers);

/**
 * @swagger
 * /api/users/available-drivers:
 *   get:
 *     summary: Lay danh sach tai xe dang ranh (khong co booking active)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Danh sach tai xe available }
 */
router.get('/available-drivers', verifyToken, verifyRole([1]), ctrl.getAvailableDrivers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cap nhat thong tin user (admin)
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
 *               password: { type: string, description: "De trong neu khong doi" }
 *     responses:
 *       200: { description: Cap nhat thanh cong }
 *   delete:
 *     summary: Xoa tai khoan (admin, khong the tu xoa minh)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Xoa thanh cong }
 *       400: { description: Khong the xoa chinh minh }
 */
router.put('/:id', verifyToken, verifyRole([1]), ctrl.updateUser);
router.delete('/:id', verifyToken, verifyRole([1]), ctrl.deleteUser);

/**
 * @swagger
 * /api/users/{id}/toggle-active:
 *   patch:
 *     summary: Kich hoat / vo hieu hoa tai khoan (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *         description: UUID cua user
 *     responses:
 *       200: { description: Trang thai tai khoan da duoc cap nhat }
 *       404: { description: Khong tim thay user }
 */
router.patch('/:id/toggle-active', verifyToken, verifyRole([1]), ctrl.toggleActive);

module.exports = router;
