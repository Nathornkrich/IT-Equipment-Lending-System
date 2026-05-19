const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'it_borrowing',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
})

pool.on('error', (err) => {
  console.error('Unexpected DB error', err)
})

module.exports = pool
