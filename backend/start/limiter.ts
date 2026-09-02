import limiter from '@adonisjs/limiter/services/main'

export const aiThrottle = limiter.define('ai', (ctx) => {
  return limiter
    .allowRequests(5)
    .every('1 minute')
    .usingKey(`ai_user_${ctx.auth.user!.id}`)
    .store('redis')
})
