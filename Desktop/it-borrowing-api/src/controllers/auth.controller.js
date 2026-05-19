const userModel = require('../models/user.model')
const authService = require('../services/auth.service')

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' })
    }

    const existing = await userModel.findByEmail(email)
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const passwordHash = await authService.hashPassword(password)
    const user = await userModel.create({ name, email, passwordHash })

    const token = authService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const user = await userModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const valid = await authService.comparePassword(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = authService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    })
  } catch (err) {
    next(err)
  }
}

const me = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me }
