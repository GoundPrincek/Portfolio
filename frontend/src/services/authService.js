import { apiRequest } from './api.js'

export const login = (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials })
export const logout = () => apiRequest('/auth/logout', { method: 'POST' })
export const getCurrentAdmin = () => apiRequest('/auth/me')

export const getAdminOverview = () => apiRequest('/admin/overview')
export const getAdminCollection = (collection) => apiRequest(`/admin/${collection}`)
export const getAdminMessages = () => apiRequest('/admin/messages')
export const updateMessageStatus = (id, status) => apiRequest(`/admin/messages/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } })
export const createAdminItem = (collection, data) => apiRequest(`/${collection}`, { method: 'POST', body: data })
export const updateAdminItem = (collection, id, data) => apiRequest(`/${collection}/${encodeURIComponent(id)}`, { method: 'PUT', body: data })
export const deleteAdminItem = (collection, id) => apiRequest(`/${collection}/${encodeURIComponent(id)}`, { method: 'DELETE' })
