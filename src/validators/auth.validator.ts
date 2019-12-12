import validationErrors from '../middleware/validation-errors'
import defs from './definitions'
import sanitize from '../lib/sanitize'

export const signupValidator = [
  defs.email(),
  defs.password(),
  defs.strShort('first').optional(),
  defs.strShort('last').optional(),

  validationErrors,

  sanitize('body', ['email', 'password', 'first', 'last']),
]

export const signinValidator = [
  defs.email(),
  defs.password(),

  validationErrors,
]
