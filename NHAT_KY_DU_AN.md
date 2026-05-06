# 📋 Nhật Ký Dự Án — PhuOng Tourist Car

> **Đồ án tốt nghiệp** | Hệ thống đặt xe du lịch trực tuyến  
> **Sinh viên:** Huỳnh Đoàn Tấn Phát  
> **Cập nhật lần cuối:** 06/05/2026

---

## 🏗️ Tổng quan dự án

**PhuOng Tourist Car** là hệ thống đặt xe du lịch trực tuyến gồm 3 loại dịch vụ:
- ✈️ Đưa đón sân bay
- 🗺️ Tour du lịch (nhiều ngày)
- ⛳ Đưa đón sân golf

**Công nghệ:**
| Tầng | Công nghệ |
|---|---|
| Backend | Node.js, Express, Sequelize ORM, PostgreSQL |
| Frontend | React + Vite, Tailwind CSS, React Router |
| Realtime | Socket.IO |
| Auth | JWT, Google OAuth 2.0 |
| Thanh toán | VNPay (cổng thanh toán Việt Nam) |
| Upload ảnh | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| API docs | Swagger UI |

---

## 👥 Vai trò hệ thống

| role_id | Vai trò | Quyền |
|---|---|---|
| 1 | Admin | Toàn quyền: quản lý đơn, gán xe/tài xế, xem báo cáo |
| 2 | Khách hàng | Đặt xe, thanh toán, xem đơn, đánh giá |
| 3 | Tài xế | Xem lịch chạy, cập nhật trạng thái chuyến |

---

## 🗄️ Cơ sở dữ liệu

**Database:** `phuong_tourist_car` (PostgreSQL)

### Các bảng chính

| Bảng | Mô tả |
|---|---|
| `roles` | Phân quyền (admin/khách/tài xế) |
| `users` | Tài khoản người dùng |
| `categories` | Danh mục dịch vụ (sân bay, tour, golf) |
| `car_models` | Dòng xe (4 chỗ, 7 chỗ, 16 chỗ, 29 chỗ, 45 chỗ) |
| `cars` | Xe cụ thể (biển số, màu, ảnh) |
| `products` | Sản phẩm/dịch vụ (có `num_days` cho tour) |
| `price_list` | Bảng giá theo product × car_model |
| `bookings` | Đơn đặt xe |
| `payments` | Thanh toán VNPay |
| `notifications` | Thông báo nội bộ |
| `reviews` | Đánh giá sau chuyến |

### Quan hệ quan trọng
- `products` → `categories` (mỗi dịch vụ thuộc 1 danh mục)
- `price_list` → `products` × `car_models` (giá theo từng loại xe)
- `bookings` → `users` (customer), `products`, `car_models`, `cars`, `users` (driver)
- `payments` → `bookings` (1-1)
- `notifications` → `users`

---

## 📁 Cấu trúc thư mục

