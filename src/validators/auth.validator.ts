import { body } from 'express-validator'
import validationErrors from '../middleware/validation-errors'
import { sanitize } from '../lib/sanitize'

export const signupValidator = [
  body('email')
    .isEmail()
    .withMessage('must be a valid email'),
  body('password')
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 72 }).withMessage('must be between 1 and 72 characters'),

  body('first')
    .optional()
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters'),

  body('last')
    .optional()
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters'),

  validationErrors,

  sanitize('body', ['email', 'password', 'first', 'last']),
]

export const signinValidator = [
  body('email')
    .isEmail()
    .withMessage('must be a valid email'),
  body('password')
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 72 })
    .withMessage('must be between 1 and 72 characters'),

  validationErrors,
]
