import { HttpError } from './http-error'
import {ValidationError as VErrorObject } from 'express-validator'

/**
 * Handle errors generated during input validation (express-validator).
 */
export class ValidationError extends HttpError {
  public errors: () => string[]

  constructor(errors: VErrorObject[]) {
    super(422, 'A validation error has occurred')

    this.errors = () => errors.map(e => `${e.param}: ${e.msg}`)
  }
}

export default ValidationError
