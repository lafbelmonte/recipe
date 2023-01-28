import '../common'
import supertest from 'supertest'
import { expect } from 'chai'
import RecipeModel from '../../src/models/recipe'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '../../src/types'
import * as jwt from '../../src/libs/jwt'

describe('Recipe', () => {
  before(function () {
    this.request = supertest('http://localhost:3000')
  })
  describe('GIVEN existing admin token', () => {
    beforeEach(async function () {
      this.token = jwt.generateToken({
        id: uuidv4(),
        role: UserRole.Admin
      })
    })

    describe('GIVEN admin adds a recipe', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/recipes/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            name: 'name1',
            ingredients: 'ingredients1',
            instructions: 'instructions1'
          })
      })

      afterEach(async function () {
        await RecipeModel.deleteMany({})
      })

      it('SHOULD successfully create a recipe', function () {
        expect(this.response.status).to.eqls(201)
        expect(this.response.body.message).to.eqls(
          'Recipe successfully created.'
        )
      })
    })

    describe('GIVEN existing recipes', () => {
      beforeEach(async function () {
        this.admin = uuidv4()

        this.recipe1 = uuidv4()
        this.recipe2 = uuidv4()

        await RecipeModel.create({
          _id: this.recipe1,
          name: 'name1',
          ingredients: 'ingredients1',
          instructions: 'instructions1',
          createdBy: this.admin
        })

        await RecipeModel.create({
          _id: this.recipe2,
          name: 'name2',
          ingredients: 'ingredients2',
          instructions: 'instructions2',
          createdBy: this.admin
        })
      })

      afterEach(async function () {
        await RecipeModel.deleteMany({})
      })

      describe('GIVEN admin requested to lists the recipes', () => {
        beforeEach(async function () {
          this.response = await this.request
            .get('/recipes')
            .auth(this.token, { type: 'bearer' })
        })

        it('SHOULD return list of recipes', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.recipes).to.have.length(2)
        })
      })

      describe('GIVEN admin updates a recipe', () => {
        beforeEach(async function () {
          this.response = await this.request
            .put(`/recipes/update/${this.recipe1}`)
            .auth(this.token, { type: 'bearer' })
            .send({
              name: 'name3',
              ingredients: 'ingredients3',
              instructions: 'instructions3'
            })

          this.recipe = await RecipeModel.findOne({ _id: this.recipe1 })
        })

        it('SHOULD update successfully', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.message).to.eqls(
            'Recipe successfully updated.'
          )
          expect(this.recipe.name).to.eqls('name3')
          expect(this.recipe.ingredients).to.eqls('ingredients3')
          expect(this.recipe.instructions).to.eqls('instructions3')
        })
      })

      describe('GIVEN admin deletes a recipe', () => {
        beforeEach(async function () {
          this.response = await this.request
            .delete(`/recipes/delete/${this.recipe1}`)
            .auth(this.token, { type: 'bearer' })

          this.recipe = await RecipeModel.findOne({ _id: this.recipe1 })
        })

        it('SHOULD delete successfully', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.message).to.eqls(
            'Recipe successfully deleted.'
          )
          expect(this.recipe).to.be.null
        })
      })
    })
  })

  describe('GIVEN existing basic token', () => {
    beforeEach(async function () {
      this.basic = uuidv4()
      this.token = jwt.generateToken({
        id: this.basic,
        role: UserRole.Basic
      })
    })

    describe('GIVEN basic adds a recipe', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/recipes/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            name: 'name1',
            ingredients: 'ingredients1',
            instructions: 'instructions1'
          })
      })

      afterEach(async function () {
        await RecipeModel.deleteMany({})
      })

      it('SHOULD successfully create a recipe', function () {
        expect(this.response.status).to.eqls(201)
        expect(this.response.body.message).to.eqls(
          'Recipe successfully created.'
        )
      })
    })

    describe('GIVEN existing recipes', () => {
      beforeEach(async function () {
        this.admin = uuidv4()

        this.recipe1 = uuidv4()
        this.recipe2 = uuidv4()

        await RecipeModel.create({
          _id: this.recipe1,
          name: 'name1',
          ingredients: 'ingredients1',
          instructions: 'instructions1',
          createdBy: this.basic
        })

        await RecipeModel.create({
          _id: this.recipe2,
          name: 'name2',
          ingredients: 'ingredients2',
          instructions: 'instructions2',
          createdBy: this.admin
        })
      })

      afterEach(async function () {
        await RecipeModel.deleteMany({})
      })

      describe('GIVEN basic requested to lists the recipes', () => {
        beforeEach(async function () {
          this.response = await this.request
            .get('/recipes')
            .auth(this.token, { type: 'bearer' })
        })

        it('SHOULD return list of recipes', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.recipes).to.have.length(2)
        })
      })

      describe('GIVEN basic updates its own recipe', () => {
        beforeEach(async function () {
          this.response = await this.request
            .put(`/recipes/update/${this.recipe1}`)
            .auth(this.token, { type: 'bearer' })
            .send({
              name: 'name3',
              ingredients: 'ingredients3',
              instructions: 'instructions3'
            })

          this.recipe = await RecipeModel.findOne({ _id: this.recipe1 })
        })

        it('SHOULD update successfully', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.message).to.eqls(
            'Recipe successfully updated.'
          )
          expect(this.recipe.name).to.eqls('name3')
          expect(this.recipe.ingredients).to.eqls('ingredients3')
          expect(this.recipe.instructions).to.eqls('instructions3')
        })
      })

      describe('GIVEN basic updates other recipe', () => {
        beforeEach(async function () {
          this.response = await this.request
            .put(`/recipes/update/${this.recipe2}`)
            .auth(this.token, { type: 'bearer' })
            .send({
              name: 'name3',
              ingredients: 'ingredients3',
              instructions: 'instructions3'
            })

          this.recipe = await RecipeModel.findOne({ _id: this.recipe1 })
        })

        it('SHOULD update successfully', function () {
          expect(this.response.status).to.eqls(400)
          expect(this.response.body.message).to.eqls(`Can't update recipe.`)
        })
      })

      describe('GIVEN basic deletes its own recipe recipe', () => {
        beforeEach(async function () {
          this.response = await this.request
            .delete(`/recipes/delete/${this.recipe1}`)
            .auth(this.token, { type: 'bearer' })

          this.recipe = await RecipeModel.findOne({ _id: this.recipe1 })
        })

        it('SHOULD delete successfully', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.message).to.eqls(
            'Recipe successfully deleted.'
          )
          expect(this.recipe).to.be.null
        })
      })

      describe('GIVEN basic deletes other recipe', () => {
        beforeEach(async function () {
          this.response = await this.request
            .delete(`/recipes/delete/${this.recipe2}`)
            .auth(this.token, { type: 'bearer' })

          this.recipe = await RecipeModel.findOne({ _id: this.recipe1 })
        })

        it('SHOULD delete successfully', function () {
          expect(this.response.status).to.eqls(400)
          expect(this.response.body.message).to.eqls(`Can't delete recipe.`)
        })
      })
    })
  })
})
