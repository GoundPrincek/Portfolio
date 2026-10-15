import { asyncHandler, success, AppError } from '../utils/errors.js'
import { getCollectionConfig } from '../services/content.service.js'

export const overview = asyncHandler(async (req, res) => {
  const prisma = req.app.locals.prisma
  const [projects, skills, experience, education, achievements, messages, newMessages] = await Promise.all([
    prisma.project.count(), prisma.skill.count(), prisma.experience.count(), prisma.education.count(),
    prisma.achievement.count(), prisma.message.count(), prisma.message.count({ where: { status: 'NEW' } }),
  ])
  return success(res, 'Dashboard overview fetched successfully', { projects, skills, experience, education, achievements, messages, newMessages })
})

export const listCollection = (collection) => asyncHandler(async (req, res) => {
  const { model, orderBy } = getCollectionConfig(collection)
  const items = await req.app.locals.prisma[model].findMany({ orderBy })
  return success(res, `${collection} fetched successfully`, items)
})

export const createCollectionItem = (collection) => asyncHandler(async (req, res) => {
  const { model } = getCollectionConfig(collection)
  const item = await req.app.locals.prisma[model].create({ data: req.body })
  return success(res, `${collection} item created successfully`, item, 201)
})

export const updateCollectionItem = (collection) => asyncHandler(async (req, res) => {
  const { model } = getCollectionConfig(collection)
  const item = await req.app.locals.prisma[model].update({ where: { id: req.params.id }, data: req.body })
  return success(res, `${collection} item updated successfully`, item)
})

export const deleteCollectionItem = (collection) => asyncHandler(async (req, res) => {
  const { model } = getCollectionConfig(collection)
  try {
    await req.app.locals.prisma[model].delete({ where: { id: req.params.id } })
  } catch (error) {
    if (error.code === 'P2025') throw new AppError(404, 'NOT_FOUND', 'The item was not found.')
    throw error
  }
  return success(res, `${collection} item deleted successfully`, null)
})
