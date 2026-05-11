const { Car, CarModel, User, Booking } = require('../models');
const { Op } = require('sequelize');

const carIncludes = [
  { model: CarModel, as: 'model_info', attributes: ['id', 'model_name', 'num_seats', 'image_url'] },
  { model: User, as: 'driver', attributes: ['id', 'full_name', 'phone'] }
];

const getAllCars = async (req, res) => {
  try {
    const { model_id, status } = req.query;
    const where = { is_active: true };
    if (model_id) where.model_id = model_id;
    if (status) where.status = status;
    const cars = await Car.findAll({ where, include: carIncludes, order: [['id', 'ASC']] });
    res.json({ message: 'OK', data: cars });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getAvailableCars = async (req, res) => {
  try {
    const { model_id, start_time, end_time, booking_id } = req.query;

    // Nếu có start_time → kiểm tra overlap thật sự theo giờ
    // Nếu không có → fallback về cách cũ (loại hết xe có booking active)
    let bookedIds = [];
    if (start_time) {
      const newStart = new Date(start_time);
      const newEnd   = end_time ? new Date(end_time) : new Date(newStart.getTime() + 3 * 60 * 60 * 1000);
      const overlapWhere = {
        status:     { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] },
        car_id:     { [Op.ne]: null },
        start_time: { [Op.lt]: newEnd },
        [Op.or]: [
          { end_time: { [Op.gt]: newStart } },
          { end_time: null }
        ]
      };
      // Loại trừ booking hiện tại đang được gán (tránh tự chặn chính mình khi re-assign)
      if (booking_id) overlapWhere.id = { [Op.ne]: booking_id };
      const booked = await Booking.findAll({ where: overlapWhere, attributes: ['car_id'], raw: true });
      bookedIds = booked.map(b => b.car_id).filter(Boolean);
    } else {
      // Fallback: loại xe đang có chuyến active bất kể giờ
      const booked = await Booking.findAll({
        where: { status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] } },
        attributes: ['car_id'], raw: true
      });
      bookedIds = booked.map(b => b.car_id).filter(Boolean);
    }

    const where = { status: 'AVAILABLE', is_active: true };
    if (bookedIds.length > 0) where.id = { [Op.notIn]: bookedIds };
    if (model_id) where.model_id = model_id;
    const cars = await Car.findAll({ where, include: carIncludes, order: [['id', 'ASC']] });
    res.json({ message: 'OK', data: cars });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const createCar = async (req, res) => {
  try {
    const { model_id, driver_id, license_plate, color, status } = req.body;
    if (!model_id || !license_plate) return res.status(400).json({ message: 'model_id and license_plate are required.' });
    const car = await Car.create({ model_id, driver_id: driver_id || null, license_plate, color, status: status || 'AVAILABLE' });
    const full = await Car.findByPk(car.id, { include: carIncludes });
    res.status(201).json({ message: 'Vehicle created successfully.', data: full });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'License plate already exists.' });
    res.status(500).json({ message: e.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Vehicle not found.' });
    const { model_id, driver_id, license_plate, color, status } = req.body;
    await car.update({ model_id, driver_id: driver_id || null, license_plate, color, status });
    const full = await Car.findByPk(car.id, { include: carIncludes });
    res.json({ message: 'Vehicle updated successfully.', data: full });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'License plate already exists.' });
    res.status(500).json({ message: e.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Vehicle not found.' });

    // Chặn xóa nếu đang có booking CONFIRMED hoặc IN_PROGRESS
    const activeBooking = await Booking.findOne({
      where: {
        car_id: car.id,
        status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] }
      }
    });
    if (activeBooking) {
      return res.status(400).json({
        message: 'Cannot delete a vehicle that has an active trip (CONFIRMED or IN_PROGRESS).'
      });
    }

    // Soft delete: vô hiệu hóa xe, không xóa thật để giữ lịch sử booking
    await car.update({ is_active: false, driver_id: null });
    res.json({ message: 'Vehicle deactivated successfully.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAllCars, getAvailableCars, createCar, updateCar, deleteCar };
