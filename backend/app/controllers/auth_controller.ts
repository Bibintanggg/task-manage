import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@foadonis/openapi/decorators'

@ApiTags('Authentication')
export default class AuthController {
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account',
  })
  @ApiBody({
    type: () => registerValidator,
    description: 'User registration payload',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error',
  })
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    return response.created({
      message: "Register successfulled",
      data: user
    })
  }

  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticate user and return a JWT access token',
  })
  @ApiBody({
    type: () => loginValidator,
    description: 'User login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error',
  })
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
