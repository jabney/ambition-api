import sanitize from '../lib/sanitize'
import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const updateUserValidator = [
  defs.body.email().optional(),
  defs.body.password().optional(),
  defs.body.first().optional(),
  defs.body.last().optional(),

  validationErrors,

  sanitize('body', ['email', 'password', 'first', 'last']),
]

export const addGrantValidator = [
  defs.body.grant(),

  validationErrors,
]

export const removeGrantValidator = addGrantValidator
