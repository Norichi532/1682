const nodemailer = require('nodemailer');

// Lazy-init: create a fresh transporter each call so env vars are always
// read at send-time, not at module-load time (important on cloud deployments).
const getTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // must be a 16-char Gmail App Password (no spaces)
    },
  });

const sendNewPassword = async (toEmail, newPassword) => {
  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your new password — PhuOng Tourist Car',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1d4ed8; margin-bottom: 8px;">PhuOng Tourist Car</h2>
        <p style="color: #374151;">Your password has been reset. Here is your new password:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #111827;">${newPassword}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Please log in and change your password immediately after signing in.</p>
      </div>
    `,
  });
};

const sendCompletionEmail = async (toEmail, customerName, productName) => {
  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Chuyến xe của bạn đã hoàn thành — PhuOng Tourist Car',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1d4ed8; margin-bottom: 8px;">PhuOng Tourist Car</h2>
        <p style="color: #374151;">Xin chào <strong>${customerName}</strong>,</p>
        <p style="color: #374151;">Chuyến xe <strong>"${productName}"</strong> của bạn đã hoàn thành. Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</p>
        <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="color: #1d4ed8; font-weight: bold; margin: 0;">Hay de lai danh gia cho chuyen di!</p>
          <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Danh gia cua ban giup chung toi cai thien dich vu tot hon.</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/my-orders" style="display: block; text-align: center; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Xem don va Viet danh gia</a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">PhuOng Tourist Car - Da Nang</p>
      </div>
    `,
  });
};

const sendWelcomeEmail = async (toEmail, fullName) => {
  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Chao mung ban den voi PhuOng Tourist Car!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">PhuOng Tourist Car</h1>
          <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Dich vu xe du lich Da Nang</p>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 12px;">Xin chao <strong>${fullName}</strong>,</p>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Chao mung ban da dang ky tai khoan tai <strong>PhuOng Tourist Car</strong>!
            Chung toi rat vui duoc dong hanh cung ban trong moi hanh trinh kham pha Da Nang va cac vung lan can.
          </p>
          <div style="background: #eff6ff; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #1d4ed8; font-weight: bold; margin: 0 0 12px; font-size: 15px;">Ban co the trai nghiem:</p>
            <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
              <li>Dua don san bay Da Nang nhanh chong, tien loi</li>
              <li>Tour tham quan: Ba Na Hills, Hoi An, Hue</li>
              <li>Dua don san golf chuyen nghiep</li>
            </ul>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.FRONTEND_URL}/services"
               style="display: inline-block; background: #1d4ed8; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
              Kham pha dich vu ngay
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0;">
            Neu ban can ho tro, hay lien he chung toi qua email hoac hotline.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">2025 PhuOng Tourist Car - Da Nang, Viet Nam</p>
        </div>
      </div>
    `,
  });
};

const sendDepositEmail = async (toEmail, customerName, productName, depositAmount, bookingId) => {
  const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Đặt cọc thành công — PhuOng Tourist Car',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;">PhuOng Tourist Car</h1>
          <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px;">Xác nhận thanh toán cọc</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <p style="color:#374151;">Xin chào <strong>${customerName}</strong>,</p>
          <p style="color:#374151;">Chúng tôi đã nhận được khoản đặt cọc cho đơn đặt xe của bạn.</p>
          <div style="background:#eff6ff;border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Dịch vụ</p>
            <p style="margin:0 0 16px;color:#111827;font-weight:bold;font-size:16px;">${productName}</p>
            <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Số tiền đặt cọc (30%)</p>
            <p style="margin:0;color:#1d4ed8;font-weight:bold;font-size:22px;">${fmt(depositAmount)}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;">Mã đơn: <strong>#${bookingId.slice(0,8).toUpperCase()}</strong></p>
          <p style="color:#374151;font-size:14px;">Đơn của bạn đang chờ xếp xe. Chúng tôi sẽ thông báo khi có tài xế được phân công.</p>
          <a href="${process.env.FRONTEND_URL}/my-orders" style="display:block;text-align:center;background:#1d4ed8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;">Xem đơn của tôi</a>
        </div>
        <div style="background:#f9fafb;padding:14px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">PhuOng Tourist Car — Đà Nẵng, Việt Nam</p>
        </div>
      </div>
    `,
  });
};

