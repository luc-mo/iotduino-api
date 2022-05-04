import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import {
  users,
  controllers
} from './routes'

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`)
})

app.use('/api/users', users)
app.use('/api/controllers', controllers)

export default app