# IT Equipment Borrowing API

ระบบยืมคืนอุปกรณ์ IT พัฒนาด้วย Node.js + Express + PostgreSQL

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **Auth**: JWT (jsonwebtoken)
- **Testing**: Jest + Supertest
- **Container**: Docker + Docker Compose

## การติดตั้งและรัน

### วิธีที่ 1: Docker (แนะนำ)

```bash
# 1. Clone repo
git clone <repo-url>
cd it-borrowing-api

# 2. Copy env
cp .env.example .env

# 3. รัน
docker compose up --build
```

API พร้อมใช้งานที่ `http://localhost:3000`

### วิธีที่ 2: รันตรง (ต้องมี PostgreSQL ก่อน)

```bash
npm install
cp .env.example .env
# แก้ไข .env ให้ตรงกับ database ของคุณ

# สร้างตาราง
psql -U postgres -d it_borrowing -f src/migrations/001_init.sql

npm run dev
```

## รัน Tests

```bash
npm test              # รัน tests + coverage report
npm run test:watch    # watch mode
```

Coverage threshold: **80%** ทุก metric

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | - | สมัครสมาชิก |
| POST | `/api/auth/login` | - | เข้าสู่ระบบ |
| GET | `/api/auth/me` | User | ดูข้อมูลตัวเอง |
| GET | `/api/equipments` | User | ดูอุปกรณ์ทั้งหมด |
| GET | `/api/equipments/:id` | User | ดูรายละเอียดอุปกรณ์ |
| POST | `/api/equipments` | Admin | เพิ่มอุปกรณ์ |
| PUT | `/api/equipments/:id` | Admin | แก้ไขอุปกรณ์ |
| DELETE | `/api/equipments/:id` | Admin | ลบอุปกรณ์ |
| POST | `/api/reservations` | User | จองอุปกรณ์ |
| GET | `/api/reservations/my` | User | ดูรายการจองของตัวเอง |
| POST | `/api/borrowings` | Admin | ยืนยันการยืม |
| PUT | `/api/borrowings/:id/return` | User | คืนอุปกรณ์ |
| GET | `/api/reports/summary` | Admin | ดูสถิติ |