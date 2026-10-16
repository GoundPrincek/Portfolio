import { before, test } from 'node:test'
import assert from 'node:assert/strict'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { openApiSpec } from '../src/openapi.js'

const secret = 'test-only-secret-with-at-least-thirty-two-characters'
const password = 'portfolio-admin-password-2026'
let app
let agent
let records

function recordModel(collection, uniqueField) {
  return {
    async findMany({ where } = {}) { return where ? records[collection].filter((item) => Object.entries(where).every(([key, value]) => item[key] === value)) : [...records[collection]] },
    async findUnique({ where }) { return records[collection].find((item) => Object.entries(where).every(([key, value]) => item[key] === value)) || null },
    async findFirst({ where }) { return records[collection].find((item) => Object.entries(where).every(([key, value]) => item[key] === value)) || null },
    async create({ data, select }) {
      if (uniqueField && records[collection].some((item) => item[uniqueField] === data[uniqueField])) {
        const error = new Error('Duplicate unique field')
        error.code = 'P2002'
        throw error
      }
      const item = { id: `${collection}-${Date.now()}-${Math.random()}`, createdAt: new Date(), updatedAt: new Date(), status: 'NEW', ...data }
      records[collection].push(item)
      return select ? Object.fromEntries(Object.keys(select).map((key) => [key, item[key]])) : item
    },
    async update({ where, data }) {
      const item = records[collection].find((entry) => entry.id === where.id || (uniqueField && entry[uniqueField] === where[uniqueField]))
      if (!item) { const error = new Error('Missing record'); error.code = 'P2025'; throw error }
      Object.assign(item, data, { updatedAt: new Date() })
      return item
    },
    async delete({ where }) {
      const index = records[collection].findIndex((item) => item.id === where.id)
      if (index < 0) { const error = new Error('Missing record'); error.code = 'P2025'; throw error }
      return records[collection].splice(index, 1)[0]
    },
    async count({ where } = {}) { return where ? records[collection].filter((item) => Object.entries(where).every(([key, value]) => item[key] === value)).length : records[collection].length },
  }
}

before(async () => {
  records = { projects: [], skills: [], experience: [], education: [], achievements: [], messages: [] }
  const models = Object.fromEntries(Object.entries(records).map(([name]) => [name, recordModel(name, name === 'projects' ? 'slug' : null)]))
  const user = { id: 'admin-1', name: 'Portfolio Admin', email: 'owner@example.test', role: 'ADMIN', passwordHash: await bcrypt.hash(password, 4) }
  const prisma = {
    project: models.projects,
    skill: models.skills,
    experience: models.experience,
    education: models.education,
    achievement: models.achievements,
    message: models.messages,
    user: { findUnique: async ({ where }) => where.email === user.email ? user : null },
    $queryRaw: async () => [{ '?column?': 1 }],
  }
  app = createApp({ prisma, jwtSecret: secret, clientUrl: 'http://localhost:5173' })
  agent = request.agent(app)
})

