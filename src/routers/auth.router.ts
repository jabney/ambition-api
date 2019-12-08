import { Router } from 'express'
import { apiKey } from '../middleware/api-key'
import { signup, signin, signout, signoutAll } from '../controllers/auth.controller'
import { tokenOptional, tokenRequired } from '../middleware/deserialize-user'

const router = Router()

router.route('/signup')
  .post(apiKey, signup)

router.route('/signin')
  .post(apiKey, tokenOptional('_id'), signin)

router.route('/signout')
  .get(signout, tokenRequired('_id'))

router.route('/signout/all')
  .get(signoutAll, tokenRequired('_id'))

export default router
