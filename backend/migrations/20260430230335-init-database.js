'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 0. Tạo extension để sinh UUID tự động (Quan trọng cho Postgres)
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // 1. ROLES
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      role_name: { type: Sequelize.STRING(50), unique: true, allowNull: false }
    });

    // 2. USERS
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()'), primaryKey: true },
      role_id: { type: Sequelize.INTEGER, references: { model: 'roles', key: 'id' }, onDelete: 'RESTRICT' },
      full_name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), unique: true, allowNull: false },
      password: { type: Sequelize.STRING(255) },
      phone: { type: Sequelize.STRING(20) },
      avatar_url: { type: Sequelize.TEXT },
      google_id: { type: Sequelize.STRING(255), unique: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 3. CATEGORIES
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      category_name: { type: Sequelize.STRING(100), unique: true, allowNull: false },
      description: { type: Sequelize.TEXT }
    });

    // 4. PRODUCTS (Điểm đến / Tour)
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      category_id: { type: Sequelize.INTEGER, references: { model: 'categories', key: 'id' }, onDelete: 'CASCADE' },
      product_name: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      address: { type: Sequelize.TEXT },
      base_price: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      image_url: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 5. CAR MODELS (Dòng xe)
    await queryInterface.createTable('car_models', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      model_name: { type: Sequelize.STRING(150), allowNull: false },
      num_seats: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.TEXT },
      features: { type: Sequelize.JSONB }, // Giữ JSONB cho features để linh hoạt lưu mảng vd: ["wifi", "water"]
      image_url: { type: Sequelize.TEXT }
    });

    // 6. CARS (Xe cụ thể)
    await queryInterface.createTable('cars', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      model_id: { type: Sequelize.INTEGER, references: { model: 'car_models', key: 'id' }, onDelete: 'CASCADE' },
      driver_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      license_plate: { type: Sequelize.STRING(20), unique: true, allowNull: false },
      color: { type: Sequelize.STRING(50) },
      status: { type: Sequelize.STRING(50), defaultValue: 'AVAILABLE' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 7. PRICE LIST
    await queryInterface.createTable('price_list', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      product_id: { type: Sequelize.INTEGER, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      model_id: { type: Sequelize.INTEGER, references: { model: 'car_models', key: 'id' }, onDelete: 'CASCADE' },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false }
    });
    // Ràng buộc để không trùng lặp giá cho cùng 1 lộ trình và 1 loại xe
    await queryInterface.addConstraint('price_list', {
      fields: ['product_id', 'model_id'],
      type: 'unique',
      name: 'unique_product_model_price'
    });

    // 8. BOOKINGS
    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()'), primaryKey: true },
      customer_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      product_id: { type: Sequelize.INTEGER, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      model_id: { type: Sequelize.INTEGER, references: { model: 'car_models', key: 'id' }, onDelete: 'RESTRICT' },
      car_id: { type: Sequelize.INTEGER, references: { model: 'cars', key: 'id' }, onDelete: 'SET NULL' },
      driver_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      start_time: { type: Sequelize.DATE, allowNull: false },
      total_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      status: { type: Sequelize.STRING(50), defaultValue: 'PENDING' },
      additional_data: { type: Sequelize.JSONB }, // Giữ JSONB cho thông tin chuyến bay, số túi golf
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 9. PAYMENTS
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()'), primaryKey: true },
      booking_id: { type: Sequelize.UUID, references: { model: 'bookings', key: 'id' }, onDelete: 'CASCADE' },
      payment_method: { type: Sequelize.STRING(50), defaultValue: 'PAYOS' },
      transaction_code: { type: Sequelize.STRING(100), unique: true },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      status: { type: Sequelize.STRING(50), defaultValue: 'PENDING' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 10. REVIEWS
    await queryInterface.createTable('reviews', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      booking_id: { type: Sequelize.UUID, references: { model: 'bookings', key: 'id' }, onDelete: 'CASCADE', unique: true },
      customer_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      rating: { type: Sequelize.INTEGER },
      comment: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 11. NOTIFICATIONS
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      content: { type: Sequelize.TEXT, allowNull: false },
      is_read: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('price_list');
    await queryInterface.dropTable('cars');
    await queryInterface.dropTable('car_models');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
  }
};