const request = require('supertest')
const app = require('../src/app')

// Mock database และ services
jest.mock('../src/models/user.model')
jest.mock('../src/services/auth.service')

const userModel = require('../src/models/user.model')
const authService = require('../src/services/auth.service')

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 201 and token on success', async () => {
    userModel.findByEmail.mockResolvedValue(null)
    authService.hashPassword.mockResolvedValue('hashed')
    userModel.create.mockResolvedValue({
      id: 'uuid-1', name: 'Test', email: 'test@test.com', role: 'user'
    })
    authService.generateToken.mockReturnValue('mock-token')

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('user')
  })

  it('returns 409 if email already exists', async () => {
    userModel.findByEmail.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/already in use/i)
  })

  it('returns 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com' })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 200 and token on valid credentials', async () => {
    userModel.findByEmail.mockResolvedValue({
      id: 'uuid-1', name: 'Test', email: 'test@test.com',
      password_hash: 'hashed', role: 'user'
    })
    authService.comparePassword.mockResolvedValue(true)
    authService.generateToken.mockReturnValue('mock-token')

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token', 'mock-token')
  })

  it('returns 401 on wrong password', async () => {
    userModel.findByEmail.mockResolvedValue({
      id: 'uuid-1', email: 'test@test.com', password_hash: 'hashed'
    })
    authService.comparePassword.mockResolvedValue(false)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' })

    expect(res.status).toBe(401)
  })

  it('returns 401 if user not found', async () => {
    userModel.findByEmail.mockResolvedValue(null)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@test.com', password: 'password123' })

    expect(res.status).toBe(401)
  })

  it('returns 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com' })

    expect(res.status).toBe(400)
  })
})
