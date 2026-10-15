import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CLIENT_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  GITHUB_USERNAME: z.string().min(1).default('GoundPrincek'),
  GITHUB_TOKEN: z.string().optional(),
})

export function readEnv(source = process.env) {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) {
    const details = parsed.error.issues.map(({ path, message }) => `${path.join('.')}: ${message}`).join('; ')
    throw new Error(`Invalid environment configuration: ${details}`)
  }
  return parsed.data
}
