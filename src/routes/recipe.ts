import express from 'express'
import * as RecipeController from '../controllers/recipe'
const router = express.Router()

router.post('/add', RecipeController.add)

router.get('/', RecipeController.list)

router.put('/update/:id', RecipeController.update)

router.delete('/delete/:id', RecipeController.remove)

export default router
