import { Router } from 'express'
import { apiKey } from '../middleware/api-key'
import { signup, signin, signout, signoutAll } from '../controllers/auth.controller'
import { tokenOptional, tokenRequired } from '../middleware/authorize'
import { signupValidator, signinValidator } from '../validators/auth.validator'

const router = Router()

router.route('/signup')
  .post(apiKey, signupValidator, signup)

router.route('/signin')
  .post(apiKey, tokenOptional, signinValidator, signin)

router.route('/signout')
  .get(tokenRequired, signout)

router.route('/signout/all')
  .get(tokenRequired, signoutAll)

export default router
