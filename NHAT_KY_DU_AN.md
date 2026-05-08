# 📋 Nhật Ký Dự Án — PhuOng Tourist Car

> **Đồ án tốt nghiệp** | Hệ thống đặt xe du lịch trực tuyến  
> **Sinh viên:** Huỳnh Đoàn Tấn Phát  
> **Cập nhật lần cuối:** 08/05/2026

---

## 🏗️ Tổng quan dự án

**PhuOng Tourist Car** là hệ thống đặt xe du lịch trực tuyến gồm 3 loại dịch vụ:
- ✈️ Đưa đón sân bay
- 🗺️ Tour du lịch (1 ngày và nhiều ngày)
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
| Deploy | Render (backend) + Vercel (frontend) + Supabase (DB) |

---

## 👥 Vai trò hệ thống

| role_id | Vai trò | Quyền |
|---|---|---|
| 1 | Admin | Toàn quyền: quản lý đơn, gán xe/tài xế, xem báo cáo |
| 2 | Khách hàng | Đặt xe, thanh toán, xem đơn, đánh giá |
| 3 | Tài xế | Xem lịch chạy, cập nhật trạng thái chuyến |

---

## 🗄️ Cơ sở dữ liệu

**Database:** `phuong_tourist_car` (PostgreSQL / Supabase)

### Các bảng chính

| Bảng | Mô tả |
|---|---|
| `roles` | Phân quyền (admin/khách/tài xế) |
| `users` | Tài khoản người dùng |
| `categories` | Danh mục dịch vụ (sân bay, tour, golf) |
| `car_models` | Dòng xe — có `images` JSONB (gallery nhiều ảnh) |
| `cars` | Xe cụ thể (biển số, màu, ảnh) |
| `products` | Sản phẩm/dịch vụ — có `num_days` và `itinerary` JSONB cho tour |
| `price_list` | Bảng giá theo product × car_model |
| `bookings` | Đơn đặt xe |
| `payments` | Thanh toán VNPay |
| `notifications` | Thông báo nội bộ |
| `reviews` | Đánh giá sau chuyến |

### Migrations đã chạy

| File | Mô tả |
|---|---|
| `20260430230335-init-database.js` | Khởi tạo toàn bộ 11 bảng |
| `20260505000001-add-is-active-to-users.js` | Thêm `is_active` vào users |
| `20260505000002-add-is-active-to-cars.js` | Thêm `is_active` vào cars |
| `20260505000003-add-end-time-to-bookings.js` | Thêm `end_time` vào bookings |
| `20260506000001-add-num-days-to-products.js` | Thêm `num_days` vào products (cho tour) |
| `20260507000001-add-images-to-car-models.js` | Thêm `images` JSONB vào car_models (gallery) |
| `20260507000002-add-itinerary-to-products.js` | Thêm `itinerary` JSONB vào products (lịch trình tour) |

### Cấu trúc `itinerary` JSONB (products)
```json
[
  {
    "day": 1,
    "label": "Ngày 1 — Đà Nẵng City Tour",
    "items": [
      { "time": "07h30", "desc": "Xe đón khách tại khách sạn..." },
      { "time": "08h00", "desc": "Tham quan Chùa Linh Ứng Sơn Trà..." }
    ]
  },
  {
    "day": 2,
    "label": "Ngày 2 — Bà Nà Hills",
    "items": [...]
  }
]
```

---

## 📁 Cấu trúc thư mục

