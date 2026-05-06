const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Thanh toán VNPay
 */

/**
 * @swagger
 * /api/payments/create-payment-url:
 *   post:
 *     summary: Tạo URL thanh toán cọc 30% qua VNPay
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [booking_id]
 *             properties:
 *               booking_id: { type: string }
 *     responses:
 *       200: { description: URL thanh toán VNPay }
 *       404: { description: Không tìm thấy đơn }
 */
router.post('/create-payment-url', verifyToken, verifyRole([2]), ctrl.createPaymentUrl);

/**
 * @swagger
 * /api/payments/vnpay-return:
 *   get:
 *     summary: VNPay redirect về sau thanh toán (frontend gọi để verify)
 *     tags: [Payments]
 *     responses:
 *       200: { description: Kết quả thanh toán }
 */
router.get('/vnpay-return', ctrl.vnpayReturn);

/**
 * @swagger
 * /api/payments/vnpay-ipn:
 *   get:
 *     summary: VNPay IPN webhook - tự động xác nhận booking sau thanh toán
 *     tags: [Payments]
 *     responses:
 *       200: { description: IPN response }
 */
router.get('/vnpay-ipn', ctrl.vnpayIpn);

/**
 * @swagger
 * /api/payments/cancel/{bookingId}:
 *   post:
 *     summary: Hủy booking và hoàn tiền theo chính sách
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Hủy thành công, kèm thông tin hoàn tiền }
 *       404: { description: Không tìm thấy đơn }
 */
router.post('/cancel/:bookingId', verifyToken, verifyRole([2]), ctrl.cancelBooking);

/**
 * @swagger
 * /api/payments/booking/{bookingId}:
 *   get:
 *     summary: Xem thông tin thanh toán của booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Thông tin payment }
 */
router.get('/booking/:bookingId', verifyToken, ctrl.getPaymentByBooking);

module.exports = router;
