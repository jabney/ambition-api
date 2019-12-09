import { Router } from 'express'
import { addToWhtelist, removeFromWhitelist, fetchWhitelist } from '../controllers/admin.controller'
import { deserializeUser } from '../middleware/authorize'
import { addValidator, removeValidator } from '../validators/admin.validator'
import hasRole from '../middleware/has-role'

const router = Router()

router.use(deserializeUser('roles'), hasRole('admin'))

router.route('/whitelist')
  .get(fetchWhitelist)
  .post(addValidator, addToWhtelist)
  .delete(removeValidator, removeFromWhitelist)

export default router
