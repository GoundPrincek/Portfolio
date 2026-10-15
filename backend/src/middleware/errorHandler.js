import { AppError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'

export function notFound(_req, _res, next) {
  next(new AppError(404, 'NOT_FOUND', 'The requested resource was not found.'))
}

export function errorHandler(error, req, res, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500
  const code = error.code || (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR')
  if (status >= 500) logger.error({ err: error, method: req.method, path: req.path }, 'request failed')
  return res.status(status).json({
    success: false,
    message: status >= 500 ? 'An unexpected error occurred.' : error.message,
    error: code,
  })
}
