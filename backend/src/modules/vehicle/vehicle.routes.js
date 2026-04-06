const express = require('express');
const router = express.Router();
const VehicleController = require('./vehicle.controller');
const { authMiddleware, authorize } = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management APIs
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: Successfully retrieved vehicle list
 *
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               seat_capacity:
 *                 type: integer
 *               fuel_type:
 *                 type: string
 *               year_of_manufacture:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 */
// Định nghĩa các endpoint
router.get('/', VehicleController.getVehicles);
router.post('/', VehicleController.createVehicle);
/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update vehicle information
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               seat_capacity:
 *                 type: integer
 *               fuel_type:
 *                 type: string
 *               year_of_manufacture:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update successful
 *       400:
 *         description: Invalid input data (e.g., duplicate license plate)
 *       404:
 *         description: Vehicle not found
 *
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle to delete
 *     responses:
 *       200:
 *         description: Delete successful
 *       400:
 *         description: Cannot delete because the vehicle is in use
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', VehicleController.updateVehicle);
router.delete('/:id', VehicleController.deleteVehicle);

// Ai đăng nhập rồi (authMiddleware) cũng có thể XEM danh sách xe
router.get('/', authMiddleware, VehicleController.getVehicles);

// Chỉ Admin (1) và Staff (2) mới được THÊM, SỬA, XÓA
router.post('/', authMiddleware, authorize(1, 2), VehicleController.createVehicle);
router.put('/:id', authMiddleware, authorize(1, 2), VehicleController.updateVehicle);
router.delete('/:id', authMiddleware, authorize(1, 2), VehicleController.deleteVehicle);
module.exports = router;