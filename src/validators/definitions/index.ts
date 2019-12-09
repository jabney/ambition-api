import { body, query, param, ValidationChain } from 'express-validator'

type Location = 'body'|'query'|'param'

const location: {[K in Location]: (field: string) => ValidationChain} = {
  body,
  query,
  param,
}

const email = (loc: Location) => location[loc]('email')
  .isEmail().withMessage('must be a valid email')

const password = (loc: Location) => location[loc]('password')
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 72 }).withMessage('must be between 1 and 72 characters')

const first = (loc: Location) => location[loc]('first')
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters')

const last = (loc: Location) => location[loc]('last')
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters')

export default {
  body: {
    email: email('body'),
    password: password('body'),
    first: first('body'),
    last: last('body'),
  },

  query: {

  },

  param: {

  }
}
