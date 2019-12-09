import { RequestHandler } from 'express'
import { createError } from '../lib/errors'

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
    await user.updateOne(fields)

    if (fields.password) {
      user.passwordInfo = { password: fields.password }
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
    await req.user.remove()
    res.json({ data: 'user data deleted '})

  } catch (e) {
    next(createError(e))
  }
}
