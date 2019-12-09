import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const updateValidator = [
  /**
   * Optional fields.
   */
  defs.body.email.optional(),
  defs.body.password.optional(),
  defs.body.first.optional(),
  defs.body.last.optional(),

  validationErrors,
]
