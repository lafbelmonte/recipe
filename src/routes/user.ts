import express from 'express'
import * as UserController from '../controllers/user'
const router = express.Router()

router.post('/add', UserController.add)

export default router
