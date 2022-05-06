import { clients } from '../index'

function handleUserMessage(wsUser, message) {
  try {
    const { _id } = wsUser.user
    const { controllerId } = JSON.parse(message)

    const wsController = clients.get(controllerId)
    if(!wsController)
      return wsUser.send(JSON.stringify({ error: 'Controller not found' }))

    const isOwner = _id.equals(wsController.controller.userId)
    if(!isOwner)
      return wsUser.send(JSON.stringify({ error: 'Forbidden' }))

    wsController.send(message)

  } catch(error) {
    console.log(error)
    wsUser.send(JSON.stringify({ error: 'Invalid message' }))
  }
}

function handleControllerMessage(wsController, message) {
  try {
    const { userId } = wsController.controller

    const wsUser = clients.get(userId.toString())
    if(!wsUser)
      return wsController.send(JSON.stringify({ error: 'User not found' }))

    wsUser.send(message)

  } catch(error) {
    console.log(error)
    wsController.send(JSON.stringify({ error: 'Invalid message' }))
  }
}

function handleClose(ws, client) {
  try {
    const { _id } = ws[client]
    clients.delete(_id.toString())
  } catch(error) {
    console.log(error)
  }
}

export default function onConnection(ws, req) {
  const { client, user, controller } = req.headers
  switch(client) {
    case 'user':
      ws.user = user
      clients.set(user._id.toString(), ws)
      ws.on('message', message => handleUserMessage(ws, message))
      break

    case 'controller':
      ws.controller = controller
      clients.set(controller._id.toString(), ws)
      ws.on('message', message => handleControllerMessage(ws, message))
      break
  }
  ws.on('close', () => handleClose(ws, client))
}