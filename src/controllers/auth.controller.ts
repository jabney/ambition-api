import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Token } from '../models/token.model'
import { User } from '../models/user.model'
import { IProfileInfo } from '../models/profile-info.interface'

/**
 *
 */
export const signup: RequestHandler = async (req, res, next) => {
  const info: IProfileInfo = req.body

  try {
    const { password } = info
    const user = new User({ ...info, passwordInfo: { password } })
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

/**
 *
 */
export const tokenInfo: RequestHandler = (req, res, next) => {
  const token = req.token

  if (token == null) {
    return res.json({
      expires: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
      }
    })
  }

  // Convert now to seconds.
  const now = Math.floor(Date.now() / 1000)

  // Calculate expire time in seconds, inutes, hours, and days.
  const expiresInSeconds = token.expiresAt - now
  const expiresInMinutes = expiresInSeconds / 60
  const expiresInHours = expiresInMinutes / 60
  const expiresInDays = expiresInHours / 24

  // Create the response object.
  const expires = {
    seconds: expiresInSeconds,
    minutes: expiresInMinutes,
    hours: expiresInHours,
    days: expiresInDays,
  }

  res.json({ expires })
}
