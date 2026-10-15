import { apiRequest } from './api.js'

export const getGitHubProfile = () => apiRequest('/github/profile')
export const getSelectedRepos = () => apiRequest('/github/repos')