```
Final/
├── backend/
│   └── src/
│       ├── config/config.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── bookingController.js
│       │   ├── carController.js
│       │   ├── carModelController.js
│       │   ├── categoryController.js
│       │   ├── notificationController.js
│       │   ├── paymentController.js
│       │   ├── productController.js
│       │   ├── reviewController.js
│       │   ├── uploadController.js
│       │   └── userController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── upload.js (Cloudinary multer)
│       ├── migrations/
│       │   ├── 20260430230335-init-database.js
│       │   ├── 20260505000001-add-is-active-to-users.js
│       │   ├── 20260505000002-add-is-active-to-cars.js
│       │   ├── 20260505000003-add-end-time-to-bookings.js
│       │   └── 20260506000001-add-num-days-to-products.js
│       ├── models/
│       │   ├── booking.js, car.js, carModel.js, category.js
│       │   ├── notification.js, payment.js, priceList.js
│       │   ├── product.js, review.js, role.js, user.js
│       │   └── index.js
│       ├── routes/
│       │   ├── authRoutes.js, bookingRoutes.js, carRoutes.js
│       │   ├── carModelRoutes.js, categoryRoutes.js
│       │   ├── notificationRoutes.js, paymentRoutes.js
│       │   ├── productRoutes.js, reviewRoutes.js
│       │   ├── uploadRoutes.js, userRoutes.js
│       ├── seeders/
│       │   └── 20260501083044-demo-phuongtravel-data.js
│       ├── utils/
│       │   ├── mailer.js (Nodemailer)
│       │   └── socket.js (Socket.IO singleton)
│       └── server.js
└── frontend/
    └── src/
        ├── App.jsx (routes)
        ├── main.jsx
        ├── services/api.js (axios instance)
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Footer.jsx
        │   ├── ImageUpload.jsx (Cloudinary upload)
        │   ├── Navbar.jsx
        │   ├── NotificationBell.jsx
        │   ├── ProtectedRoute.jsx
        │   └── PublicLayout.jsx
        └── pages/
            ├── (public) HomePage, ServicesPage, CategoryPage
            ├── (public) ProductDetailPage, VehiclesPage, VehicleDetailPage
            ├── (public) BookingPage, VNPayReturnPage
            ├── (public) LoginPage, RegisterPage, ForgotPasswordPage
            ├── (public) GoogleCallbackPage, ProfilePage
            ├── (public) MyOrdersPage, AboutPage
            ├── admin/
            │   ├── AdminLayout.jsx (sidebar + ProfileModal)
            │   ├── DashboardPage.jsx
            │   ├── BookingsManagePage.jsx
            │   ├── ProductsManagePage.jsx
            │   ├── CarsManagePage.jsx
            │   ├── CarModelsManagePage.jsx
            │   ├── UsersManagePage.jsx
            │   └── CalendarPage.jsx
            └── driver/
                └── SchedulePage.jsx
```

---

## ⚙️ Biến môi trường (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=postgres
DB_NAME=phuong_tourist_car
DB_PORT=5432
DB_PASSWORD=<mật khẩu postgres>

# JWT
JWT_SECRET=<chuỗi bí mật>

# Google OAuth
GOOGLE_CLIENT_ID=<từ Google Console>
GOOGLE_CLIENT_SECRET=<từ Google Console>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173

# Email (Gmail SMTP)
MAIL_USER=phuongtouristcar.dev@gmail.com
MAIL_PASS=<app password>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

# VNPay
VNPAY_TMN_CODE=<mã terminal>
VNPAY_SECURE_SECRET=<hash secret>
VNPAY_RETURN_URL=http://localhost:5173/vnpay-return
```

---

## 🚀 Cách chạy dự án

```bash
# 1. Backend
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev          # chạy trên port 5000

