const { Booking, Product, Category, CarModel, Car, User, PriceList, Notification } = require('../models');
const { sendCompletionEmail } = require('../utils/mailer');
const { Op } = require('sequelize');
const { getIo } = require('../utils/socket');

// [POST] Khách tạo booking
const createBooking = async (req, res) => {
  try {
    const { product_id, model_id, start_time, additional_data } = req.body;
    const customer_id = req.user.id;

    if (!product_id || !model_id || !start_time) {
      return res.status(400).json({ message: 'product_id, model_id, start_time là bắt buộc' });
    }

    // Kiểm tra đặt xe trước ít nhất 3 ngày
    const minTime = new Date();
    minTime.setDate(minTime.getDate() + 3);
    minTime.setHours(0, 0, 0, 0);
    if (new Date(start_time) < minTime) {
      return res.status(400).json({ message: 'Ngày đi phải cách hôm nay ít nhất 3 ngày.' });
    }

    const priceRecord = await PriceList.findOne({ where: { product_id, model_id } });
    if (!priceRecord) {
      return res.status(404).json({ message: 'Không tìm thấy giá cho sản phẩm và dòng xe này' });
    }

    const booking = await Booking.create({
      customer_id, product_id, model_id, start_time,
      total_price: priceRecord.price,
      status: 'PENDING',
      additional_data: additional_data || null
    });

    // Lưu notification cho admin
    await Notification.create({
      user_id: customer_id,
      content: `Đơn đặt xe mới #${booking.id.slice(0, 8)} đang chờ xác nhận`
    });

    // Emit socket tới admin
    const io = getIo();
    if (io) io.emit('new_booking', {
      id: booking.id, customer_id, product_id, model_id, start_time,
      status: booking.status, total_price: booking.total_price
    });

    res.status(201).json({ message: 'Đặt xe thành công!', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [GET] Khách xem đơn của mình
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customer_id: req.user.id },
      include: [
        {
          model: Product, as: 'product', attributes: ['id', 'product_name'],
          include: [{ model: Category, as: 'category', attributes: ['id', 'category_name'] }]
        },
        { model: CarModel, as: 'car_model', attributes: ['id', 'model_name', 'num_seats'] },
        { model: Car, as: 'assigned_car', attributes: ['id', 'license_plate', 'color'] },
        { model: User, as: 'assigned_driver', attributes: ['id', 'full_name', 'phone'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ message: 'OK', data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [GET] Admin xem tất cả đơn
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'full_name', 'phone', 'email'] },
        {
          model: Product, as: 'product', attributes: ['id', 'product_name', 'category_id'],
          include: [{ model: Category, as: 'category', attributes: ['id', 'category_name'] }]
        },
        { model: CarModel, as: 'car_model', attributes: ['id', 'model_name', 'num_seats'] },
        { model: Car, as: 'assigned_car', attributes: ['id', 'license_plate', 'color'] },
        { model: User, as: 'assigned_driver', attributes: ['id', 'full_name', 'phone'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ message: 'OK', data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [PATCH] Admin cập nhật trạng thái booking
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn' });

    booking.status = status;
    await booking.save();

    // Khi hoàn thành: gửi email + notification cho khách
    if (status === 'COMPLETED') {
      const fullBooking = await Booking.findByPk(booking.id, {
        include: [
          { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
          { model: Product, as: 'product', attributes: ['product_name'] }
        ]
      });
      if (fullBooking?.customer) {
        await Notification.create({
          user_id: fullBooking.customer.id,
          content: `Chuyến xe "${fullBooking.product?.product_name}" đã hoàn thành. Hãy để lại đánh giá! 🌟`
        });
        sendCompletionEmail(fullBooking.customer.email, fullBooking.customer.full_name, fullBooking.product?.product_name).catch(e => console.error('Email error:', e.message));
      }
    }

    res.json({ message: 'Cập nhật trạng thái thành công', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [PATCH] Admin gán xe + tài xế (nội bộ hoặc xe ngoài)
const assignCarAndDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { car_id, driver_id, external_car_info } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn' });

    // ── Trường hợp xe ngoài ──────────────────────────────────────
    if (external_car_info) {
      const { license_plate, car_type, driver_name, driver_phone, vendor } = external_car_info;
      if (!license_plate || !driver_name || !driver_phone) {
        return res.status(400).json({ message: 'Biển số xe, tên tài xế và SĐT là bắt buộc' });
      }
      const existingAd = booking.additional_data || {};
      booking.additional_data = { ...existingAd, external_car: { license_plate, car_type, driver_name, driver_phone, vendor } };
      booking.car_id = null;
      booking.driver_id = null;
      booking.status = 'CONFIRMED';
      await booking.save();
      return res.json({ message: 'Gán xe ngoài thành công', data: booking });
    }

    // ── Trường hợp xe nội bộ ────────────────────────────────────
    if (!car_id || !driver_id) {
      return res.status(400).json({ message: 'car_id và driver_id là bắt buộc' });
    }

    // Kiểm tra xe có đang bận không
    const conflictingBooking = await Booking.findOne({
      where: { car_id, status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] }, id: { [Op.ne]: id } }
    });
    if (conflictingBooking) {
      return res.status(400).json({ message: 'Xe này đang trong chuyến khác chưa hoàn thành!' });
    }

    // Kiểm tra tài xế có đang bận không
    const conflictingDriver = await Booking.findOne({
      where: { driver_id, status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] }, id: { [Op.ne]: id } }
    });
    if (conflictingDriver) {
      return res.status(400).json({ message: 'Tài xế này đang trong chuyến khác chưa hoàn thành!' });
    }

    // Xóa external_car_info nếu trước đó đã gán xe ngoài rồi đổi lại nội bộ
    if (booking.additional_data?.external_car) {
      const { external_car: _, ...restAd } = booking.additional_data;
      booking.additional_data = restAd;
    }

    booking.car_id = car_id;
    booking.driver_id = driver_id;
    booking.status = 'CONFIRMED';
    await booking.save();

    res.json({ message: 'Gán xe và tài xế thành công', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [GET] Tài xế xem lịch của mình
const getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        driver_id: req.user.id,
        status: { [Op.ne]: 'CANCELLED' }
      },
      include: [
        { model: User, as: 'customer', attributes: ['id', 'full_name', 'phone'] },
        { model: Product, as: 'product', attributes: ['id', 'product_name'] },
        { model: CarModel, as: 'car_model', attributes: ['id', 'model_name', 'num_seats'] },
        { model: Car, as: 'assigned_car', attributes: ['id', 'license_plate', 'color'] }
      ],
      order: [['start_time', 'ASC']]
    });
    res.json({ message: 'OK', data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [PATCH] Tài xế cập nhật trạng thái chuyến của mình
// Chỉ cho phép: CONFIRMED → IN_PROGRESS → COMPLETED
const driverUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const driver_id = req.user.id;

    // Tài xế chỉ được chuyển sang 2 trạng thái này
    const allowedStatuses = ['IN_PROGRESS', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Tài xế chỉ được cập nhật: IN_PROGRESS hoặc COMPLETED' });
    }

    // Chỉ được cập nhật chuyến được gán cho mình
    const booking = await Booking.findOne({ where: { id, driver_id } });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy chuyến hoặc bạn không có quyền' });

    // Validate workflow: CONFIRMED → IN_PROGRESS → COMPLETED
    if (status === 'IN_PROGRESS' && booking.status !== 'CONFIRMED') {
      return res.status(400).json({ message: 'Chỉ có thể bắt đầu chuyến khi đã CONFIRMED' });
    }
    if (status === 'COMPLETED' && booking.status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: 'Chỉ có thể hoàn thành khi đang IN_PROGRESS' });
    }

    booking.status = status;
    await booking.save();

    // Khi tài xế đánh dấu hoàn thành → gửi email cho khách
    if (status === 'COMPLETED') {
      const fullBooking = await Booking.findByPk(booking.id, {
        include: [
          { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
          { model: Product, as: 'product', attributes: ['product_name'] }
        ]
      });
      if (fullBooking?.customer) {
        await Notification.create({
          user_id: fullBooking.customer.id,
          content: `Chuyến xe "${fullBooking.product?.product_name}" đã hoàn thành. Hãy để lại đánh giá! 🌟`
        });
        sendCompletionEmail(fullBooking.customer.email, fullBooking.customer.full_name, fullBooking.product?.product_name)
          .catch(e => console.error('Email error:', e.message));
      }
    }

    res.json({ message: 'Cập nhật trạng thái thành công', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking, getMyBookings, getAllBookings,
  updateBookingStatus, assignCarAndDriver,
  getDriverBookings, driverUpdateStatus
};
