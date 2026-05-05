# Hướng dẫn chạy dự án PhuOng Tourist Car

## Yêu cầu
- Node.js >= 18
- PostgreSQL (đang chạy, đã tạo database `phuong_tourist_car`)

## Mật khẩu test
Tất cả tài khoản dùng mật khẩu: `Abc@123456`

| Email | Vai trò |
|-------|---------|
| admin@phuongtravel.vn | Admin |
| an.nguyen@gmail.com | Khách hàng |
| hung.driver@phuongtravel.vn | Tài xế |

## Bước 1 — Chạy Backend

```bash
cd backend
npm install          # Nếu chưa cài
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

> Backend sẽ chạy tại: http://localhost:5000
> Swagger API docs: http://localhost:5000/api-docs

## Bước 2 — Chạy Frontend

```bash
cd frontend
npm install          # Nếu chưa cài
npm run dev
```

> Frontend sẽ chạy tại: http://localhost:5173

## Cấu trúc thư mục

```
Final/
├── backend/
│   └── src/
│       ├── config/        # Cấu hình database
│       ├── controllers/   # Xử lý logic
│       ├── middlewares/   # JWT Auth middleware
│       ├── migrations/    # Tạo bảng DB
│       ├── models/        # Sequelize models
│       ├── routes/        # API routes
│       ├── seeders/       # Dữ liệu mẫu
│       ├── utils/         # Socket utility
│       └── server.js      # Entry point
└── frontend/
    └── src/
        ├── components/    # Navbar, Footer, Layout
        ├── context/       # AuthContext
        ├── pages/         # Tất cả trang
        │   ├── admin/     # Dashboard, Bookings (Admin + Driver)
        │   └── driver/    # Schedule
        └── services/      # Axios API instance
```

## Ghi chú reset DB
```bash
cd backend
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
