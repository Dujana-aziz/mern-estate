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
    // Find user in the db
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorhandler(404, 'User not found!'))

    // validate user password
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorhandler(401, 'Wrong Credentials!'))

    // Change that user into a token using jwt
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
    // removing password from the post response
    const { password: pass, ...rest } = validUser._doc
    // send the response of the valid user in cookies while tokenizing it
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    // res.cookie('access_token',token,{httpOnly:true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000 )})
  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = user._doc
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest)
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 13)
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      })
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = newUser._doc
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest)
    }
  } catch (error) {
    next(error)
  }
}
