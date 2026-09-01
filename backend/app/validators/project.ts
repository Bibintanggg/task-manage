import vine from '@vinejs/vine'

export const createProjectValidator = vine.create({
  name: vine.string().trim().minLength(3),
  description: vine.string().trim().optional()
})

export const updateProjectValidator = vine.create({
  name: vine.string().trim().minLength(3).optional(),
  description: vine.string().optional()
})
