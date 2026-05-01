const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Setup Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ==========================================
// SWAGGER CONFIGURATION (API DOCUMENTATION)
// ==========================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PhuOng Tourist Car API',
      version: '1.0.0',
      description: 'API documentation system for the PhuOng Tourist Car Booking project',
      contact: {
        name: 'Huynh Doan Tan Phat' // Your name for project credit
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
      },
    ],
    // Enable "Authorize" button (lock icon) for testing secured APIs later
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Scan files with annotations to auto-generate docs (server.js and routes folder)
  apis: ['./src/server.js', './src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// ==========================================


// ==========================================
// ROUTES (API)
// ==========================================
// Gọi file router vừa tạo
const authRoutes = require('./routes/authRoutes');

// Gắn tiền tố /api/auth cho tất cả các route trong file đó
app.use('/api/auth', authRoutes);

// ==========================================


/**
 * @swagger
 * /:
 *   get:
 *     summary: Check server status
 *     description: Returns a message confirming that the backend is running properly.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is running normally
 */
app.get('/', (req, res) => {
  res.json({ message: ' Welcome to PhuOng Tourist Car API!' });
});


// Start server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Base API URL: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`=================================`);
});