import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@foadonis/openapi/decorators'

@ApiTags('Projects')
@ApiBearerAuth()

export default class ProjectsController {
  @ApiOperation({
    summary: 'Create project',
    description: 'Admin only'
  })
  @ApiBody({
    type: () => createProjectValidator
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: Project,
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required',
  })
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

  @ApiOperation({
    summary: 'Get all projects'
  })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
    type: [Project]
  })
  async getProjects({ response }: HttpContext) {
    const projects = await Project.all()
    return response.ok({
      data: projects
    })
  }

  @ApiOperation({
    summary: 'Get project by ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
    type: Project,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
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

  @ApiOperation({
    summary: 'Update project',
    description: 'Admin only',
  })
  @ApiBody({
    type: () => updateProjectValidator,
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: Project,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required',
  })
  async updateProjectById({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(updateProjectValidator)
    const project = await Project.findOrFail(params.id)
    await project.merge(payload).save()
    response.ok({
      message: "Project updated successfully",
      data: project
    })
  }

  @ApiOperation({
    summary: 'Delete project',
    description: 'Admin only',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required',
  })
  async destroy({ response, params }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return response.ok({
      message: 'Project deleted successfully',
    })
  }
}
