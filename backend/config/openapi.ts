import { defineConfig } from '@foadonis/openapi'

export default defineConfig({
  ui: 'swagger',
  document: {
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'REST API Task Management menggunakan AdonisJS, MySQL, Gemini AI, JWT, dan Redis',
    },

    components: {
      securitySchemes: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
})
