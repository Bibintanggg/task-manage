import { ProjectSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Task from './task.ts'

export default class Project extends ProjectSchema {
  @belongsTo(() => User, {
    foreignKey: "createdBy",
  })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => Task, {
    foreignKey: 'projectId'
  })
  declare tasks: HasMany<typeof Task>
}
