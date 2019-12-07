import exp from 'express'
import { createError } from '../lib/errors'
import env from '../environment'

/**
 * Reject http requests on any server which sets x-forwarded-proto to 'https'.
 */
export default function rejectHttp() {
  return function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {
    if (!req.secure && !env.ALLOW_UNSECURE) {
      return next(createError(404, 'use https'))
    }

    next()
  }
}
