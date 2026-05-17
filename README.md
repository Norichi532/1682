# PhuOng Tourist Car

A full-stack web application for managing tourist car bookings, built with React, Node.js, Express, PostgreSQL, and Sequelize.

**Live Demo:** [phuong-tourist-frontend.vercel.app](https://phuong-tourist-frontend.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express 5, Sequelize ORM |
| Database | PostgreSQL 14+ |
| Auth | JWT, Google OAuth 2.0 |
| Payment | VNPay (sandbox) |
| Realtime | Socket.IO |
| Email | Nodemailer (Gmail) |
| File Upload | Cloudinary + Multer |

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

| Software | Minimum Version | Download |
|----------|----------------|----------|
| Node.js | 18+ | https://nodejs.org |
| PostgreSQL | 14+ | https://www.postgresql.org/download |
| Git | any | https://git-scm.com |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Norichi532/1682.git
cd 1682
```

---

### 2. Create a PostgreSQL database

Open **pgAdmin** or any PostgreSQL client and run:

```sql
CREATE DATABASE phuong_tourist_car;
```

---

### 3. Configure the backend environment

Inside the `backend/` folder, create a file named `.env`:

```
backend/
└── .env   ← create this file
```

Paste the following content and fill in your values:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phuong_tourist_car
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server
PORT=5000

# JWT
JWT_SECRET=any_random_secret_string

# Email — use Gmail with an App Password
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# Google OAuth (optional — skip if not using Google Login)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# VNPay sandbox
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECURE_SECRET=your_vnpay_secure_secret
VNPAY_RETURN_URL=http://localhost:5173/vnpay-return

# Frontend URL (used for email links and OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

> **Notes:**
> - `DB_PASSWORD` — your local PostgreSQL password.
> - `MAIL_PASS` — a Gmail **App Password**, not your regular Gmail password. Generate one at https://myaccount.google.com/apppasswords.
> - VNPay credentials can be obtained from https://sandbox.vnpayment.vn.

---

### 4. Install and run the backend

Open a terminal, navigate to the `backend/` folder, then run:

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

The backend starts at: **http://localhost:5000**  
Swagger API docs: **http://localhost:5000/api-docs**

---

### 5. Install and run the frontend

Open a **new terminal**, navigate to the `frontend/` folder, then run:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at: **http://localhost:5173**

Open your browser and go to **http://localhost:5173** to use the app.

---

## Default Test Accounts

After running the seed, the following accounts are available (all passwords: `Abc@123456`):

| Email | Role |
|-------|------|
| admin@phuongtravel.vn | Admin |
| an.nguyen@gmail.com | Customer |
| hung.driver@phuongtravel.vn | Driver |

---

## Project Structure

```
1682/
├── backend/
│   └── src/
│       ├── config/         # Database connection config (local / production)
│       ├── controllers/    # Business logic handlers
│       │   ├── authController.js       # Register, login, Google OAuth, forgot password
│       │   ├── bookingController.js    # Create booking, assign car/driver, update status
│       │   ├── carController.js        # Car CRUD, available car lookup
│       │   ├── carModelController.js   # Car model management
│       │   ├── categoryController.js   # Service category management
│       │   ├── notificationController.js
│       │   ├── paymentController.js    # VNPay integration, refund, cancel
│       │   ├── productController.js    # Service/product CRUD with pricing
│       │   ├── reviewController.js     # Post-trip reviews
│       │   ├── uploadController.js     # Cloudinary image upload
│       │   └── userController.js       # User/driver management
│       ├── middlewares/    # JWT authentication & role-based access
│       ├── migrations/     # Sequelize database schema migrations (7 files)
│       ├── models/         # Sequelize model definitions (11 models)
│       ├── routes/         # API route definitions
│       ├── seeders/        # Initial seed data (accounts, cars, services, tours)
│       ├── utils/
│       │   ├── mailer.js   # Email sending via Nodemailer
│       │   └── socket.js   # Socket.IO realtime helpers
│       └── server.js       # App entry point
│
└── frontend/
    └── src/
        ├── components/     # Shared components (Navbar, Footer, Layout, NotificationBell)
        ├── context/        # AuthContext — global login state management
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── ServicesPage.jsx        # Service listing with search & filter
        │   ├── ProductDetailPage.jsx   # Service detail + booking form
        │   ├── BookingPage.jsx
        │   ├── MyOrdersPage.jsx        # Customer booking history
        │   ├── VNPayReturnPage.jsx     # Payment result handler
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── ForgotPasswordPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── VehiclesPage.jsx
        │   ├── AboutPage.jsx
        │   ├── admin/                  # Admin dashboard pages
        │   │   ├── DashboardPage.jsx
        │   │   ├── BookingsManagePage.jsx
        │   │   ├── CarsManagePage.jsx
        │   │   ├── CarModelsManagePage.jsx
        │   │   ├── ProductsManagePage.jsx
        │   │   ├── UsersManagePage.jsx
        │   │   ├── SchedulePage.jsx
        │   │   └── CalendarPage.jsx
        │   └── driver/                 # Driver dashboard pages
        └── services/
            └── api.js                  # Axios instance with base URL & auth header
```

---

## Key Features

**Customer**
- Browse and search services by category, name, or location
- Book a service by selecting vehicle type and date
- Pay a 30% deposit online via VNPay
- Track booking status in real time
- Cancel booking with automatic refund policy (100% / 50% / 0%)
- Leave a review after trip completion

**Admin**
- Dashboard with booking and revenue statistics
- Manage services, car models, cars, and drivers
- Assign internal or external vehicles to bookings with conflict detection
- Receive real-time notifications for new bookings and payments via Socket.IO

**Driver**
- View assigned trips on a calendar
- Update trip status: Confirmed → In Progress → Completed

---

## Booking Status Flow

```
PENDING  ──[Pay deposit]──▶  CONFIRMED  ──[Driver starts]──▶  IN_PROGRESS  ──[Driver completes]──▶  COMPLETED
   │                              │
[Cancel]                      [Cancel]
   │                              │
   ▼                              ▼
CANCELLED                    CANCELLED
                         (refund based on policy)
```

---

## Reset the Database

To wipe all data and start fresh:

```bash
cd backend
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_HOST` | Yes | PostgreSQL host (usually `localhost`) |
| `DB_PORT` | Yes | PostgreSQL port (default `5432`) |
| `DB_NAME` | Yes | Database name |
| `DB_USER` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `PORT` | No | Backend server port (default `5000`) |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `MAIL_USER` | Yes | Gmail address for sending emails |
| `MAIL_PASS` | Yes | Gmail App Password |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | No | Google OAuth redirect URI |
| `VNPAY_TMN_CODE` | Yes | VNPay merchant code |
| `VNPAY_SECURE_SECRET` | Yes | VNPay secure hash secret |
| `VNPAY_RETURN_URL` | Yes | URL VNPay redirects to after payment |
| `FRONTEND_URL` | Yes | Frontend base URL (for email links and OAuth) |
