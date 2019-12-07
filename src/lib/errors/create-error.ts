import { HttpError } from './http-error'
import { getStatusText } from 'http-status-codes'

export function createError(...args: any[]) {
  let status: number|null = null
  let message: string|null = null
  let stack: string|null|undefined = null

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg instanceof Error) {
      stack = arg.stack
      continue
    }

    switch (typeof arg) {
      case 'number':
        status = arg
        continue
      case 'string':
        message = arg
        continue
    }

    if (status == null) {
      const { status: _status, code, statusCode } = arg
      const s = _status || code || statusCode

      if (typeof s === 'number') {
        status = s
      }
    }

    if (message == null) {
      const { message: _message } = arg
      if (typeof _message === 'string') {
        message = _message
      }
    }
  }

  status = status == null ? 500 : status
  message = message == null ? getStatusText(status) : message

  return new HttpError(status, message, stack)
}

export default createError
