import UserModel from './models/user'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import mongoose from './libs/mongoose'
import { UserRole } from './types'

// seeder to create an initial admin (will only create once)
export default {
  async start() {
    await mongoose.start()

    const admin = await UserModel.findOne({
      email: 'test@gmail.com'
    })

    if (!admin) {
      const password = await bcrypt.hash('password', 10)

      await UserModel.create({
        _id: uuidv4(),
        email: 'test@gmail.com',
        password,
        role: UserRole.Admin
      })

      console.log('Admin seeded successfully.')
    } else {
      console.log(`Admin already created, ID: ${admin.id}`)
    }
  },
  async stop() {
    await mongoose.stop()
  }
}
