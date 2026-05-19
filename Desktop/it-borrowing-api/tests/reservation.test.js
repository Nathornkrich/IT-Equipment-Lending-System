const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

jest.mock('../src/models/reservation.model')
jest.mock('../src/models/equipment.model')

const reservationModel = require('../src/models/reservation.model')
const equipmentModel = require('../src/models/equipment.model')

process.env.JWT_SECRET = 'testsecret'

const makeToken = (role = 'user') =>
  jwt.sign({ userId: 'uuid-user-1', email: 'u@test.com', role }, 'testsecret')

const userToken = makeToken('user')
const adminToken = makeToken('admin')

const mockEquipment = {
  id: 'uuid-eq-1',
  name: 'MacBook Pro',
  serial_number: 'SN-001',
  status: 'available',
}

const mockReservation = {
  id: 'uuid-res-1',
  user_id: 'uuid-user-1',
  equipment_id: 'uuid-eq-1',
  borrow_date: '2025-06-01',
  return_date: '2025-06-07',
  status: 'pending',
}

describe('POST /api/reservations', () => {
  beforeEach(() => jest.clearAllMocks())

  it('creates reservation for authenticated user', async () => {
    equipmentModel.findById.mockResolvedValue(mockEquipment)
    reservationModel.create.mockResolvedValue(mockReservation)

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        equipment_id: 'uuid-eq-1',
        borrow_date: '2025-06-01',
        return_date: '2025-06-07',
      })

    expect(res.status).toBe(201)
    expect(res.body.reservation).toHaveProperty('id')
    expect(res.body.reservation.status).toBe('pending')
  })

  it('returns 400 if required fields missing', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ equipment_id: 'uuid-eq-1' })

    expect(res.status).toBe(400)
  })

  it('returns 400 if borrow_date missing', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ equipment_id: 'uuid-eq-1', return_date: '2025-06-07' })

    expect(res.status).toBe(400)
  })

  it('returns 404 if equipment not found', async () => {
    equipmentModel.findById.mockResolvedValue(null)

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        equipment_id: 'uuid-not-exist',
        borrow_date: '2025-06-01',
        return_date: '2025-06-07',
      })

    expect(res.status).toBe(404)
  })

  it('returns 409 if equipment is not available', async () => {
    equipmentModel.findById.mockResolvedValue({ ...mockEquipment, status: 'borrowed' })

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        equipment_id: 'uuid-eq-1',
        borrow_date: '2025-06-01',
        return_date: '2025-06-07',
      })

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/borrowed/i)
  })

  it('returns 409 if equipment is under maintenance', async () => {
    equipmentModel.findById.mockResolvedValue({ ...mockEquipment, status: 'maintenance' })

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        equipment_id: 'uuid-eq-1',
        borrow_date: '2025-06-01',
        return_date: '2025-06-07',
      })

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/maintenance/i)
  })

  it('returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ equipment_id: 'uuid-eq-1', borrow_date: '2025-06-01', return_date: '2025-06-07' })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/reservations/my', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns reservations for current user', async () => {
    reservationModel.findByUser.mockResolvedValue([mockReservation])

    const res = await request(app)
      .get('/api/reservations/my')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.reservations).toHaveLength(1)
    expect(reservationModel.findByUser).toHaveBeenCalledWith('uuid-user-1')
  })

  it('returns empty array if no reservations', async () => {
    reservationModel.findByUser.mockResolvedValue([])

    const res = await request(app)
      .get('/api/reservations/my')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.reservations).toHaveLength(0)
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/reservations/my')
    expect(res.status).toBe(401)
  })
})
