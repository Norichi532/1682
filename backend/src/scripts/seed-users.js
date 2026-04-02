const bcrypt = require('bcryptjs');
const pool = require('../config/database'); // Đảm bảo đường dẫn này đúng với file database.js của bạn

async function seedUsers() {
    // Danh sách user mẫu khớp với file seed.sql hoặc yêu cầu mới
    const users = [
        { email: 'admin@test.com', password: 'password123', full_name: 'Nguyễn Văn Admin', role_id: 1 },
        { email: 'staff@test.com', password: 'password123', full_name: 'Lê Thị Nhân Viên', role_id: 2 },
        { email: 'driver@test.com', password: 'password123', full_name: 'Trần Văn Tài Xế', role_id: 3 },
        { email: 'customer@test.com', password: 'password123', full_name: 'Phạm Khách Hàng', role_id: 4 }
    ];

    try {
        console.log('🚀 Đang bắt đầu nạp dữ liệu user mẫu...');

        for (const user of users) {
            // 1. Hash mật khẩu
            const hashed = await bcrypt.hash(user.password, 10);

            // 2. Kiểm tra xem user đã tồn tại chưa, nếu chưa thì INSERT, nếu có rồi thì UPDATE mật khẩu
            const query = `
                INSERT INTO users (email, password_hash, full_name, role_id, status)
                VALUES ($1, $2, $3, $4, 'active')
                ON CONFLICT (email) 
                DO UPDATE SET password_hash = $2, full_name = $3, role_id = $4
            `;

            await pool.query(query, [user.email, hashed, user.full_name, user.role_id]);
            console.log(`✅ Đã xử lý user: ${user.email}`);
        }

        console.log('🎉 Hoàn tất nạp dữ liệu mẫu!');
    } catch (err) {
        console.error('❌ Lỗi:', err);
    } finally {
        await pool.end();
    }
}

seedUsers();