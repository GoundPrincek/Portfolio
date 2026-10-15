import { apiRequest } from './api.js'

export const sendContactMessage = (message) => apiRequest('/contact', { method: 'POST', body: message })
