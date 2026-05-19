const db = require('../config/db')

const create = async ({ user_id, equipment_id, borrow_date, return_date }) => {
  const result = await db.query(
    `INSERT INTO reservations (user_id, equipment_id, borrow_date, return_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, equipment_id, borrow_date, return_date]
  )
  return result.rows[0]
}

const findByUser = async (user_id) => {
  const result = await db.query(
    `SELECT r.*, e.name AS equipment_name, e.serial_number
     FROM reservations r
     JOIN equipments e ON r.equipment_id = e.id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [user_id]
  )
  return result.rows
}

const findById = async (id) => {
  const result = await db.query('SELECT * FROM reservations WHERE id = $1', [id])
  return result.rows[0] || null
}

const updateStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  )
  return result.rows[0] || null
}

module.exports = { create, findByUser, findById, updateStatus }
