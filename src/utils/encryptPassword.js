import { pbkdf2 } from 'crypto'

export default async function encryptPassword(password, salt) {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, 10000, 64, 'sha512', (error, key) => {
      if(error) reject(error)
      resolve(key.toString('base64'))
    })
  })
}