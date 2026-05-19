const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

jest.mock('../src/models/equipment.model')
const equipmentModel = require('../src/models/equipment.model')

process.env.JWT_SECRET = 'testsecret'

// helper สร้าง token จำลอง
const makeToken = (role = 'user') =>
  jwt.sign({ userId: 'uuid-user', email: 'u@test.com', role }, 'testsecret')

const adminToken = makeToken('admin')
const userToken = makeToken('user')

const mockEquipment = {
  id: 'uuid-eq-1',
  name: 'MacBook Pro',
  serial_number: 'SN-001',
  status: 'available',
  category_name: 'Laptop',
}

describe('GET /api/equipments', () => {
  it('returns equipment list for authenticated user', async () => {
    equipmentModel.findAll.mockResolvedValue([mockEquipment])

    const res = await request(app)
      .get('/api/equipments')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.equipments).toHaveLength(1)
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/equipments')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/equipments', () => {
  it('admin can create equipment', async () => {
    equipmentModel.create.mockResolvedValue(mockEquipment)

    const res = await request(app)
      .post('/api/equipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'MacBook Pro', serial_number: 'SN-001' })

    expect(res.status).toBe(201)
    expect(res.body.equipment).toHaveProperty('name', 'MacBook Pro')
  })

  it('user cannot create equipment (403)', async () => {
    const res = await request(app)
      .post('/api/equipments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'MacBook Pro', serial_number: 'SN-001' })

    expect(res.status).toBe(403)
  })

  it('returns 400 if name is missing', async () => {
    const res = await request(app)
      .post('/api/equipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ serial_number: 'SN-001' })

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/equipments/:id', () => {
  it('admin can delete equipment', async () => {
    equipmentModel.remove.mockResolvedValue({ id: 'uuid-eq-1' })

    const res = await request(app)
      .delete('/api/equipments/uuid-eq-1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
  })

  it('returns 404 if not found', async () => {
    equipmentModel.remove.mockResolvedValue(null)

    const res = await request(app)
      .delete('/api/equipments/notexist')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
  })
})
