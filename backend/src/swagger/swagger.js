const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PhuOngtravel — Transport & Tour Management API',
      version: '1.0.0',
      description: 'API documentation for FYP — COMP1682',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.js'],
};

module.exports = swaggerJsdoc(options);
