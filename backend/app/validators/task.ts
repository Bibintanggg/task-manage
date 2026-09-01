import vine from '@vinejs/vine'

export const createTaskValidator = vine.create({
  title: vine.string().trim().minLength(3),
  description: vine.string().trim().optional(),
  status: vine.enum(['todo', 'in_progress', 'done']),
  priority: vine.enum(['low', 'medium', 'high']),
  assigneeId: vine.number()
})

export const updateTaskValidator = vine.create({
  title: vine.string().trim().minLength(3).optional(),
  description: vine.string().trim().optional(),
  status: vine.enum(['todo', 'in_progress', 'done']).optional(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  assigneeId: vine.number().optional()
})
