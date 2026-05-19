const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

jest.mock('../src/models/borrowing.model')
jest.mock('../src/models/reservation.model')
jest.mock('../src/models/equipment.model')

const borrowingModel = require('../src/models/borrowing.model')
const reservationModel = require('../src/models/reservation.model')
const equipmentModel = require('../src/models/equipment.model')

process.env.JWT_SECRET = 'testsecret'

const makeToken = (role = 'admin') =>
  jwt.sign({ userId: 'uuid-admin-1', email: 'admin@test.com', role }, 'testsecret')

const adminToken = makeToken('admin')
const userToken = makeToken('user')

const mockReservation = {
  id: 'uuid-res-1',
  user_id: 'uuid-user-1',
  equipment_id: 'uuid-eq-1',
  borrow_date: '2025-06-01',
  return_date: '2025-06-07',
  status: 'pending',
}

const mockBorrowing = {
  id: 'uuid-borrow-1',
  reservation_id: 'uuid-res-1',
  approved_by: 'uuid-admin-1',
  status: 'active',
  equipment_id: 'uuid-eq-1',
  borrowed_at: new Date().toISOString(),
}

describe('POST /api/borrowings (Admin confirm borrow)', () => {
  beforeEach(() => jest.clearAllMocks())

  it('admin can confirm borrowing from a pending reservation', async () => {
    reservationModel.findById.mockResolvedValue(mockReservation)
    borrowingModel.create.mockResolvedValue(mockBorrowing)
    reservationModel.updateStatus.mockResolvedValue({ ...mockReservation, status: 'approved' })
    equipmentModel.updateStatus.mockResolvedValue({ id: 'uuid-eq-1', status: 'borrowed' })

    const res = await request(app)
      .post('/api/borrowings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reservation_id: 'uuid-res-1' })

    expect(res.status).toBe(201)
    expect(res.body.borrowing).toHaveProperty('id')
    expect(reservationModel.updateStatus).toHaveBeenCalledWith('uuid-res-1', 'approved')
    expect(equipmentModel.updateStatus).toHaveBeenCalledWith('uuid-eq-1', 'borrowed')
  })

  it('returns 400 if reservation_id missing', async () => {
    const res = await request(app)
      .post('/api/borrowings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})

    expect(res.status).toBe(400)
  })

  it('returns 404 if reservation not found', async () => {
    reservationModel.findById.mockResolvedValue(null)

    const res = await request(app)
      .post('/api/borrowings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reservation_id: 'uuid-not-exist' })

    expect(res.status).toBe(404)
  })

  it('returns 409 if reservation already approved', async () => {
    reservationModel.findById.mockResolvedValue({ ...mockReservation, status: 'approved' })

    const res = await request(app)
      .post('/api/borrowings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reservation_id: 'uuid-res-1' })

    expect(res.status).toBe(409)
  })

  it('returns 409 if reservation is rejected', async () => {
    reservationModel.findById.mockResolvedValue({ ...mockReservation, status: 'rejected' })

    const res = await request(app)
      .post('/api/borrowings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reservation_id: 'uuid-res-1' })

    expect(res.status).toBe(409)
  })

  it('returns 403 for non-admin user', async () => {
    const res = await request(app)
      .post('/api/borrowings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ reservation_id: 'uuid-res-1' })

    expect(res.status).toBe(403)
  })

  it('returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/borrowings')
      .send({ reservation_id: 'uuid-res-1' })

    expect(res.status).toBe(401)
  })
})

describe('PUT /api/borrowings/:id/return', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns equipment successfully', async () => {
    borrowingModel.findById.mockResolvedValue(mockBorrowing)
    borrowingModel.markReturned.mockResolvedValue({ ...mockBorrowing, status: 'returned', returned_at: new Date().toISOString() })
    equipmentModel.updateStatus.mockResolvedValue({ id: 'uuid-eq-1', status: 'available' })

    const res = await request(app)
      .put('/api/borrowings/uuid-borrow-1/return')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ note: 'คืนสภาพดี' })

    expect(res.status).toBe(200)
    expect(res.body.borrowing.status).toBe('returned')
    expect(equipmentModel.updateStatus).toHaveBeenCalledWith('uuid-eq-1', 'available')
  })

  it('returns 404 if borrowing not found', async () => {
    borrowingModel.findById.mockResolvedValue(null)

    const res = await request(app)
      .put('/api/borrowings/uuid-not-exist/return')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})

    expect(res.status).toBe(404)
  })

  it('returns 409 if already returned', async () => {
    borrowingModel.findById.mockResolvedValue({ ...mockBorrowing, status: 'returned' })

    const res = await request(app)
      .put('/api/borrowings/uuid-borrow-1/return')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})

    expect(res.status).toBe(409)
  })

  it('returns 401 without token', async () => {
    const res = await request(app)
      .put('/api/borrowings/uuid-borrow-1/return')
      .send({})

    expect(res.status).toBe(401)
  })
})
