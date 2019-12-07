import { JSONError } from './json-error'

export class HttpError extends Error {
  public status: number
  public error: string|null

  constructor(status=500, message='internal server error', error: string|null = null) {
    super(message)
    this.status = status
    this.error = error
  }

  toJSON(): JSONError {
    const { status, message, error } = this
    return { status, message }
  }
}
