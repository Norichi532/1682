'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const salt  = await bcrypt.genSalt(10);
    const pw    = await bcrypt.hash('Pass@123', salt);

    // ── 1. ROLES ──────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('roles', [
      { id: 1, role_name: 'Admin'    },
      { id: 2, role_name: 'Customer' },
      { id: 3, role_name: 'Driver'   },
    ], {});

    // ── 2. USERS  (Vietnamese names kept as required) ─────────────────────────
    await queryInterface.bulkInsert('users', [
      // Admin
      { id: '00000000-0000-0000-0000-000000000001', role_id: 1,
        full_name: 'Quản Trị Viên', email: 'admin@phuongtravel.vn',
        password: pw, phone: '0901000001', is_active: true,
        created_at: now, updated_at: now },
      // Customers
      { id: '00000000-0000-0000-0000-000000000002', role_id: 2,
        full_name: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com',
        password: pw, phone: '0901000002', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000003', role_id: 2,
        full_name: 'Trần Thị Bình', email: 'binh.tran@gmail.com',
        password: pw, phone: '0901000003', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000004', role_id: 2,
        full_name: 'Lê Minh Cường', email: 'cuong.le@gmail.com',
        password: pw, phone: '0901000004', is_active: true,
        created_at: now, updated_at: now },
      // Drivers
      { id: '00000000-0000-0000-0000-000000000011', role_id: 3,
        full_name: 'Tài xế Hùng', email: 'hung.driver@phuongtravel.vn',
        password: pw, phone: '0901000011', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000012', role_id: 3,
        full_name: 'Tài xế Dũng', email: 'dung.driver@phuongtravel.vn',
        password: pw, phone: '0901000012', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000013', role_id: 3,
        full_name: 'Tài xế Khoa', email: 'khoa.driver@phuongtravel.vn',
        password: pw, phone: '0901000013', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000014', role_id: 3,
        full_name: 'Tài xế Tuấn', email: 'tuan.driver@phuongtravel.vn',
        password: pw, phone: '0901000014', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000015', role_id: 3,
        full_name: 'Tài xế Phúc', email: 'phuc.driver@phuongtravel.vn',
        password: pw, phone: '0901000015', is_active: true,
        created_at: now, updated_at: now },
      { id: '00000000-0000-0000-0000-000000000016', role_id: 3,
        full_name: 'Tài xế Linh', email: 'linh.driver@phuongtravel.vn',
        password: pw, phone: '0901000016', is_active: true,
        created_at: now, updated_at: now },
    ], {});

    // ── 3. CATEGORIES ─────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('categories', [
      { id: 1, category_name: 'Airport Transfer',
        description: 'Professional airport pickup and drop-off service',
        created_at: now, updated_at: now },
      { id: 2, category_name: 'Tours',
        description: 'Day tours and multi-day tours around Da Nang & Central Vietnam',
        created_at: now, updated_at: now },
      { id: 3, category_name: 'Golf Transfer',
        description: 'Premium golf course transfer service',
        created_at: now, updated_at: now },
    ], {});

    // ── 4. CAR MODELS ─────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('car_models', [
      {
        id: 1, model_name: 'Toyota Fortuner 7-Seater', num_seats: 7,
        description: 'Comfortable SUV — ideal for small families or private groups',
        features: JSON.stringify(['Air conditioning', 'USB charging ports', 'Premium reclining seats']),
        image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        created_at: now, updated_at: now
      },
      {
        id: 2, model_name: 'Ford Transit 16-Seater', num_seats: 16,
        description: 'Mid-range minibus — perfect for small tour groups',
        features: JSON.stringify(['Air conditioning', 'USB charging ports', 'Entertainment screen']),
        image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
        created_at: now, updated_at: now
      },
      {
        id: 3, model_name: 'Hyundai County 29-Seater', num_seats: 29,
        description: 'Mid-size coach — suitable for medium-sized groups',
        features: JSON.stringify(['Air conditioning', 'Wi-Fi', 'Complimentary bottled water', 'USB charging ports']),
        image_url: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800',
        created_at: now, updated_at: now
      },
      {
        id: 4, model_name: 'Hyundai Universe 45-Seater', num_seats: 45,
        description: 'Premium coach — ideal for large groups and corporate tours',
        features: JSON.stringify(['Air conditioning', 'Wi-Fi', 'Complimentary bottled water', 'Reclining seats', 'TV entertainment', 'Karaoke microphone']),
        image_url: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
        created_at: now, updated_at: now
      },
    ], {});

    // ── 5. CARS ───────────────────────────────────────────────────────────────
    // car id=1,2 → model 2 (16-seat Transit)
    // car id=3,4 → model 3 (29-seat County)
    // car id=5   → model 4 (45-seat Universe)
    // car id=6   → model 1 (7-seat Fortuner)
    await queryInterface.bulkInsert('cars', [
      { id: 1, model_id: 2, driver_id: '00000000-0000-0000-0000-000000000011',
        license_plate: '43B-001.11', color: 'White',
        status: 'AVAILABLE', is_active: true, created_at: now, updated_at: now },
      { id: 2, model_id: 2, driver_id: '00000000-0000-0000-0000-000000000012',
        license_plate: '43B-002.22', color: 'White',
        status: 'AVAILABLE', is_active: true, created_at: now, updated_at: now },
      { id: 3, model_id: 3, driver_id: '00000000-0000-0000-0000-000000000013',
        license_plate: '43B-003.33', color: 'White',
        status: 'AVAILABLE', is_active: true, created_at: now, updated_at: now },
      { id: 4, model_id: 3, driver_id: '00000000-0000-0000-0000-000000000014',
        license_plate: '43B-004.44', color: 'White',
        status: 'AVAILABLE', is_active: true, created_at: now, updated_at: now },
      { id: 5, model_id: 4, driver_id: '00000000-0000-0000-0000-000000000015',
        license_plate: '43B-005.55', color: 'White',
        status: 'AVAILABLE', is_active: true, created_at: now, updated_at: now },
      { id: 6, model_id: 1, driver_id: '00000000-0000-0000-0000-000000000016',
        license_plate: '43A-006.66', color: 'Black',
        status: 'AVAILABLE', is_active: true, created_at: now, updated_at: now },
    ], {});

    // ── 6. PRODUCTS (ids 1–4 only; tours 5–12 are seeded by the next seeder) ─
    await queryInterface.bulkInsert('products', [
      // ── Airport Transfers (category 1) ─────────────────────────────────────
      {
        id: 1, category_id: 1,
        product_name: 'Airport Transfer – Da Nang City',
        description: 'Professional pickup and drop-off service between Da Nang International Airport and hotels, guesthouses, and resorts within Da Nang city.',
        address: 'Da Nang International Airport',
        image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
        created_at: now, updated_at: now
      },
      {
        id: 2, category_id: 1,
        product_name: 'Airport Transfer – Da Nang to Hoi An',
        description: 'Comfortable and reliable transfer from Da Nang International Airport to the UNESCO-listed Ancient Town of Hoi An, Quang Nam province.',
        address: 'Da Nang International Airport',
        image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
        created_at: now, updated_at: now
      },
      {
        id: 3, category_id: 1,
        product_name: 'Airport Transfer – Da Nang to Hue',
        description: 'Reliable transfer service from Da Nang Airport to hotels, resorts, and guesthouses in the ancient imperial city of Hue.',
        address: 'Da Nang International Airport',
        image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
        created_at: now, updated_at: now
      },
      // ── Golf Transfer (category 3) ──────────────────────────────────────────
      {
        id: 4, category_id: 3,
        product_name: 'Golf Transfer – BRG Da Nang Golf Resort',
        description: 'Premium transfer to BRG Da Nang Golf Resort, an award-winning 18-hole championship seaside course designed by Luke Donald.',
        address: 'BRG Golf Club, Da Nang',
        image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
        created_at: now, updated_at: now
      },
    ], {});

    // ── 7. PRICE LIST – products 1–4 × all car models 1–4 ───────────────────
    await queryInterface.bulkInsert('price_list', [
      // Product 1 – Airport → Da Nang City
      { product_id: 1, model_id: 1, price:  400000, created_at: now, updated_at: now },
      { product_id: 1, model_id: 2, price:  600000, created_at: now, updated_at: now },
      { product_id: 1, model_id: 3, price:  700000, created_at: now, updated_at: now },
      { product_id: 1, model_id: 4, price: 1000000, created_at: now, updated_at: now },
      // Product 2 – Airport → Hoi An
      { product_id: 2, model_id: 1, price:  700000, created_at: now, updated_at: now },
      { product_id: 2, model_id: 2, price: 1000000, created_at: now, updated_at: now },
      { product_id: 2, model_id: 3, price: 1400000, created_at: now, updated_at: now },
      { product_id: 2, model_id: 4, price: 2000000, created_at: now, updated_at: now },
      // Product 3 – Airport → Hue
      { product_id: 3, model_id: 1, price: 1800000, created_at: now, updated_at: now },
      { product_id: 3, model_id: 2, price: 2700000, created_at: now, updated_at: now },
      { product_id: 3, model_id: 3, price: 3700000, created_at: now, updated_at: now },
      { product_id: 3, model_id: 4, price: 4700000, created_at: now, updated_at: now },
      // Product 4 – Golf BRG
      { product_id: 4, model_id: 1, price:  900000, created_at: now, updated_at: now },
      { product_id: 4, model_id: 2, price: 1400000, created_at: now, updated_at: now },
      { product_id: 4, model_id: 3, price: 1800000, created_at: now, updated_at: now },
      { product_id: 4, model_id: 4, price: 2700000, created_at: now, updated_at: now },
    ], {});

    // ── 8. BOOKINGS (only products 1–4; tour bookings are in the next seeder) ─
    const B1 = '10000000-0000-0000-0000-000000000001';
    const B2 = '10000000-0000-0000-0000-000000000002';
    const B3 = '10000000-0000-0000-0000-000000000003';
    const B4 = '10000000-0000-0000-0000-000000000004';
    const B5 = '10000000-0000-0000-0000-000000000005';

    await queryInterface.bulkInsert('bookings', [
      // B1 – Nguyễn Văn An | Airport→City | 16-seat Transit | COMPLETED (past)
      {
        id: B1,
        customer_id: '00000000-0000-0000-0000-000000000002',
        product_id: 1, model_id: 2, car_id: 1,
        driver_id: '00000000-0000-0000-0000-000000000011',
        start_time: new Date('2026-04-20T08:00:00'),
        end_time:   new Date('2026-04-20T11:00:00'),
        total_price: 600000, status: 'COMPLETED',
        additional_data: JSON.stringify({
          terminal: 'International', flight_code: 'VN123',
          pickup_location: 'Da Nang International Airport',
          dropoff_location: 'Mường Thanh Luxury Hotel',
          contact_name: 'Nguyễn Văn An', contact_phone: '0901000002',
          num_passengers: 12
        }),
        created_at: now, updated_at: now
      },
      // B2 – Trần Thị Bình | Golf BRG | 29-seat County | COMPLETED (past)
      {
        id: B2,
        customer_id: '00000000-0000-0000-0000-000000000003',
        product_id: 4, model_id: 3, car_id: 3,
        driver_id: '00000000-0000-0000-0000-000000000013',
        start_time: new Date('2026-04-25T06:30:00'),
        end_time:   new Date('2026-04-25T19:00:00'),
        total_price: 1800000, status: 'COMPLETED',
        additional_data: JSON.stringify({
          from_golf: false, golf_bags: 8,
          pickup_location: 'Fusion Suites Da Nang',
          dropoff_location: 'BRG Golf Club',
          contact_name: 'Trần Thị Bình', contact_phone: '0901000003',
          num_passengers: 20
        }),
        created_at: now, updated_at: now
      },
      // B3 – Lê Minh Cường | Airport→Hoi An | 16-seat Transit | CONFIRMED (upcoming)
      {
        id: B3,
        customer_id: '00000000-0000-0000-0000-000000000004',
        product_id: 2, model_id: 2, car_id: 2,
        driver_id: '00000000-0000-0000-0000-000000000012',
        start_time: new Date('2026-05-20T10:30:00'),
        end_time:   new Date('2026-05-20T13:30:00'),
        total_price: 1000000, status: 'CONFIRMED',
        additional_data: JSON.stringify({
          terminal: 'Domestic', flight_code: 'VJ456',
          pickup_location: 'Da Nang Airport – Domestic Terminal',
          dropoff_location: 'La Siesta Resort Hoi An',
          contact_name: 'Lê Minh Cường', contact_phone: '0901000004',
          num_passengers: 10
        }),
        created_at: now, updated_at: now
      },
      // B4 – Nguyễn Văn An | Airport→City | 7-seat Fortuner | CONFIRMED (upcoming)
      {
        id: B4,
        customer_id: '00000000-0000-0000-0000-000000000002',
        product_id: 1, model_id: 1, car_id: 6,
        driver_id: '00000000-0000-0000-0000-000000000016',
        start_time: new Date('2026-05-25T14:00:00'),
        end_time:   new Date('2026-05-25T17:00:00'),
        total_price: 400000, status: 'CONFIRMED',
        additional_data: JSON.stringify({
          terminal: 'International', flight_code: 'QH789',
          pickup_location: 'Da Nang Airport – International Terminal',
          dropoff_location: 'Novotel Premier Han River',
          contact_name: 'Nguyễn Văn An', contact_phone: '0901000002',
          num_passengers: 5
        }),
        created_at: now, updated_at: now
      },
      // B5 – Trần Thị Bình | Airport→Hue | 45-seat Universe | PENDING (awaiting car assignment)
      {
        id: B5,
        customer_id: '00000000-0000-0000-0000-000000000003',
        product_id: 3, model_id: 4, car_id: null, driver_id: null,
        start_time: new Date('2026-06-05T09:00:00'),
        end_time:   new Date('2026-06-05T14:00:00'),
        total_price: 4700000, status: 'PENDING',
        additional_data: JSON.stringify({
          terminal: 'International', flight_code: 'VN301',
          pickup_location: 'Da Nang Airport – International Terminal',
          dropoff_location: 'La Residence Hotel & Spa Hue',
          contact_name: 'Trần Thị Bình', contact_phone: '0901000003',
          num_passengers: 40
        }),
        created_at: now, updated_at: now
      },
    ], {});

    // ── 9. PAYMENTS (30% deposit — only for non-PENDING bookings) ─────────────
    await queryInterface.bulkInsert('payments', [
      // B1 completed – 30% of 600,000
      { id: '20000000-0000-0000-0000-000000000001',
        booking_id: B1, payment_method: 'VNPAY',
        transaction_code: 'VNPAY-SEED-001', amount: 180000,
        status: 'SUCCESS', created_at: now, updated_at: now },
      // B2 completed – 30% of 1,800,000
      { id: '20000000-0000-0000-0000-000000000002',
        booking_id: B2, payment_method: 'VNPAY',
        transaction_code: 'VNPAY-SEED-002', amount: 540000,
        status: 'SUCCESS', created_at: now, updated_at: now },
      // B3 confirmed – 30% of 1,000,000
      { id: '20000000-0000-0000-0000-000000000003',
        booking_id: B3, payment_method: 'VNPAY',
        transaction_code: 'VNPAY-SEED-003', amount: 300000,
        status: 'SUCCESS', created_at: now, updated_at: now },
      // B4 confirmed – 30% of 400,000
      { id: '20000000-0000-0000-0000-000000000004',
        booking_id: B4, payment_method: 'VNPAY',
        transaction_code: 'VNPAY-SEED-004', amount: 120000,
        status: 'SUCCESS', created_at: now, updated_at: now },
    ], {});

    // ── 10. REVIEWS (only COMPLETED bookings) ────────────────────────────────
    await queryInterface.bulkInsert('reviews', [
      {
        booking_id: B1,
        customer_id: '00000000-0000-0000-0000-000000000002',
        rating: 5,
        comment: 'Driver was very punctual and friendly. The vehicle was clean and comfortable. Highly recommend!',
        created_at: now, updated_at: now
      },
      {
        booking_id: B2,
        customer_id: '00000000-0000-0000-0000-000000000003',
        rating: 4,
        comment: 'Great service for our golf group. The coach had plenty of room for all our equipment. Will definitely book again.',
        created_at: now, updated_at: now
      },
    ], {});

    // ── 11. NOTIFICATIONS ─────────────────────────────────────────────────────
    await queryInterface.bulkInsert('notifications', [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        content: 'New booking from Trần Thị Bình (Airport → Hue) is awaiting car assignment.',
        is_read: false, created_at: now, updated_at: now
      },
      {
        user_id: '00000000-0000-0000-0000-000000000002',
        content: 'Your airport transfer has been completed. Thank you for choosing PhuOng Tourist Car!',
        is_read: true, created_at: now, updated_at: now
      },
      {
        user_id: '00000000-0000-0000-0000-000000000011',
        content: 'You have been assigned a new airport transfer on May 25, 2026 at 14:00.',
        is_read: false, created_at: now, updated_at: now
      },
    ], {});
  },

  // ── DOWN ──────────────────────────────────────────────────────────────────
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
    await queryInterface.bulkDelete('reviews',       null, {});
    await queryInterface.bulkDelete('payments',      null, {});
    await queryInterface.bulkDelete('bookings',      null, {});
    await queryInterface.bulkDelete('price_list',    null, {});
    await queryInterface.bulkDelete('products',      null, {});
    await queryInterface.bulkDelete('cars',          null, {});
    await queryInterface.bulkDelete('car_models',    null, {});
    await queryInterface.bulkDelete('categories',    null, {});
    await queryInterface.bulkDelete('users',         null, {});
    await queryInterface.bulkDelete('roles',         null, {});
  }
};
