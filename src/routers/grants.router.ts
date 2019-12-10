import { Router } from 'express'
import { tokenRequired } from '../middleware/authorize'
import { fetchGrants } from '../controllers/grants.controller'

const router = Router()

router.route('/')
  .get(tokenRequired, fetchGrants)

export default router
