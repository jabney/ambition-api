import { Router } from 'express'
import { apiKey } from '../middleware/api-key'
import { signup, signin, signout, signoutAll } from '../controllers/auth.controller'

const router = Router()

router.route('/signup')
  .post(apiKey, signup)

router.route('/signin')
  .post(apiKey, signin)

router.route('/signout')
  .get(signout)

router.route('/signout/all')
  .get(signoutAll)

export default router
