import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const input = z.object({
  ADMIN_NAME: z.string().trim().min(1).max(100),
  ADMIN_EMAIL: z.string().trim().email().max(254),
  ADMIN_PASSWORD: z.string().min(12).max(200),
}).safeParse(process.env)

if (!input.success) {
  console.error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD (at least 12 characters) for this one-time command.')
  process.exit(1)
}

const prisma = new PrismaClient()
try {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = input.data
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL.toLowerCase() },
    create: { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), passwordHash, role: 'ADMIN' },
    update: { name: ADMIN_NAME, passwordHash, role: 'ADMIN' },
  })
  console.info(`Admin account ${ADMIN_EMAIL.toLowerCase()} is ready.`)
} catch (error) {
  console.error('Unable to create the admin account:', error.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
