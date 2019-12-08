import { RequestHandler } from 'express'
import { Token } from '../models/token.model'
import { User } from '../models/user.model'
import * as tokens from '../lib/tokens'
import { createError } from '../lib/errors'

/**
 * Create a token and save it to the db.
 */
async function createToken(userId: string): Promise<string> {
  const token = await tokens.sign(userId)

  const {
    iat: issuedAt,
    exp: expiresAt,
  } = tokens.decode(token)

  const tokenDoc = new Token({ userId, issuedAt, expiresAt })
  await tokenDoc.save()
  return token
}

// createToken('5dec56e4e903e327da7fe5c9').then(token => console.log(token))

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

    const token = await createToken(user._id.toHexString())
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
    const user = await User.findOne({ email })

    if (user == null) {
      return next(createError(404, 'user not found'))
    }

    if (!await user.verifyPassword(password)) {
      return next(createError(404, 'user not found'))
    }

    const token = await createToken(user._id.toHexString())

    res.json({ token })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const signout: RequestHandler = (req, res, next) => {
  res.json({ data: 'signout' })
}

/**
 *
 */
export const signoutAll: RequestHandler = (req, res, next) => {
  res.json({ data: 'signoutAll' })
}
