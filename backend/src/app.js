const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swagger');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// ─── SECURITY & CORE MIDDLEWARE ──────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// ─── RATE LIMITING ──────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Quá nhiều yêu cầu, thử lại sau.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Quá nhiều lần đăng nhập thất bại, thử lại sau 15 phút.' },
});

app.use('/api/', globalLimiter);

// ─── API DOCS ────────────────────────────────────────────────
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get('/api/v1/health', (req, res) =>
  res.json({ success: true, message: 'Phuong Tourist Car API is running', version: 'v1' })
);

// ─── ROUTES ─────────────────────────────────────────────────
// app.use('/api/v1/auth',         loginLimiter, require('./modules/auth/auth.route'));
// app.use('/api/v1/users',        require('./modules/users/user.route'));
// app.use('/api/v1/vehicles',     require('./modules/vehicles/vehicle.route'));
// app.use('/api/v1/tours',        require('./modules/tours/tour.route'));
// app.use('/api/v1/drivers',      require('./modules/drivers/driver.route'));
// app.use('/api/v1/bookings',     require('./modules/bookings/booking.route'));
// app.use('/api/v1/schedules',    require('./modules/schedules/schedule.route'));
// app.use('/api/v1/payments',     require('./modules/payments/payment.route'));
// app.use('/api/v1/notifications',require('./modules/notifications/notification.route'));

// ─── 404 HANDLER ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint không tồn tại' });
});

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server chạy tại http://localhost:${PORT}`);
  logger.info(`Swagger docs:  http://localhost:${PORT}/api/v1/docs`);
});
