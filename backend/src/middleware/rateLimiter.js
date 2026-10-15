import rateLimit from 'express-rate-limit'

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please try again later.', error: 'RATE_LIMITED' },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please try again later.', error: 'RATE_LIMITED' },
})
