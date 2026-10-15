const text = { type: 'string' }
const url = { type: 'string', format: 'uri' }
const list = { type: 'array', items: text }
const adminSecurity = [{ AdminCookie: [] }]
const response = (schema, description) => ({ description, content: { 'application/json': { schema } } })
const envelope = (schema) => ({ type: 'object', required: ['success', 'message', 'data'], properties: { success: { type: 'boolean', example: true }, message: text, data: schema } })
const array = (schema) => ({ type: 'array', items: schema })
const record = (properties, required = []) => ({ type: 'object', required, properties })

const projectView = record({ id: text, slug: text, index: text, name: text, title: text, summary: text, overview: text, problem: text, solution: text, architecture: text, status: text, kind: text, technologies: list, features: list, repository: url, live: { ...url, nullable: true }, imageUrl: { ...url, nullable: true }, galleryUrls: list, featured: { type: 'boolean' } })
const projectInput = record({
  title: text, slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }, subtitle: text, localName: text, tagline: text,
  shortDescription: { type: 'string', maxLength: 400 }, description: text, problem: text, solution: text, architecture: text,
  designQuestion: text, learned: text, contribution: text, kind: text, status: text, technologies: list, features: list,
  githubUrl: url, liveUrl: { ...url, nullable: true }, imageUrl: { ...url, nullable: true }, galleryUrls: array(url), featured: { type: 'boolean' }, sortOrder: { type: 'integer', minimum: 0 },
}, ['title', 'slug', 'shortDescription', 'description', 'problem', 'solution', 'architecture', 'kind', 'status', 'technologies', 'features', 'githubUrl'])
const schemas = {
  Project: projectView,
  ProjectInput: projectInput,
  SkillInput: record({ name: text, category: text, level: text, sortOrder: { type: 'integer', minimum: 0 } }, ['name', 'category']),
  ExperienceInput: record({ title: text, organization: text, description: text, learned: text, related: text, category: text, period: text, year: text, startDate: { type: 'string', format: 'date-time', nullable: true }, endDate: { type: 'string', format: 'date-time', nullable: true }, location: text, sortOrder: { type: 'integer', minimum: 0 } }, ['title', 'organization', 'description', 'category', 'period']),
  EducationInput: record({ institution: text, degree: text, field: text, description: text, startDate: { type: 'string', format: 'date-time', nullable: true }, endDate: { type: 'string', format: 'date-time', nullable: true }, sortOrder: { type: 'integer', minimum: 0 } }, ['institution', 'degree', 'field', 'description']),
  AchievementInput: record({ title: text, category: text, description: text, date: { type: 'string', format: 'date-time', nullable: true }, url: { ...url, nullable: true }, sortOrder: { type: 'integer', minimum: 0 } }, ['title', 'category', 'description']),
  ContactRequest: record({ name: text, email: { type: 'string', format: 'email' }, subject: text, message: { type: 'string', minLength: 10, maxLength: 5000 } }, ['name', 'email', 'message']),
  LoginRequest: record({ email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } }, ['email', 'password']),
  MessageStatus: record({ status: { type: 'string', enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] } }, ['status']),
  Error: record({ success: { type: 'boolean', example: false }, message: text, error: text }, ['success', 'message', 'error']),
}

