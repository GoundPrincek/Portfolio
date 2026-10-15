import { saveContact } from '../services/contact.service.js'
import { asyncHandler, success } from '../utils/errors.js'

export const submit = asyncHandler(async (req, res) => {
  if (req.body.website) return success(res, 'Message received', null, 201)
  await saveContact(req.app.locals.prisma, req.body)
  return success(res, 'Message received. Thank you for reaching out.', null, 201)
})

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await req.app.locals.prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
  return success(res, 'Messages fetched successfully', messages)
})

export const updateMessage = asyncHandler(async (req, res) => {
  const readAt = req.body.status === 'NEW' ? null : new Date()
  const message = await req.app.locals.prisma.message.update({
    where: { id: req.params.id }, data: { status: req.body.status, readAt },
  })
  return success(res, 'Message status updated successfully', message)
})
