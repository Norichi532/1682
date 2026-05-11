const { Booking, Product, Category, CarModel, Car, User, PriceList, Notification } = require('../models');
const { sendCompletionEmail, sendConfirmationEmail } = require('../utils/mailer');
const { Op } = require('sequelize');
const { getIo } = require('../utils/socket');

// [POST] Khách tạo booking
const createBooking = async (req, res) => {
  try {
    const { product_id, model_id, start_time, additional_data } = req.body;
    const customer_id = req.user.id;

    if (!product_id || !model_id || !start_time) {
      return res.status(400).json({ message: 'product_id, model_id, start_time are required.' });
    }

    // Kiểm tra đặt xe trước ít nhất 3 ngày
    const minTime = new Date();
    minTime.setDate(minTime.getDate() + 3);
    minTime.setHours(0, 0, 0, 0);
    if (new Date(start_time) < minTime) {
      return res.status(400).json({ message: 'The departure date must be at least 3 days before today.' });
    }

    const priceRecord = await PriceList.findOne({ where: { product_id, model_id } });
    if (!priceRecord) {
      return res.status(404).json({ message: 'No prices were found for this product and model.' });
    }

    // Lấy product để biết category và num_days (tour)
    const product = await Product.findByPk(product_id, {
      include: [{ model: Category, as: 'category', attributes: ['id'] }]
    });
    const categoryId = product?.category_id;

    // Tính end_time dựa theo loại dịch vụ
    const start = new Date(start_time);
    let end_time;
    if (categoryId === 2 && product.num_days && product.num_days > 0) {
      // Tour: dùng num_days cố định từ product
      end_time = new Date(start);
      end_time.setDate(end_time.getDate() + product.num_days);
    } else if (categoryId === 3) {
      // Golf: ước tính 6 tiếng
      end_time = new Date(start.getTime() + 6 * 60 * 60 * 1000);
    } else {
      // Airport hoặc dịch vụ thông thường: ước tính 3 tiếng
      end_time = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    }

    const booking = await Booking.create({
      customer_id, product_id, model_id, start_time, end_time,
      total_price: priceRecord.price,
      status: 'PENDING',
      additional_data: additional_data || null
    });

    // Lưu notification cho admin
    await Notification.create({
      user_id: customer_id,
      content: `New booking #${booking.id.slice(0, 8)} is awaiting confirmation.`
    });

    // Emit socket tới admin
    const io = getIo();
    if (io) io.to('admin').emit('new_booking', { booking_id: booking.id });

    res.status(201).json({ message: 'Booking created successfully!', data: booking });
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
      return res.status(400).json({ message: `Invalid status. Allowed values: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const previousStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Khi hoàn thành: gửi email + notification cho khách
    // Guard previousStatus !== 'COMPLETED' để tránh gửi email trùng nếu admin set lại
    if (status === 'COMPLETED' && previousStatus !== 'COMPLETED') {
      const fullBooking = await Booking.findByPk(booking.id, {
        include: [
          { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
          { model: Product, as: 'product', attributes: ['product_name'] }
        ]
      });
      if (fullBooking?.customer) {
        await Notification.create({
          user_id: fullBooking.customer.id,
          content: `Your trip "${fullBooking.product?.product_name}" has been completed. Leave a review! 🌟`
        });
        sendCompletionEmail(fullBooking.customer.email, fullBooking.customer.full_name, fullBooking.product?.product_name).catch(e => console.error('Email error:', e.message));
      }
    }

    res.json({ message: 'Status updated successfully.', data: booking });
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
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    // ── Trường hợp xe ngoài ──────────────────────────────────────
    if (external_car_info) {
      const { license_plate, car_type, driver_name, driver_phone, vendor } = external_car_info;
      if (!license_plate || !driver_name || !driver_phone) {
        return res.status(400).json({ message: 'License plate, driver name and phone number are required.' });
      }
      const existingAd = booking.additional_data || {};
      booking.additional_data = { ...existingAd, external_car: { license_plate, car_type, driver_name, driver_phone, vendor } };
      booking.car_id = null;
      booking.driver_id = null;
      booking.status = 'CONFIRMED';
      await booking.save();

      // Gửi email xác nhận + notification cho khách (xe ngoài)
      try {
        const fullBooking = await Booking.findByPk(id, {
          include: [
            { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
            { model: Product, as: 'product', attributes: ['product_name'] }
          ]
        });
        if (fullBooking?.customer) {
          const productName = fullBooking.product?.product_name || 'Service';
          await Notification.create({
            user_id: fullBooking.customer.id,
            content: `Booking "${productName}" confirmed. Driver: ${driver_name} - ${driver_phone} - ${license_plate}`
          });
          sendConfirmationEmail(
            fullBooking.customer.email,
            fullBooking.customer.full_name,
            productName,
            booking.start_time,
            driver_name,
            driver_phone,
            license_plate
          ).catch(e => console.error('Confirmation email error (external):', e.message));
        }
      } catch (e) {
        console.error('Customer confirmation notification error (external):', e.message);
      }

      return res.json({ message: 'External vehicle assigned successfully.', data: booking });
    }

    // ── Trường hợp xe nội bộ ────────────────────────────────────
    if (!car_id || !driver_id) {
      return res.status(400).json({ message: 'car_id and driver_id are required.' });
    }

    // Lấy thông tin thời gian của booking hiện tại
    const newStart = new Date(booking.start_time);
    const newEnd = booking.end_time ? new Date(booking.end_time) : new Date(newStart.getTime() + 3 * 60 * 60 * 1000);

    // Điều kiện overlap: booking khác có start_time < newEnd VÀ end_time > newStart
    const overlapCondition = {
      status: { [Op.in]: ['CONFIRMED', 'IN_PROGRESS'] },
      id: { [Op.ne]: id },
      start_time: { [Op.lt]: newEnd },
      [Op.or]: [
        { end_time: { [Op.gt]: newStart } },
        { end_time: null } // booking cũ chưa có end_time → coi như bận
      ]
    };

    // Kiểm tra xe có bị trùng lịch không
    const conflictingCar = await Booking.findOne({
      where: { car_id, ...overlapCondition }
    });
    if (conflictingCar) {
      const cfStart = new Date(conflictingCar.start_time).toLocaleString('vi-VN');
      const cfEnd = conflictingCar.end_time ? new Date(conflictingCar.end_time).toLocaleString('vi-VN') : '?';
      return res.status(400).json({
        message: `This vehicle is already assigned to another trip from ${cfStart} to ${cfEnd}. Please choose a different vehicle.`
      });
    }

    // Kiểm tra tài xế có bị trùng lịch không
    const conflictingDriver = await Booking.findOne({
      where: { driver_id, ...overlapCondition }
    });
    if (conflictingDriver) {
      const cfStart = new Date(conflictingDriver.start_time).toLocaleString('vi-VN');
      const cfEnd = conflictingDriver.end_time ? new Date(conflictingDriver.end_time).toLocaleString('vi-VN') : '?';
      return res.status(400).json({
        message: `This driver already has another trip from ${cfStart} to ${cfEnd}. Please choose a different driver.`
      });
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

    // Thông báo cho tài xế được gán + gửi email xác nhận cho khách
    try {
      const fullBooking = await Booking.findByPk(booking.id, {
        include: [
          { model: Product, as: 'product', attributes: ['product_name'] },
          { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
          { model: User, as: 'assigned_driver', attributes: ['id', 'full_name', 'phone'] },
          { model: Car, as: 'assigned_car', attributes: ['id', 'license_plate'] }
        ]
      });
      const startStr = new Date(booking.start_time).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
      const productName = fullBooking?.product?.product_name || 'Service';

      // Notification cho tài xế
      await Notification.create({
        user_id: driver_id,
        content: `You have been assigned to trip "${productName}" at ${startStr}.`
      });

      // Email xác nhận + notification cho khách
      if (fullBooking?.customer) {
        const driverInfo = fullBooking.assigned_driver;
        const carInfo = fullBooking.assigned_car;
        await Notification.create({
          user_id: fullBooking.customer.id,
          content: `Booking "${productName}" confirmed. Driver: ${driverInfo?.full_name || 'N/A'} - ${driverInfo?.phone || 'N/A'} - ${carInfo?.license_plate || 'N/A'}`
        });
        sendConfirmationEmail(
          fullBooking.customer.email,
          fullBooking.customer.full_name,
          productName,
          booking.start_time,
          driverInfo?.full_name || 'N/A',
          driverInfo?.phone || 'N/A',
          carInfo?.license_plate || 'N/A'
        ).catch(e => console.error('Confirmation email error (internal):', e.message));
      }
    } catch (e) {
      console.error('Driver notification error:', e.message);
    }

    res.json({ message: 'Vehicle and driver assigned successfully.', data: booking });
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
      return res.status(400).json({ message: 'Driver can only update to: IN_PROGRESS or COMPLETED.' });
    }

    // Chỉ được cập nhật chuyến được gán cho mình
    const booking = await Booking.findOne({ where: { id, driver_id } });
    if (!booking) return res.status(404).json({ message: 'Trip not found or you do not have permission.' });

    // Validate workflow: CONFIRMED → IN_PROGRESS → COMPLETED
    if (status === 'IN_PROGRESS' && booking.status !== 'CONFIRMED') {
      return res.status(400).json({ message: 'Trip can only be started when status is CONFIRMED.' });
    }
    if (status === 'COMPLETED' && booking.status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: 'Trip can only be completed when status is IN_PROGRESS.' });
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
          content: `Your trip "${fullBooking.product?.product_name}" has been completed. Leave a review! 🌟`
        });
        sendCompletionEmail(fullBooking.customer.email, fullBooking.customer.full_name, fullBooking.product?.product_name)
          .catch(e => console.error('Email error:', e.message));
      }
    }

    res.json({ message: 'Status updated successfully.', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking, getMyBookings, getAllBookings,
  updateBookingStatus, assignCarAndDriver,
  getDriverBookings, driverUpdateStatus
};
