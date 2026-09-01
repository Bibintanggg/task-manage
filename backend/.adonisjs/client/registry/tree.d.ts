/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  projects: {
    getProjects: typeof routes['projects.get_projects']
    getProjectsById: typeof routes['projects.get_projects_by_id']
    createProject: typeof routes['projects.create_project']
    updateProjectById: typeof routes['projects.update_project_by_id']
    destroy: typeof routes['projects.destroy']
  }
  tasks: {
    getTasks: typeof routes['tasks.get_tasks']
    createTask: typeof routes['tasks.create_task']
    getTasksById: typeof routes['tasks.get_tasks_by_id']
    updateTaskById: typeof routes['tasks.update_task_by_id']
    destroy: typeof routes['tasks.destroy']
  }
}
