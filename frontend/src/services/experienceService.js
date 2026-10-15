import { apiRequest } from './api.js'

export const getExperience = () => apiRequest('/experience')
export const getEducation = () => apiRequest('/education')
export const getAchievements = () => apiRequest('/achievements')