const sendCancelEmail = async (toEmail, customerName, productName, refundAmount, refundPercent) => {
  const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
  const refundText = refundPercent === 0
    ? 'Không hoàn tiền cọc do hủy trong vòng 24 giờ trước chuyến đi.'
    : `Hoàn <strong>${refundPercent}%</strong> tiền cọc — <strong>${fmt(refundAmount)}</strong> sẽ được hoàn vào tài khoản trong 5–10 ngày làm việc.`;
  const color = refundPercent === 100 ? '#16a34a' : refundPercent === 50 ? '#d97706' : '#dc2626';

  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Xác nhận hủy đơn — PhuOng Tourist Car',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#374151;padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;">PhuOng Tourist Car</h1>
          <p style="color:#d1d5db;margin:6px 0 0;font-size:13px;">Thông báo hủy đơn</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <p style="color:#374151;">Xin chào <strong>${customerName}</strong>,</p>
          <p style="color:#374151;">Đơn đặt xe <strong>"${productName}"</strong> của bạn đã được hủy thành công.</p>
          <div style="background:#fef3f2;border-left:4px solid ${color};border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:${color};font-size:14px;">${refundText}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/services" style="display:block;text-align:center;background:#1d4ed8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;">Đặt xe mới</a>
        </div>
        <div style="background:#f9fafb;padding:14px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">PhuOng Tourist Car — Đà Nẵng, Việt Nam</p>
        </div>
      </div>
    `,
  });
};

const sendConfirmationEmail = async (toEmail, customerName, productName, startTime, driverName, driverPhone, licensePlate) => {
  const fmt = (d) => new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your booking is confirmed — PhuOng Tourist Car',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;">PhuOng Tourist Car</h1>
          <p style="color:#bbf7d0;margin:6px 0 0;font-size:13px;">Booking Confirmed ✓</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <p style="color:#374151;">Hello <strong>${customerName}</strong>,</p>
          <p style="color:#374151;">Great news! Your booking has been confirmed and a driver has been assigned.</p>
          <div style="background:#f0fdf4;border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 12px;color:#15803d;font-weight:bold;font-size:15px;">Booking Details</p>
            <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
              <tr><td style="padding:4px 0;color:#6b7280;width:40%;">Service</td><td style="padding:4px 0;font-weight:bold;">${productName}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Pickup time</td><td style="padding:4px 0;font-weight:bold;">${fmt(startTime)}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Driver</td><td style="padding:4px 0;font-weight:bold;">${driverName}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Driver phone</td><td style="padding:4px 0;font-weight:bold;">${driverPhone}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Vehicle plate</td><td style="padding:4px 0;font-weight:bold;">${licensePlate}</td></tr>
            </table>
          </div>
          <p style="color:#374151;font-size:14px;">If you have any questions, feel free to contact your driver directly or reach us via our support line.</p>
          <a href="${process.env.FRONTEND_URL}/my-orders" style="display:block;text-align:center;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;">View My Booking</a>
        </div>
        <div style="background:#f9fafb;padding:14px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">PhuOng Tourist Car — Da Nang, Vietnam</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendNewPassword, sendCompletionEmail, sendWelcomeEmail, sendDepositEmail, sendCancelEmail, sendConfirmationEmail };
ationEmail = async (toEmail, customerName, productName, startTime, driverName, driverPhone, licensePlate) => {
  const fmt = (d) => new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  await getTransporter().sendMail({
    from: `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your booking is confirmed — PhuOng Tourist Car',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;">PhuOng Tourist Car</h1>
          <p style="color:#bbf7d0;margin:6px 0 0;font-size:13px;">Booking Confirmed</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <p style="color:#374151;">Hello <strong>${customerName}</strong>,</p>
          <p style="color:#374151;">Great news! Your booking has been confirmed and a driver has been assigned.</p>
          <div style="background:#f0fdf4;border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 12px;color:#15803d;font-weight:bold;font-size:15px;">Booking Details</p>
            <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
              <tr><td style="padding:4px 0;color:#6b7280;width:40%;">Service</td><td style="padding:4px 0;font-weight:bold;">${productName}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Pickup time</td><td style="padding:4px 0;font-weight:bold;">${fmt(startTime)}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Driver</td><td style="padding:4px 0;font-weight:bold;">${driverName}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Driver phone</td><td style="padding:4px 0;font-weight:bold;">${driverPhone}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">Vehicle plate</td><td style="padding:4px 0;font-weight:bold;">${licensePlate}</td></tr>
            </table>
          </div>
          <p style="color:#374151;font-size:14px;">If you have any questions, feel free to contact your driver directly or reach us via our support line.</p>
          <a href="${process.env.FRONTEND_URL}/my-orders" style="display:block;text-align:center;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;">View My Booking</a>
        </div>
        <div style="background:#f9fafb;padding:14px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">PhuOng Tourist Car — Da Nang, Vietnam</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendNewPassword, sendCompletionEmail, sendWelcomeEmail, sendDepositEmail, sendCancelEmail, sendConfirmationEmail };

