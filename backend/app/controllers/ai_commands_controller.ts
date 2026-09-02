import { AiCommandExecutorService } from '#services/ai_command_executor_service'
import { AiService } from '#services/ai_service'
import { AuditLogService } from '#services/audit_log_service'
import { aiPromptValidator } from '#validators/ai_command'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@foadonis/openapi/decorators'

@ApiBearerAuth()
export default class AiCommandsController {
  @ApiOperation({
    summary: 'Execute AI task command',
    description:
      'Convert a natural language prompt into structured task operations. ' +
      'Only create, update, and delete task operations are allowed.',
  })

  @ApiBody({
    type: () => aiPromptValidator,
    description: 'Natural language task command',
  })

  @ApiResponse({
    status: 200,
    description: 'AI command executed successfully',
  })

  @ApiResponse({
    status: 400,
    description:
      'Invalid AI command, prohibited operation, validation error, or transaction failure',
  })

  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })

  @ApiResponse({
    status: 429,
    description:
      'Too many AI requests. Rate limit handled using Redis',
  })
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
