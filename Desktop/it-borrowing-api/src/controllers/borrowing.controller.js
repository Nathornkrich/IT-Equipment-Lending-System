const borrowingModel = require('../models/borrowing.model')
const reservationModel = require('../models/reservation.model')
const equipmentModel = require('../models/equipment.model')

// Admin ยืนยันการยืม (จาก reservation)
const confirmBorrow = async (req, res, next) => {
  try {
    const { reservation_id } = req.body
    const approved_by = req.user.userId

    if (!reservation_id) {
      return res.status(400).json({ message: 'reservation_id is required' })
    }

    const reservation = await reservationModel.findById(reservation_id)
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' })
    if (reservation.status !== 'pending') {
      return res.status(409).json({ message: `Reservation is already ${reservation.status}` })
    }

    // สร้าง borrowing record
    const borrowing = await borrowingModel.create({ reservation_id, approved_by })

    // อัปเดตสถานะ reservation และอุปกรณ์
    await reservationModel.updateStatus(reservation_id, 'approved')
    await equipmentModel.updateStatus(reservation.equipment_id, 'borrowed')

    res.status(201).json({ borrowing })
  } catch (err) {
    next(err)
  }
}

// คืนอุปกรณ์
const returnEquipment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { note } = req.body

    const borrowing = await borrowingModel.findById(id)
    if (!borrowing) return res.status(404).json({ message: 'Borrowing record not found' })
    if (borrowing.status === 'returned') {
      return res.status(409).json({ message: 'Equipment already returned' })
    }

    const updated = await borrowingModel.markReturned(id, note)

    // คืนสถานะอุปกรณ์เป็น available
    await equipmentModel.updateStatus(borrowing.equipment_id, 'available')

    res.json({ borrowing: updated })
  } catch (err) {
    next(err)
  }
}

module.exports = { confirmBorrow, returnEquipment }
