import vine from '@vinejs/vine'

const createTaskOperation = vine.object({
  action: vine.literal("create_task"),
  data: vine.object({
    projectId: vine.number(),
    title: vine.string().trim(),
    description: vine.string().trim().optional(),
    status: vine.enum(['todo', 'in_progress', 'done']).optional(),
    priority: vine.enum(['low', 'medium', 'high']).optional(),
    assigneeId: vine.number(),
  })
})

const updateTaskOperation = vine.object({
  action: vine.literal('update_task'),
  taskId: vine.number(),
  data: vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    status: vine.enum(['todo', 'in_progress', 'done']).optional(),
    priority: vine.enum(['low', 'medium', 'high']).optional(),
    assigneeId: vine.number().optional(),
  }),
})

const deleteTaskOperation = vine.object({
  action: vine.literal('delete_task'),
  taskId: vine.number(),
})

const operationSchema = vine.union([
  vine.union.if((value) => vine.helpers.isObject(value) && value.action === 'create_task',
    createTaskOperation
  ),

  vine.union.if((value) => vine.helpers.isObject(value) && value.action === 'update_task',
    updateTaskOperation
  ),

  vine.union.if((value) => vine.helpers.isObject(value) && value.action === 'delete_task',
    deleteTaskOperation
  ),
])

const rejectedCommand = vine.object({
  decision: vine.literal('reject'),
  reason: vine.string().trim(),

  operations: vine.array(vine.any()).maxLength(0),
})

const executeCommand = vine.object({
  decision: vine.literal('execute'),
  operations: vine.array(operationSchema).minLength(1),
})

export const aiResponseValidator = vine.compile(
  vine.union([
    vine.union.if((value) => vine.helpers.isObject(value) && value.decision === 'execute', executeCommand),
    vine.union.if((value) => vine.helpers.isObject(value) && value.decision === 'reject', rejectedCommand)
  ])
)
