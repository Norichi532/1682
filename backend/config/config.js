// config/config.js
require('dotenv').config(); // Nạp file .env

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD), // Ép kiểu chuỗi cho chắc chắn
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false // Tắt log các câu lệnh SQL trên terminal cho đỡ rối mắt
  },
  production: {
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
};