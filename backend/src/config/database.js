const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, {
      dialect: 'postgres',
      logging: (msg) => logger.debug(msg),
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: (msg) => logger.debug(msg),
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      }
    );

const connectDB = async () => {
  await sequelize.authenticate();
  logger.info('PostgreSQL connected via Sequelize');
};

module.exports = { sequelize, connectDB };
