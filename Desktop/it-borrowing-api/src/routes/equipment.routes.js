const router = require('express').Router()
const equipmentController = require('../controllers/equipment.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

/**
 * @swagger
 * /equipments:
 *   get:
 *     summary: ดูอุปกรณ์ทั้งหมด
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [available, borrowed, maintenance] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: รายการอุปกรณ์
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipments:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Equipment' }
 */
router.get('/', authMiddleware, equipmentController.getAll)

/**
 * @swagger
 * /equipments/{id}:
 *   get:
 *     summary: ดูรายละเอียดอุปกรณ์
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: ข้อมูลอุปกรณ์ }
 *       404: { description: ไม่พบอุปกรณ์ }
 */
router.get('/:id', authMiddleware, equipmentController.getById)

/**
 * @swagger
 * /equipments:
 *   post:
 *     summary: เพิ่มอุปกรณ์ (Admin เท่านั้น)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, serial_number]
 *             properties:
 *               name:          { type: string, example: "MacBook Pro 14" }
 *               serial_number: { type: string, example: "MBP-2024-001" }
 *               description:   { type: string }
 *               category_id:   { type: string, format: uuid }
 *     responses:
 *       201: { description: เพิ่มสำเร็จ }
 *       403: { description: ไม่มีสิทธิ์ }
 */
router.post('/', authMiddleware, adminMiddleware, equipmentController.create)

/**
 * @swagger
 * /equipments/{id}:
 *   put:
 *     summary: แก้ไขอุปกรณ์ (Admin เท่านั้น)
 *     tags: [Equipment]
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
 *               name:          { type: string }
 *               serial_number: { type: string }
 *               description:   { type: string }
 *               status:        { type: string, enum: [available, borrowed, maintenance] }
 *     responses:
 *       200: { description: แก้ไขสำเร็จ }
 *       404: { description: ไม่พบอุปกรณ์ }
 */
router.put('/:id', authMiddleware, adminMiddleware, equipmentController.update)

/**
 * @swagger
 * /equipments/{id}:
 *   delete:
 *     summary: ลบอุปกรณ์ (Admin เท่านั้น)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: ลบสำเร็จ }
 *       404: { description: ไม่พบอุปกรณ์ }
 */
router.delete('/:id', authMiddleware, adminMiddleware, equipmentController.remove)

module.exports = router
