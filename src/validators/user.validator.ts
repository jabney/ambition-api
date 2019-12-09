import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const updateValidator = [
  /**
   * Optional fields.
   */
  defs.body.optional.email,
  defs.body.optional.password,
  defs.body.optional.first,
  defs.body.optional.last,

  validationErrors,
]
