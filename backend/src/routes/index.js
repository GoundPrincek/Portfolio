import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { authLimiter, contactLimiter } from '../middleware/rateLimiter.js'
import { achievementSchema, contactSchema, educationSchema, experienceSchema, loginSchema, messageStatusSchema, projectSchema, skillSchema } from '../validators/schemas.js'
import { list, projectBySlug } from '../controllers/content.controller.js'
import { login, logout, me } from '../controllers/auth.controller.js'
import { listMessages, submit, updateMessage } from '../controllers/contact.controller.js'
import { overview, createCollectionItem, deleteCollectionItem, updateCollectionItem } from '../controllers/admin.controller.js'
import { profile, repositories } from '../controllers/github.controller.js'
import { asyncHandler, success } from '../utils/errors.js'

const collections = [
  ['projects', projectSchema],
  ['skills', skillSchema],
  ['experience', experienceSchema],
  ['education', educationSchema],
  ['achievements', achievementSchema],
]

export function createApiRouter({ adminAuth }) {
  const router = Router()

  router.get('/health', asyncHandler(async (req, res) => {
    try {
      await req.app.locals.prisma.$queryRaw`SELECT 1`
      return success(res, 'Service is healthy', { status: 'ok', database: 'connected' })
    } catch {
      return res.status(503).json({ success: false, message: 'Database connection is unavailable.', error: 'DATABASE_UNAVAILABLE', data: { status: 'error', database: 'disconnected' } })
    }
  }))

  const authRouter = Router()
  authRouter.post('/login', authLimiter, validate(loginSchema), login)
  authRouter.post('/logout', logout)
  authRouter.get('/me', adminAuth, me)
  router.use('/auth', authRouter)

  router.post('/contact', contactLimiter, validate(contactSchema), submit)
  router.get('/github/profile', profile)
  router.get('/github/repos', repositories)

  for (const [collection, schema] of collections) {
    const collectionRouter = Router()
    collectionRouter.get('/', list(collection))
    if (collection === 'projects') collectionRouter.get('/:slug', projectBySlug)
    collectionRouter.post('/', adminAuth, validate(schema), createCollectionItem(collection))
    collectionRouter.put('/:id', adminAuth, validate(schema), updateCollectionItem(collection))
    collectionRouter.delete('/:id', adminAuth, deleteCollectionItem(collection))
    router.use(`/${collection}`, collectionRouter)
  }

  const adminRouter = Router()
  adminRouter.use(adminAuth)
  adminRouter.get('/overview', overview)
  adminRouter.get('/messages', listMessages)
  adminRouter.patch('/messages/:id', validate(messageStatusSchema), updateMessage)
  router.use('/admin', adminRouter)

  return router
}
