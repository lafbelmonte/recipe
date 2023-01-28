import '../common'
import supertest from 'supertest'
import { expect } from 'chai'
import UserModel from '../../src/models/user'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '../../src/types'
import bcrypt from 'bcrypt'
import * as jwt from '../../src/libs/jwt'

describe('User', () => {
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

    describe('GIVEN admin adds a basic user', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'basic@gmail.com',
            password: 'password',
            role: UserRole.Basic
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD successfully create a user', function () {
        expect(this.response.status).to.eqls(201)
        expect(this.response.body.message).to.eqls('User successfully created.')
      })
    })

    describe('GIVEN admin adds an admin user', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'admin@gmail.com',
            password: 'password',
            role: UserRole.Admin
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD successfully create a user', function () {
        expect(this.response.status).to.eqls(201)
        expect(this.response.body.message).to.eqls('User successfully created.')
      })
    })

    describe('GIVEN admin adds an invalid role', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'admin@gmail.com',
            password: 'password',
            role: 'invalid'
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls(
          'Roles available are ADMIN or BASIC only.'
        )
      })
    })

    describe('GIVEN admin adds a user without a role', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'admin@gmail.com',
            password: 'password'
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Role is required.')
      })
    })

    describe('GIVEN admin adds a user without an email', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            password: 'password',
            role: UserRole.Basic
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Email is required.')
      })
    })

    describe('GIVEN admin adds a user without a password', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'basic@gmail.com',
            role: UserRole.Basic
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Password is required.')
      })
    })

    describe('GIVEN admin adds a user with invalid email', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'basic',
            password: 'password',
            role: UserRole.Basic
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Email is invalid.')
      })
    })

    describe('GIVEN admin adds a basic user with an existing email', () => {
      beforeEach(async function () {
        await UserModel.create({
          _id: uuidv4(),
          email: 'basic@gmail.com',
          password: await bcrypt.hash('password', 10),
          role: UserRole.Basic
        })

        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'basic@gmail.com',
            password: 'password',
            role: UserRole.Basic
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD successfully create a user', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Account already exists.')
      })
    })

    describe('GIVEN existing user accounts', () => {
      beforeEach(async function () {
        this.basic = uuidv4()
        this.admin = uuidv4()

        await UserModel.create({
          _id: this.basic,
          email: 'basic@gmail.com',
          password: await bcrypt.hash('password', 10),
          role: UserRole.Basic
        })

        await UserModel.create({
          _id: this.admin,
          email: 'admin@gmail.com',
          password: await bcrypt.hash('password', 10),
          role: UserRole.Admin
        })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      describe('GIVEN admin requested to lists the accounts', () => {
        beforeEach(async function () {
          this.response = await this.request
            .get('/users')
            .auth(this.token, { type: 'bearer' })
        })

        it('SHOULD return list of users', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.users).to.have.length(2)
        })
      })

      describe('GIVEN admin updates a user account', () => {
        beforeEach(async function () {
          this.response = await this.request
            .put(`/users/update/${this.basic}`)
            .auth(this.token, { type: 'bearer' })
            .send({
              email: 'admin2@gmail.com',
              password: 'password2',
              role: UserRole.Admin
            })

          this.user = await UserModel.findOne({ _id: this.basic })
        })

        it('SHOULD update successfully', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.message).to.eqls(
            'User successfully updated.'
          )
          expect(this.user.email).to.eqls('admin2@gmail.com')
          expect(this.user.role).to.eqls(UserRole.Admin)
        })
      })

      describe('GIVEN admin updates a user account with existing emails aside from its own', () => {
        beforeEach(async function () {
          this.response = await this.request
            .put(`/users/update/${this.basic}`)
            .auth(this.token, { type: 'bearer' })
            .send({
              email: 'admin@gmail.com'
            })

          this.user = await UserModel.findOne({ _id: this.basic })
        })

        it('SHOULD respond and error', function () {
          expect(this.response.status).to.eqls(400)
          expect(this.response.body.message).to.eqls('Email already exists.')
        })
      })

      describe('GIVEN admin updates a user account with an invalid role', () => {
        beforeEach(async function () {
          this.response = await this.request
            .put(`/users/update/${this.basic}`)
            .auth(this.token, { type: 'bearer' })
            .send({
              role: 'invalid'
            })

          this.user = await UserModel.findOne({ _id: this.basic })
        })

        it('SHOULD respond and error', function () {
          expect(this.response.status).to.eqls(400)
          expect(this.response.body.message).to.eqls(
            'Roles available are ADMIN or BASIC only.'
          )
        })
      })

      describe('GIVEN admin deletes a user account', () => {
        beforeEach(async function () {
          this.response = await this.request
            .delete(`/users/delete/${this.basic}`)
            .auth(this.token, { type: 'bearer' })

          this.user = await UserModel.findOne({ _id: this.basic })
        })

        it('SHOULD delete successfully', function () {
          expect(this.response.status).to.eqls(200)
          expect(this.response.body.message).to.eqls(
            'User successfully deleted.'
          )
          expect(this.user).to.be.null
        })
      })
    })
  })

  describe('GIVEN existing basic token', () => {
    beforeEach(async function () {
      this.token = jwt.generateToken({
        id: uuidv4(),
        role: UserRole.Basic
      })
    })

    describe('GIVEN basic adds a user', () => {
      beforeEach(async function () {
        this.response = await this.request
          .post('/users/add')
          .auth(this.token, { type: 'bearer' })
          .send({
            email: 'admin@gmail.com',
            password: 'password',
            role: UserRole.Admin
          })
      })

      afterEach(async function () {
        await UserModel.deleteMany({})
      })

      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(403)
      })
    })
  })
})
