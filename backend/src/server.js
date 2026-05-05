const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const { setIo } = require('./utils/socket');

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
setIo(io); // Store io globally so controllers can use it without circular imports

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PhuOng Tourist Car API',
      version: '1.0.0',
      description: 'API documentation for PhuOng Tourist Car Booking',
      contact: { name: 'Huynh Doan Tan Phat' }
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/server.js', './src/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);


const carModelRoutes = require('./routes/carModelRoutes');
app.use('/api/car-models', carModelRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);
const carRoutes = require('./routes/carRoutes');
app.use('/api/cars', carRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check server status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PhuOng Tourist Car API!' });
});

app.get('/api', (req, res) => {
  res.json({
    message: '✅ PhuOng Tourist Car API đang hoạt động!',
    version: '1.0.0',
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: [
      '/api/auth',
      '/api/products',
      '/api/categories',
      '/api/bookings',
      '/api/cars',
      '/api/notifications',
    ]
  });
});

server.listen(PORT, () => {
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`API:     http://localhost:${PORT}/api`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  console.log('=================================');
});

module.exports = { io };
