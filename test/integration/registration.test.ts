import '../common'
import supertest from 'supertest'
import { expect } from 'chai'
import bcrypt from 'bcrypt'
import UserModel from '../../src/models/user'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '../../src/types'

describe('Registration', () => {
  before(function () {
    this.request = supertest('http://localhost:3000')
  })
  describe('GIVEN basic user registers', () => {
    beforeEach(async function () {
      this.response = await this.request.post('/register').send({
        email: 'basic@gmail.com',
        password: 'password'
      })
    })

    afterEach(async function () {
      await UserModel.deleteMany({})
    })

    it('SHOULD successfully create an account', function () {
      expect(this.response.status).to.eqls(201)
      expect(this.response.body.message).to.eqls(
        'Account successfully created.'
      )
    })
  })
  describe('GIVEN basic user registers without an email', () => {
    beforeEach(async function () {
      this.response = await this.request.post('/register').send({
        password: 'password'
      })
    })

    it('SHOULD respond an error', function () {
      expect(this.response.status).to.eqls(400)
      expect(this.response.body.message).to.eqls('Email is required.')
    })
  })
  describe('GIVEN basic user registers without a password', () => {
    beforeEach(async function () {
      this.response = await this.request.post('/register').send({
        email: 'basic@gmail.com'
      })
    })

    it('SHOULD respond an error', function () {
      expect(this.response.status).to.eqls(400)
      expect(this.response.body.message).to.eqls('Password is required.')
    })
  })
  describe('GIVEN basic user registers with an invalid email', () => {
    beforeEach(async function () {
      this.response = await this.request.post('/register').send({
        email: 'luisdev986',
        password: 'password'
      })
    })

    it('SHOULD respond an error', function () {
      expect(this.response.status).to.eqls(400)
      expect(this.response.body.message).to.eqls('Email is invalid.')
    })
  })
  describe('GIVEN basic user registers with an existing email', () => {
    beforeEach(async function () {
      await UserModel.create({
        _id: uuidv4(),
        email: 'basic@gmail.com',
        password: await bcrypt.hash('password', 10),
        role: UserRole.Basic
      })

      this.response = await this.request.post('/register').send({
        email: 'basic@gmail.com',
        password: 'password'
      })
    })

    afterEach(async function () {
      await UserModel.deleteMany({})
    })

    it('SHOULD respond an error', function () {
      expect(this.response.status).to.eqls(400)
      expect(this.response.body.message).to.eqls('Account already exists.')
    })
  })
})
