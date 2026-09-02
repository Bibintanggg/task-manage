import vine from '@vinejs/vine'

export const aiPromptValidator = vine.create({
  prompt: vine.string().trim().minLength(3)
})
