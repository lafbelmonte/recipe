import '../common'
import supertest from 'supertest'
import { expect } from 'chai'
import UserModel from '../../src/models/user'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '../../src/types'
import bcrypt from 'bcrypt'

describe('Login', () => {
  before(function () {
    this.request = supertest('http://localhost:3000')
  })
  describe('GIVEN existing user', () => {
    beforeEach(async function () {
      this.user = {
        _id: uuidv4(),
        email: 'basic@gmail.com',
        password: 'password',
        role: UserRole.Basic
      }

      await UserModel.create({
        ...this.user,
        password: await bcrypt.hash(this.user.password, 10)
      })
    })

    afterEach(async function () {
      await UserModel.deleteMany({})
    })

    describe('GIVEN existing user login', () => {
      beforeEach(async function () {
        this.response = await this.request.post('/login').send({
          email: this.user.email,
          password: this.user.password
        })
      })
      it('SHOULD respond successfully with a token', function () {
        expect(this.response.status).to.eqls(200)
        expect(this.response.body.message).to.eqls('Login successful.')
        expect(this.response.body.token).to.be.ok
      })
    })

    describe('GIVEN existing user login with incorrect password', () => {
      beforeEach(async function () {
        this.response = await this.request.post('/login').send({
          email: this.user.email,
          password: 'incorrect'
        })
      })
      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Incorrect password.')
      })
    })

    describe('GIVEN existing user login without an email', () => {
      beforeEach(async function () {
        this.response = await this.request.post('/login').send({
          password: this.user.password
        })
      })
      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Email is required.')
      })
    })

    describe('GIVEN existing user login without a password', () => {
      beforeEach(async function () {
        this.response = await this.request.post('/login').send({
          email: this.user.email
        })
      })
      it('SHOULD respond an error', function () {
        expect(this.response.status).to.eqls(400)
        expect(this.response.body.message).to.eqls('Password is required.')
      })
    })
  })

  describe('GIVEN non existing user login', () => {
    beforeEach(async function () {
      this.response = await this.request.post('/login').send({
        email: 'basic@gmail.com',
        password: 'password'
      })
    })
    it('SHOULD respond an error', function () {
      expect(this.response.status).to.eqls(400)
      expect(this.response.body.message).to.eqls('Email not found.')
    })
  })
})
