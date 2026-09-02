import Project from "#models/project";
import Task from "#models/task";
import User from "#models/user";
import { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { AiOperation } from "../types/ai_command.ts";

export class AiCommandExecutorService {
  async execute(operation: AiOperation, trx: TransactionClientContract) {
    switch (operation.action) {
      case 'create_task': {
        const data = operation.data
        const project = await Project.findOrFail(data.projectId, {
          client: trx
        })
        const assignee = await User.findOrFail(data.assigneeId, {
          client: trx
        })
        const task = new Task()
        task.merge({
          projectId: project.id,
          assigneeId: assignee.id,
          title: data.title,
          description: data.description,
          status: data.status ?? 'todo',
          priority: data.priority ?? 'medium',
        })
        task.useTransaction(trx)
        await task.save()
        return task
      }
      case "update_task": {
        const task = await Task.findOrFail(operation.taskId, {
          client: trx
        })
        const data = operation.data
        if (data.assigneeId) {
          await User.findOrFail(data.assigneeId, {
            client: trx
          })
        }
        await task.merge(data).save()
        return task
      }

      case "delete_task": {
        const task = await Task.findOrFail(operation.taskId, {
          client: trx
        })
        await task.delete()
        return task
      }
    }
  }
}
