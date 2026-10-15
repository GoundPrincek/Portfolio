import { asyncHandler, success } from '../utils/errors.js'
import { getProjectBySlug, listContent } from '../services/content.service.js'

export const list = (collection) => asyncHandler(async (req, res) => {
  const data = await listContent(req.app.locals.prisma, collection)
  return success(res, `${collection} fetched successfully`, data)
})

export const projectBySlug = asyncHandler(async (req, res) => {
  const data = await getProjectBySlug(req.app.locals.prisma, req.params.slug)
  return success(res, 'Project fetched successfully', data)
})
