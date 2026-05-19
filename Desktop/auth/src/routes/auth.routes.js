const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: สมัครสมาชิก
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: "สมชาย ใจดี" }
 *               email:    { type: string, format: email, example: "somchai@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       201: { description: สมัครสำเร็จ }
 *       400: { description: ข้อมูลไม่ครบ }
 *       409: { description: Email ซ้ำ }
 */
router.post('/register', authController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: เข้าสู่ระบบ — คืน JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: "admin@example.com" }
 *               password: { type: string, example: "password" }
 *     responses:
 *       200: { description: เข้าสู่ระบบสำเร็จ }
 *       401: { description: รหัสผ่านไม่ถูกต้อง }
 */
router.post('/login', authController.login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: ดูข้อมูลผู้ใช้ปัจจุบัน
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: ข้อมูล user }
 *       401: { description: ไม่มี token }
 */
router.get('/me', authMiddleware, authController.me)

module.exports = router
