const router = require('express').Router()
const reservationController = require('../controllers/reservation.controller')
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: จองอุปกรณ์
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [equipment_id, borrow_date, return_date]
 *             properties:
 *               equipment_id: { type: string, format: uuid }
 *               borrow_date:  { type: string, format: date, example: "2025-07-01" }
 *               return_date:  { type: string, format: date, example: "2025-07-07" }
 *     responses:
 *       201: { description: จองสำเร็จ สถานะ pending }
 *       404: { description: ไม่พบอุปกรณ์ }
 *       409: { description: อุปกรณ์ไม่ว่าง }
 */
router.post('/', authMiddleware, reservationController.create)

/**
 * @swagger
 * /reservations/my:
 *   get:
 *     summary: ดูรายการจองของตัวเอง
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: รายการจองทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Reservation' }
 */
router.get('/my', authMiddleware, reservationController.getMyReservations)

module.exports = router
