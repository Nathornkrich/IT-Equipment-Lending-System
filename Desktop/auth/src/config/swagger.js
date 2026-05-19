const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IT Equipment Borrowing API',
      version: '1.0.0',
      description: 'CS367 Final Project — ระบบยืมคืนอุปกรณ์ IT',
    },
    servers: [{ url: 'http://localhost:3000/api', description: 'Local Dev' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'สมชาย ใจดี' },
            email: { type: 'string', format: 'email', example: 'somchai@example.com' },
            role: { type: 'string', enum: ['user', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Equipment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'MacBook Pro 14' },
            serial_number: { type: 'string', example: 'MBP-2024-001' },
            status: { type: 'string', enum: ['available', 'borrowed', 'maintenance'] },
            description: { type: 'string' },
            category_name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            equipment_id: { type: 'string', format: 'uuid' },
            borrow_date: { type: 'string', format: 'date', example: '2025-07-01' },
            return_date: { type: 'string', format: 'date', example: '2025-07-07' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'cancelled'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Borrowing: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            reservation_id: { type: 'string', format: 'uuid' },
            approved_by: { type: 'string', format: 'uuid' },
            borrowed_at: { type: 'string', format: 'date-time' },
            returned_at: { type: 'string', format: 'date-time', nullable: true },
            status: { type: 'string', enum: ['active', 'returned', 'overdue'] },
            note: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
}

module.exports = swaggerJsdoc(options)
