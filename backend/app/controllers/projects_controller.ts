import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  async createProject({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createProjectValidator)
    const user = auth.getUserOrFail()
    const project = await Project.create({
      name: payload.name,
      description: payload.description,
      createdBy: user.id
    })

    return response.created({
      message: "Succes create project!",
      data: project
    })
  }

  async getProjects({ response }: HttpContext) {
    const projects = await Project.all()
    return response.ok({
      data: projects
    })
  }

  async getProjectsById({ response, params }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.notFound({
        error: 'Project nof found'
      })
    }
    return response.ok({
      data: project
    })
  }

  async updateProjectById({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(updateProjectValidator)
    const project = await Project.findOrFail(params.id)
    await project.merge(payload).save()
    response.ok({
      message: "Project updated successfully",
      data: project
    })
  }

  async destroy({ response, params }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return response.ok({
      message: 'Project deleted successfully',
    })
  }
}