# 2. Frontend
cd frontend
npm install
npm run dev          # chạy trên port 5173
```

---

## ✅ Những gì đã hoàn thành

### 🔧 Backend

#### Auth (`/api/auth`)
- `POST /register` — đăng ký (validate email @gmail, phone 10 số, password 6+ ký tự)
- `POST /login` — đăng nhập JWT (1 ngày)
- `GET /me` — lấy thông tin user hiện tại
- `PATCH /profile` — cập nhật họ tên, số điện thoại
- `PATCH /change-password` — đổi mật khẩu (kiểm tra mật khẩu cũ)
- `POST /forgot-password` — sinh mật khẩu ngẫu nhiên gửi qua email
- `GET /google` — redirect sang Google OAuth
- `GET /google/callback` — nhận code, tạo/link tài khoản Google, gửi welcome email nếu user mới, trả JWT + `is_google` flag

#### Products (`/api/products`)
- CRUD đầy đủ
- `num_days` cho tour (chỉ có ý nghĩa với category_id = 2)
- Kèm bảng giá (`price_list`) theo từng dòng xe

#### Bookings (`/api/bookings`)
- `POST /` — tạo đơn (kiểm tra đặt trước ít nhất 3 ngày)
- Tính `end_time` tự động: tour dùng `product.num_days`, golf +6h, sân bay +3h
- `GET /my` — lịch sử đặt xe của khách
- `GET /admin` — tất cả đơn (dành cho admin)
- `GET /driver` — lịch chạy của tài xế đang đăng nhập
- `PATCH /:id/assign` — admin gán xe + tài xế (kiểm tra trùng lịch)
- `PATCH /:id/status` — admin cập nhật trạng thái
- `PATCH /:id/driver-status` — tài xế cập nhật (`CONFIRMED→IN_PROGRESS→COMPLETED`)

#### Payments (`/api/payments`)
- `POST /create-payment-url` — tạo link VNPay (30% cọc)
- `GET /vnpay-return` — nhận kết quả từ VNPay, xác nhận booking → `CONFIRMED`
- `POST /cancel/:bookingId` — hủy đơn đã CONFIRMED, tính hoàn tiền:
  - ≥ 3 ngày trước chuyến: hoàn 100% cọc
  - 1–3 ngày: hoàn 50%
  - < 24h: không hoàn
- Gửi thông báo cho cả khách và tài xế khi hủy

#### Notifications (`/api/notifications`)
- CRUD thông báo
- Emit Socket.IO (`new_booking`) khi có đơn mới
- Emit thông báo realtime khi hủy đơn

#### Các module khác
- Cars, CarModels, Categories — CRUD đầy đủ
- Users — CRUD, toggle `is_active` (vô hiệu hóa tài khoản)
- Reviews — đánh giá sau khi hoàn thành chuyến
- Upload — ảnh lên Cloudinary
- Reports — thống kê doanh thu, đơn hàng

---

### 🎨 Frontend

#### Trang công khai (khách chưa đăng nhập)
- **HomePage** — banner, giới thiệu dịch vụ, xe nổi bật
- **ServicesPage** — danh sách dịch vụ
- **CategoryPage** — dịch vụ theo danh mục
- **ProductDetailPage** — chi tiết dịch vụ + bảng giá
- **VehiclesPage / VehicleDetailPage** — danh sách xe
- **AboutPage** — giới thiệu công ty + Google Maps nhúng
- **LoginPage** — đăng nhập, logo công ty, nút quay về trang chủ
- **RegisterPage** — đăng ký tài khoản
- **ForgotPasswordPage** — quên mật khẩu
- **GoogleCallbackPage** — xử lý callback Google OAuth

#### Trang khách hàng (role_id = 2)
- **BookingPage** — đặt xe 3 bước (lịch trình → chọn xe → xác nhận)
  - Tour: hiển thị số ngày cố định từ product (không cho khách tự nhập)
  - Sân bay: chọn chiều đi/đến, mã chuyến bay
  - Golf: chọn sân, số túi golf
  - Thanh toán VNPay 30% cọc
- **VNPayReturnPage** — trang kết quả thanh toán
- **MyOrdersPage** — lịch sử đơn đặt, xem trạng thái, đánh giá
- **ProfilePage** — thông tin cá nhân + đổi mật khẩu (ẩn đổi mật khẩu nếu đăng nhập bằng Google)

#### Trang Admin (role_id = 1)
- **DashboardPage** — thống kê tổng quan, doanh thu, cảnh báo đơn chưa gán xe
- **BookingsManagePage** — quản lý đơn đặt xe
  - PENDING: hiện thông tin, chờ khách thanh toán
  - CONFIRMED + chưa gán: hiện form gán xe + tài xế (kiểm tra trùng lịch)
  - CONFIRMED + đã gán: nút hủy đơn
- **ProductsManagePage** — quản lý dịch vụ + bảng giá (có ô Số ngày cho Tour)
- **CarsManagePage** — quản lý xe (ảnh, biển số, màu, tình trạng)
- **CarModelsManagePage** — quản lý dòng xe
- **UsersManagePage** — quản lý tài khoản, toggle khóa/mở tài khoản
- **CalendarPage** — lịch hiển thị các chuyến đã xác nhận

#### Trang Tài xế (role_id = 3)
- **SchedulePage** — lịch chạy xe cá nhân
  - Hiển thị đơn CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
  - Nút "Bắt đầu chuyến" (CONFIRMED → IN_PROGRESS)
  - Nút "Hoàn thành chuyến" (IN_PROGRESS → COMPLETED)
  - Thông tin khách hàng, loại xe, số hiệu bay, túi golf

#### Components dùng chung
- **Navbar** — logo, menu, icon đơn hàng, chuông thông báo, dropdown user
- **AdminLayout** — sidebar với ProfileModal (click avatar để mở)
- **NotificationBell** — chuông thông báo realtime (Socket.IO)
- **ImageUpload** — upload ảnh lên Cloudinary

---

## 🔄 Luồng nghiệp vụ chính

### Đặt xe và thanh toán
```
Khách chọn dịch vụ
  → BookingPage (3 bước)
  → Tạo booking (status: PENDING)
  → Thanh toán VNPay 30% cọc
  → VNPay redirect về /vnpay-return
  → Backend xác nhận → status: CONFIRMED
  → Admin nhận thông báo (Socket.IO)
