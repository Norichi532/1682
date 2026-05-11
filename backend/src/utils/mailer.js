const sgMail = require('@sendgrid/mail');

// Khởi tạo SendGrid với API key từ biến môi trường
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Địa chỉ người gửi (phải được verify trên SendGrid Sender Authentication)
const FROM_EMAIL = `"PhuOng Tourist Car" <${process.env.MAIL_USER}>`;

const sendNewPassword = async (toEmail, newPassword) => {
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
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
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Chuyến xe của bạn đã hoàn thành — PhuOng Tourist Car',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1d4ed8; margin-bottom: 8px;">PhuOng Tourist Car</h2>
        <p style="color: #374151;">Hello <strong>${customerName}</strong>,</p>
        <p style="color: #374151;">Your trip <strong>"${productName}"</strong> has been completed. Thank you for choosing our service!</p>
        <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="color: #1d4ed8; font-weight: bold; margin: 0;">Please leave a review for your trip!</p>
          <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Your feedback helps us improve our service.</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/my-orders" style="display: block; text-align: center; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View bookings and write reviews.</a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">PhuOng Tourist Car - Da Nang</p>
      </div>
    `,
  });
};

const sendWelcomeEmail = async (toEmail, fullName) => {
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Welcome to PhuOng Tourist Car!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">PhuOng Tourist Car</h1>
          <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Da Nang tourist car service</p>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 12px;">Hello <strong>${fullName}</strong>,</p>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Welcome to your registered account at <strong>PhuOng Tourist Car</strong>!
            We are delighted to accompany you on every journey exploring Da Nang and its surrounding areas.
          </p>
          <div style="background: #eff6ff; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #1d4ed8; font-weight: bold; margin: 0 0 12px; font-size: 15px;">You can experience our services:</p>
            <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
              <li>Fast and convenient airport transfer in Da Nang</li>
              <li>Tours in and around Da Nang</li>
              <li>Professional golf course transfer</li>
            </ul>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.FRONTEND_URL}/services"
               style="display: inline-block; background: #1d4ed8; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
              Explore services
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0;">
            If you need any assistance, please contact us via email or hotline.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">2026 PhuOng Tourist Car - Da Nang, Viet Nam</p>
        </div>
      </div>
    `,
  });
};

const sendDepositEmail = async (toEmail, customerName, productName, depositAmount, bookingId) => {
  const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Deposit Successful — PhuOng Tourist Car',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;">PhuOng Tourist Car</h1>
          <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px;">Confirm deposit payment</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <p style="color:#374151;">Hello <strong>${customerName}</strong>,</p>
          <p style="color:#374151;">We have received your deposit payment for the booking.</p>
          <div style="background:#eff6ff;border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Service</p>
            <p style="margin:0 0 16px;color:#111827;font-weight:bold;font-size:16px;">${productName}</p>
            <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Deposit Amount (30%)</p>
            <p style="margin:0;color:#1d4ed8;font-weight:bold;font-size:22px;">${fmt(depositAmount)}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;">Booking ID: <strong>#${bookingId.slice(0,8).toUpperCase()}</strong></p>
          <p style="color:#374151;font-size:14px;">Your order has been confirmed and is awaiting vehicle allocation. We will notify you as soon as a driver is assigned.</p>
          <a href="${process.env.FRONTEND_URL}/my-orders" style="display:block;text-align:center;background:#1d4ed8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;">View My Orders</a>
        </div>
        <div style="background:#f9fafb;padding:14px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">PhuOng Tourist Car — Da Nang, Vietnam</p>
        </div>
      </div>
    `,
  });
};

const sendCancelEmail = async (toEmail, customerName, productName, refundAmount, refundPercent) => {
  const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
  const refundText = refundPercent === 0
    ? 'No deposit refund as the cancellation was made within 24 hours before the trip.'
    : `Refund <strong>${refundPercent}%</strong> of the deposit — <strong>${fmt(refundAmount)}</strong> will be credited to your account within 5–10 business days.`;
  const color = refundPercent === 100 ? '#16a34a' : refundPercent === 50 ? '#d97706' : '#dc2626';

  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Cancellation Confirmation — PhuOng Tourist Car',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#374151;padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;">PhuOng Tourist Car</h1>
          <p style="color:#d1d5db;margin:6px 0 0;font-size:13px;">Cancellation Notification</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <p style="color:#374151;">Hello <strong>${customerName}</strong>,</p>
          <p style="color:#374151;">Your booking for the service <strong>"${productName}"</strong> has been canceled.</p>
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
  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
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
