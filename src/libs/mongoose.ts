import mongoose from 'mongoose'

export default {
  async start() {
    mongoose.connection.on('connected', () => {
      console.log('Database connected.')
    })

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected.')
    })

    return mongoose.connect('mongodb://127.0.0.1/recipe')
  },
  async stop() {
    return mongoose.disconnect()
  }
}
