const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendNewPassword = async (toEmail, newPassword) => {
  await transporter.sendMail({
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
  await transporter.sendMail({
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
        <a href="http://localhost:5173/my-orders" style="display: block; text-align: center; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Xem don va Viet danh gia</a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">PhuOng Tourist Car - Da Nang</p>
      </div>
    `,
  });
};

const sendWelcomeEmail = async (toEmail, fullName) => {
  await transporter.sendMail({
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
            <a href="http://localhost:5173/services"
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

module.exports = { sendNewPassword, sendCompletionEmail, sendWelcomeEmail };
