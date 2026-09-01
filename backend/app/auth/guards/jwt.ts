import jwt from 'jsonwebtoken'
import { errors, symbols } from '@adonisjs/auth'

import type {
  AuthClientResponse,
  GuardContract,
} from '@adonisjs/auth/types'

import type { HttpContext } from '@adonisjs/core/http'
import { Secret } from '@adonisjs/core/helpers'

export type JwtGuardUser<RealUser> = {
  getId(): string | number | BigInt
  getOriginal(): RealUser
}

export type JwtGuardOptions = {
  secret: Secret<string>
}

export interface JwtUserProviderContract<RealUser> {
  [symbols.PROVIDER_REAL_USER]: RealUser

  createUserForGuard(
    user: RealUser
  ): Promise<JwtGuardUser<RealUser>>

  findById(
    identifier: string | number | BigInt
  ): Promise<JwtGuardUser<RealUser> | null>
}

export class JwtGuard<
  UserProvider extends JwtUserProviderContract<unknown>,
> implements GuardContract<
  UserProvider[typeof symbols.PROVIDER_REAL_USER]
> {
  declare [symbols.GUARD_KNOWN_EVENTS]: {}

  driverName: 'jwt' = 'jwt'

  authenticationAttempted = false
  isAuthenticated = false

  user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

  #ctx: HttpContext
  #userProvider: UserProvider
  #options: JwtGuardOptions

  constructor(
    ctx: HttpContext,
    userProvider: UserProvider,
    options: JwtGuardOptions
  ) {
    this.#ctx = ctx
    this.#userProvider = userProvider
    this.#options = options
  }

  /**
   * Generate JWT
   */
  async generate(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ) {
    const providerUser =
      await this.#userProvider.createUserForGuard(user)

    const token = jwt.sign(
      {
        userId: providerUser.getId(),
      },
      this.#options.secret.release(),
      {
        expiresIn: '1d',
      }
    )

    return {
      type: 'bearer',
      token,
    }
  }

  async authenticate(): Promise<
    UserProvider[typeof symbols.PROVIDER_REAL_USER]
  > {
    if (this.authenticationAttempted) {
      return this.getUserOrFail()
    }

    this.authenticationAttempted = true

    const authHeader =
      this.#ctx.request.header('authorization')

    if (!authHeader) {
      throw this.unauthorized()
    }

    const [type, token] = authHeader.split(' ')

    if (
      type?.toLowerCase() !== 'bearer' ||
      !token
    ) {
      throw this.unauthorized()
    }

    try {
      const payload = jwt.verify(
        token,
        this.#options.secret.release()
      )

      if (
        typeof payload !== 'object' ||
        !('userId' in payload)
      ) {
        throw this.unauthorized()
      }

      const providerUser =
        await this.#userProvider.findById(
          payload.userId as string | number
        )

      if (!providerUser) {
        throw this.unauthorized()
      }

      this.user = providerUser.getOriginal()
      this.isAuthenticated = true

      return this.user
    } catch {
      throw this.unauthorized()
    }
  }

  async check(): Promise<boolean> {
    try {
      await this.authenticate()
      return true
    } catch {
      return false
    }
  }

  getUserOrFail():
    UserProvider[typeof symbols.PROVIDER_REAL_USER] {
    if (!this.user) {
      throw this.unauthorized()
    }

    return this.user
  }

  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
    const token = await this.generate(user)

    return {
      headers: {
        authorization: `Bearer ${token.token}`,
      },
    }
  }

  private unauthorized() {
    return new errors.E_UNAUTHORIZED_ACCESS(
      'Unauthorized access',
      {
        guardDriverName: this.driverName,
      }
    )
  }
}
