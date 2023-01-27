import express from 'express'
import { Server } from 'http'
import mongoose from './libs/mongoose'

type Context = {
  server: Server
}

export default {
  async start(this: Context) {
    const app = express()

    app.get('/', function (req, res) {
      res.send('Hello World')
    })

    await mongoose.start()

    this.server = app.listen(3000, () => console.log('Server started.'))
  },
  async stop(this: Context) {
    await mongoose.stop()
    this.server.close(() => {
      console.log('Server closed.')
    })
  }
}
