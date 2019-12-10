import sanitize from '../lib/sanitize'
import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const updateValidator = [
  /**
   * Optional fields.
   */
  defs.body.email().optional(),
  defs.body.password().optional(),
  defs.body.first().optional(),
  defs.body.last().optional(),

  validationErrors,

  sanitize('body', ['email', 'password', 'first', 'last']),
]
