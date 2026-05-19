const router = require('express').Router()
const reportController = require('../controllers/report.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

/**
 * @swagger
 * /reports/summary:
 *   get:
 *     summary: สรุปสถิติการยืม (Admin เท่านั้น)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สถิติการยืมทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment_summary:
 *                   type: array
 *                   description: จำนวนอุปกรณ์แยกตาม status
 *                 borrowing_summary:
 *                   type: array
 *                   description: จำนวน borrowing แยกตาม status
 *                 top_equipments:
 *                   type: array
 *                   description: อุปกรณ์ที่ถูกยืมบ่อยที่สุด 5 อันดับ
 *                 monthly_borrowings:
 *                   type: array
 *                   description: สถิติรายเดือน 6 เดือนล่าสุด
 *       403: { description: ต้องเป็น Admin }
 */
router.get('/summary', authMiddleware, adminMiddleware, reportController.getSummary)

module.exports = router
