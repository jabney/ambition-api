import validationErrors from '../middleware/validation-errors'
import defs from './definitions'

export const signupValidator = [
  defs.body.email,
  defs.body.password,
  defs.body.first.optional(),
  defs.body.last.optional(),

  validationErrors,
]

export const signinValidator = [
  defs.body.email,
  defs.body.password,

  validationErrors,
]
