import express from 'express'
import mongoose from './libs/mongoose'
import registrationRouter from './routes/registration'

export default {
  async start(this: any) {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/register', registrationRouter)

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
