import { getStatusText } from 'http-status-codes'
import { HttpError } from './http-error'

/**
 * Create an HttpError.
 */
export function createError(status: number, message?: string): HttpError
export function createError(error: object): HttpError
export function createError(arg1: number|object, arg2?: string): HttpError {

  // Handle status and message arguments.
  if (typeof arg1 === 'number') {
    const status = arg1
    const message = arg2 || getStatusText(status)
    return new HttpError(status, message)
  }

  // Handle error arguments.
  if (arg1 instanceof HttpError) {
    return arg1
  } else {
    const status = 500
    // Pass the error object to HttpError.
    return new HttpError(status, getStatusText(status), arg1)
  }
}

export default createError
