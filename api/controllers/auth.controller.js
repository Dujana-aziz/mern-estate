import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.model.js'
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorhandler(404, 'User not found!'))

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorhandler(401, 'Wrong Credentials!'))

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
    // removing password from the post response
    const { password: pass, ...rest } = validUser._doc
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)

    // res.cookie('access_token',token,{httpOnly:true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000 )})
  } catch (error) {
    next(error)
  }
}
