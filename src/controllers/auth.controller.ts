import { RequestHandler } from 'express'
import { Token } from '../models/token.model'
import { User } from '../models/user.model'
import { createError } from '../lib/errors'

/**
 *
 */
export const signup: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(createError(400, 'email and password required'))
  }

  try {
    const user = new User({ email, passwordInfo: { password } })
    await user.save()

    const token = await Token.createToken(user._id)
    res.json({ token })

  } catch (e) {
    // Handle duplicate key error.
    if (e.name === 'MongoError' && e.code === 11000) {
      return next(createError(409, 'user already exists'))
    }

    return next(createError(e))
  }
}

/**
 *
 */
export const signin: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  try {
    // If there is an existing valid token, remove it.
    if (req.token) { req.token.remove() }

    const user = await User.findOne({ email })

    if (user == null) {
      return next(createError(404, 'user not found'))
    }

    if (!await user.verifyPassword(password)) {
      return next(createError(404, 'user not found'))
    }

    const token = await Token.createToken(user._id)

    res.json({ token })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const signout: RequestHandler = async (req, res, next) => {
  try {
    await req.token.remove()

    res.json({ data: 'token revoked' })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const signoutAll: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.token
    await Token.deleteMany({ userId })

    res.json({ data: 'all tokens revoked' })

  } catch (e) {
    return next(createError(e))
  }
}
