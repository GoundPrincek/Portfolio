export class AppError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

export function success(res, message, data, status = 200) {
  return res.status(status).json({ success: true, message, data })
}
