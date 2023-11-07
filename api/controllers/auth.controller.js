import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorhandler } from '../utils/error.js'

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = bcryptjs.hashSync(password, 13)
  const newUser = new User({ username, email, password: hashedPassword })
  try {
    await newUser.save()
    res.status(201).json({ message: 'User Created Successfully', newUser })
  } catch (error) {
    next(error)
  }
}