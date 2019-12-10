import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Whitelist } from '../models/whitelist.model'

/**
 * Require that the email address in the request body be whitelisted.
 */
export const requireWhitelisted: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    if (!await Whitelist.isWhitelisted(email)) {
      next(createError(403))
    } else {
      next()
    }
  } catch (e) {
    next(createError(e))
  }
}
