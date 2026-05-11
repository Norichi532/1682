const { User, Role, Booking, Car } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const userIncludes = [{ model: Role, as: 'role', attributes: ['id', 'role_name'] }];

// GET /api/users — all users (admin)
const getAllUsers = async (req, res) => {
  try {
    const { role_id } = req.query;
    const where = {};
    if (role_id) where.role_id = role_id;
    const users = await User.findAll({
      where,
      include: userIncludes,
      attributes: { exclude: ['password', 'google_id'] },
      order: [['created_at', 'DESC']]
    });
    res.json({ message: 'OK', data: users });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/users/drivers — only drivers (for car assign dropdown)
const getDrivers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role_id: 3 },
      attributes: ['id', 'full_name', 'phone', 'email'],
      order: [['full_name', 'ASC']]
    });
    res.json({ message: 'OK', data: users });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/users/available-drivers — tài xế rảnh trong khung giờ cụ thể
// Query params: start_time, end_time (ISO string), booking_id (loại trừ booking hiện tại khi re-assign)
const getAvailableDrivers = async (req, res) => {
  try {
    const { start_time, end_time, booking_id } = req.query;

    // Nếu có start_time → kiểm tra overlap thật sự theo giờ
    // Nếu không có → fallback về cách cũ (loại hết tài xế có booking active)
    let busyIds = [];
    if (start_time) {
      const newStart = new Date(start_time);
      const newEnd   = end_time ? new Date(end_time) : new Date(newStart.getTime() + 3 * 60 * 60 * 1000);
      const overlapWhere = {
        status:     { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] },
        driver_id:  { [Op.ne]: null },
        start_time: { [Op.lt]: newEnd },
        [Op.or]: [
          { end_time: { [Op.gt]: newStart } },
          { end_time: null }
        ]
      };
      // Loại trừ booking hiện tại đang được gán (tránh tự chặn chính mình khi re-assign)
      if (booking_id) overlapWhere.id = { [Op.ne]: booking_id };
      const busyRows = await Booking.findAll({ where: overlapWhere, attributes: ['driver_id'], raw: true });
      busyIds = [...new Set(busyRows.map(b => b.driver_id))];
    } else {
      // Fallback: loại tài xế đang có chuyến active bất kể giờ
      const busyRows = await Booking.findAll({
        where: {
          status:    { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] },
          driver_id: { [Op.ne]: null }
        },
        attributes: ['driver_id'],
        raw: true
      });
      busyIds = [...new Set(busyRows.map(b => b.driver_id))];
    }

    const where = { role_id: 3 };
    if (busyIds.length > 0) where.id = { [Op.notIn]: busyIds };

    const drivers = await User.findAll({
      where,
      attributes: ['id', 'full_name', 'phone'],
      order: [['full_name', 'ASC']]
    });
    res.json({ message: 'OK', data: drivers });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// POST /api/users — tạo tài xế mới (admin)
const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, role_id } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ message: 'Missing required fields.' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email is already in use.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ full_name, email, password: hashed, phone, role_id: role_id || 3 });
    const full = await User.findByPk(user.id, { include: userIncludes, attributes: { exclude: ['password', 'google_id'] } });
    res.status(201).json({ message: 'Account created successfully.', data: full });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/users/:id — cập nhật user (admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const { full_name, phone, role_id, password } = req.body;
    const updates = { full_name, phone, role_id };
    if (password) updates.password = await bcrypt.hash(password, 10);
    await user.update(updates);
    const full = await User.findByPk(user.id, { include: userIncludes, attributes: { exclude: ['password', 'google_id'] } });
    res.json({ message: 'User updated successfully.', data: full });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// DELETE /api/users/:id — soft delete với kiểm tra booking đang hoạt động
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Driver not found.' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account.' });
    if (user.role_id !== 3) return res.status(400).json({ message: 'Only driver accounts can be deleted.' });

    // Chặn nếu đang có booking CONFIRMED hoặc IN_PROGRESS
    const activeBooking = await Booking.findOne({
      where: {
        driver_id: user.id,
        status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] }
      }
    });
    if (activeBooking) {
      return res.status(400).json({
        message: 'Cannot delete a driver who has an active trip (CONFIRMED or IN_PROGRESS).'
      });
    }

    // Soft delete: vô hiệu hóa tài khoản, không xóa thật
    await user.update({ is_active: false });

    // Gỡ tài xế khỏi xe đang gán (nếu có) — xe trở về trạng thái không có tài xế
    await Car.update({ driver_id: null }, { where: { driver_id: user.id } });

    res.json({ message: 'Driver deactivated successfully.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PATCH /api/users/:id/toggle-active — bật/tắt is_active
const toggleActive = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot deactivate your own account.' });

    // Nếu đang muốn deactivate → kiểm tra booking đang chạy
    if (user.is_active) {
      const activeBooking = await Booking.findOne({
        where: { driver_id: user.id, status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] } }
      });
      if (activeBooking) {
        return res.status(400).json({
          message: 'Cannot deactivate a driver who has an active trip (CONFIRMED or IN_PROGRESS).'
        });
      }
    }

    await user.update({ is_active: !user.is_active });
    res.json({
      message: user.is_active ? 'Driver activated successfully.' : 'Driver deactivated successfully.',
      is_active: user.is_active
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAllUsers, getDrivers, getAvailableDrivers, createUser, updateUser, deleteUser, toggleActive };
