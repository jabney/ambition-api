import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const addToWhitelistValidator = [
  defs.body.email(),

  validationErrors,
]

export const removeFromWhitelistValidator = [
  defs.body.email(),

  validationErrors,
]

export const revokeTokensValidator = [
  defs.body.mongoId('userId').optional(),
  defs.body.email().optional(),

  validationErrors,
]

export const revokeAllTokensValidator = [
  defs.body.boolean('confirm').optional(),

  validationErrors,
]
