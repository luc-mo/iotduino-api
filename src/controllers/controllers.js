import { connection } from 'mongoose'
import { Users, Controllers } from '../models'

export async function getAllControllers(req, res) {
  try {
    const { _id: userId } = req.user
    const controllers = await Controllers.find({ userId })
    res.send(controllers)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function getController(req, res) {
  try {
    const { _id: userId } = req.user
    const { id: _id } = req.params
    const controller = await Controllers.findOne({ _id, userId })
    res.send(controller)
    
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function createController(req, res) {
  try {
    const { _id: userId } = req.user
    const { name, type } = req.body
    
    if(!name || !type)
      return res.status(400).send({ message: 'Missing required fields' })
    
    const session = await connection.startSession()
    await session.withTransaction(async() => {
      const controller = await Controllers.create({ name, type, userId })
      await Users.findByIdAndUpdate(userId, {
        $push: { controllers: controller._id }
      })
      res.status(201).send({ controller })
    })

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function updateController(req, res) {
  try {
    const { _id: userId } = req.user
    const { id: _id } = req.params
    const { name, type } = req.body

    const controller = await Controllers.findOneAndUpdate(
      { _id, userId },
      { name, type },
      { new: true }
    )
    res.status(201).send(controller)

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function deleteController(req, res) {
  try {
    const { _id: userId } = req.user
    const { id: _id } = req.params

    const session = await connection.startSession()
    await session.withTransaction(async() => {
      await Controllers.findOneAndDelete({ _id, userId })
      await Users.findByIdAndUpdate(userId, {
        $pull: { controllers: _id }
      })
      res.send({ message: 'Controller deleted successfully' })
    })

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}