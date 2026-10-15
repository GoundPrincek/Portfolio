import { AppError } from '../utils/errors.js'

const cache = new Map()
const ttl = 5 * 60 * 1000

async function cached(key, load) {
  const existing = cache.get(key)
  if (existing && existing.expiresAt > Date.now()) return existing.value
  const value = await load()
  cache.set(key, { value, expiresAt: Date.now() + ttl })
  return value
}

async function githubFetch(path, token) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new AppError(502, 'GITHUB_UNAVAILABLE', 'GitHub data is temporarily unavailable.')
  try { return await response.json() } catch { throw new AppError(502, 'GITHUB_UNAVAILABLE', 'GitHub returned an invalid response.') }
}

export function getGitHubProfile(username, token) {
  return cached(`profile:${username}`, async () => {
    const { login, name, avatar_url, html_url, bio, public_repos } = await githubFetch(`/users/${encodeURIComponent(username)}`, token)
    return { username: login, name, avatarUrl: avatar_url, url: html_url, bio, publicRepos: public_repos }
  })
}

export function getGitHubRepos(username, token, selectedNames) {
  const selected = new Set(selectedNames.map((name) => name.toLowerCase()))
  return cached(`repos:${username}`, async () => {
    const repos = await githubFetch(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&type=owner`, token)
    return repos.filter((repo) => selected.has(repo.name.toLowerCase())).map(({ name, full_name, description, html_url, language, stargazers_count, updated_at }) => ({
      name, fullName: full_name, description, url: html_url, language, stars: stargazers_count, updatedAt: updated_at,
    }))
  })
}

export function clearGitHubCache() { cache.clear() }
