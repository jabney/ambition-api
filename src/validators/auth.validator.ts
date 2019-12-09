import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const signupValidator = [
  defs.body.required.email,
  defs.body.required.password,

  /**
   * Optional fields.
   */
  defs.body.optional.first,
  defs.body.optional.last,

  validationErrors,
]

export const signinValidator = [
  defs.body.required.email,
  defs.body.required.password,

  validationErrors,
]
