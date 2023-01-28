import express from 'express'
import * as LoginController from '../controllers/login'
const router = express.Router()

router.post('/', LoginController.login)

export default router
