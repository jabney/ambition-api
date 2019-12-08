import { JSONError } from './json-error'

export class HttpError extends Error {
  public name: string
  public status: number
  public wrapped: any

  constructor(status=500, message='internal server error', error?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.wrapped = error
  }

  toJSON(): JSONError {
    const { status, message } = this
    return { status, message }
  }
}
