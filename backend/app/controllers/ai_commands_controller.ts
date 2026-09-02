import { AiCommandExecutorService } from '#services/ai_command_executor_service'
import { AiService } from '#services/ai_service'
import { AuditLogService } from '#services/audit_log_service'
import { aiPromptValidator } from '#validators/ai_command'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class AiCommandsController {
  async command({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(aiPromptValidator)
    const user = auth.getUserOrFail()
    const aiService = new AiService()
    const executor = new AiCommandExecutorService()
    const auditLogService = new AuditLogService()
    let command: any = null

    try {
      command = await aiService.parseCommand(payload.prompt)

      if (command.decision === 'reject') {
        throw new Error(
          `Command not allowed: ${command.reason}`
        )
      }

      const results = await db.transaction(
        async (trx) => {
          const operationResults = []

          for (const operation of command.operations) {
            const result =
              await executor.execute(
                operation,
                trx
              )

            operationResults.push(result)
          }

          return operationResults
        }
      )

      await auditLogService.logSuccess(
        user.id, {
        prompt: payload.prompt
      },
        command
      )

      return response.ok({
        message: "AI command execute successfully",
        data: results
      })
    } catch (error: any) {
      const failedReason = error instanceof Error ? error.message : "Unknown error"
      await auditLogService.logFailed(
        user.id, {
        prompt: payload.prompt
      },
        command,
        failedReason
      )

      return response.badRequest({
        message: "Failed to execute ai command",
        error: failedReason
      })
    }
  }
}
