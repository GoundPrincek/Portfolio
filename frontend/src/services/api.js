const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR' } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
      method,
      credentials: 'include',
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('The API could not be reached. Check the server connection and try again.')
  }

  let payload
  try { payload = await response.json() } catch { payload = null }
  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message || `The request failed with status ${response.status}.`, {
      status: response.status,
      code: payload?.error || 'REQUEST_FAILED',
    })
  }
  return payload.data
}
