const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Quản lý xe (admin)
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Lấy tất cả xe đang hoạt động (is_active=true) kèm tài xế và dòng xe (admin)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: model_id
 *         in: query
 *         schema: { type: integer }
 *       - name: status
 *         in: query
 *         schema: { type: string, enum: [AVAILABLE, MAINTENANCE, INACTIVE] }
 *     responses:
 *       200: { description: Danh sách xe đang hoạt động (is_active=true) }
 */
router.get('/', verifyToken, verifyRole([1]), ctrl.getAllCars);

/**
 * @swagger
 * /api/cars/available:
 *   get:
 *     summary: Lấy xe đang rảnh (không trong chuyến CONFIRMED/IN_PROGRESS)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: model_id
 *         in: query
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Danh sách xe rảnh }
 */
router.get('/available', verifyToken, verifyRole([1]), ctrl.getAvailableCars);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Thêm xe mới (admin)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [model_id, license_plate]
 *             properties:
 *               model_id: { type: integer }
 *               license_plate: { type: string }
 *               color: { type: string }
 *               driver_id: { type: string }
 *               status: { type: string, enum: [AVAILABLE, MAINTENANCE, INACTIVE] }
 *     responses:
 *       201: { description: Tạo xe thành công }
 *       400: { description: Biển số đã tồn tại }
 */
router.post('/', verifyToken, verifyRole([1]), ctrl.createCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Cập nhật thông tin xe (admin)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model_id: { type: integer }
 *               license_plate: { type: string }
 *               color: { type: string }
 *               driver_id: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Cập nhật thành công }
 *   delete:
 *     summary: Vô hiệu hóa xe - soft delete (admin)
 *     description: Không xóa thật khỏi DB. Đặt is_active=false để giữ lịch sử booking. Không thể xóa xe đang có chuyến CONFIRMED hoặc IN_PROGRESS.
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Đã vô hiệu hóa xe thành công }
 *       400: { description: Xe đang có chuyến chưa hoàn thành }
 */
router.put('/:id', verifyToken, verifyRole([1]), ctrl.updateCar);
router.delete('/:id', verifyToken, verifyRole([1]), ctrl.deleteCar);

module.exports = router;
