export interface JSONError {
  status: number
  message: string
}

export class HttpError extends Error {
  public status: number

  constructor(status=500, message='internal server error') {
    super(message)
    this.status = status
  }

  toJSON() {
    const { status, message } = this
    return { status, message }
  }
}
