import { Router } from 'express'
import { signin, signout, signoutAll, signup } from '../controllers/auth.controller'
import { apiKey } from '../middleware/api-key'
import { tokenOptional, tokenRequired } from '../middleware/authorize'
import { requireWhitelisted } from '../middleware/require-whitelisted'
import { signinValidator, signupValidator } from '../validators/auth.validator'

const router = Router()

router.route('/signup')
  .post(apiKey, requireWhitelisted, signupValidator, signup)

router.route('/signin')
  .post(apiKey, requireWhitelisted, tokenOptional, signinValidator, signin)

router.route('/signout')
  .get(tokenRequired, signout)

router.route('/signout/all')
  .get(tokenRequired, signoutAll)

export default router