```
Final/
├── backend/
│   ├── seed-tours.js               ← Script thêm 8 tour từ docx lịch trình
│   └── src/
│       ├── config/config.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── bookingController.js   ← kiểm tra trùng lịch xe/tài xế
│       │   ├── carController.js
│       │   ├── carModelController.js  ← hỗ trợ images gallery
│       │   ├── categoryController.js
│       │   ├── notificationController.js
│       │   ├── paymentController.js
│       │   ├── productController.js   ← hỗ trợ itinerary
│       │   ├── reviewController.js
│       │   ├── uploadController.js
│       │   └── userController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── upload.js
│       ├── migrations/             ← 7 migration files
│       ├── models/
│       │   ├── carModel.js         ← có images JSONB
│       │   ├── product.js          ← có num_days + itinerary JSONB
│       │   └── (booking, car, category, notification, payment, priceList, review, role, user, index)
│       ├── routes/
│       ├── seeders/
│       │   └── 20260501083044-demo-phuongtravel-data.js
│       ├── utils/
│       │   ├── mailer.js           ← dùng FRONTEND_URL env (đã fix)
│       │   └── socket.js
│       └── server.js
└── frontend/
    ├── vercel.json                 ← SPA routing (ở root frontend/, KHÔNG trong public/)
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── services/api.js         ← dùng VITE_API_URL env
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Footer.jsx          ← email phuongtouristcar.dev@gmail.com
        │   ├── ImageUpload.jsx
        │   ├── Navbar.jsx
        │   ├── NotificationBell.jsx
        │   ├── ProtectedRoute.jsx
        │   └── PublicLayout.jsx
        └── pages/
            ├── HomePage.jsx        ← badge clickable → Google Maps popup
            ├── ServicesPage.jsx
            ├── CategoryPage.jsx
            ├── ProductDetailPage.jsx  ← timeline itinerary + badge num_days
            ├── VehiclesPage.jsx
            ├── VehicleDetailPage.jsx  ← gallery ảnh + thumbnails (fixed hooks)
            ├── BookingPage.jsx        ← terminal sân bay, validate >45 khách, golf labels fix
            ├── VNPayReturnPage.jsx
            ├── LoginPage.jsx          ← Google OAuth href dùng VITE_API_URL
            ├── RegisterPage.jsx       ← Google OAuth href dùng VITE_API_URL
            ├── ForgotPasswordPage.jsx
            ├── GoogleCallbackPage.jsx
            ├── ProfilePage.jsx
            ├── MyOrdersPage.jsx
            ├── AboutPage.jsx          ← địa chỉ/SĐT/email đã cập nhật
            ├── admin/
            │   ├── AdminLayout.jsx    ← xóa nút "Về trang chủ"
            │   ├── DashboardPage.jsx
            │   ├── BookingsManagePage.jsx
            │   ├── ProductsManagePage.jsx  ← tab Lịch trình + ItineraryEditor
            │   ├── CarsManagePage.jsx
            │   ├── CarModelsManagePage.jsx ← gallery nhiều ảnh
            │   ├── UsersManagePage.jsx
            │   └── CalendarPage.jsx
            └── driver/
                └── SchedulePage.jsx
```

---

## ⚙️ Biến môi trường (.env)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=postgres
DB_NAME=phuong_tourist_car
DB_PORT=5432
DB_PASSWORD=<mật khẩu postgres>

JWT_SECRET=<chuỗi bí mật>

GOOGLE_CLIENT_ID=<từ Google Console>
GOOGLE_CLIENT_SECRET=<từ Google Console>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173

MAIL_USER=phuongtouristcar.dev@gmail.com
MAIL_PASS=<app password>

CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

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
node seed-tours.js      # ← thêm 8 tour với lịch trình đầy đủ
npm run dev             # port 5000

# 2. Frontend
cd frontend
npm install
npm run dev             # port 5173
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
- `GET /google/callback` — nhận code, tạo/link tài khoản, gửi welcome email nếu user mới, trả JWT + `is_google` flag

#### Products (`/api/products`)
- CRUD đầy đủ
- `num_days` cho tour (category_id = 2)
- `itinerary` JSONB — lịch trình chi tiết theo ngày/giờ cho tour
- Kèm bảng giá (`price_list`) theo từng dòng xe

#### Car Models (`/api/car-models`)
- CRUD đầy đủ
- `images` JSONB — gallery nhiều ảnh, upload song song qua Cloudinary

#### Bookings (`/api/bookings`)
- `POST /` — tạo đơn (kiểm tra đặt trước ít nhất 3 ngày)
- Tính `end_time` tự động: tour dùng `product.num_days`, golf +6h, sân bay +3h
- `GET /my` — lịch sử đặt xe của khách
- `GET /admin` — tất cả đơn
- `GET /driver` — lịch chạy của tài xế đang đăng nhập
- `PATCH /:id/assign` — **gán xe + tài xế có kiểm tra trùng lịch** (tính năng chính đồ án)
  - Overlap condition: `start_time < newEnd AND end_time > newStart`
  - Kiểm tra cả xe lẫn tài xế riêng biệt
  - Hỗ trợ gán xe ngoài (external_car_info)
- `PATCH /:id/status` — admin cập nhật trạng thái
- `PATCH /:id/driver-status` — tài xế cập nhật (`CONFIRMED→IN_PROGRESS→COMPLETED`)

