const equipmentModel = require('../models/equipment.model')

const getAll = async (req, res, next) => {
  try {
    const { status, category_id, page, limit } = req.query
    const equipments = await equipmentModel.findAll({ status, category_id, page, limit })
    res.json({ equipments })
  } catch (err) {
    next(err)
  }
}

const getById = async (req, res, next) => {
  try {
    const equipment = await equipmentModel.findById(req.params.id)
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' })
    res.json({ equipment })
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    const { category_id, name, serial_number, description } = req.body
    if (!name || !serial_number) {
      return res.status(400).json({ message: 'name and serial_number are required' })
    }
    const equipment = await equipmentModel.create({ category_id, name, serial_number, description })
    res.status(201).json({ equipment })
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const equipment = await equipmentModel.update(req.params.id, req.body)
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' })
    res.json({ equipment })
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    const deleted = await equipmentModel.remove(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Equipment not found' })
    res.json({ message: 'Equipment deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove }
