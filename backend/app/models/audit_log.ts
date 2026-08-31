import { AuditLogSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class AuditLog extends AuditLogSchema {
  @belongsTo(() => User, {
    foreignKey: "userId"
  })
  declare user: BelongsTo<typeof User>
}
