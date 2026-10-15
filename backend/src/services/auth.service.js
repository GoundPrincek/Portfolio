import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors.js'

export async function login(prisma, { email, password }, secret) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  const valid = user && user.role === 'ADMIN' && await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.')
  const token = jwt.sign({ role: user.role, email: user.email }, secret, {
    algorithm: 'HS256', subject: user.id, expiresIn: '30m',
  })
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}
