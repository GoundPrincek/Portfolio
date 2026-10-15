import { readEnv } from './config/env.js'
import { prisma } from './config/database.js'
import { createApp } from './app.js'
import { logger } from './utils/logger.js'

let config
try {
  config = readEnv()
} catch (error) {
  logger.error({ message: error.message }, 'Unable to start API')
  process.exit(1)
}

const app = createApp({
  prisma,
  jwtSecret: config.JWT_SECRET,
  clientUrl: config.CLIENT_URL,
  githubUsername: config.GITHUB_USERNAME,
  githubToken: config.GITHUB_TOKEN,
  isProduction: config.NODE_ENV === 'production',
})

const server = app.listen(config.PORT, () => logger.info({ port: config.PORT }, 'Portfolio API listening'))

async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down API')
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
