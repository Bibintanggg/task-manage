import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('project_id').unsigned().notNullable().references('projects.id').onDelete('CASCADE')
      table.integer('assignee_id').unsigned().nullable().references('users.id').onDelete('SET NULL')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.enum('status', ['todo', 'in_progress', 'done']).defaultTo('todo').notNullable()
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
