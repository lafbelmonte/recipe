import express from 'express'
import * as UserController from '../controllers/user'
const router = express.Router()

router.post('/add', UserController.add)

router.get('/', UserController.list)

router.put('/update/:id', UserController.update)

router.delete('/delete/:id', UserController.remove)

export default router
