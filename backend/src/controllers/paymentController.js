const {
  VNPay, HashAlgorithm, VnpLocale, VnpCurrCode, ProductCode,
  IpnSuccess, IpnFailChecksum, IpnOrderNotFound, IpnInvalidAmount,
  InpOrderAlreadyConfirmed, IpnUnknownError, RefundTransactionType,
  VNPAY_GATEWAY_SANDBOX_HOST
} = require('vnpay');
const { Booking, Payment, User, Product, Notification } = require('../models');
const { Op } = require('sequelize');
const { sendDepositEmail, sendCancelEmail } = require('../utils/mailer');
const { getIo } = require('../utils/socket');

const vnpay = new VNPay({
  tmnCode:       process.env.VNPAY_TMN_CODE,
  secureSecret:  process.env.VNPAY_SECURE_SECRET,
  vnpayHost:     VNPAY_GATEWAY_SANDBOX_HOST,
  hashAlgorithm: HashAlgorithm.SHA512,
  testMode:      true,
  enableLog:     false,
});

// ── Tính tiền hoàn theo chính sách ──────────────────────────────────────────
const calcRefundAmount = (depositAmount, pickupTime) => {
  const now      = new Date();
  const pickup   = new Date(pickupTime);
  const diffDays = (pickup - now) / (1000 * 60 * 60 * 24);

  if (diffDays >= 3)  return { refundAmount: depositAmount, refundPercent: 100 };
  if (diffDays >= 1)  return { refundAmount: Math.floor(depositAmount * 0.5), refundPercent: 50 };
  return { refundAmount: 0, refundPercent: 0 };
};

// [POST] /api/payments/create-payment-url — Tạo URL thanh toán 30% cọc
const createPaymentUrl = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const customerId = req.user.id;

    const booking = await Booking.findOne({
      where: { id: booking_id, customer_id: customerId, status: 'PENDING' }
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found or invalid.' });

    // Kiểm tra chưa có payment pending
    const existing = await Payment.findOne({
      where: { booking_id, status: { [Op.in]: ['PENDING', 'SUCCESS'] } }
    });
    if (existing?.status === 'SUCCESS') {
      return res.status(400).json({ message: 'This booking has already been paid.' });
    }

    const depositAmount = Math.floor(parseFloat(booking.total_price) * 0.3);
    const txnRef = `${booking_id.slice(0, 8)}-${Date.now()}`;

    // Xóa payment PENDING cũ nếu có (retry), tạo mới
    if (existing) await existing.destroy();
    await Payment.create({
      booking_id,
      payment_method: 'VNPAY',
      transaction_code: txnRef,
      amount: depositAmount,
      status: 'PENDING'
    });

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount:      depositAmount,
      vnp_IpAddr:      req.ip || '127.0.0.1',
      vnp_TxnRef:      txnRef,
      vnp_OrderInfo:   `Dat coc 30% don xe #${booking_id.slice(0, 8)}`,
      vnp_OrderType:   ProductCode.Hotel_Tourism,
      vnp_ReturnUrl:   process.env.VNPAY_RETURN_URL,
      vnp_Locale:      VnpLocale.VN,
      vnp_CurrCode:    VnpCurrCode.VND,
      vnp_CreateDate:  new Date(),
    });

    res.json({ paymentUrl });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// [GET] /api/payments/vnpay-return — Xử lý redirect từ VNPay về frontend
