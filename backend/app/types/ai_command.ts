export type CreateTaskOperation = {
  action: "create_task"
  data: {
    projectId: number
    title: string
    description?: string
    status?: 'todo' | 'in_progress' | 'done'
    priority?: 'low' | 'medium' | 'high'
    assigneeId: number
  }
}

export type UpdateTaskOperation = {
  action: "update_task"
  taskId: number
  data: {
    title?: string
    description?: string
    status?: 'todo' | 'in_progress' | 'done'
    priority?: 'low' | 'medium' | 'high'
    assigneeId?: number
  }
}

export type DeleteTaskOperation = {
  action: "delete_task"
  taskId: number
}

export type AiOperation =
  | CreateTaskOperation
  | UpdateTaskOperation
  | DeleteTaskOperation

