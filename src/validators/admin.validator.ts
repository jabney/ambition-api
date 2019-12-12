import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const addToWhitelistValidator = [
  defs.email(),

  validationErrors,
]

export const removeFromWhitelistValidator = [
  defs.email(),

  validationErrors,
]

export const revokeTokensValidator = [
  defs.mongoId('userId').optional(),
  defs.email().optional(),

  validationErrors,
]

export const revokeAllTokensValidator = [
  defs.boolean('confirm').optional(),

  validationErrors,
]
