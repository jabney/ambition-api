import { Router } from 'express'
import { addToWhtelist, fetchWhitelist, removeFromWhitelist } from '../controllers/admin.controller'
import { deserializeUser } from '../middleware/authorize'
import hasRole from '../middleware/has-role'
import { addValidator, removeValidator } from '../validators/admin.validator'

const router = Router()

router.use(deserializeUser('roles'), hasRole('admin'))

router.route('/whitelist')
  .get(fetchWhitelist)
  .post(addValidator, addToWhtelist)
  .delete(removeValidator, removeFromWhitelist)

export default router
