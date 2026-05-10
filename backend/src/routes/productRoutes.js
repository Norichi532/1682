const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý dịch vụ / tour
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy tất cả sản phẩm (public, filter theo category_id)
 *     tags: [Products]
 *     parameters:
 *       - name: category_id
 *         in: query
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Danh sách sản phẩm kèm bảng giá }
 *   post:
 *     summary: Tạo sản phẩm mới (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, product_name]
 *             properties:
 *               category_id: { type: integer }
 *               product_name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               image_url: { type: string }
 *               prices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     model_id: { type: integer }
 *                     price: { type: number }
 *     responses:
 *       201: { description: Tạo thành công }
 */
router.get('/', ctrl.getAllProducts);
router.post('/', verifyToken, verifyRole([1]), ctrl.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm kèm bảng giá
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chi tiết sản phẩm }
 *       404: { description: Không tìm thấy }
 *   put:
 *     summary: Cập nhật sản phẩm + đồng bộ bảng giá (admin)
 *     tags: [Products]
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
 *               product_name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               image_url: { type: string }
 *               prices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     model_id: { type: integer }
 *                     price: { type: number }
 *     responses:
 *       200: { description: Cập nhật thành công }
 *   delete:
 *     summary: Xóa sản phẩm và bảng giá liên quan (admin)
 *     tags: [Products]
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
router.get('/:id', ctrl.getProductById);
router.put('/:id', verifyToken, verifyRole([1]), ctrl.updateProduct);
router.delete('/:id', verifyToken, verifyRole([1]), ctrl.deleteProduct);

module.exports = router;
