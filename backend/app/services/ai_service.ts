import env from "#start/env"
import { aiResponseValidator } from "#validators/ai_response"
import { GoogleGenAI } from "@google/genai"


const ai = new GoogleGenAI({
  apiKey: env.get("GEMINI_API_KEY"),
})

export class AiService {
  async parseCommand(prompt: string) {
    const SYSTEM_PROMPT = `
You are a command parser for a Task Management API.

Convert the user's natural language instruction into structured task operations.

Allowed actions:
- create_task
- update_task
- delete_task

You may ONLY modify Task entities.

If the user requests an operation outside Task,
including modifying User or Project,
you MUST reject the command.

When the command is allowed:
- decision must be "execute"
- return the task operations

When the command is not allowed:
- decision must be "reject"
- operations must be empty
- provide a short reason

You must NEVER reinterpret a forbidden operation
as a task operation.

For example:
"delete user id 2"
MUST NOT become "delete_task taskId 2".

Valid task statuses:
- todo
- in_progress
- done

Valid priorities:
- low
- medium
- high
`

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          anyOf: [
            {
              type: 'object',

              properties: {
                decision: {
                  type: 'string',
                  enum: ['execute'],
                },

                operations: {
                  type: 'array',
                  minItems: 1,

                  items: {
                    anyOf: [
                      {
                        type: 'object',

                        properties: {
                          action: {
                            type: 'string',
                            enum: ['create_task'],
                          },

                          data: {
                            type: 'object',

                            properties: {
                              projectId: {
                                type: 'integer',
                              },

                              title: {
                                type: 'string',
                              },

                              description: {
                                type: 'string',
                              },

                              status: {
                                type: 'string',
                                enum: [
                                  'todo',
                                  'in_progress',
                                  'done',
                                ],
                              },

                              priority: {
                                type: 'string',
                                enum: [
                                  'low',
                                  'medium',
                                  'high',
                                ],
                              },

                              assigneeId: {
                                type: 'integer',
                              },
                            },

                            required: [
                              'projectId',
                              'title',
                              'assigneeId',
                            ],

                            additionalProperties: false,
                          },
                        },

                        required: [
                          'action',
                          'data',
                        ],

                        additionalProperties: false,
                      },
                      {
                        type: 'object',

                        properties: {
                          action: {
                            type: 'string',
                            enum: ['update_task'],
                          },

                          taskId: {
                            type: 'integer',
                          },

                          data: {
                            type: 'object',

                            properties: {
                              title: {
                                type: 'string',
                              },

                              description: {
                                type: 'string',
                              },

                              status: {
                                type: 'string',
                                enum: [
                                  'todo',
                                  'in_progress',
                                  'done',
                                ],
                              },

                              priority: {
                                type: 'string',
                                enum: [
                                  'low',
                                  'medium',
                                  'high',
                                ],
                              },

                              assigneeId: {
                                type: 'integer',
                              },
                            },

                            additionalProperties: false,
                          },
                        },

                        required: [
                          'action',
                          'taskId',
                          'data',
                        ],

                        additionalProperties: false,
                      },
                      {
                        type: 'object',

                        properties: {
                          action: {
                            type: 'string',
                            enum: ['delete_task'],
                          },

                          taskId: {
                            type: 'integer',
                          },
                        },

                        required: [
                          'action',
                          'taskId',
                        ],

                        additionalProperties: false,
                      },
                    ],
                  },
                },
              },

              required: [
                'decision',
                'operations',
              ],

              additionalProperties: false,
            },
            {
              type: 'object',

              properties: {
                decision: {
                  type: 'string',
                  enum: ['reject'],
                },

                reason: {
                  type: 'string',
                },

                operations: {
                  type: 'array',

                  // Gemini tetap butuh items
                  items: {
                    type: 'object',
                  },

                  maxItems: 0,
                },
              },

              required: [
                'decision',
                'reason',
                'operations',
              ],

              additionalProperties: false,
            }
          ],
        }
      },
    })

    const text = response.text
    if (!text) {
      throw new Error("Empty response from AI")
    }
    const parsed = JSON.parse(text)
    const validated = await aiResponseValidator.validate(parsed)
    return validated
  }
}
