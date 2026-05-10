const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Quản lý đặt xe
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Khách tạo booking mới
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, model_id, start_time]
 *             properties:
 *               product_id: { type: integer }
 *               model_id: { type: integer }
 *               start_time: { type: string, format: date-time }
 *               additional_data: { type: object }
 *     responses:
 *       201: { description: Đặt xe thành công }
 *       400: { description: Thiếu thông tin }
 */
router.post('/', verifyToken, verifyRole([2]), ctrl.createBooking);

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Khách xem đơn của mình
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Danh sách đơn của khách }
 */
router.get('/my', verifyToken, verifyRole([2]), ctrl.getMyBookings);

/**
 * @swagger
 * /api/bookings/driver:
 *   get:
 *     summary: Tài xế xem lịch chạy xe của mình
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lịch của tài xế }
 */
router.get('/driver', verifyToken, verifyRole([3]), ctrl.getDriverBookings);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Admin xem tất cả đơn
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200: { description: Tất cả đơn }
 */
router.get('/', verifyToken, verifyRole([1]), ctrl.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}/assign:
 *   patch:
 *     summary: Admin gán xe + tài xế cho đơn
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [car_id, driver_id]
 *             properties:
 *               car_id: { type: integer }
 *               driver_id: { type: string }
 *     responses:
 *       200: { description: Gán thành công, booking → CONFIRMED }
 *       400: { description: Xe hoặc tài xế đang bận }
 */
router.patch('/:id/assign', verifyToken, verifyRole([1]), ctrl.assignCarAndDriver);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Admin cập nhật trạng thái booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200: { description: Cập nhật thành công }
 */
router.patch('/:id/status', verifyToken, verifyRole([1]), ctrl.updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}/driver-status:
 *   patch:
 *     summary: Tài xế cập nhật trạng thái chuyến (CONFIRMED→IN_PROGRESS→COMPLETED)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [IN_PROGRESS, COMPLETED]
 *     responses:
 *       200: { description: Cập nhật thành công }
 *       400: { description: Sai thứ tự workflow }
 */
router.patch('/:id/driver-status', verifyToken, verifyRole([3]), ctrl.driverUpdateStatus);

module.exports = router;
