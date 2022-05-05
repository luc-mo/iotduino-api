import { verify } from 'jsonwebtoken'
import { wsServer } from '../index'
import { Users, Controllers } from '../models'

export default async function wsAuth(req, socket, head) {
  try {
    const { client, apitoken, authorization, controllerid } = req.headers
    const { _id: userId } = verify(authorization, process.env.JWT_SECRET)

    const user = await Users.findById(userId)
    if(!user)
      return socket.destroy()
    
    const isAuthorized = user.apiToken.some(token => token === apitoken)
    if(!isAuthorized)
      return socket.destroy()

    switch(client) {
      case 'user': 
        req.headers.user = user
        break
      case 'controller':
        const controller = await Controllers.findOne({ _id: controllerid, userId })
        if(!controller)
          return socket.destroy()
        req.headers.controller = controller
        break
      default:
        return socket.destroy()
    }

    wsServer.handleUpgrade(req, socket, head, ws => wsServer.emit('connection', ws, req))

  } catch(error) {
    console.log(error)
    return socket.destroy()
  }
}