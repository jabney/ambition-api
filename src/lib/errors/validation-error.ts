import {ValidationError as VErrorObject } from 'express-validator'
import { HttpError } from './http-error'
import { IJSonError } from './json-error'

/**
 * Handle errors generated during input validation (express-validator).
 */
export class ValidationError extends HttpError {
  public errors: () => string[]

  constructor(errors: VErrorObject[]) {
    super(422, 'A validation error has occurred')
    this.name = 'ValidationError'

    // Return a formatted error list.
    this.errors = () => errors.map((e) => `${e.param}: ${e.msg}`)
  }

  public toJSON(): IJSonError {
    const json = super.toJSON()
    json.errors = this.errors()
    return json
  }
}

export default ValidationError
