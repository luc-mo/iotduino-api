import { connection } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { randomBytes } from 'crypto'

import { Users, Controllers } from '../models'
import { signToken, encryptPassword } from '../utils'

async function verifyExistingUser(username, email) {
  const user = await Users.find({
    $or: [{ username }, { email }],
  })
  return user.length ? true : false
}

export async function registerUser(req, res) {
  try {
    const { username, password, email, ...rest } = req.body
    if(!username || !password || !email)
      return res.status(400).send({ message: 'Missing required fields' })

    const existence = await verifyExistingUser(username, email)
    if(existence)
      return res.status(409).send({ message: 'User already exists' })
    
    const salt = randomBytes(16).toString('base64')
    const encryptedPassword = await encryptPassword(password, salt)
    const apiToken = [ uuidv4() ]

    await Users.create({
      ...rest,
      username,
      password: encryptedPassword,
      apiToken,
      salt,
      email,
    })

    res.status(201).send({ message: 'User created successfully' })
    
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body
    if(!username || !password)
      return res.status(400).send({ message: 'Missing required fields' })

    const user = await Users.findOne({ username })
    if(!user)
      return res.status(401).send({ message: 'Incorrect user and/or password' })

    const encryptedPassword = await encryptPassword(password, user.salt)
    if(user.password !== encryptedPassword)
      return res.status(401).send({ message: 'Incorrect user and/or password' })

    const loginToken = signToken(user._id)
    res.send({ loginToken })
    
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function deleteUser(req, res) {
  try {
    const { _id: userId } = req.user
    
    const session = await connection.startSession()
    await session.withTransaction(async() => {
      await Users.findByIdAndDelete(userId)
      await Controllers.deleteMany({ userId })
      res.send({ message: 'User data deleted successfully' })
    })

  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}