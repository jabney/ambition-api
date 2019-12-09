import { Router } from 'express'
import { apiKey } from '../middleware/api-key'
import { signup, signin, signout, signoutAll } from '../controllers/auth.controller'
import { tokenOptional, tokenRequired } from '../middleware/deserialize-user'
import { signupValidator, signinValidator } from '../validators/auth.validator'

const optionalToken = tokenOptional('_id')
const requiredToken = tokenRequired('_id')

const router = Router()

router.route('/signup')
  .post(apiKey, signupValidator, signup)

router.route('/signin')
  .post(apiKey, optionalToken, signinValidator, signin)

router.route('/signout')
  .get(requiredToken, signout)

router.route('/signout/all')
  .get(requiredToken, signoutAll)

export default router
