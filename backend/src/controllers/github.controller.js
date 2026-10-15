import { getGitHubProfile, getGitHubRepos } from '../services/github.service.js'
import { asyncHandler, success } from '../utils/errors.js'

export const profile = asyncHandler(async (req, res) => {
  const { username, token } = req.app.locals.github
  return success(res, 'GitHub profile fetched successfully', await getGitHubProfile(username, token))
})

export const repositories = asyncHandler(async (req, res) => {
  const { username, token } = req.app.locals.github
  const projects = await req.app.locals.prisma.project.findMany({ where: { featured: true }, select: { title: true } })
  const names = projects.map(({ title }) => title.replace(/\s+/g, ''))
  const data = await getGitHubRepos(username, token, names)
  return success(res, 'Selected GitHub repositories fetched successfully', data)
})
