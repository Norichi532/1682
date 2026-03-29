const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Transport & Tour Management API',
      version: '1.0.0',
      description: 'API documentation for FYP',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Đã sửa lại để ghép với /api/auth ở file route
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // security: [{ bearerAuth: [] }], <-- Tạm thời Comment dòng này lại
  },
  // ĐÃ SỬA LẠI ĐƯỜNG DẪN TÌM KIẾM API
  apis: ['./src/modules/**/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;