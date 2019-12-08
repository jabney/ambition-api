import { JSONError } from './json-error'

export class HttpError extends Error {
  public name: string
  public status: number
  public wrapped: string|null

  constructor(status=500, message='internal server error', stack: string|null = null) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.wrapped = stack
  }

  toJSON(): JSONError {
    const { status, message } = this
    return { status, message }
  }
}
