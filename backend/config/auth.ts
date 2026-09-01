import { defineConfig } from '@adonisjs/auth'
import { sessionUserProvider } from '@adonisjs/auth/session'
import env from '#start/env'
import { JwtGuard } from '../app/auth/guards/jwt.ts'
import { Secret } from '@adonisjs/core/helpers'
import { Authenticators, InferAuthEvents } from '@adonisjs/auth/types'

const jwtConfig = {
  secret: new Secret(env.get('JWT_SECRET')),
}

const userProvider = sessionUserProvider({
  model: () => import('#models/user'),
})

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    jwt: (ctx) => {
      return new JwtGuard(ctx, userProvider, jwtConfig)
    },
  },
})

export default authConfig

declare module '@adonisjs/auth/types' {
  export interface Authenticators
    extends InferAuthenticators<typeof authConfig> { }
}

declare module '@adonisjs/core/types' {
  interface EventsList
    extends InferAuthEvents<Authenticators> { }
}
