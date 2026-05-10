# 📋 Nhật Ký Dự Án — PhuOng Tourist Car

> **Đồ án tốt nghiệp** | Hệ thống đặt xe du lịch trực tuyến  
> **Sinh viên:** Huỳnh Đoàn Tấn Phát  
> **Cập nhật lần cuối:** 10/05/2026 (lần 4) — Swagger đầy đủ + fix Gmail SMTP timeout

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
| Realtime | Socket.IO (JWT-authenticated rooms) |
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
│       │   └── mailer.js           ← dùng FRONTEND_URL env (đã fix)
│       └── server.js
└── frontend/
    ├── vercel.json                 ← SPA routing (ở root frontend/, KHÔNG trong public/)
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── services/api.js         ← dùng VITE_API_URL env
        ├── utils/socket.js         ← Socket.IO client singleton (connectSocket / getSocket / disconnectSocket)
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
- Notifications (polling REST API mỗi 30 giây)

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
  → Admin nhận thông báo qua Notification (polling)
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
| `POST /forgot-password` timeout 121s trên Render | `service: 'gmail'` dùng port 465 bị block → đổi sang `host: smtp.gmail.com, port: 587, secure: false` + connectionTimeout |
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

## 🗓️ Nhật ký thay đổi

### 10/05/2026 (lần 4) — Swagger đầy đủ + fix Gmail SMTP timeout

#### Swagger — Bổ sung docs còn thiếu

Sau khi kiểm tra, 2 file thực sự thiếu Swagger (carModelRoutes & productRoutes đã đủ do dùng block gộp):

**`backend/src/routes/authRoutes.js`**
- Thêm `@swagger` cho `POST /api/auth/forgot-password`
- Thêm `@swagger` cho `GET /api/auth/google`
- Thêm `@swagger` cho `GET /api/auth/google/callback`
- Di chuyển `module.exports = router` xuống cuối file (sau Google routes)

**`backend/src/routes/userRoutes.js`**
- Thêm `@swagger` cho `GET /api/users/available-drivers`
- Thêm `@swagger` cho `PATCH /api/users/{id}/toggle-active`

#### BookingPage.jsx — Xóa 2 biến unused

**`frontend/src/pages/BookingPage.jsx`**
- Xóa `const lastItem = day.items?.[day.items.length - 1]` (từng dùng để tính giờ cuối lịch trình, nay đã thay bằng logic khác)
- Xóa `const readOnly = "w-full px-4 py-3 ..."` (class CSS từng dùng cho input readonly, nay dùng inline)
- ESLint báo đỏ `no-unused-vars` → xóa để code sạch

#### Fix Gmail SMTP timeout trên Render

**`backend/src/utils/mailer.js`**
- **Nguyên nhân:** `service: 'gmail'` mặc định dùng port 465 (SSL) — Render block cổng này → request treo 121 giây rồi 500
- **Giải pháp:** Đổi sang explicit SMTP settings:
  ```js
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,  // STARTTLS
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  ```
- Kết quả: email gửi đi trong vài giây thay vì timeout

### 10/05/2026 (lần 3) — Socket.IO realtime + Tour booking từ lịch trình

#### Backend — Khôi phục & nâng cấp Socket.IO (đúng cách)

**`backend/src/utils/socket.js`** *(tạo lại)*
- Singleton `getIo / setIo` — giữ instance Socket.IO để các controller dùng

**`backend/src/server.js`**
- Thêm lại `http.createServer(app)` + `socket.io Server`
- **JWT auth middleware tại handshake**: `io.use(...)` xác thực token trước khi cho kết nối, gắn `socket.user`
- **Room-based**: mỗi user join `user_<id>`, admin join thêm room `admin`
- CORS socket chỉ cho phép `FRONTEND_URL` (không còn `origin: '*'`)
- `server.listen()` thay cho `app.listen()`

**`backend/src/controllers/bookingController.js`**
- Thêm lại `const { getIo } = require('../utils/socket')`
- Sau khi tạo booking: `io.to('admin').emit('new_booking', { booking_id })` — chỉ emit tới room admin, không broadcast tất cả

**`backend/src/controllers/paymentController.js`**
- Thêm lại `const { getIo } = require('../utils/socket')`
- Sau khi VNPay xác nhận thành công: `io.to('admin').emit(...)` + `io.to('user_<id>').emit(...)` — admin và đúng khách hàng đó nhận thông báo ngay

#### Frontend — Kết nối Socket.IO thật sự

**`frontend/package.json`**
- Thêm dependency `"socket.io-client": "^4.8.3"` → chạy `npm install` để cài

