/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import ProjectsController from '#controllers/projects_controller'
import TasksController from '#controllers/tasks_controller'
import AiCommandsController from '#controllers/ai_commands_controller'
import { aiThrottle } from './limiter.ts'
import openapi from '@foadonis/openapi/services/main'
const AuthController = () => import("#controllers/auth_controller")

router.get('/', () => {
  return { hello: 'world' }
})


router.get('/me', async ({ auth }) => {
  const user = auth.getUserOrFail()
  return {
    data: user,
  }
}).use(middleware.auth({ guards: ['jwt'] }))

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

router.get('/projects', [ProjectsController, 'getProjects']).use(middleware.auth())
router.get('/projects/:id', [ProjectsController, 'getProjectsById']).use(middleware.auth())
router.post('/projects', [ProjectsController, 'createProject']).use(middleware.auth()).use(middleware.role({
  roles: ['admin']
}))
router.put('/projects/:id', [ProjectsController, 'updateProjectById']).use(middleware.auth()).use(middleware.role({
  roles: ['admin']
}))
router.delete('/projects/:id', [ProjectsController, 'destroy']).use(middleware.auth()).use(middleware.role({
  roles: ['admin']
}))

router.post('/projects/:id/tasks', [TasksController, 'createTask']).use(middleware.auth())
router.get('/tasks/:id', [TasksController, 'getTasksById']).use(middleware.auth())
router.put('/tasks/:id', [TasksController, 'updateTaskById']).use(middleware.auth())
router.delete('/tasks/:id', [TasksController, 'destroy']).use(middleware.auth())
router.get('/projects/:id/tasks', [TasksController, 'getTasksByProject']).use(middleware.auth())

router.post('/ai/command', [AiCommandsController, 'command']).use(middleware.auth()).use(aiThrottle)

openapi.registerRoutes()
