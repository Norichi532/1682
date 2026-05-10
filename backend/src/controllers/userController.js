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

// GET /api/users/available-drivers — tài xế đang rảnh (không có booking CONFIRMED/IN_PROGRESS)
const getAvailableDrivers = async (req, res) => {
  try {
    const busyRows = await Booking.findAll({
      where: {
        status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] },
        driver_id: { [Op.ne]: null }
      },
      attributes: ['driver_id'],
      raw: true
    });
    const busyIds = [...new Set(busyRows.map(b => b.driver_id))];

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
    if (!full_name || !email || !password) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email đã được sử dụng' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ full_name, email, password: hashed, phone, role_id: role_id || 3 });
    const full = await User.findByPk(user.id, { include: userIncludes, attributes: { exclude: ['password', 'google_id'] } });
    res.status(201).json({ message: 'Tạo tài khoản thành công', data: full });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/users/:id — cập nhật user (admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    const { full_name, phone, role_id, password } = req.body;
    const updates = { full_name, phone, role_id };
    if (password) updates.password = await bcrypt.hash(password, 10);
    await user.update(updates);
    const full = await User.findByPk(user.id, { include: userIncludes, attributes: { exclude: ['password', 'google_id'] } });
    res.json({ message: 'Cập nhật thành công', data: full });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// DELETE /api/users/:id — soft delete với kiểm tra booking đang hoạt động
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài xế' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'Không thể xóa chính mình' });
    if (user.role_id !== 3) return res.status(400).json({ message: 'Chỉ có thể xóa tài khoản tài xế' });

    // Chặn nếu đang có booking CONFIRMED hoặc IN_PROGRESS
    const activeBooking = await Booking.findOne({
      where: {
        driver_id: user.id,
        status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] }
      }
    });
    if (activeBooking) {
      return res.status(400).json({
        message: 'Không thể xóa tài xế đang có chuyến xe chưa hoàn thành (CONFIRMED hoặc IN_PROGRESS).'
      });
    }

    // Soft delete: vô hiệu hóa tài khoản, không xóa thật
    await user.update({ is_active: false });

    // Gỡ tài xế khỏi xe đang gán (nếu có) — xe trở về trạng thái không có tài xế
    await Car.update({ driver_id: null }, { where: { driver_id: user.id } });

    res.json({ message: 'Đã vô hiệu hóa tài xế thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PATCH /api/users/:id/toggle-active — bật/tắt is_active
const toggleActive = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'Không thể tự vô hiệu hóa mình' });

    // Nếu đang muốn deactivate → kiểm tra booking đang chạy
    if (user.is_active) {
      const activeBooking = await Booking.findOne({
        where: { driver_id: user.id, status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] } }
      });
      if (activeBooking) {
        return res.status(400).json({
          message: 'Không thể vô hiệu hóa tài xế đang có chuyến CONFIRMED hoặc IN_PROGRESS.'
        });
      }
    }

    await user.update({ is_active: !user.is_active });
    res.json({
      message: user.is_active ? 'Đã kích hoạt lại tài xế' : 'Đã vô hiệu hóa tài xế',
      is_active: user.is_active
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAllUsers, getDrivers, getAvailableDrivers, createUser, updateUser, deleteUser, toggleActive };