test('API validation, public reads, contact persistence, auth, admin CRUD, and errors', async (t) => {
  await t.test('reports database health and returns a consistent not found response', async () => {
    const health = await request(app).get('/api/health').expect(200)
    assert.deepEqual(health.body.data, { status: 'ok', database: 'connected' })
    const missing = await request(app).get('/api/not-a-route').expect(404)
    assert.equal(missing.body.success, false)
    assert.equal(missing.body.error, 'NOT_FOUND')
    const docs = await request(app).get('/api/docs/').expect(200)
    assert.match(docs.headers['content-type'], /text\/html/)
    assert.equal(docs.headers['content-security-policy'], undefined)
  })

  await t.test('documents every public endpoint and references valid local schemas', () => {
    for (const path of ['/health', '/projects', '/projects/{id}', '/skills', '/experience', '/education', '/achievements', '/contact', '/github/profile', '/github/repos', '/auth/login', '/auth/logout', '/auth/me', '/admin/overview', '/admin/messages']) {
      assert.ok(openApiSpec.paths[path], `OpenAPI should document ${path}`)
    }
    const visit = (value) => {
      if (!value || typeof value !== 'object') return
      if (typeof value.$ref === 'string' && value.$ref.startsWith('#/')) {
        const resolved = value.$ref.slice(2).split('/').reduce((parent, key) => parent?.[key], openApiSpec)
        assert.ok(resolved, `OpenAPI reference ${value.$ref} should resolve`)
      }
      Object.values(value).forEach(visit)
    }
    visit(openApiSpec)
  })

  await t.test('returns a controlled gateway error when GitHub cannot be reached', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = async () => { throw new Error('network details must not reach the response') }
    try {
      const response = await request(app).get('/api/github/profile').expect(502)
      assert.equal(response.body.error, 'GITHUB_UNAVAILABLE')
      assert.equal(response.body.message, 'GitHub data is temporarily unavailable.')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.test('rejects invalid contact fields and stores a valid message', async () => {
    const invalid = await request(app).post('/api/contact').send({ name: 'A', email: 'not-an-email', message: 'short' }).expect(400)
    assert.equal(invalid.body.error, 'VALIDATION_ERROR')
    await request(app).post('/api/contact').send({ name: 'Recruiter', email: 'person@example.com', subject: 'Internship', message: 'I would like to discuss your projects.' }).expect(201)
    assert.equal(records.messages.length, 1)
    assert.equal(records.messages[0].status, 'NEW')
  })

  await t.test('protects admin mutations and rejects incorrect credentials', async () => {
    const payload = { title: 'API Project', slug: 'api-project', subtitle: '', localName: '', tagline: '', shortDescription: 'A short project summary', description: 'Overview', problem: 'Problem', solution: 'Solution', architecture: 'Architecture', designQuestion: '', learned: '', contribution: '', kind: 'Web application', status: 'In progress', technologies: ['React'], features: ['Routing'], githubUrl: 'https://github.com/example/project', liveUrl: '', imageUrl: '', galleryUrls: [], featured: false, sortOrder: 1 }
    const denied = await request(app).post('/api/projects').send(payload).expect(401)
    assert.equal(denied.body.error, 'AUTH_REQUIRED')
    await agent.post('/api/auth/login').send({ email: 'owner@example.test', password: 'incorrect password' }).expect(401)
    const login = await agent.post('/api/auth/login').send({ email: 'owner@example.test', password }).expect(200)
    assert.equal(login.body.data.user.role, 'ADMIN')
    assert.match(login.headers['set-cookie'][0], /HttpOnly/i)
  })

  await t.test('creates, lists, retrieves, updates, and deletes a project', async () => {
    const payload = { title: 'API Project', slug: 'api-project', subtitle: '', localName: '', tagline: '', shortDescription: 'A short project summary', description: 'Overview', problem: 'Problem', solution: 'Solution', architecture: 'Architecture', designQuestion: '', learned: '', contribution: '', kind: 'Web application', status: 'In progress', technologies: ['React'], features: ['Routing'], githubUrl: 'https://github.com/example/project', liveUrl: '', imageUrl: '', galleryUrls: [], featured: false, sortOrder: 1 }
    const created = await agent.post('/api/projects').send(payload).expect(201)
    const id = created.body.data.id
    assert.equal((await request(app).get('/api/projects').expect(200)).body.data[0].id, 'api-project')
    assert.equal((await request(app).get('/api/projects/api-project').expect(200)).body.data.name, 'API Project')
    const updated = await agent.put(`/api/projects/${id}`).send({ ...payload, title: 'Updated API Project' }).expect(200)
    assert.equal(updated.body.data.title, 'Updated API Project')
    await agent.delete(`/api/projects/${id}`).expect(200)
    await request(app).get('/api/projects/api-project').expect(404)
  })

  await t.test('requires admin authentication to read messages and returns them after sign in', async () => {
    await request(app).get('/api/admin/messages').expect(401)
    const response = await agent.get('/api/admin/messages').expect(200)
    assert.equal(response.body.data.length, 1)
  })
})
