import { Request, Response } from 'express'
import * as RecipeService from '../services/recipe'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '../types'

export const add = async (req: Request, res: Response) => {
  try {
    const { name, instructions, ingredients } = req.body

    if (!name) {
      throw new Error('Name is required.')
    }

    if (!instructions) {
      throw new Error('Instructions is required.')
    }

    if (!ingredients) {
      throw new Error('Ingredients is required.')
    }

    await RecipeService.createRecipe({
      id: uuidv4(),
      name,
      instructions,
      ingredients,
      createdBy: req.user?.id as any
    })

    res.status(201).json({ message: 'Recipe successfully created.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const list = async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeService.findAllRecipes()

    res.status(200).json({ recipes })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { body } = req

    const recipe = await RecipeService.findRecipeById(id)

    if (!recipe) {
      throw new Error('Recipe not found.')
    }

    if (req.user?.role === UserRole.Basic && req.user.id !== recipe.createdBy) {
      throw new Error(`Can't update recipe.`)
    }

    await RecipeService.updateRecipeById(id, body)

    res.status(200).json({ message: 'Recipe successfully updated.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const recipe = await RecipeService.findRecipeById(id)

    if (!recipe) {
      throw new Error('Recipe not found.')
    }

    if (req.user?.role === UserRole.Basic && req.user.id !== recipe.createdBy) {
      throw new Error(`Can't delete recipe.`)
    }

    await RecipeService.deleteRecipeById(id)

    res.status(200).json({ message: 'Recipe successfully deleted.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
