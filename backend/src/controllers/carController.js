const { Car, CarModel, User, Booking } = require('../models');
const { Op } = require('sequelize');

const carIncludes = [
  { model: CarModel, as: 'model_info', attributes: ['id', 'model_name', 'num_seats', 'image_url'] },
  { model: User, as: 'driver', attributes: ['id', 'full_name', 'phone'] }
];

const getAllCars = async (req, res) => {
  try {
    const { model_id, status } = req.query;
    const where = {};
    if (model_id) where.model_id = model_id;
    if (status) where.status = status;
    const cars = await Car.findAll({ where, include: carIncludes, order: [['id', 'ASC']] });
    res.json({ message: 'OK', data: cars });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getAvailableCars = async (req, res) => {
  try {
    const { model_id } = req.query;
    const booked = await Booking.findAll({
      where: { status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] } },
      attributes: ['car_id'], raw: true
    });
    const bookedIds = booked.map(b => b.car_id).filter(Boolean);
    const where = { status: 'AVAILABLE' };
    if (bookedIds.length > 0) where.id = { [Op.notIn]: bookedIds };
    if (model_id) where.model_id = model_id;
    const cars = await Car.findAll({ where, include: carIncludes, order: [['id', 'ASC']] });
    res.json({ message: 'OK', data: cars });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const createCar = async (req, res) => {
  try {
    const { model_id, driver_id, license_plate, color, status } = req.body;
    if (!model_id || !license_plate) return res.status(400).json({ message: 'model_id và license_plate là bắt buộc' });
    const car = await Car.create({ model_id, driver_id: driver_id || null, license_plate, color, status: status || 'AVAILABLE' });
    const full = await Car.findByPk(car.id, { include: carIncludes });
    res.status(201).json({ message: 'Tạo xe thành công', data: full });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'Biển số xe đã tồn tại' });
    res.status(500).json({ message: e.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Không tìm thấy xe' });
    const { model_id, driver_id, license_plate, color, status } = req.body;
    await car.update({ model_id, driver_id: driver_id || null, license_plate, color, status });
    const full = await Car.findByPk(car.id, { include: carIncludes });
    res.json({ message: 'Cập nhật thành công', data: full });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'Biển số xe đã tồn tại' });
    res.status(500).json({ message: e.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Không tìm thấy xe' });
    await car.destroy();
    res.json({ message: 'Xóa xe thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAllCars, getAvailableCars, createCar, updateCar, deleteCar };
