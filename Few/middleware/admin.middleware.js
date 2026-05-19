/**
 * ตรวจว่า user มี role = 'admin'
 * ต้องใช้หลัง authMiddleware เสมอ เพราะต้องการ req.user
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = adminMiddleware
