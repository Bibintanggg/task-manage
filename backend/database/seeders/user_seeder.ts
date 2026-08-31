import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        name: 'admin bintang',
        email: 'admin@gmail.com',
        password: '123456',
        role: 'admin'
      },
      {
        name: 'bintang user',
        email: 'user@gmail.com',
        password: '123456',
        role: 'user'
      }
    ])
  }
}
