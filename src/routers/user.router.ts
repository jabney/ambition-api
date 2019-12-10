import { Router } from 'express'
import { fetch, remove, update } from '../controllers/user.controller'
import { deserializeUser } from '../middleware/authorize'
import { updateValidator } from '../validators/user.validator'

const router = Router()

const deserializeProfile = deserializeUser('email first last grants roles')
const deserializeMin = deserializeUser('_id')

router.route('/')
  .get(deserializeProfile, fetch)
  .patch(deserializeMin, updateValidator, update)
  .delete(deserializeMin, remove)

export default router
