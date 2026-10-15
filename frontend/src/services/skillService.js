import { apiRequest } from './api.js'

export const getSkills = () => apiRequest('/skills')
