import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hasMany } from '@adonisjs/lucid/orm'
import Project from './project.ts'
import Task from './task.ts'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AuditLog from './audit_log.ts'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @hasMany(() => Project, {
    foreignKey: 'createdBy',
  })
  declare projects: HasMany<typeof Project>

  @hasMany(() => Task, {
    foreignKey: "assigneeId",
  })
  declare assignedTasks: HasMany<typeof Task>

  @hasMany(() => AuditLog, {
    foreignKey: 'userId',
  })
  declare auditLogs: HasMany<typeof AuditLog>

  get initials() {
    const [first, last] = this.name ? this.name.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
