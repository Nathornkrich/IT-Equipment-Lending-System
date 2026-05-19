const reservationModel = require('../models/reservation.model')
const equipmentModel = require('../models/equipment.model')

const create = async (req, res, next) => {
  try {
    const { equipment_id, borrow_date, return_date } = req.body
    const user_id = req.user.userId

    if (!equipment_id || !borrow_date || !return_date) {
      return res.status(400).json({ message: 'equipment_id, borrow_date and return_date are required' })
    }

    // ตรวจว่าอุปกรณ์มีอยู่และพร้อมใช้งาน
    const equipment = await equipmentModel.findById(equipment_id)
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' })
    if (equipment.status !== 'available') {
      return res.status(409).json({ message: `Equipment is currently ${equipment.status}` })
    }

    const reservation = await reservationModel.create({
      user_id,
      equipment_id,
      borrow_date,
      return_date,
    })

    res.status(201).json({ reservation })
  } catch (err) {
    next(err)
  }
}

const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await reservationModel.findByUser(req.user.userId)
    res.json({ reservations })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getMyReservations }
