CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role         user_role NOT NULL DEFAULT 'user',
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TYPE equipment_status AS ENUM ('available', 'borrowed', 'maintenance');

CREATE TABLE IF NOT EXISTS equipment_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS equipments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES equipment_categories(id),
  name          VARCHAR(200) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  status        equipment_status NOT NULL DEFAULT 'available',
  description   TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TYPE reservation_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

CREATE TABLE IF NOT EXISTS reservations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id),
  equipment_id UUID NOT NULL REFERENCES equipments(id),
  borrow_date  DATE NOT NULL,
  return_date  DATE NOT NULL,
  status       reservation_status NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TYPE borrowing_status AS ENUM ('active', 'returned', 'overdue');

CREATE TABLE IF NOT EXISTS borrowings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID UNIQUE NOT NULL REFERENCES reservations(id),
  approved_by    UUID NOT NULL REFERENCES users(id),
  borrowed_at    TIMESTAMP DEFAULT NOW(),
  returned_at    TIMESTAMP,
  status         borrowing_status NOT NULL DEFAULT 'active',
  note           TEXT
);

-- Seed: admin user (password: admin1234)
INSERT INTO users (name, email, password_hash, role) VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$bsRCtYKOytdmEuB2tOpbeOVVKA0VtGGaXMbYUvgjYIOruZh3wkgs2',
  'admin'
) ON CONFLICT DO NOTHING;
