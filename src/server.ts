import express from 'express'
import mongoose from './libs/mongoose'
import registrationRouter from './routes/registration'
import loginRouter from './routes/login'
import UserRouter from './routes/user'
import RecipeRouter from './routes/recipe'
import * as jwt from './libs/jwt'
import verifyAdmin from './libs/verify-admin'

export default {
  // starting express server and mongoose
  async start(this: any) {
    const app = express()

    // middlewares for parsing data
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // endpoints
    app.use('/register', registrationRouter)
    app.use('/login', loginRouter)
    app.use('/users', jwt.verifyToken, verifyAdmin, UserRouter)
    app.use('/recipes', jwt.verifyToken, RecipeRouter)

    // start mongoose
    await mongoose.start()

    // start server
    this.server = app.listen(3000, () => console.log('Server started.'))
  },
  // stopping express server and mongoose
  async stop(this: any) {
    // stop mongoose
    await mongoose.stop()
    // stop server
    this.server.close(() => {
      console.log('Server closed.')
    })
  }
}
