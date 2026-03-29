const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./modules/auth/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. MỚI THÊM: Tạo route /api-docs để hiển thị giao diện Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Khai báo Routes API
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Transport & Tour API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📚 Tài liệu API (Swagger): http://localhost:${PORT}/api-docs`); // MỚI THÊM: In ra console cho dễ bấm
});