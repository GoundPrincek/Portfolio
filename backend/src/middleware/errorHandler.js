import { AppError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'

export function notFound(_req, _res, next) {
  next(new AppError(404, 'NOT_FOUND', 'The requested resource was not found.'))
}

export function errorHandler(error, req, res, _next) {
  const prismaCode = error.code?.startsWith('P') ? error.code : null
  const status = Number.isInteger(error.status) ? error.status : prismaCode === 'P2002' ? 409 : prismaCode === 'P2025' ? 404 : 500
  const code = error.status ? error.code : status === 409 ? 'ALREADY_EXISTS' : status === 404 ? 'NOT_FOUND' : status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'
  if (status >= 500) logger.error({ err: error, method: req.method, path: req.path }, 'request failed')
  return res.status(status).json({
    success: false,
    message: status >= 500 ? 'An unexpected error occurred.' : error.status ? error.message : status === 409 ? 'A record with these details already exists.' : status === 404 ? 'The requested resource was not found.' : error.message,
    error: code,
  })
}
