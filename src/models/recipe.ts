import { Document, Schema, model } from 'mongoose'
import { Recipe } from '../types'

export type RecipeDocument = Omit<Recipe, 'id'> & Document

const schema = new Schema<RecipeDocument>(
  {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    ingredients: {
      type: String,
      required: true
    },
    instructions: {
      type: String,
      required: true
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  { _id: false }
)

export default model<RecipeDocument>('Recipe', schema)
