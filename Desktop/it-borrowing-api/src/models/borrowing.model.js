const db = require('../config/db')

const create = async ({ reservation_id, approved_by }) => {
  const result = await db.query(
    `INSERT INTO borrowings (reservation_id, approved_by)
     VALUES ($1, $2)
     RETURNING *`,
    [reservation_id, approved_by]
  )
  return result.rows[0]
}

const findById = async (id) => {
  const result = await db.query(
    `SELECT b.*, r.equipment_id, r.user_id, r.borrow_date, r.return_date,
            e.name AS equipment_name
     FROM borrowings b
     JOIN reservations r ON b.reservation_id = r.id
     JOIN equipments e ON r.equipment_id = e.id
     WHERE b.id = $1`,
    [id]
  )
  return result.rows[0] || null
}

const markReturned = async (id, note) => {
  const result = await db.query(
    `UPDATE borrowings
     SET status = 'returned', returned_at = NOW(), note = $2
     WHERE id = $1
     RETURNING *`,
    [id, note]
  )
  return result.rows[0] || null
}

module.exports = { create, findById, markReturned }
