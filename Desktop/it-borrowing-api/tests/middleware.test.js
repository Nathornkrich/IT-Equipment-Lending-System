const jwt = require('jsonwebtoken')
const authMiddleware = require('../src/middlewares/auth.middleware')
const adminMiddleware = require('../src/middlewares/admin.middleware')

process.env.JWT_SECRET = 'testsecret'

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('authMiddleware', () => {
  it('calls next() with valid token', () => {
    const token = jwt.sign({ userId: '1', role: 'user' }, 'testsecret')
    const req = { headers: { authorization: `Bearer ${token}` } }
    const res = mockRes()
    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toHaveProperty('userId', '1')
  })

  it('returns 401 with no token', () => {
    const req = { headers: {} }
    const res = mockRes()
    authMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 401 with invalid token', () => {
    const req = { headers: { authorization: 'Bearer badtoken' } }
    const res = mockRes()
    authMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 401 with expired token', () => {
    const token = jwt.sign({ userId: '1' }, 'testsecret', { expiresIn: -1 })
    const req = { headers: { authorization: `Bearer ${token}` } }
    const res = mockRes()
    authMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Token expired' }))
  })
})

describe('adminMiddleware', () => {
  it('calls next() for admin user', () => {
    const req = { user: { role: 'admin' } }
    const res = mockRes()
    const next = jest.fn()

    adminMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 403 for non-admin user', () => {
    const req = { user: { role: 'user' } }
    const res = mockRes()

    adminMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('returns 403 if no user on request', () => {
    const req = {}
    const res = mockRes()

    adminMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(403)
  })
})

describe('errorMiddleware', () => {
  const errorMiddleware = require('../src/middlewares/error.middleware')
  
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterEach(() => {
    console.error.mockRestore()
  })

  it('returns error status and message', () => {
    const err = { status: 400, message: 'Bad request', stack: 'Error stack' }
    const req = {}
    const res = mockRes()

    errorMiddleware(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Bad request' }))
  })

  it('defaults to 500 if no status', () => {
    const err = new Error('Something broke')
    const req = {}
    const res = mockRes()

    errorMiddleware(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
