import { login as authenticate } from '../services/auth.service.js'
import { asyncHandler, success } from '../utils/errors.js'

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authenticate(req.app.locals.prisma, req.body, req.app.locals.jwtSecret)
  res.cookie('portfolio_admin', token, {
    httpOnly: true,
    secure: req.app.locals.isProduction,
    sameSite: 'lax',
    maxAge: 30 * 60 * 1000,
    path: '/',
  })
  return success(res, 'Signed in successfully', { user })
})

export const logout = (_req, res) => {
  res.clearCookie('portfolio_admin', { httpOnly: true, secure: res.app.locals.isProduction, sameSite: 'lax', path: '/' })
  return success(res, 'Signed out successfully', null)
}

export const me = (req, res) => success(res, 'Current admin fetched successfully', { user: req.user })
