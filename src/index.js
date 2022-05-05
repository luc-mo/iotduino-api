import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { createServer } from 'http'
import { Server } from 'ws'

import {
  users,
  controllers
} from './routes'
import { wsAuth } from './middlewares'

const PORT = process.env.PORT || 8000

export const app = express()
export const server = createServer(app)
export const wsServer = new Server({ noServer: true })
export const clients = new Map()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`)
})

server.on('upgrade', wsAuth)

wsServer.on('connection', (ws, req) => {
  ws.send('Hello from the server')
})

app.use('/api/users', users)
app.use('/api/controllers', controllers)

export default { app, server, wsServer, clients }