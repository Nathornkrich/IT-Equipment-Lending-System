const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const authRoutes = require('./routes/auth.routes')
const equipmentRoutes = require('./routes/equipment.routes')
const reservationRoutes = require('./routes/reservation.routes')
const borrowingRoutes = require('./routes/borrowing.routes')
const reportRoutes = require('./routes/report.routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/equipments', equipmentRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/borrowings', borrowingRoutes)
app.use('/api/reports', reportRoutes)

// Swagger UI (optional — บวกคะแนน)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Global error handler (ต้องอยู่หลังสุด)
app.use(errorMiddleware)

module.exports = app
