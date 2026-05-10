const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carModelController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: CarModels
 *   description: Quản lý dòng xe
 */

/**
 * @swagger
 * /api/car-models:
 *   get:
 *     summary: Lấy tất cả dòng xe (public)
 *     tags: [CarModels]
 *     responses:
 *       200: { description: Danh sách dòng xe }
 *   post:
 *     summary: Tạo dòng xe mới (admin)
 *     tags: [CarModels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [model_name, num_seats]
 *             properties:
 *               model_name: { type: string }
 *               num_seats: { type: integer }
 *               description: { type: string }
 *               features: { type: array, items: { type: string } }
 *               image_url: { type: string }
 *     responses:
 *       201: { description: Tạo thành công }
 */
router.get('/', ctrl.getAll);
router.post('/', verifyToken, verifyRole([1]), ctrl.create);

/**
 * @swagger
 * /api/car-models/{id}:
 *   get:
 *     summary: Lấy chi tiết một dòng xe
 *     tags: [CarModels]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chi tiết dòng xe }
 *   put:
 *     summary: Cập nhật dòng xe (admin)
 *     tags: [CarModels]
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
 *               model_name: { type: string }
 *               num_seats: { type: integer }
 *               description: { type: string }
 *               features: { type: array, items: { type: string } }
 *               image_url: { type: string }
 *     responses:
 *       200: { description: Cập nhật thành công }
 *   delete:
 *     summary: Xóa dòng xe (admin)
 *     tags: [CarModels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Xóa thành công }
 */
router.get('/:id', ctrl.getById);
router.put('/:id', verifyToken, verifyRole([1]), ctrl.update);
router.delete('/:id', verifyToken, verifyRole([1]), ctrl.remove);

module.exports = router;