```

### Gán xe và thực hiện chuyến
```
Admin vào BookingsManagePage
  → Thấy đơn CONFIRMED chưa gán xe
  → Chọn xe + tài xế (hệ thống kiểm tra trùng lịch)
  → Tài xế nhận thông báo
  → Tài xế vào SchedulePage → bấm "Bắt đầu chuyến" → IN_PROGRESS
  → Tài xế bấm "Hoàn thành chuyến" → COMPLETED
  → Khách nhận thông báo + email xác nhận hoàn thành
```

### Hủy đơn
```
Admin hủy đơn CONFIRMED
  → Tính % hoàn tiền dựa vào ngày chuyến
  → Gửi thông báo cho khách (kèm thông tin hoàn tiền)
  → Gửi thông báo cho tài xế (nếu đã gán)
  → status: CANCELLED
```

---

## 🐛 Các lỗi đã xử lý

| Vấn đề | Giải pháp |
|---|---|
| Tour: khách tự nhập số ngày | Thêm `num_days` vào Product, backend tự lấy khi tạo booking |
| Gán xe cho đơn PENDING (chưa cọc) | Chỉ hiện form gán xe khi status = CONFIRMED |
| Google user thấy nút "Đổi mật khẩu" | Backend trả `is_google` flag, frontend ẩn nút nếu `user.is_google = true` |
| Google user mới không nhận email chào | Thêm `sendWelcomeEmail` trong googleCallback khi `isNewUser = true` |
| Thông báo hủy hiện % hoàn tiền dạng số | Đổi sang câu chữ tự nhiên thay vì "Hoàn 50%" |
| Tài xế không nhận thông báo khi đơn bị hủy | Thêm `Notification.create` cho driver trong paymentController |
| ProfilePage trắng xóa | Lỗi JSX: thiếu đóng ngoặc `}` sau `&&` block, đã sửa |
| BookingPage trắng xóa (sau thêm num_days) | `product` không phải prop của `Step1Schedule`, đã đổi sang truyền `numDays` |
| BookingPage blank cho tất cả trang | Lỗi do thêm PublicRoute redirect nhầm, đã revert |

---

## 📌 Cần làm thêm (nếu có thời gian)

- [ ] Chạy migration mới: `npx sequelize-cli db:migrate` (thêm `num_days`)
- [ ] Cập nhật seeder: thêm `num_days` cho các tour demo
- [ ] Deploy backend lên Render
- [ ] Deploy frontend lên Vercel / Netlify
- [ ] Redis caching cho các API thường xuyên gọi
- [ ] Trang đánh giá sau chuyến (UI hoàn chỉnh)

---

## 🗒️ Ghi chú kỹ thuật

**VNPay trên localhost hoạt động được vì:**  
VNPay dùng browser redirect (không phải IPN server-to-server). Khi thanh toán xong, VNPay redirect trình duyệt của user về `VNPAY_RETURN_URL` → trình duyệt tự gọi về localhost. Khi deploy chỉ cần đổi `VNPAY_RETURN_URL` sang domain thật.

**Google OAuth flow:**  
`/api/auth/google` → redirect Google → Google gọi về `/api/auth/google/callback` → backend tạo JWT → redirect về `FRONTEND_URL/auth/google/callback?token=...&user=...` → `GoogleCallbackPage` lưu vào localStorage.

**Socket.IO:**  
Dùng singleton pattern (`utils/socket.js`) để tránh circular import. Controllers gọi `getIo()` để emit sự kiện mà không cần import server trực tiếp.

**Kiểm tra trùng lịch xe/tài xế:**  
Khi gán xe/tài xế, backend tìm các booking khác có `start_time < end_time_mới` AND `end_time > start_time_mới`. Nếu có overlap → báo lỗi kèm thông tin booking xung đột.
