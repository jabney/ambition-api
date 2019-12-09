import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Token } from '../models/token.model'

/**
 *
 */
export const fetch: RequestHandler = async (req, res, next) => {
  res.json({ user: req.user })
}

/**
 *
 */
export const update: RequestHandler = async (req, res, next) => {
  const user = req.user
  const fields = req.body

  try {
    // Update the user with the given fields.
    await user.updateOne(fields)

    /**
     * Check if we should update the password.
     */
    const { password } = fields

    if (password) {
      user.passwordInfo = { password }
      await user.save()
    }

    res.json({ data: 'user updated' })

  } catch (e) {
    next(createError(e))
  }
}

/**
 *
 */
export const remove: RequestHandler = async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    await Token.deleteMany({ userId })
    await req.user.remove()

    res.json({ data: 'user data deleted '})

  } catch (e) {
    next(createError(e))
  }
}
