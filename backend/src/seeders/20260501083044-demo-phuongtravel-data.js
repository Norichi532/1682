'use strict';
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker/locale/vi');

module.exports = {
  async up(queryInterface, Sequelize) {
    const currentTime = new Date();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Abc@123456', salt);

    // 1. ROLES
    await queryInterface.bulkInsert('roles', [
      { id: 1, role_name: 'Admin' },
      { id: 2, role_name: 'Customer' },
      { id: 3, role_name: 'Driver' },
    ], {});

    // 2. USERS
    await queryInterface.bulkInsert('users', [
      // Admin
      {
        id: '00000000-0000-0000-0000-000000000001',
        role_id: 1, full_name: 'Quản Trị Viên',
        email: 'admin@phuongtravel.vn', password: hashedPassword,
        phone: '0901000001', created_at: currentTime, updated_at: currentTime
      },
      // Customers
      {
        id: '00000000-0000-0000-0000-000000000002',
        role_id: 2, full_name: 'Nguyễn Văn An',
        email: 'an.nguyen@gmail.com', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        role_id: 2, full_name: 'Trần Thị Bình',
        email: 'binh.tran@gmail.com', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        role_id: 2, full_name: 'Lê Minh Cường',
        email: 'cuong.le@gmail.com', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      // Drivers
      {
        id: '00000000-0000-0000-0000-000000000011',
        role_id: 3, full_name: 'Tài xế Hùng',
        email: 'hung.driver@phuongtravel.vn', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      {
        id: '00000000-0000-0000-0000-000000000012',
        role_id: 3, full_name: 'Tài xế Dũng',
        email: 'dung.driver@phuongtravel.vn', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      {
        id: '00000000-0000-0000-0000-000000000013',
        role_id: 3, full_name: 'Tài xế Khoa',
        email: 'khoa.driver@phuongtravel.vn', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      {
        id: '00000000-0000-0000-0000-000000000014',
        role_id: 3, full_name: 'Tài xế Tuấn',
        email: 'tuan.driver@phuongtravel.vn', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
      {
        id: '00000000-0000-0000-0000-000000000015',
        role_id: 3, full_name: 'Tài xế Phúc',
        email: 'phuc.driver@phuongtravel.vn', password: hashedPassword,
        phone: `09${faker.string.numeric(8)}`, created_at: currentTime, updated_at: currentTime
      },
    ], {});

    // 3. CATEGORIES
    await queryInterface.bulkInsert('categories', [
      { id: 1, category_name: 'Đưa đón Sân Bay', description: 'Dịch vụ đưa đón sân bay chuyên nghiệp', created_at: currentTime, updated_at: currentTime },
      { id: 2, category_name: 'Tour Du Lịch', description: 'Các tour du lịch trong ngày và nhiều ngày', created_at: currentTime, updated_at: currentTime },
      { id: 3, category_name: 'Sân Golf', description: 'Đưa đón sân golf cao cấp', created_at: currentTime, updated_at: currentTime },
    ], {});

    // 4. CAR MODELS (id=2,3,4 — no id=1)
    await queryInterface.bulkInsert('car_models', [
      {
        id: 2, model_name: 'Ford Transit 16 chỗ', num_seats: 16,
        description: 'Xe trung cấp, phù hợp đoàn nhỏ',
        features: JSON.stringify(['Điều hòa', 'USB sạc điện thoại', 'Màn hình giải trí']),
        image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: 3, model_name: 'Hyundai County 29 chỗ', num_seats: 29,
        description: 'Xe trung lớn, phù hợp đoàn vừa',
        features: JSON.stringify(['Điều hòa', 'Wifi', 'Nước uống miễn phí', 'USB sạc điện thoại']),
        image_url: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: 4, model_name: 'Hyundai Universe 45 chỗ', num_seats: 45,
        description: 'Xe cao cấp, phù hợp đoàn lớn',
        features: JSON.stringify(['Điều hòa', 'Wifi', 'Nước uống miễn phí', 'Ghế ngả êm ái', 'Tivi giải trí', 'Micro karaoke']),
        image_url: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
        created_at: currentTime, updated_at: currentTime
      },
    ], {});

    // 5. CARS (all white / màu trắng)
    await queryInterface.bulkInsert('cars', [
      { id: 1, model_id: 2, driver_id: '00000000-0000-0000-0000-000000000011', license_plate: '43A-001.11', color: 'Trắng', status: 'AVAILABLE', created_at: currentTime, updated_at: currentTime },
      { id: 2, model_id: 2, driver_id: '00000000-0000-0000-0000-000000000012', license_plate: '43A-002.22', color: 'Trắng', status: 'AVAILABLE', created_at: currentTime, updated_at: currentTime },
      { id: 3, model_id: 3, driver_id: '00000000-0000-0000-0000-000000000013', license_plate: '43B-003.33', color: 'Trắng', status: 'AVAILABLE', created_at: currentTime, updated_at: currentTime },
      { id: 4, model_id: 3, driver_id: '00000000-0000-0000-0000-000000000014', license_plate: '43B-004.44', color: 'Trắng', status: 'AVAILABLE', created_at: currentTime, updated_at: currentTime },
      { id: 5, model_id: 4, driver_id: '00000000-0000-0000-0000-000000000015', license_plate: '43C-005.55', color: 'Trắng', status: 'AVAILABLE', created_at: currentTime, updated_at: currentTime },
    ], {});

    // 6. PRODUCTS (9 routes)
    await queryInterface.bulkInsert('products', [
      // Sân Bay (cat 1)
      {
        id: 1, category_id: 1,
        product_name: 'Đưa đón Sân bay Đà Nẵng – Nội thành',
        description: 'Dịch vụ đưa đón từ sân bay Đà Nẵng đến các khách sạn, nhà hàng trong nội thành Đà Nẵng.',
        address: 'Sân bay Quốc tế Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: 2, category_id: 1,
        product_name: 'Đưa đón Sân bay Đà Nẵng – Hội An',
        description: 'Đưa đón từ sân bay Đà Nẵng đến phố cổ Hội An, Quảng Nam.',
        address: 'Sân bay Quốc tế Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: 3, category_id: 1,
        product_name: 'Đưa đón Sân bay Đà Nẵng – Huế',
        description: 'Đưa đón từ sân bay Đà Nẵng về các khách sạn tại Huế.',
        address: 'Sân bay Quốc tế Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      // Tour (cat 2)
      {
        id: 4, category_id: 2,
        product_name: 'Tour Bà Nà Hills',
        description: 'Khám phá Bà Nà Hills, cầu Vàng và làng Pháp huyền bí.',
        address: 'Bà Nà Hills, Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: 5, category_id: 2,
        product_name: 'Tour Hội An – Mỹ Sơn',
        description: 'Tham quan phố cổ Hội An và thánh địa Mỹ Sơn trong ngày.',
        address: 'Hội An, Quảng Nam',
        image_url: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: 6, category_id: 2,
        product_name: 'Tour Ngũ Hành Sơn – Cù Lao Chàm',
        description: 'Thăm Ngũ Hành Sơn huyền bí và đảo Cù Lao Chàm trong xanh.',
        address: 'Ngũ Hành Sơn, Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        created_at: currentTime, updated_at: currentTime
      },
      // Sân Golf (cat 3)
      {
        id: 7, category_id: 3,
        product_name: 'Đưa đón Sân Golf BRG Đà Nẵng',
        description: 'Dịch vụ đưa đón đến sân golf BRG Đà Nẵng, chuẩn 18 lỗ quốc tế.',
        address: 'BRG Golf Club, Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
        created_at: currentTime, updated_at: currentTime
      },
    ], {});

    // 7. PRICE LIST (9 products × 3 models = 27 entries)
    // basePrices[productId] = [price_model2, price_model3, price_model4]
    // Giá theo bảng giá thực tế [16 chỗ, 29 chỗ, 45 chỗ]
    // Nguồn: Báo giá khách Việt & Báo giá Golf (đơn vị: VNĐ)
    const basePrices = {
      1: [600000,   700000,  1000000], // Đưa đón SB ĐN – Nội thành
      2: [1000000,  1400000, 2000000], // Đưa đón SB ĐN – Hội An
      3: [2700000,  3700000, 4700000], // Đưa đón SB ĐN – Huế
      4: [1200000,  2000000, 2500000], // Tour Bà Nà Hills
      5: [1500000,  2200000, 3000000], // Tour Hội An – Mỹ Sơn
      6: [1200000,  2000000, 2500000], // Tour Ngũ Hành Sơn – Cù Lao Chàm
      7: [1400000,  1800000, 2700000], // Đưa đón Sân Golf BRG Đà Nẵng
    };

    const priceListData = [];
    for (let productId = 1; productId <= 7; productId++) {
      const prices = basePrices[productId];
      [2, 3, 4].forEach((modelId, idx) => {
        priceListData.push({
          product_id: productId,
          model_id: modelId,
          price: prices[idx],
          created_at: currentTime,
          updated_at: currentTime
        });
      });
    }
    await queryInterface.bulkInsert('price_list', priceListData, {});

    // 8. BOOKINGS (sample)
    const b1Id = '10000000-0000-0000-0000-000000000001';
    const b2Id = '10000000-0000-0000-0000-000000000002';
    const b3Id = '10000000-0000-0000-0000-000000000003';

    await queryInterface.bulkInsert('bookings', [
      {
        id: b1Id,
        customer_id: '00000000-0000-0000-0000-000000000002',
        product_id: 1, model_id: 2, car_id: 1,
        driver_id: '00000000-0000-0000-0000-000000000011',
        start_time: new Date('2026-05-10T08:00:00'),
        total_price: 600000, status: 'COMPLETED',
        additional_data: JSON.stringify({ flight_code: 'VN123', note: 'Đón tại cửa B' }),
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: b2Id,
        customer_id: '00000000-0000-0000-0000-000000000003',
        product_id: 4, model_id: 3, car_id: 3,
        driver_id: '00000000-0000-0000-0000-000000000013',
        start_time: new Date('2026-05-15T07:00:00'),
        total_price: 1500000, status: 'CONFIRMED',
        additional_data: JSON.stringify({ note: 'Đoàn 20 người' }),
        created_at: currentTime, updated_at: currentTime
      },
      {
        id: b3Id,
        customer_id: '00000000-0000-0000-0000-000000000004',
        product_id: 7, model_id: 2, car_id: null,
        driver_id: null,
        start_time: new Date('2026-05-20T06:30:00'),
        total_price: 500000, status: 'PENDING',
        additional_data: JSON.stringify({ golf_bags: 4, note: '' }),
        created_at: currentTime, updated_at: currentTime
      },
    ], {});

    // 9. PAYMENTS
    await queryInterface.bulkInsert('payments', [
      {
        id: '20000000-0000-0000-0000-000000000001',
        booking_id: b1Id, payment_method: 'PAYOS',
        transaction_code: 'PAYOS-001', amount: 600000,
        status: 'PAID', created_at: currentTime, updated_at: currentTime
      },
      {
        id: '20000000-0000-0000-0000-000000000002',
        booking_id: b2Id, payment_method: 'PAYOS',
        transaction_code: 'PAYOS-002', amount: 1500000,
        status: 'PAID', created_at: currentTime, updated_at: currentTime
      },
    ], {});

    // 10. REVIEWS
    await queryInterface.bulkInsert('reviews', [
      {
        booking_id: b1Id,
        customer_id: '00000000-0000-0000-0000-000000000002',
        rating: 5,
        comment: 'Xe sạch, tài xế thân thiện, đúng giờ. Rất hài lòng!',
        created_at: currentTime, updated_at: currentTime
      },
    ], {});

    // 11. NOTIFICATIONS
    await queryInterface.bulkInsert('notifications', [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        content: 'Đơn đặt xe mới từ khách hàng Lê Minh Cường đang chờ xử lý.',
        is_read: false, created_at: currentTime, updated_at: currentTime
      },
      {
        user_id: '00000000-0000-0000-0000-000000000002',
        content: 'Đơn đặt xe của bạn đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!',
        is_read: true, created_at: currentTime, updated_at: currentTime
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    await queryInterface.bulkDelete('bookings', null, {});
    await queryInterface.bulkDelete('price_list', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('cars', null, {});
    await queryInterface.bulkDelete('car_models', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
