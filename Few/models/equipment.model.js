const db = require('../config/db')

const findAll = async ({ status, category_id, page = 1, limit = 20 } = {}) => {
  const conditions = []
  const params = []

  if (status) {
    params.push(status)
    conditions.push(`e.status = $${params.length}`)
  }
  if (category_id) {
    params.push(category_id)
    conditions.push(`e.category_id = $${params.length}`)
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''
  const offset = (page - 1) * limit
  params.push(limit, offset)

  const result = await db.query(
    `SELECT e.*, c.name AS category_name
     FROM equipments e
     LEFT JOIN equipment_categories c ON e.category_id = c.id
     ${where}
     ORDER BY e.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )
  return result.rows
}

const findById = async (id) => {
  const result = await db.query(
    `SELECT e.*, c.name AS category_name
     FROM equipments e
     LEFT JOIN equipment_categories c ON e.category_id = c.id
     WHERE e.id = $1`,
    [id]
  )
  return result.rows[0] || null
}

const create = async ({ category_id, name, serial_number, description }) => {
  const result = await db.query(
    `INSERT INTO equipments (category_id, name, serial_number, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [category_id, name, serial_number, description]
  )
  return result.rows[0]
}

const update = async (id, { category_id, name, serial_number, description, status }) => {
  const result = await db.query(
    `UPDATE equipments
     SET category_id = COALESCE($1, category_id),
         name = COALESCE($2, name),
         serial_number = COALESCE($3, serial_number),
         description = COALESCE($4, description),
         status = COALESCE($5, status)
     WHERE id = $6
     RETURNING *`,
    [category_id, name, serial_number, description, status, id]
  )
  return result.rows[0] || null
}

const remove = async (id) => {
  const result = await db.query(
    'DELETE FROM equipments WHERE id = $1 RETURNING id',
    [id]
  )
  return result.rows[0] || null
}

const updateStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE equipments SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  )
  return result.rows[0] || null
}

module.exports = { findAll, findById, create, update, remove, updateStatus }
