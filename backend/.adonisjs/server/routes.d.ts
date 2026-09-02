import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'projects.get_projects': { paramsTuple?: []; params?: {} }
    'projects.get_projects_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.create_project': { paramsTuple?: []; params?: {} }
    'projects.update_project_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.create_task': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.get_tasks_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.update_task_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.get_tasks_by_project': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ai_commands.command': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'projects.get_projects': { paramsTuple?: []; params?: {} }
    'projects.get_projects_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.get_tasks_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.get_tasks_by_project': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'projects.get_projects': { paramsTuple?: []; params?: {} }
    'projects.get_projects_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.get_tasks_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.get_tasks_by_project': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'projects.create_project': { paramsTuple?: []; params?: {} }
    'tasks.create_task': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ai_commands.command': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'projects.update_project_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.update_task_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}