import vine from '@vinejs/vine'

export const registerValidator = vine.create({
  name: vine.string().trim().minLength(3),
  email: vine.string().email().normalizeEmail(),
  password: vine.string().minLength(8),
  role: vine.enum(['admin', 'user'])
})

export const loginValidator = vine.create({
  email: vine.string().email().normalizeEmail(),
  password: vine.string()
})
