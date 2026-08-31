import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')
      table.string('action').notNullable()
      table.json('request_payload').nullable()
      table.json('response_payload').nullable()
      table.enum('status', ['success', 'failed']).notNullable()
      table.text('failed_reason').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
