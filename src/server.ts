import express from 'express'
import mongoose from './libs/mongoose'
import registrationRouter from './routes/registration'
import loginRouter from './routes/login'
import UserRouter from './routes/user'
import RecipeRouter from './routes/recipe'
import * as jwt from './libs/jwt'
import verifyAdmin from './libs/verify-admin'

export default {
  async start(this: any) {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/register', registrationRouter)
    app.use('/login', loginRouter)
    app.use('/users', jwt.verifyToken, verifyAdmin, UserRouter)
    app.use('/recipes', jwt.verifyToken, RecipeRouter)

    await mongoose.start()

    this.server = app.listen(3000, () => console.log('Server started.'))
  },
  async stop(this: any) {
    await mongoose.stop()
    this.server.close(() => {
      console.log('Server closed.')
    })
  }
}
