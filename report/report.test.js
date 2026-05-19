const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

jest.mock('../src/config/db')
const db = require('../src/config/db')

process.env.JWT_SECRET = 'testsecret'

const makeToken = (role = 'admin') =>
  jwt.sign({ userId: 'uuid-admin-1', email: 'admin@test.com', role }, 'testsecret')

const adminToken = makeToken('admin')
const userToken = makeToken('user')

const mockRows = { rows: [] }

describe('GET /api/reports/summary', () => {
  beforeEach(() => jest.clearAllMocks())

  it('admin gets summary report', async () => {
    db.query.mockResolvedValue(mockRows)

    const res = await request(app)
      .get('/api/reports/summary')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('equipment_summary')
    expect(res.body).toHaveProperty('borrowing_summary')
    expect(res.body).toHaveProperty('top_equipments')
    expect(res.body).toHaveProperty('monthly_borrowings')
  })

  it('returns 403 for non-admin', async () => {
    const res = await request(app)
      .get('/api/reports/summary')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(403)
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/reports/summary')
    expect(res.status).toBe(401)
  })
})
