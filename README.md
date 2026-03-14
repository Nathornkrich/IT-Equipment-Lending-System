# IT-Equipment-Lending-System

Authentication , Reports

ชื่อ พิมพ์พิชชา เกตุศรีระ

POST /api/auth/login → เข้าสู่ระบบ

POST /api/auth/register → สมัครสมาชิก

GET /api/reports/summary → ดูสถิติการยืมทั้งหมด 

Equipment

ชื่อ ณธรกริช ทองธรรมชาติ

GET /api/equipments → ดูอุปกรณ์ทั้งหมด

GET /api/equipments/{id} → ดูรายละเอียดอุปกรณ์

POST /api/equipments → เพิ่มอุปกรณ์ (Admin)

PUT /api/equipments/{id} → แก้ไขข้อมูลอุปกรณ์ (Admin)

DELETE /api/equipments/{id} → ลบอุปกรณ์ (Admin)

Reservation / Borrowing

ชื่อ ฉัตรสรวง เย่าตัก

POST /api/reservations → จองอุปกรณ์

GET /api/reservations/my → ดูรายการจองของตนเอง

POST /api/borrowings → ยืนยันการยืมอุปกรณ์

PUT /api/borrowings/{id}/return → คืนอุปกรณ์
