import { apiRequest } from './api.js'

export const getProjects = () => apiRequest('/projects')
export const getProject = (slug) => apiRequest(`/projects/${encodeURIComponent(slug)}`)
