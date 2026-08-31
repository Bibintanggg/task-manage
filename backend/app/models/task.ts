import { TaskSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Project from './project.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.ts'

export default class Task extends TaskSchema {
  @belongsTo(() => Project, {
    foreignKey: "projectId"
  })
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, {
    foreignKey: "assignedId"
  })
  declare assignee: BelongsTo<typeof User>
}
