import validationErrors from '../middleware/validation-errors'
import defs from './definitions'
import sanitize from '../lib/sanitize'

export const signupValidator = [
  defs.body.email(),
  defs.body.password(),
  defs.body.first().optional(),
  defs.body.last().optional(),

  validationErrors,

  sanitize('body', ['email', 'password', 'first', 'last']),
]

export const signinValidator = [
  defs.body.email(),
  defs.body.password(),

  validationErrors,
]
