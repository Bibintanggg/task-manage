import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    return response.created({
      message: "Register successfulled",
      data: user
    })
  }

  async login({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(
      payload.email,
      payload.password,
    )
    const token = await auth.use("jwt").generate(user)
    return response.ok({
      message: "Login successfull",
      data: {
        user, token
      }
    })

  }
}
