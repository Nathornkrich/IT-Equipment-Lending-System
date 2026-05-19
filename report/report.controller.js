const db = require('../config/db')

const getSummary = async (req, res, next) => {
  try {
    const [totalEquip, borrowStats, topEquip, monthlyStats] = await Promise.all([
      // จำนวนอุปกรณ์แยกตาม status
      db.query(`
        SELECT status, COUNT(*) AS count
        FROM equipments
        GROUP BY status
      `),

      // จำนวน borrowing แยกตาม status
      db.query(`
        SELECT status, COUNT(*) AS count
        FROM borrowings
        GROUP BY status
      `),

      // Top 5 อุปกรณ์ที่ยืมบ่อยที่สุด
      db.query(`
        SELECT e.name, e.serial_number, COUNT(b.id) AS borrow_count
        FROM borrowings b
        JOIN reservations r ON b.reservation_id = r.id
        JOIN equipments e ON r.equipment_id = e.id
        GROUP BY e.id, e.name, e.serial_number
        ORDER BY borrow_count DESC
        LIMIT 5
      `),

      // สถิติรายเดือน (6 เดือนล่าสุด)
      db.query(`
        SELECT TO_CHAR(borrowed_at, 'YYYY-MM') AS month, COUNT(*) AS count
        FROM borrowings
        WHERE borrowed_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `),
    ])

    res.json({
      equipment_summary: totalEquip.rows,
      borrowing_summary: borrowStats.rows,
      top_equipments: topEquip.rows,
      monthly_borrowings: monthlyStats.rows,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getSummary }
