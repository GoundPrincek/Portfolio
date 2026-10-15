import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors.js'

export function requireAdmin({ secret }) {
  return (req, _res, next) => {
    const token = req.cookies?.portfolio_admin
    if (!token) return next(new AppError(401, 'AUTH_REQUIRED', 'Please sign in to continue.'))
    try {
      const payload = jwt.verify(token, secret, { algorithms: ['HS256'] })
      if (payload.role !== 'ADMIN') throw new Error('Invalid role')
      req.user = { id: payload.sub, email: payload.email, role: payload.role }
      return next()
    } catch {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Please sign in to continue.'))
    }
  }
}