#### Payments (`/api/payments`)
- `POST /create-payment-url` — tạo link VNPay (30% cọc)
- `GET /vnpay-return` — nhận kết quả từ VNPay → CONFIRMED
- `POST /cancel/:bookingId` — hủy đơn, chính sách hoàn tiền:
  - ≥ 3 ngày trước chuyến: hoàn 100%
  - 1–3 ngày: hoàn 50%
  - < 24h: không hoàn

#### Các module khác
- Cars, Categories — CRUD đầy đủ
- Users — CRUD, toggle `is_active`
- Reviews — đánh giá sau chuyến
- Upload — ảnh lên Cloudinary
- Reports — thống kê doanh thu, đơn hàng
- Notifications + Socket.IO realtime

---

### 🎨 Frontend

#### Trang công khai
- **HomePage** — badge "Đà Nẵng City" clickable → popup Google Maps (địa chỉ 09 Tiên Sơn 06), ochre line trên chữ ĐÀ NẴNG
- **ServicesPage** — danh sách dịch vụ theo tab
- **ProductDetailPage** — chi tiết + **timeline lịch trình** cho tour + badge số ngày
- **VehicleDetailPage** — gallery ảnh lớn có thumbnails, description bên dưới
- **AboutPage** — địa chỉ: 09 Tiên Sơn 06, Đà Nẵng | SĐT: 0335 966 977 | Email: phuongtouristcar.dev@gmail.com
- **LoginPage / RegisterPage** — Google OAuth href dùng `VITE_API_URL`

#### Trang khách hàng
- **BookingPage** — đặt xe 3 bước:
  - Sân bay: chọn **nhà ga Quốc tế / Nội địa**, mã chuyến bay không bắt buộc
  - Golf: labels pickup/dropoff đúng theo chiều đi (`from_golf` / `to_golf`)
  - Validate: cảnh báo khi >45 hành khách, hiển thị hotline 0335 966 977
  - Bước 2: lọc xe theo sức chứa thực (trừ số túi golf)
- **MyOrdersPage** — lịch sử đơn, đánh giá
- **ProfilePage** — ẩn đổi mật khẩu nếu tài khoản Google

#### Trang Admin
- **ProductsManagePage** — **2 tab: Thông tin chung + Lịch trình** (ItineraryEditor theo ngày/giờ/mô tả)
- **CarModelsManagePage** — **upload gallery nhiều ảnh**, xem/xóa từng ảnh
- **BookingsManagePage** — gán xe/tài xế có conflict detection
- **AdminLayout** — đã xóa nút "Về trang chủ"
- Dashboard, CalendarPage, CarsManagePage, UsersManagePage

#### Trang Tài xế
- **SchedulePage** — lịch chạy, cập nhật trạng thái CONFIRMED→IN_PROGRESS→COMPLETED

---

## 🔄 Luồng nghiệp vụ chính

### Đặt xe và thanh toán
```
Khách chọn dịch vụ → BookingPage (3 bước)
  → Tạo booking (PENDING)
  → Thanh toán VNPay 30% cọc
  → Backend xác nhận → CONFIRMED
  → Admin nhận thông báo realtime (Socket.IO)
```

### Gán xe — tính năng chính đồ án
```
Admin vào BookingsManagePage
  → Thấy đơn CONFIRMED chưa gán xe
  → Chọn xe + tài xế
  → Backend kiểm tra overlap: start < newEnd AND end > newStart
  → Nếu trùng → 400 + thông báo thời gian bị trùng cụ thể
  → Nếu OK → gán, status CONFIRMED, tài xế nhận notification
```

### Thực hiện chuyến
```
Tài xế → SchedulePage → "Bắt đầu chuyến" → IN_PROGRESS
  → "Hoàn thành chuyến" → COMPLETED
  → Khách nhận notification + email
```

### Hủy đơn
```
Admin hủy đơn CONFIRMED
  → Tính % hoàn tiền theo ngày chuyến
  → Notification cho khách + tài xế
  → status: CANCELLED
```

---

## 🐛 Các lỗi đã xử lý

