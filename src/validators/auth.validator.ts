import { body } from 'express-validator'
import validationErrors from '../middleware/validation-errors'
// import { sanitize } from '../lib/sanitize'

export const signupValidator = [
  body('email')
    .isEmail()
    .withMessage('must be a valid email'),
  body('password')
    .isString()
    .isLength({ min: 1, max: 72 })
    .withMessage('must be a string between 1 and 72 characters'),

  validationErrors,

  // sanitize('body', ['email', 'password']),
]

export const signinValidator = [
  body('email')
    .isEmail()
    .withMessage('must be a valid email'),
  body('password')
    .isString()
    .isLength({ min: 1, max: 72 })
    .withMessage('must be a string between 1 and 72 characters'),

  validationErrors,

  // sanitize('body', ['email', 'password']),
]
