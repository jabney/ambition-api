import { RequestHandler } from 'express'
import env from '../environment'
import { createError } from '../lib/errors'

/**
 * Reject http requests on any server which sets x-forwarded-proto to 'https'.
 */
export default function rejectHttp(): RequestHandler {
  return (req, res, next) => {
    if (!req.secure && !env.ALLOW_UNSECURE) {
      return next(createError(404, 'use https'))
    }
    next()
  }
}
