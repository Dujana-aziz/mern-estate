import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

import dotenv from 'dotenv'
dotenv.config()

// Connecting the data base
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to DB')
  })
  .catch((error) => {
    console.log(error)
  })

// Connecting with backend server using express on port 3000
const app = express()
app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

// Routes to communicate between Client & Server
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

// Middle Ware for handling server db error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
