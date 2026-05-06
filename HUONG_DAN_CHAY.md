# PhuOng Tourist Car — Hướng dẫn cài đặt và chạy dự án

Hướng dẫn này dành cho người muốn tải về và chạy dự án trên máy cá nhân bằng **Visual Studio Code**.

---

## Yêu cầu cài đặt trước

| Phần mềm | Phiên bản tối thiểu | Link tải |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| PostgreSQL | 14+ | https://www.postgresql.org/download |
| Git | bất kỳ | https://git-scm.com |
| Visual Studio Code | bất kỳ | https://code.visualstudio.com |

---

## Bước 1 — Tải dự án về máy

Mở terminal (hoặc Terminal trong VS Code) và chạy:

```bash
git clone https://github.com/Norichi532/1682.git
cd 1682
```

Mở thư mục vừa tải trong VS Code:

```bash
code .
```

---

## Bước 2 — Tạo database PostgreSQL

Mở **pgAdmin** hoặc bất kỳ công cụ PostgreSQL nào, tạo một database mới:

```sql
CREATE DATABASE phuong_tourist_car;
```

---

## Bước 3 — Tạo file `.env` cho Backend

Vào thư mục `backend/`, tạo file tên `.env` (không có đuôi mở rộng):

```
backend/
└── .env      ← tạo file này
```

Nội dung file `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phuong_tourist_car
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=any_random_secret_string

# Email (dùng Gmail + App Password)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# Google OAuth (tuỳ chọn — bỏ qua nếu không dùng đăng nhập Google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# VNPay (thanh toán online — điền thông tin sandbox của bạn)
VNPAY_TMN_CODE=71J40SMS
VNPAY_SECURE_SECRET=W380CCFRZ61X1AZUQ84HEUM33QCVDFDN
VNPAY_RETURN_URL=http://localhost:5173/vnpay-return

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

> **Lưu ý:** Thay `your_postgres_password` bằng mật khẩu PostgreSQL thực tế trên máy bạn.
> `MAIL_PASS` là **App Password** của Gmail, không phải mật khẩu Gmail thông thường.
> Xem cách tạo App Password tại: https://myaccount.google.com/apppasswords

---

## Bước 4 — Cài đặt và chạy Backend

Mở terminal trong VS Code, chạy lần lượt:

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

Backend sẽ khởi động tại: **http://localhost:5000**
Swagger API docs: **http://localhost:5000/api-docs**

---

## Bước 5 — Cài đặt và chạy Frontend

Mở một terminal mới trong VS Code (**+** trên thanh terminal), chạy:

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ khởi động tại: **http://localhost:5173**

Mở trình duyệt và truy cập địa chỉ trên để sử dụng.

---

## Tài khoản test có sẵn

Sau khi chạy seed, các tài khoản sau đã được tạo sẵn (mật khẩu đều là `Abc@123456`):

| Email | Vai trò |
|---|---|
| admin@phuongtravel.vn | Quản trị viên |
| an.nguyen@gmail.com | Khách hàng |
| hung.driver@phuongtravel.vn | Tài xế |

---

## Cấu trúc thư mục

```
1682/
├── backend/
│   ├── src/
│   │   ├── config/        # Cấu hình kết nối database
│   │   ├── controllers/   # Xử lý logic nghiệp vụ
│   │   ├── middlewares/   # Xác thực JWT
│   │   ├── migrations/    # Tạo bảng trong database
│   │   ├── models/        # Định nghĩa Sequelize models
│   │   ├── routes/        # Định nghĩa API endpoints
│   │   ├── seeders/       # Dữ liệu mẫu ban đầu
│   │   ├── utils/         # Mailer, Socket.IO helper
│   │   └── server.js      # Điểm khởi động backend
│   └── .sequelizerc
└── frontend/
    └── src/
        ├── assets/        # Hình ảnh tĩnh
        ├── components/    # Navbar, Footer, Layout dùng chung
        ├── context/       # AuthContext (quản lý đăng nhập)
        ├── pages/
        │   ├── admin/     # Trang quản trị
        │   └── driver/    # Trang tài xế
        └── services/      # Cấu hình Axios
```

---

## Reset database (khi cần)

```bash
cd backend
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
