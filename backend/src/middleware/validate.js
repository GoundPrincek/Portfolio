import { AppError } from '../utils/errors.js'

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Please check the submitted fields.'))
    }
    req[source] = result.data
    return next()
  }
}
