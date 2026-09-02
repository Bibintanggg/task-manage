import AuditLog from "#models/audit_log";

export class AuditLogService {
  async logSuccess(userId: number, requestPayload: unknown, responsePayload: unknown) {
    return await AuditLog.create({
      userId,
      action: "AI_COMMAND",
      requestPayload,
      responsePayload,
      status: 'success',
      failedReason: null
    })
  }

  async logFailed(userId: number, requestPayload: unknown, responsePayload: unknown, failedReason: string) {
    return await AuditLog.create({
      userId,
      requestPayload,
      responsePayload,
      failedReason,
      status: "failed",
      action: 'AI_COMMAND'
    }
    )
  }
}
