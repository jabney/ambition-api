import { ErrorRequestHandler } from 'express'
import { HttpError } from './lib/errors'

/**
 * Main application error handler.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)

  if (err instanceof HttpError) {
    res.status(err.status).json(err)
  } else {
    const status = 500
    const message = err.message || 'unknown error'
    res.status(status).json({ status, message })
  }
}

export default errorHandler
