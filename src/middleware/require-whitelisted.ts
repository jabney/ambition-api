import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Whitelist } from '../models/whitelist.model'
import env from '../environment'

/**
 * Require that the email address in the request body be whitelisted.
 */
export const requireWhitelisted: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  if (!env.REQUIRE_WHITELISTED) {
    return next()
  }

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
