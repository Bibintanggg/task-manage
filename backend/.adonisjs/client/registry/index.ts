/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/register',
    tokens: [{"old":"/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'projects.get_projects': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.get_projects']['types'],
  },
  'projects.get_projects_by_id': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.get_projects_by_id']['types'],
  },
  'projects.create_project': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.create_project']['types'],
  },
  'projects.update_project_by_id': {
    methods: ["PUT"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update_project_by_id']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'tasks.create_task': {
    methods: ["POST"],
    pattern: '/projects/:id/tasks',
    tokens: [{"old":"/projects/:id/tasks","type":0,"val":"projects","end":""},{"old":"/projects/:id/tasks","type":1,"val":"id","end":""},{"old":"/projects/:id/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.create_task']['types'],
  },
  'tasks.get_tasks_by_id': {
    methods: ["GET","HEAD"],
    pattern: '/tasks/:id',
    tokens: [{"old":"/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.get_tasks_by_id']['types'],
  },
  'tasks.update_task_by_id': {
    methods: ["PUT"],
    pattern: '/tasks/:id',
    tokens: [{"old":"/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.update_task_by_id']['types'],
  },
  'tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/tasks/:id',
    tokens: [{"old":"/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.destroy']['types'],
  },
  'tasks.get_tasks_by_project': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/tasks',
    tokens: [{"old":"/projects/:id/tasks","type":0,"val":"projects","end":""},{"old":"/projects/:id/tasks","type":1,"val":"id","end":""},{"old":"/projects/:id/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.get_tasks_by_project']['types'],
  },
  'ai_commands.command': {
    methods: ["POST"],
    pattern: '/ai/command',
    tokens: [{"old":"/ai/command","type":0,"val":"ai","end":""},{"old":"/ai/command","type":0,"val":"command","end":""}],
    types: placeholder as Registry['ai_commands.command']['types'],
  },
  'openapi.html': {
    methods: ["GET","HEAD"],
    pattern: '/api',
    tokens: [{"old":"/api","type":0,"val":"api","end":""}],
    types: placeholder as Registry['openapi.html']['types'],
  },
  'openapi.json': {
    methods: ["GET","HEAD"],
    pattern: '/api.json',
    tokens: [{"old":"/api.json","type":0,"val":"api.json","end":""}],
    types: placeholder as Registry['openapi.json']['types'],
  },
  'openapi.yaml': {
    methods: ["GET","HEAD"],
    pattern: '/api.yaml',
    tokens: [{"old":"/api.yaml","type":0,"val":"api.yaml","end":""}],
    types: placeholder as Registry['openapi.yaml']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
