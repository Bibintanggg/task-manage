import Project from '#models/project'
import Task from '#models/task'
import User from '#models/user'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@foadonis/openapi/decorators'

@ApiTags("Tasks")
@ApiBearerAuth()
export default class TasksController {
  @ApiOperation({
    summary: 'Create task',
    description: 'Create a new task inside a project',
  })
  @ApiBody({
    type: () => createTaskValidator,
    description: 'Task creation payload',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Project or assignee not found',
  })
  async createTask({ request, response, params }: HttpContext) {
    const payload = await request.validateUsing(createTaskValidator)
    const project = await Project.findOrFail(params.id)
    const assignee = await User.findOrFail(payload.assigneeId)
    const task = await Task.create({
      projectId: project.id,
      title: payload.title,
      description: payload.description,
      status: payload.status ?? "todo",
      priority: payload.priority ?? "medium",
      assigneeId: assignee.id,
    })
    return response.created({
      message: "Success created task!",
      data: task
    })
  }

  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieve all tasks',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: [Task],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getTasks({ response }: HttpContext) {
    const tasks = await Task.all()
    return response.ok({
      data: tasks
    })
  }

  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieve a task using its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: Task,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async getTasksById({ params, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    return response.ok({
      data: task
    })
  }

  @ApiOperation({
    summary: 'Update task',
    description: 'Update task data using its ID',
  })
  @ApiBody({
    type: () => updateTaskValidator,
    description: 'Task update payload',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async updateTaskById({ request, response, params }: HttpContext) {
    const payload = await request.validateUsing(updateTaskValidator)
    const task = await Task.findOrFail(params.id)
    await task.merge(payload).save()
    response.ok({
      message: "Task updated successfully",
      data: task
    })
  }

  @ApiOperation({
    summary: 'Delete task',
    description: 'Delete a task using its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async destroy({ response, params }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await task.delete()
    return response.ok({
      message: 'Task deleted successfully'
    })
  }

  async getTasksByProject({ response, params }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    const tasks = await Task.query().where('projectId', project.id)
    return response.ok({
      data: tasks
    })
  }
}
