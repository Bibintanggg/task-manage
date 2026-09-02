import Project from '#models/project'
import Task from '#models/task'
import User from '#models/user'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
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

  async getTasks({ response }: HttpContext) {
    const tasks = await Task.all()
    return response.ok({
      data: tasks
    })
  }

  async getTasksById({ params, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    return response.ok({
      data: task
    })
  }

  async updateTaskById({ request, response, params }: HttpContext) {
    const payload = await request.validateUsing(updateTaskValidator)
    const task = await Task.findOrFail(params.id)
    await task.merge(payload).save()
    response.ok({
      message: "Task updated successfully",
      data: task
    })
  }

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
