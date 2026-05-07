// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  },
  production: {
    // Hỗ trợ DB_URL (Supabase/Render) hoặc biến riêng lẻ
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    logging: false
  }
};
