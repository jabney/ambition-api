import {ValidationError as VErrorObject } from 'express-validator'
import { HttpError } from './http-error'

/**
 * Handle errors generated during input validation (express-validator).
 */
export class ValidationError extends HttpError {
  public errors: () => string[]

  constructor(errors: VErrorObject[]) {
    super(422, 'A validation error has occurred')

    this.errors = () => errors.map((e) => `${e.param}: ${e.msg}`)
  }

  public toJSON() {
    const json = super.toJSON()
    json.errors = this.errors()
    return json
  }
}

export default ValidationError
