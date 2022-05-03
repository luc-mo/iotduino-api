import { sign } from 'jsonwebtoken'

export default function signToken(_id) {
  return sign({ _id }, process.env.JWT_SECRET, { expiresIn: '365d' })
}