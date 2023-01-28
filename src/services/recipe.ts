import RecipeModel from '../models/recipe'
import { Recipe } from '../types'

const createRecipe = async (params: Recipe) => {
  await RecipeModel.create({ _id: params.id, ...params })
}

const findAllRecipes = async () => {
  const recipes = await RecipeModel.find({})

  return recipes
}

const updateRecipeById = async (id: string, body: Record<string, any>) => {
  await RecipeModel.updateOne({ _id: id }, body)
}

const findRecipeById = async (id: string) => {
  const recipe = await RecipeModel.findOne({ _id: id })

  return recipe
}

const deleteRecipeById = async (id: string) => {
  await RecipeModel.deleteOne({ _id: id })
}

export {
  createRecipe,
  findAllRecipes,
  updateRecipeById,
  findRecipeById,
  deleteRecipeById
}
