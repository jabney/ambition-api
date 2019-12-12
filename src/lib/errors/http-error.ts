import { IJSonError } from './json-error'

/**
 * The canonical error class used for request handlers.
 */
export class HttpError extends Error {
  public name: string
  public status: number
  public wrapped: object|undefined

  constructor(status= 500, message= 'internal server error', error?: object) {
    super(message)
    this.name = 'HttpError'
    this.status = status

    if (error != null) {
      this.wrapped = error
    }
  }

  public toJSON(): IJSonError {
    const { status, message } = this
    return { status, message }
  }
}