const vnpayReturn = async (req, res) => {
  try {
    const verify = vnpay.verifyReturnUrl(req.query);
    if (!verify.isVerified || !verify.isSuccess) {
      return res.json({ success: false, message: 'Payment failed or was cancelled.' });
    }

    // Cập nhật DB (phòng khi IPN chưa gọi được — localhost dev)
    const txnRef = req.query.vnp_TxnRef;
    const payment = await Payment.findOne({ where: { transaction_code: txnRef } });
    if (payment && payment.status !== 'SUCCESS') {
      await payment.update({ status: 'SUCCESS' });
      const booking = await Booking.findByPk(payment.booking_id, {
        include: [
          { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
          { model: Product, as: 'product', attributes: ['product_name'] }
        ]
      });
      if (booking && booking.status === 'PENDING') {
        await booking.update({ status: 'CONFIRMED' });

        const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
        const productName = booking.product?.product_name || 'Dịch vụ';
        const customer = booking.customer;

        // Thông báo cho khách
        if (customer) {
          await Notification.create({
            user_id: customer.id,
            content: `Deposit of ${fmt(payment.amount)} for booking "${productName}" successful. Your booking is awaiting vehicle assignment.`
          });
          // Email cho khách
          sendDepositEmail(customer.email, customer.full_name, productName, payment.amount, booking.id)
            .catch(e => console.error('Deposit email error:', e.message));
        }

        // Thông báo cho tất cả admin
        const admins = await User.findAll({ where: { role_id: 1 }, attributes: ['id'] });
        await Promise.all(admins.map(admin =>
          Notification.create({
            user_id: admin.id,
            content: `Booking #${booking.id.slice(0,8).toUpperCase()} has been deposited with ${fmt(payment.amount)}.`
          })
        ));

        // Emit socket
        const io = getIo();
        if (io) {
          io.to('admin').emit('payment_confirmed', { booking_id: booking.id });
          if (customer) io.to(`user_${customer.id}`).emit('payment_confirmed', { booking_id: booking.id });
        }
      }
    }

    res.json({ success: true, message: 'Deposit payment successful! Your booking has been confirmed.' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// [GET] /api/payments/vnpay-ipn — Webhook VNPay tự động xác nhận booking
const vnpayIpn = async (req, res) => {
  try {
    const verify = vnpay.verifyIpnCall(req.query);
    if (!verify.isVerified) return res.json(IpnFailChecksum);

    const txnRef   = req.query.vnp_TxnRef;
    const payment  = await Payment.findOne({ where: { transaction_code: txnRef } });
    if (!payment) return res.json(IpnOrderNotFound);
    if (payment.status === 'SUCCESS') return res.json(InpOrderAlreadyConfirmed);

    const paidAmount = parseInt(req.query.vnp_Amount) / 100;
    if (Math.abs(paidAmount - parseFloat(payment.amount)) > 1) return res.json(IpnInvalidAmount);

    if (!verify.isSuccess) {
      await payment.update({ status: 'FAILED' });
      return res.json(IpnSuccess);
    }

    // Cập nhật payment + booking
    await payment.update({ status: 'SUCCESS' });
    const booking = await Booking.findByPk(payment.booking_id);
    if (booking && booking.status === 'PENDING') {
      await booking.update({ status: 'CONFIRMED' });
    }

    return res.json(IpnSuccess);
  } catch (e) {
    return res.json(IpnUnknownError);
  }
};

// [POST] /api/payments/cancel/:bookingId — Hủy booking + hoàn tiền
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        customer_id: userId,
        status: { [Op.in]: ['PENDING', 'CONFIRMED'] }
      }
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found or cannot be cancelled.' });

    const payment = await Payment.findOne({
      where: { booking_id: bookingId, status: 'SUCCESS' }
    });

    let refundInfo = null;

    if (payment) {
      const { refundAmount, refundPercent } = calcRefundAmount(
        parseFloat(payment.amount), booking.start_time
      );

      if (refundAmount > 0) {
        try {
          await vnpay.refund({
            vnp_Amount:          refundAmount,
            vnp_CreateBy:        'system',
            vnp_IpAddr:          req.ip || '127.0.0.1',
            vnp_OrderInfo:       `Hoan tien huy don #${bookingId.slice(0, 8)}`,
            vnp_RequestId:       `REF-${Date.now()}`,
            vnp_TransactionDate: payment.created_at,
            vnp_TransactionType: RefundTransactionType.FULL_REFUND,
            vnp_TxnRef:          payment.transaction_code,
            vnp_CreateDate:      new Date(),
            vnp_TransactionNo:   '0',
          });
          await payment.update({ status: 'REFUNDED' });
        } catch (refundErr) {
          console.error('VNPay refund error:', refundErr.message);
        }
      }

      refundInfo = { refundAmount, refundPercent };
    }

    await booking.update({ status: 'CANCELLED' });

    const msg = refundInfo
      ? refundInfo.refundPercent > 0
        ? `Booking cancelled. The deposit will be refunded within 5–10 business days.`
        : 'Booking cancelled. The deposit is non-refundable as the cancellation was within 24 hours of the trip.'
        : 'Booking cancelled successfully.';

    // Thông báo + email cho khách + tài xế
    try {
      const fullBooking = await Booking.findByPk(bookingId, {
        include: [
          { model: User, as: 'customer', attributes: ['id', 'full_name', 'email'] },
          { model: User, as: 'assigned_driver', attributes: ['id', 'full_name'] },
          { model: Product, as: 'product', attributes: ['product_name'] }
        ]
      });
      if (fullBooking?.customer) {
        const productName = fullBooking.product?.product_name || 'Dịch vụ';
        const ra = refundInfo?.refundAmount || 0;
        const rp = refundInfo?.refundPercent || 0;
        const notifContent = rp > 0
          ? `Booking "${productName}" cancelled. The deposit will be refunded within 5–10 business days.`
          : `Booking "${productName}" cancelled. ${rp === 0 && refundInfo ? 'The deposit is non-refundable due to cancellation within 24 hours.' : ''}`;
        await Notification.create({ user_id: fullBooking.customer.id, content: notifContent });
        sendCancelEmail(fullBooking.customer.email, fullBooking.customer.full_name, productName, ra, rp)
          .catch(e => console.error('Cancel email error:', e.message));

        // Thông báo cho tài xế nếu đã được gán
        if (fullBooking.assigned_driver) {
          await Notification.create({
            user_id: fullBooking.assigned_driver.id,
            content: `Trip "${productName}" has been cancelled by the customer.`
          });
        }
      }
    } catch (notifErr) {
      console.error('Cancel notification error:', notifErr.message);
    }

    res.json({ message: msg, refundInfo });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// [GET] /api/payments/booking/:bookingId — Xem thông tin payment của booking
const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { booking_id: req.params.bookingId },
      order: [['created_at', 'DESC']]
    });
    res.json({ data: payment });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { createPaymentUrl, vnpayReturn, vnpayIpn, cancelBooking, getPaymentByBooking };
