import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, options: {
    roles: ('admin' | 'user')[]
  }) {
    const user = auth.getUserOrFail()
    if (!options.roles.includes(user.role as 'admin' | 'user')) {
      return response.forbidden({
        message: 'You are not authorized to access this resource',
      })
    }

    const output = await next()
    return output
  }
}