const unauthorized = response({ $ref: '#/components/schemas/Error' }, 'Admin sign-in required.')
const validationError = response({ $ref: '#/components/schemas/Error' }, 'Request fields failed validation.')
const paths = {
  '/health': { get: { tags: ['Health'], summary: 'Check API and PostgreSQL connectivity', responses: { 200: response(envelope(record({ status: text, database: text })), 'Service and database are healthy.'), 503: response(envelope(record({ status: text, database: text })), 'Database is unavailable.') } } },
  '/auth/login': { post: { tags: ['Authentication'], summary: 'Sign in as the portfolio admin', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { 200: response(envelope(record({ user: record({ id: text, name: text, email: { type: 'string', format: 'email' }, role: text }) })), 'Signed in; sets an HttpOnly cookie.'), 400: validationError, 401: response({ $ref: '#/components/schemas/Error' }, 'Email or password is incorrect.') } } },
  '/auth/logout': { post: { tags: ['Authentication'], summary: 'Clear the admin cookie', responses: { 200: response(envelope({ type: 'null' }), 'Signed out.') } } },
  '/auth/me': { get: { tags: ['Authentication'], summary: 'Read the current admin session', security: adminSecurity, responses: { 200: response(envelope(record({ user: record({ id: text, email: { type: 'string', format: 'email' }, role: text }) })), 'Current owner session.'), 401: unauthorized } } },
  '/contact': { post: { tags: ['Contact'], summary: 'Validate and save a contact message', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactRequest' } } } }, responses: { 201: response(envelope({ type: 'null' }), 'Message saved for owner review.'), 400: validationError, 429: response({ $ref: '#/components/schemas/Error' }, 'Contact rate limit reached.') } } },
  '/github/profile': { get: { tags: ['GitHub'], summary: 'Read the cached public GitHub profile', responses: { 200: response(envelope(record({ username: text, name: text, avatarUrl: url, url, bio: text, publicRepos: { type: 'integer' } })), 'Public profile details.'), 502: response({ $ref: '#/components/schemas/Error' }, 'GitHub is unavailable.') } } },
  '/github/repos': { get: { tags: ['GitHub'], summary: 'Read cached selected portfolio repositories', responses: { 200: response(envelope(array(record({ name: text, fullName: text, description: text, url, language: text, stars: { type: 'integer' }, updatedAt: { type: 'string', format: 'date-time' } }))), 'Only repositories linked from projects are returned.') } } },
  '/admin/overview': { get: { tags: ['Admin'], summary: 'Get dashboard content and message counts', security: adminSecurity, responses: { 200: response(envelope(record({ projects: { type: 'integer' }, skills: { type: 'integer' }, experience: { type: 'integer' }, education: { type: 'integer' }, achievements: { type: 'integer' }, messages: { type: 'integer' }, newMessages: { type: 'integer' } })), 'Dashboard overview.'), 401: unauthorized } } },
  '/admin/messages': { get: { tags: ['Admin'], summary: 'List contact messages, newest first', security: adminSecurity, responses: { 200: response(envelope(array(record({ id: text, name: text, email: { type: 'string', format: 'email' }, subject: text, message: text, status: text, createdAt: { type: 'string', format: 'date-time' }, readAt: { type: 'string', format: 'date-time', nullable: true } }))), 'Stored messages.'), 401: unauthorized } } },
  '/admin/messages/{id}': { patch: { tags: ['Admin'], summary: 'Change a contact message status', security: adminSecurity, parameters: [{ name: 'id', in: 'path', required: true, schema: text }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageStatus' } } } }, responses: { 200: response(envelope(record({ id: text, status: text, readAt: { type: 'string', format: 'date-time', nullable: true } })), 'Message status updated.'), 400: validationError, 401: unauthorized } } },
}

const itemInputs = { projects: 'ProjectInput', skills: 'SkillInput', experience: 'ExperienceInput', education: 'EducationInput', achievements: 'AchievementInput' }
const itemSchemas = { projects: 'Project', skills: 'SkillInput', experience: 'ExperienceInput', education: 'EducationInput', achievements: 'AchievementInput' }

for (const [collection, inputSchema] of Object.entries(itemInputs)) {
  const tag = collection[0].toUpperCase() + collection.slice(1)
  paths[`/${collection}`] = {
    get: { tags: [tag], summary: `List public ${collection}`, responses: { 200: response(envelope(array({ $ref: `#/components/schemas/${itemSchemas[collection]}` })), `${collection} in display order.`) } },
    post: { tags: [tag], summary: `Create a ${collection.slice(0, -1)} (admin)`, security: adminSecurity, requestBody: { required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${inputSchema}` } } }, responses: { 201: response(envelope({ $ref: `#/components/schemas/${itemSchemas[collection]}` }), 'Record created.'), 400: validationError, 401: unauthorized } },
  }
  paths[`/${collection}/{id}`] = {
    ...(collection === 'projects' ? { get: { tags: [tag], summary: 'Get a public project case study by slug', parameters: [{ name: 'id', in: 'path', required: true, description: 'Project slug.', schema: text }], responses: { 200: response(envelope({ $ref: '#/components/schemas/Project' }), 'Project detail.'), 404: response({ $ref: '#/components/schemas/Error' }, 'Project not found.') } } } : {}),
    put: { tags: [tag], summary: `Update ${collection} item (admin)`, security: adminSecurity, parameters: [{ name: 'id', in: 'path', required: true, description: 'Database record ID.', schema: text }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${inputSchema}` } } }, responses: { 200: response(envelope({ $ref: `#/components/schemas/${itemSchemas[collection]}` }), 'Record updated.'), 400: validationError, 401: unauthorized, 404: response({ $ref: '#/components/schemas/Error' }, 'Record not found.') } },
    delete: { tags: [tag], summary: `Delete ${collection} item (admin)`, security: adminSecurity, parameters: [{ name: 'id', in: 'path', required: true, description: 'Database record ID.', schema: text }], responses: { 200: response(envelope({ type: 'null' }), 'Record deleted.'), 401: unauthorized, 404: response({ $ref: '#/components/schemas/Error' }, 'Record not found.') } },
  }
  paths[`/admin/${collection}`] = { get: { tags: ['Admin', tag], summary: `List ${collection} for the CMS`, security: adminSecurity, responses: { 200: response(envelope(array({ $ref: `#/components/schemas/${inputSchema}` })), 'Management records, including private fields.') , 401: unauthorized } } }
}

export const openApiSpec = {
  openapi: '3.0.3',
  info: { title: 'Prince Gound Portfolio API', version: '1.0.0', description: 'Portfolio content, contact intake, selected GitHub data, and protected owner CMS endpoints.' },
  servers: [{ url: '/api' }],
  tags: ['Health', 'Authentication', 'Projects', 'Skills', 'Experience', 'Education', 'Achievements', 'Contact', 'GitHub', 'Admin'].map((name) => ({ name })),
  components: {
    securitySchemes: { AdminCookie: { type: 'apiKey', in: 'cookie', name: 'portfolio_admin', description: 'HttpOnly, same-site admin cookie set by POST /auth/login.' } },
    schemas: { ...schemas },
    responses: { Unauthorized: unauthorized, ValidationError: validationError },
  },
  paths,
}
