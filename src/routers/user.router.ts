import { Router } from 'express'
import { fetchUser, deleteUser, updateUser, fetchGrants } from '../controllers/user.controller'
import { deserializeUser } from '../middleware/authorize'
import { updateValidator } from '../validators/user.validator'

const router = Router()

const deserializeProfile = deserializeUser('email first last grants roles')
const deserializeMin = deserializeUser('_id')
const deserializeStd = deserializeUser('grants')

router.route('/')
  .get(deserializeProfile, fetchUser)
  .patch(deserializeMin, updateValidator, updateUser)
  .delete(deserializeMin, deleteUser)

router.route('/grants')
  .get(deserializeStd, fetchGrants)
  // .post(deserializeStd, addGrant)
  // .post(deserializeStd, removegrant)

export default router
