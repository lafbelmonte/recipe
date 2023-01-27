import express from 'express'
import * as RegistrationController from '../controllers/registration'
const router = express.Router()

router.post('/', RegistrationController.register)

export default router
