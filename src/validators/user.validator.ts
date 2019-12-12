import sanitize from '../lib/sanitize'
import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const updateUserValidator = [
  defs.email().optional(),
  defs.password().optional(),
  defs.strShort('first').optional(),
  defs.strShort('last').optional(),

  validationErrors,

  sanitize('body', ['email', 'password', 'first', 'last']),
]

export const addGrantValidator = [
  defs.grant(),

  validationErrors,
]

export const removeGrantValidator = addGrantValidator
