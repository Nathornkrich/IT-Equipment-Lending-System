const router = require('express').Router()
const borrowingController = require('../controllers/borrowing.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

/**
 * @swagger
 * /borrowings:
 *   post:
 *     summary: Admin ยืนยันการยืม (จาก reservation)
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservation_id]
 *             properties:
 *               reservation_id: { type: string, format: uuid }
 *     responses:
 *       201: { description: ยืนยันสำเร็จ อุปกรณ์สถานะเปลี่ยนเป็น borrowed }
 *       404: { description: ไม่พบ reservation }
 *       409: { description: reservation ไม่ได้อยู่ในสถานะ pending }
 *       403: { description: ต้องเป็น Admin }
 */
router.post('/', authMiddleware, adminMiddleware, borrowingController.confirmBorrow)

/**
 * @swagger
 * /borrowings/{id}/return:
 *   put:
 *     summary: คืนอุปกรณ์
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note: { type: string, example: "คืนสภาพดี ไม่มีความเสียหาย" }
 *     responses:
 *       200: { description: คืนสำเร็จ อุปกรณ์กลับสู่ available }
 *       404: { description: ไม่พบ borrowing }
 *       409: { description: คืนไปแล้ว }
 */
router.put('/:id/return', authMiddleware, borrowingController.returnEquipment)

module.exports = router
