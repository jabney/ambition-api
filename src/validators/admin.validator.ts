import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const addValidator = [
  defs.body.email(),

  validationErrors,
]

export const removeValidator = [
  defs.body.email(),

  validationErrors,
]
