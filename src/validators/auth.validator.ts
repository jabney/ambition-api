import { body } from 'express-validator'
import validationErrors from '../middleware/validation-errors'

export const signupValidator = [
  body('email')
    .isEmail()
    .withMessage('must be a valid email'),

  body('password')
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 72 }).withMessage('must be between 1 and 72 characters'),

  /**
   * Optional fields.
   */

  body('first')
    .optional()
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters'),

  body('last')
    .optional()
    .isString().withMessage('must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters'),

  validationErrors,
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
