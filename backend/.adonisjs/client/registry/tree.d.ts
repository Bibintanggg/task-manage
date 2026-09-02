/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
  }
  projects: {
    getProjects: typeof routes['projects.get_projects']
    getProjectsById: typeof routes['projects.get_projects_by_id']
    createProject: typeof routes['projects.create_project']
    updateProjectById: typeof routes['projects.update_project_by_id']
    destroy: typeof routes['projects.destroy']
  }
  tasks: {
    createTask: typeof routes['tasks.create_task']
    getTasksById: typeof routes['tasks.get_tasks_by_id']
    updateTaskById: typeof routes['tasks.update_task_by_id']
    destroy: typeof routes['tasks.destroy']
    getTasksByProject: typeof routes['tasks.get_tasks_by_project']
  }
  aiCommands: {
    command: typeof routes['ai_commands.command']
  }
  openapi: {
    html: typeof routes['openapi.html']
    json: typeof routes['openapi.json']
    yaml: typeof routes['openapi.yaml']
  }
}
