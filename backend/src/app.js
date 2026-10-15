import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'
import { createApiRouter } from './routes/index.js'
import { requireAdmin } from './middleware/auth.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'
import { openApiSpec } from './openapi.js'
import { AppError } from './utils/errors.js'

export function createApp({ prisma, jwtSecret, clientUrl = '', githubUsername = 'GoundPrincek', githubToken = '', isProduction = false }) {
  if (!prisma) throw new Error('A Prisma-compatible client is required.')
  if (!jwtSecret || jwtSecret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters.')
  const app = express()
  app.disable('x-powered-by')
  if (isProduction) app.set('trust proxy', 1)
  app.locals.prisma = prisma
  app.locals.jwtSecret = jwtSecret
  app.locals.isProduction = isProduction
  app.locals.github = { username: githubUsername, token: githubToken }

  app.use(helmet())
  const allowedOrigins = clientUrl.split(',').map((origin) => origin.trim()).filter(Boolean)
  if (!isProduction) allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173')
  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new AppError(403, 'CORS_ORIGIN_DENIED', 'This origin is not allowed.'))
    },
  }))
  app.use(express.json({ limit: '20kb', strict: true }))
  app.use(cookieParser())
  app.use(pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ id: req.id, method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    customProps: (_req, res) => ({ responseTime: res.responseTime }),
    customLogLevel(_req, res, error) { return error || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info' },
  }))
  app.get('/', (_req, res) => res.json({ service: 'portfolio-api', docs: '/api/docs', health: '/api/health' }))
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, { explorer: true }))
  app.use('/api', createApiRouter({ adminAuth: requireAdmin({ secret: jwtSecret }) }))
  app.use(notFound)
  app.use(errorHandler)
  return app
}
