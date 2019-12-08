import { HttpError } from './http-error'
import { getStatusText } from 'http-status-codes'

/**
 * Flexibly create an HttpError.
 */
export function createError(...args: any[]) {
  let status: number|null = null
  let message: string|null = null
  let stack: string|null|undefined = null

  // Loop through arguments.
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    // If any arg is an HttpError, return it outright.
    if (arg instanceof HttpError) {
      if (args.length > 1) {
        console.warn(`<createError> arg ${i} is an HttpError. All other args ignored.`)
      }
      return arg
    }

    // If error type, set the stack.
    if (arg instanceof Error) {
      stack = arg.stack
      continue
    }

    // Check for numbers and strings for setting status and message.
    switch (typeof arg) {
      case 'number':
        status = arg
        continue
      case 'string':
        message = arg
        continue
    }

    /**
     * Plain object types.
     */

    // Check for presence of a status code.
    if (status == null) {
      const { status: _status, code, statusCode } = arg
      const s = _status || code || statusCode

      if (typeof s === 'number') {
        status = s
      }
    }

    // Check for the presence of a message.
    if (message == null) {
      const { message: _message } = arg
      if (typeof _message === 'string') {
        message = _message
      }
    }
  }

  // Set fallback defaults.
  status = status == null ? 500 : status
  message = message == null ? getStatusText(status) : message

  return new HttpError(status, message, stack)
}

export default createError
