-- ========================================================
-- EXTENSIONS (required for advanced constraints)
-- ========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ========================================================
-- ENUM TYPES
-- ========================================================
CREATE TYPE user_status      AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE vehicle_status   AS ENUM ('available', 'in_use', 'maintenance', 'retired');
CREATE TYPE booking_status   AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE schedule_status  AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
CREATE TYPE payment_status   AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE invoice_status   AS ENUM ('unpaid', 'partially_paid', 'paid');

-- ========================================================
-- LOOKUP TABLES (seed data: roles, vehicle_types, cost_types)
-- ========================================================
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,   -- admin | staff | driver | customer
    description TEXT
);

CREATE TABLE vehicle_brands (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE vehicle_models (
    id       SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL REFERENCES vehicle_brands(id),
    name     VARCHAR(100) NOT NULL,
    UNIQUE (brand_id, name)
);

CREATE TABLE vehicle_types (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,
    seat_count  INTEGER,
    description TEXT
);

CREATE TABLE cost_types (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- ========================================================
-- CORE TABLES
-- ========================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     VARCHAR(100),
    phone         VARCHAR(20),
    role_id       INTEGER REFERENCES roles(id),
    avatar_url    TEXT,
    status        user_status DEFAULT 'active',
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE drivers (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_number   VARCHAR(50) UNIQUE NOT NULL,
    license_class    VARCHAR(10),                       -- B2/C/D/E/F
    license_expiry   TIMESTAMPTZ,
    experience_years INTEGER CHECK (experience_years >= 0),
    hire_date        DATE,
    status           VARCHAR(20) DEFAULT 'available',
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at       TIMESTAMPTZ
);

CREATE TABLE vehicles (
    id                   SERIAL PRIMARY KEY,
    license_plate        VARCHAR(20) UNIQUE NOT NULL,
    model_id             INTEGER REFERENCES vehicle_models(id),
    vehicle_type_id      INTEGER REFERENCES vehicle_types(id),
    seat_capacity        INTEGER CHECK (seat_capacity > 0),
    fuel_type            VARCHAR(50),
    year_of_manufacture  INTEGER CHECK (year_of_manufacture >= 1900),
    insurance_expiry     TIMESTAMPTZ,
    inspection_expiry    TIMESTAMPTZ,
    image_url            TEXT,
    status               vehicle_status DEFAULT 'available',
    created_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at           TIMESTAMPTZ
);

CREATE TABLE tours (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    start_location  VARCHAR(100),
    end_location    VARCHAR(100),
    start_time      TIMESTAMPTZ,
    end_time        TIMESTAMPTZ,
    price_per_person DECIMAL(14,2) CHECK (price_per_person >= 0),
    vehicle_type_id INTEGER REFERENCES vehicle_types(id),
    status          VARCHAR(20) DEFAULT 'active',
    created_by      INTEGER REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE bookings (
    id                   SERIAL PRIMARY KEY,
    customer_id          INTEGER NOT NULL REFERENCES users(id),
    tour_id              INTEGER REFERENCES tours(id),
    booking_date         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    start_time           TIMESTAMPTZ,
    end_time             TIMESTAMPTZ,
    number_of_passengers INTEGER CHECK (number_of_passengers > 0),
    total_price          DECIMAL(14,2),
    status               booking_status DEFAULT 'pending',
    notes                TEXT,
    created_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at           TIMESTAMPTZ
);

CREATE TABLE schedules (
    id          SERIAL PRIMARY KEY,
    booking_id  INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    vehicle_id  INTEGER NOT NULL REFERENCES vehicles(id),
    driver_id   INTEGER NOT NULL REFERENCES drivers(id),
    start_time  TIMESTAMPTZ NOT NULL,
    end_time    TIMESTAMPTZ NOT NULL,
    status      schedule_status DEFAULT 'scheduled',
    created_by  INTEGER REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMPTZ,

    CONSTRAINT chk_schedule_time CHECK (end_time > start_time)
);

-- CRITICAL: Prevent driver double-booking (race-condition safe via PostgreSQL EXCLUDE)
ALTER TABLE schedules ADD CONSTRAINT no_driver_overlap
    EXCLUDE USING gist (
        driver_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    )
    WHERE (deleted_at IS NULL);

-- CRITICAL: Prevent vehicle double-booking
ALTER TABLE schedules ADD CONSTRAINT no_vehicle_overlap
    EXCLUDE USING gist (
        vehicle_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    )
    WHERE (deleted_at IS NULL);

-- FINANCIAL INTEGRITY: ON DELETE RESTRICT mandatory per spec
CREATE TABLE transactions (
    id                       SERIAL PRIMARY KEY,
    booking_id               INTEGER NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    amount                   DECIMAL(14,2) CHECK (amount >= 0),
    payment_method           VARCHAR(50),
    status                   payment_status DEFAULT 'pending',
    paid_at                  TIMESTAMPTZ,
    created_at               TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at               TIMESTAMPTZ
);

CREATE TABLE invoices (
    id               SERIAL PRIMARY KEY,
    booking_id       INTEGER UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
    invoice_number   VARCHAR(50) UNIQUE,
    base_amount      DECIMAL(14,2),
    extra_fees_total DECIMAL(14,2),
    tax_amount       DECIMAL(14,2),
    total_final      DECIMAL(14,2),
    deposit_amount   DECIMAL(14,2),
    remaining_amount DECIMAL(14,2),
    issue_date       TIMESTAMPTZ,
    due_date         TIMESTAMPTZ,
    pdf_url          TEXT,
    status           invoice_status DEFAULT 'unpaid',
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operational_costs (
    id               SERIAL PRIMARY KEY,
    schedule_id      INTEGER NOT NULL REFERENCES schedules(id) ON DELETE RESTRICT,
    cost_type_id     INTEGER REFERENCES cost_types(id),
    amount           DECIMAL(14,2) CHECK (amount >= 0),
    description      TEXT,
    receipt_image_url TEXT,
    recorded_by      INTEGER REFERENCES users(id),
    recorded_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255),
    content    TEXT,
    type       VARCHAR(50),
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ========================================================
-- INDEXES (mandatory: FK, status, created_at)
-- ========================================================

-- users
CREATE INDEX idx_users_role_id    ON users(role_id);
CREATE INDEX idx_users_status     ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_users_name_phone ON users USING gin (full_name gin_trgm_ops, phone gin_trgm_ops);

-- drivers
CREATE INDEX idx_drivers_user_id    ON drivers(user_id);
CREATE INDEX idx_drivers_status     ON drivers(status);
CREATE INDEX idx_drivers_deleted_at ON drivers(deleted_at);

-- vehicles
CREATE INDEX idx_vehicles_vehicle_type_id ON vehicles(vehicle_type_id);
CREATE INDEX idx_vehicles_status          ON vehicles(status);
CREATE INDEX idx_vehicles_created_at      ON vehicles(created_at);
CREATE INDEX idx_vehicles_deleted_at      ON vehicles(deleted_at);

-- tours
CREATE INDEX idx_tours_vehicle_type_id ON tours(vehicle_type_id);
CREATE INDEX idx_tours_status          ON tours(status);
CREATE INDEX idx_tours_created_at      ON tours(created_at);

-- bookings
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_tour_id     ON bookings(tour_id);
CREATE INDEX idx_bookings_status      ON bookings(status);
CREATE INDEX idx_bookings_start_time  ON bookings(start_time);
CREATE INDEX idx_bookings_created_at  ON bookings(created_at DESC);

-- schedules (GIST for range overlap + FK indexes)
CREATE INDEX idx_schedules_booking_id  ON schedules(booking_id);
CREATE INDEX idx_schedules_vehicle_id  ON schedules(vehicle_id);
CREATE INDEX idx_schedules_driver_id   ON schedules(driver_id);
CREATE INDEX idx_schedules_status      ON schedules(status);
CREATE INDEX idx_schedules_gist_vehicle USING gist (vehicle_id, tstzrange(start_time, end_time));
CREATE INDEX idx_schedules_gist_driver  USING gist (driver_id,  tstzrange(start_time, end_time));

-- transactions
CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_status     ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- invoices
CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_status     ON invoices(status);

-- notifications
CREATE INDEX idx_notifications_user_id    ON notifications(user_id);
CREATE INDEX idx_notifications_is_read    ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ========================================================
-- SEED DATA
-- ========================================================
INSERT INTO roles (name, description) VALUES
    ('admin',    'Quản trị viên toàn quyền'),
    ('staff',    'Nhân viên quản lý hệ thống'),
    ('driver',   'Tài xế — xem lịch & nhập chi phí'),
    ('customer', 'Khách hàng — đặt xe & xem đơn');

INSERT INTO vehicle_types (name, seat_count) VALUES
    ('4 chỗ',  4),
    ('7 chỗ',  7),
    ('16 chỗ', 16),
    ('29 chỗ', 29),
    ('35 chỗ', 35),
    ('45 chỗ', 45);

INSERT INTO cost_types (name) VALUES
    ('Xăng dầu'),
    ('Cầu đường'),
    ('Ăn uống tài xế'),
    ('Sửa chữa'),
    ('Khác');