**`frontend/src/utils/socket.js`** *(file mới)*
- Helper singleton: `connectSocket(token)`, `getSocket()`, `disconnectSocket()`
- Kết nối tới base URL (tự bỏ `/api` suffix), gửi token qua `auth: { token }`
- `reconnectionAttempts: 5`, transport WebSocket

**`frontend/src/components/NotificationBell.jsx`**
- Import `connectSocket` từ `utils/socket`
- Thêm `useEffect` riêng: kết nối socket với token từ localStorage
- Lắng nghe `new_booking` và `payment_confirmed` → gọi `fetchNotifications()` ngay lập tức
- Cleanup: `socket.off(...)` khi component unmount

**Kết quả luồng realtime:**
```
Khách đặt xe → backend emit 'new_booking' → room 'admin'
  → NotificationBell admin nhận ngay → fetchNotifications() → số đỏ tăng tức thì
Khách thanh toán VNPay → backend emit 'payment_confirmed' → room 'admin' + room 'user_<id>'
  → Cả admin lẫn khách đó đều thấy chuông rung ngay, không chờ 30 giây polling
```

#### Frontend — Tour booking lấy thời gian từ lịch trình

**`frontend/src/pages/BookingPage.jsx`**
- Thêm helper `parseItineraryTime(t)`: chuyển `"07h30"` → `"07:30"` cho input time
- Cập nhật `Step1Schedule` — nhận thêm prop `itinerary`:
  - **Tour (catId === 2)**: ẩn input giờ tự do, thay bằng 3 phần:
    1. Date picker chọn ngày bắt đầu tour
    2. Badge cam hiển thị giờ đón cố định lấy từ `itinerary[0].items[0].time`
    3. Bảng preview lịch trình từng ngày (label + giờ khởi hành + mô tả đầu tiên)
  - **Airport / Golf**: giữ nguyên grid date + time tự chọn như cũ
- Trong `BookingPage` useEffect load product: nếu là tour thì auto-set `data.time` từ itinerary ngay khi product load
- Truyền `itinerary={product?.itinerary}` vào `Step1Schedule`
- Nếu tour không có itinerary → graceful fallback, không lỗi (dùng optional chaining)

### 10/05/2026 (lần 2) — Rà soát & dọn dead code

#### Phân tích code
- Rà soát toàn bộ codebase (backend + frontend), xác định các vấn đề tiềm ẩn khi phát triển thêm
- Kết luận: Socket.IO được setup ở backend nhưng frontend **không lắng nghe bất kỳ socket event nào** — `NotificationBell.jsx` dùng REST API polling (30s) thay thế → các `io.emit()` chạy nhưng vô dụng
- Thông báo vẫn **an toàn, đúng per-user** vì đi qua `/api/notifications` có filter `WHERE user_id = req.user.id`

#### Xóa dead code — Backend

**`backend/src/controllers/bookingController.js`**
- Xóa `const { getIo } = require('../utils/socket')`
- Xóa block "Emit socket tới admin" (`getIo()` + `io.emit('new_booking', ...)`)

**`backend/src/controllers/paymentController.js`**
- Xóa `const { getIo } = require('../utils/socket')`
- Xóa block "Emit socket" (`getIo()` + `io.emit('payment_confirmed', ...)`) trong `vnpayReturn`

**`backend/src/server.js`**
- Xóa `const { Server } = require('socket.io')`
- Xóa `const { setIo } = require('./utils/socket')`
- Xóa `const http = require('http')` và `http.createServer(app)` → đổi lại `app.listen()` trực tiếp
- Xóa `const io = new Server(...)` + `setIo(io)`
- Xóa block `io.on('connection', ...)` (chỉ log connect/disconnect, không có logic)
- Xóa `module.exports = { io }` ở cuối file (không nơi nào import)

**`backend/src/utils/socket.js`** *(đã xóa file)*
- Toàn bộ file helper singleton `getIo/setIo` không còn được dùng → xóa

#### Xóa dead code — Frontend

**`frontend/src/assets/react.svg`** *(đã xóa file)*  
**`frontend/src/assets/vite.svg`** *(đã xóa file)*
- Hai file asset mặc định từ template Vite, không có component nào import

### 10/05/2026

#### Backend

