const protectedCookie = [{ AdminCookie: [] }]
const success = (schema) => ({ type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string' }, data: schema } })
const arrayOf = (schema) => ({ type: 'array', items: schema })
const string = { type: 'string' }
const project = { type: 'object', properties: { id: string, slug: string, name: string, summary: string, status: string, technologies: arrayOf(string), features: arrayOf(string), repository: { type: 'string', format: 'uri' }, live: { type: 'string', format: 'uri', nullable: true } } }
const item = { type: 'object', additionalProperties: true }

export const openApiSpec = {
  openapi: '3.0.3',
  info: { title: 'Prince Gound Portfolio API', version: '1.0.0', description: 'Public portfolio content, contact intake, selected public GitHub data, and protected owner CMS endpoints.' },
  servers: [{ url: '/api' }],
  tags: ['Health', 'Authentication', 'Projects', 'Skills', 'Experience', 'Education', 'Achievements', 'Contact', 'GitHub', 'Admin'].map((name) => ({ name })),
  components: {
    securitySchemes: { AdminCookie: { type: 'apiKey', in: 'cookie', name: 'portfolio_admin', description: 'HttpOnly, same-site admin cookie set by POST /auth/login.' } },
    schemas: {
      Success: success(item),
      Error: { type: 'object', properties: { success: { type: 'boolean', example: false }, message: string, error: string } },
      Project: project,
      ContactRequest: { type: 'object', required: ['name', 'email', 'message'], properties: { name: string, email: { type: 'string', format: 'email' }, subject: string, message: { type: 'string', minLength: 10, maxLength: 5000 } } },
      LoginRequest: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } },
    },
    responses: { Unauthorized: { description: 'Admin sign-in required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }, ValidationError: { description: 'Request fields failed validation.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } },
  },
  paths: {
    '/health': { get: { tags: ['Health'], summary: 'Check API and PostgreSQL connectivity', responses: { 200: { description: 'Healthy', content: { 'application/json': { schema: success(item) } } }, 503: { description: 'Database is unavailable' } } } },
    '/auth/login': { post: { tags: ['Authentication'], summary: 'Sign in as the portfolio admin', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { 200: { description: 'Sets an HttpOnly admin cookie' }, 401: { description: 'Invalid credentials' }, 400: { $ref: '#/components/responses/ValidationError' } } } },
    '/auth/logout': { post: { tags: ['Authentication'], summary: 'Clear the admin cookie', responses: { 200: { description: 'Signed out' } } } },
    '/auth/me': { get: { tags: ['Authentication'], summary: 'Read current admin session', security: protectedCookie, responses: { 200: { description: 'Current admin' }, 401: { $ref: '#/components/responses/Unauthorized' } } } },
    '/projects': { get: { tags: ['Projects'], summary: 'List public projects', responses: { 200: { description: 'Projects', content: { 'application/json': { schema: success(arrayOf(project)) } } } } }, post: { tags: ['Projects'], summary: 'Create a project', security: protectedCookie, requestBody: { required: true, content: { 'application/json': { schema: project } } }, responses: { 201: { description: 'Created' }, 401: { $ref: '#/components/responses/Unauthorized' }, 400: { $ref: '#/components/responses/ValidationError' } } } },
    '/projects/{id}': { put: { tags: ['Projects'], summary: 'Update a project', security: protectedCookie, parameters: [{ name: 'id', in: 'path', required: true, schema: string }], requestBody: { required: true, content: { 'application/json': { schema: project } } }, responses: { 200: { description: 'Updated' }, 401: { $ref: '#/components/responses/Unauthorized' } } }, delete: { tags: ['Projects'], summary: 'Delete a project', security: protectedCookie, parameters: [{ name: 'id', in: 'path', required: true, schema: string }], responses: { 200: { description: 'Deleted' }, 401: { $ref: '#/components/responses/Unauthorized' } } } },
    '/projects/{slug}': { get: { tags: ['Projects'], summary: 'Get a project case study by slug', parameters: [{ name: 'slug', in: 'path', required: true, schema: string }], responses: { 200: { description: 'Project', content: { 'application/json': { schema: success(project) } } }, 404: { description: 'Project not found' } } } },
    ...Object.fromEntries(['skills', 'experience', 'education', 'achievements'].map((path) => [`/${path}`, { get: { tags: [path[0].toUpperCase() + path.slice(1)], summary: `List ${path}`, responses: { 200: { description: 'Items', content: { 'application/json': { schema: success(arrayOf(item)) } } } } }, post: { tags: [path[0].toUpperCase() + path.slice(1)], summary: `Create ${path.slice(0, -1)}`, security: protectedCookie, requestBody: { required: true, content: { 'application/json': { schema: item } } }, responses: { 201: { description: 'Created' }, 401: { $ref: '#/components/responses/Unauthorized' } } } }])),
    '/{collection}/{id}': { put: { tags: ['Admin'], summary: 'Update a skill, experience, education item, or achievement', security: protectedCookie, parameters: [{ name: 'collection', in: 'path', required: true, schema: { type: 'string', enum: ['projects', 'skills', 'experience', 'education', 'achievements'] } }, { name: 'id', in: 'path', required: true, schema: string }], requestBody: { required: true, content: { 'application/json': { schema: item } } }, responses: { 200: { description: 'Updated' }, 401: { $ref: '#/components/responses/Unauthorized' } } }, delete: { tags: ['Admin'], summary: 'Delete a portfolio item', security: protectedCookie, parameters: [{ name: 'collection', in: 'path', required: true, schema: string }, { name: 'id', in: 'path', required: true, schema: string }], responses: { 200: { description: 'Deleted' }, 401: { $ref: '#/components/responses/Unauthorized' } } } },
    '/contact': { post: { tags: ['Contact'], summary: 'Validate and save a contact message', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactRequest' } } } }, responses: { 201: { description: 'Message stored for admin review' }, 400: { $ref: '#/components/responses/ValidationError' }, 429: { description: 'Contact rate limit reached' } } } },
    '/github/profile': { get: { tags: ['GitHub'], summary: 'Read the public GitHub profile (cached)', responses: { 200: { description: 'GitHub profile' }, 502: { description: 'GitHub is unavailable' } } } },
    '/github/repos': { get: { tags: ['GitHub'], summary: 'Read selected portfolio repositories (cached)', responses: { 200: { description: 'Selected repositories' } } } },
    '/admin/overview': { get: { tags: ['Admin'], summary: 'Get dashboard content and message counts', security: protectedCookie, responses: { 200: { description: 'Dashboard overview' }, 401: { $ref: '#/components/responses/Unauthorized' } } } },
    '/admin/messages': { get: { tags: ['Admin'], summary: 'List contact messages', security: protectedCookie, responses: { 200: { description: 'Messages' }, 401: { $ref: '#/components/responses/Unauthorized' } } } },
    '/admin/messages/{id}': { patch: { tags: ['Admin'], summary: 'Update contact message status', security: protectedCookie, parameters: [{ name: 'id', in: 'path', required: true, schema: string }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] } } } } } }, responses: { 200: { description: 'Status updated' }, 401: { $ref: '#/components/responses/Unauthorized' } } } },
  },
}