| Vấn đề | Giải pháp |
|---|---|
| Google OAuth redirect về localhost khi deploy | LoginPage/RegisterPage: đổi href hardcode → `VITE_API_URL` env |
| 404 NOT_FOUND khi callback Google OAuth trên Vercel | `vercel.json` đặt sai trong `public/` → chuyển ra `frontend/vercel.json` |
| DEPLOYMENT_NOT_FOUND khi VNPay return | `FRONTEND_URL` + `VNPAY_RETURN_URL` trên Render còn trỏ domain cũ |
| Đăng ký/Google OAuth không nhận email chào | `mailer.js` hardcode `localhost:5173` → đổi sang `FRONTEND_URL` env |
| VehicleDetailPage trắng xóa | `useState(0)` gọi sau early returns → vi phạm React Rules of Hooks → di chuyển lên đầu component |
| Ảnh xe bị crop trong gallery | `object-cover` → đổi sang `object-contain` với `bg-gray-900` |
| Golf summary hiển thị sai chiều (hotel ↔ sân golf) | direction value là `from_golf` không phải `golf_to_hotel` → fix labels |
| Tour: khách tự nhập số ngày | Thêm `num_days` vào Product, backend tự lấy khi tạo booking |
| Gán xe cho đơn PENDING (chưa cọc) | Chỉ hiện form gán xe khi status = CONFIRMED |
| Google user thấy nút "Đổi mật khẩu" | Backend trả `is_google` flag, frontend ẩn nút nếu true |
| Supabase ENOTFOUND khi deploy | Direct connection dùng IPv6 → đổi sang Session Pooler port 5432 |
| Render: SequelizeConnectionRefusedError | `config.js` dùng `url:` → đổi sang `use_env_variable: 'DB_URL'` |
| Frontend deploy không có dữ liệu | `api.js` hardcode localhost → đổi sang `import.meta.env.VITE_API_URL` |

---

## 🌐 Triển khai (Deployment)

### Kiến trúc
```
GitHub (monorepo)
├── backend/   → Render (Web Service, auto-deploy on push)
└── frontend/  → Vercel (Static Site, auto-deploy on push)
                         ↕
             Supabase (PostgreSQL — Session Pooler port 5432)
```

### Domain
| Service | URL |
|---|---|
| Frontend | https://phuongtourist.vercel.app |
| Backend | https://phuong-tourist-backend.onrender.com |
| DB | Supabase (aws-1-us-east-1) |

### Lưu ý quan trọng về config
- `vercel.json` phải ở `frontend/vercel.json` (không phải `frontend/public/`)
- Sequelize production: dùng `use_env_variable: 'DB_URL'` (không phải `url:`)
- Supabase: dùng **Session Pooler** port 5432 (không phải Direct/Transaction Pooler)
- Google OAuth: cập nhật Authorized redirect URI trong Google Console mỗi khi đổi domain

---

## 📌 Còn cần làm (nếu có thời gian)

- [ ] Chạy `node seed-tours.js` trên production sau khi deploy
- [ ] Cập nhật `FRONTEND_URL` và `VNPAY_RETURN_URL` trên Render → `phuongtourist.vercel.app`
- [ ] Test full flow: đăng ký → đặt tour → VNPay → admin gán xe → tài xế hoàn thành
- [ ] Trang đánh giá sau chuyến (UI hoàn chỉnh hơn)
- [ ] Dịch giao diện sang tiếng Anh

---

## 🗒️ Ghi chú kỹ thuật

**Conflict detection logic (`bookingController.js → assignCarAndDriver`):**
```js
WHERE car_id = :carId
  AND status IN ('CONFIRMED', 'IN_PROGRESS')
  AND id != :currentBookingId
  AND start_time < :newEndTime
  AND (end_time > :newStartTime OR end_time IS NULL)
```
Kiểm tra tương tự cho `driver_id`. Trả lỗi 400 kèm thời gian xung đột cụ thể.

**VNPay hoạt động trên localhost:**  
VNPay dùng browser redirect (không phải IPN webhook). User browser tự gọi về `VNPAY_RETURN_URL` → hoạt động ngay cả khi là localhost.

**Google OAuth flow:**  
`/api/auth/google` → Google → `/api/auth/google/callback` → backend tạo JWT → redirect `FRONTEND_URL/auth/google/callback?token=...&user=...` → `GoogleCallbackPage` lưu localStorage.

**Socket.IO singleton pattern:**  
`utils/socket.js` export `getIo()` để tránh circular import. Controllers dùng `getIo().emit(...)`.

**Cloudinary upload:**  
`/api/upload` nhận `multipart/form-data`, trả về `{ url }`. Frontend gọi song song nhiều file bằng `Promise.all`.
