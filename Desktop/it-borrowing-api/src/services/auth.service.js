const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SALT_ROUNDS = 10

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken }
