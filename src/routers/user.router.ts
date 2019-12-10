import { Router } from 'express'
import { fetchUser, deleteUser, updateUser, fetchGrants } from '../controllers/user.controller'
import { deserializeUser, tokenRequired } from '../middleware/authorize'
import { updateValidator } from '../validators/user.validator'

const router = Router()

const deserializeProfile = deserializeUser('email first last grants roles')
const deserializeMin = deserializeUser('_id')

router.route('/')
  .get(deserializeProfile, fetchUser)
  .patch(deserializeMin, updateValidator, updateUser)
  .delete(deserializeMin, deleteUser)

router.route('/grants')
  .get(tokenRequired, fetchGrants)

export default router