**`backend/src/utils/mailer.js`**
- Chuyển `transporter` từ module-level sang lazy-init `getTransporter()` — tránh lỗi khi biến môi trường chưa load khi module được import
- Thêm hàm `sendConfirmationEmail(toEmail, customerName, productName, startTime, driverName, driverPhone, licensePlate)` — gửi email xác nhận cho khách khi admin gán xe, kèm bảng thông tin: dịch vụ, giờ đón, tên/SĐT tài xế, biển số xe
- Fix `MAIL_PASS` trong `.env`: xóa khoảng trắng thừa trong App Password Gmail (phải là 16 ký tự liền không có dấu cách)

**`backend/src/controllers/bookingController.js`**
- Cập nhật hàm `assignCarAndDriver`: sau khi gán xe thành công, fetch đầy đủ thông tin booking (customer, driver, car, product) rồi:
  - Tạo Notification cho khách hàng (đã xác nhận xe + tài xế)
  - Gọi `sendConfirmationEmail` gửi email xác nhận cho khách

**`backend/src/seeders/20260507000003-add-tour-products.js`**
- Hoàn thiện seeder tour: sản phẩm 5–12 (4 tour 1 ngày + 4 tour 2 ngày 1 đêm), toàn bộ tên/mô tả/lịch trình dịch sang tiếng Anh
- Bảng giá `price_list` (đã sửa tên bảng đúng, không phải `price_lists`) cho tất cả products × 4 dòng xe
- Thêm 3 booking mẫu cho tour (1 COMPLETED + 1 CONFIRMED + 1 PENDING), payment 30% cọc, 1 review
- Hàm `down()` xóa đúng thứ tự: notifications → reviews → payments → bookings → price_list → products

#### Frontend

**`frontend/src/components/FloatingContact.jsx`** *(file mới)*
- Component nút nổi góc dưới phải, bấm toggle mở/đóng danh sách liên hệ nhanh
- 3 action: **Hotline** (`tel:0335966977`), **Zalo** (`zalo.me/0335966977`), **WhatsApp** (`wa.me/84335966977`)
- Icon SVG inline, không dùng thư viện ngoài (tránh lỗi `lucide-react` chưa cài)
- Animation fade + slide khi mở/đóng

**`frontend/src/components/PublicLayout.jsx`**
- Import và mount `<FloatingContact />` vào layout chung — xuất hiện trên toàn bộ trang public

**`frontend/src/pages/AboutPage.jsx`**
- Thay emoji icon (📍📞✉️) bằng SVG có màu thống nhất: địa chỉ (cam), hotline (xanh lá), email (xanh dương)
- Thêm component `CopyEmailCard`: bấm vào card email → copy địa chỉ vào clipboard, hiện "✓ Đã sao chép!" 2 giây
- Fix tràn chữ email dài: thêm `truncate` + `min-w-0`

**`frontend/src/components/Footer.jsx`**
- Chuyển layout từ 3 cột sang **4 cột**: Brand | Quick Links | Contact | Vị trí (Google Map)
- Thêm Google Map iframe nhúng trực tiếp vào footer, bo góc, border nhẹ
- Thêm link "About" vào Quick Links

**`frontend/src/pages/HomePage.jsx`** + **`Footer.jsx`**
- Cập nhật URL Google Maps từ `q=` (tìm kiếm — hiện nhiều điểm) sang `embed?pb=...` (tọa độ chính xác — chỉ 1 điểm ghim tại 09 Tiên Sơn 06, Đà Nẵng)

#### Hướng dẫn redeploy Supabase
```bash
cd backend
NODE_ENV=production npx sequelize-cli db:seed:undo:all   # xóa data cũ
NODE_ENV=production npx sequelize-cli db:migrate:undo:all # xóa schema (nếu cần)
NODE_ENV=production npx sequelize-cli db:migrate          # tạo lại schema
NODE_ENV=production npx sequelize-cli db:seed:all         # seed data mới
```

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

**Cloudinary upload:**  
`/api/upload` nhận `multipart/form-data`, trả về `{ url }`. Frontend gọi song song nhiều file bằng `Promise.all`.

**Socket.IO room pattern:**
```
Client kết nối → gửi JWT trong handshake.auth.token
Server xác thực → socket.user = { id, role_id }
Mọi user → socket.join(`user_${id}`)
Admin (role_id=1) → socket.join('admin') thêm

Emit có chọn lọc:
  io.to('admin').emit('new_booking', ...)         // chỉ admin
  io.to(`user_${id}`).emit('payment_confirmed')   // đúng khách đó
```

**Tour booking time logic:**
```
product.itinerary[0].items[0].time  →  "07h30"
parseItineraryTime("07h30")         →  "07:30"   (dùng cho input[type=time])
data.time auto-set khi load product (useEffect)
data.time reset lại mỗi khi đổi ngày (onChange date)
```
