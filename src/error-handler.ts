import { ErrorRequestHandler } from 'express'
import { HttpError } from './lib/errors'
import env from './environment'

/**
 * Main application error handler.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!env.TEST) {
    /* tslint:disable-next-line */
    console.log(err)
  }

  if (err instanceof HttpError) {
    res.status(err.status).json(err)
  } else {
    const status = 500
    const message = err.message || 'unknown error'
    res.status(status).json({ status, message })
  }
}

export default errorHandler
