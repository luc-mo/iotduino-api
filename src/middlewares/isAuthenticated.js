import { verify } from 'jsonwebtoken'
import { Users } from '../models'

export default async function isAuthenticated(req, res, next) {
  try {
    const { authorization: loginToken } = req.headers
    if(!loginToken) res.sendStatus(403)

    const { _id } = verify(loginToken, process.env.JWT_SECRET)
    const user = await Users.findById(_id)
    if(!user) return res.status(404).send({ message: 'User not found' })

    req.user = user
    next()
    
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}