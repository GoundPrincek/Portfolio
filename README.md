# Prince Gound — Full-stack Portfolio

Personal portfolio for **Prince Gound, Full-Stack Developer & IT Engineering Student**. It presents project case studies, skills, education and milestones, selected public GitHub repositories, and a contact form.

**Existing portfolio URL:** https://portfolio-dun-rho-2buhpe6319.vercel.app/  
**GitHub:** https://github.com/GoundPrincek/Portfolio

## Architecture

```text
React + Vite frontend ── REST / JSON ── Express API ── Prisma ── PostgreSQL
         │                                  │
         └── selected GitHub repositories ──┘
```

The public pages keep the existing visual design and use API content with the checked-in portfolio data as an offline fallback. The protected `/admin` CMS manages projects, skills, experience, education, achievements, and contact message status. Project screenshots are optional content fields; no stock or sample images are inserted.

## Stack and features

- React, Vite, React Router, Tailwind CSS, and Framer Motion
- Node.js, Express, Zod validation, Helmet, credentialed CORS, and rate limits
- PostgreSQL with Prisma models and deployable migrations
- Hashed admin passwords and a short-lived, HttpOnly signed cookie; there is no public registration
- Contact messages validated, rate limited, and stored for owner review; no email delivery is configured
- Selected public GitHub repositories fetched from GitHub and cached for five minutes
- OpenAPI / Swagger UI at `/api/docs`; database health at `/api/health`
- API behavior tests and GitHub Actions CI

## Local setup

Requirements: Node.js 20+ and a PostgreSQL database.

1. Create `backend/.env` from `backend/.env.example` and set `DATABASE_URL`, a random `JWT_SECRET` of at least 32 characters, and `CLIENT_URL=http://localhost:5173`.
2. Install dependencies and create the Prisma client:

   ```bash
   npm ci --prefix backend
   npm ci --prefix frontend
   npm --prefix backend run db:generate
   ```

3. Apply the schema and load the existing portfolio content:

   ```bash
   npm --prefix backend run db:migrate:dev -- --name init
   npm --prefix backend run db:seed
   ```

4. For owner access, temporarily set `ADMIN_NAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` in `backend/.env`, then run `npm --prefix backend run admin:create`. Remove the one-time password from the file afterwards.
5. Start the API and frontend in separate terminals:

   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

The Vite development server proxies `/api` to `http://localhost:3000`. Open `http://localhost:5173`; the CMS is at `/admin/login`.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Backend | PostgreSQL connection string; never expose to Vite |
| `PORT` | Backend | API listening port (default `3000`) |
| `CLIENT_URL` | Backend | Exact frontend origin allowed by credentialed CORS |
| `JWT_SECRET` | Backend | Random signing key, at least 32 characters |
| `GITHUB_USERNAME` | Backend | Public account used for GitHub profile/repository reads |
| `GITHUB_TOKEN` | Backend | Optional GitHub API token to raise the API rate limit |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | One-time admin command | Used only by `npm run admin:create`; never add to frontend configuration |
| `VITE_API_URL` | Frontend build | Full API base URL for separate production hosting, e.g. `https://api.example.com/api`; defaults to `/api` locally |

The root, frontend, and backend environment files are ignored by Git. Commit only the example files.

## API

Public endpoints:

```text
GET  /api/health
GET  /api/projects
GET  /api/projects/:slug
GET  /api/skills
GET  /api/experience
GET  /api/education
GET  /api/achievements
POST /api/contact
GET  /api/github/profile
GET  /api/github/repos
```

Admin sign-in uses `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`. Admin content writes use `POST`, `PUT`, and `DELETE /api/{projects|skills|experience|education|achievements}` and require the HttpOnly admin cookie. Message review is at `GET /api/admin/messages` and `PATCH /api/admin/messages/:id`; overview counts are at `GET /api/admin/overview`. Full request and response descriptions are available at `/api/docs`.

## Database, tests, and checks

```bash
npm --prefix backend run db:generate
npm --prefix backend run db:migrate:dev -- --name <migration-name>
npm --prefix backend run db:seed
npm --prefix backend test
npm --prefix backend run lint
npm --prefix frontend run lint
npm --prefix frontend run build
```

Local `db:migrate:dev` creates a versioned migration from the Prisma schema. Production uses `npm --prefix backend run db:migrate` to apply committed migrations. The seed command inserts the existing portfolio projects, skills, education, experience and milestones; it does not create an admin user.

CI runs backend dependency installation, Prisma client generation, syntax checks, API tests, frontend installation, lint, and production build on pushes and pull requests.

## Deployment

The application code is prepared for split hosting, but this repository does not include a configured production API, PostgreSQL instance, or deployment credentials.

- **Frontend:** deploy `frontend` as a Vite site. Set `VITE_API_URL` to the deployed API base ending in `/api` and set the matching frontend origin in the backend's `CLIENT_URL`.
- **Backend:** deploy `backend` to a Node.js host using `npm start`; generate Prisma with `npm run db:generate`, then run `npm run db:migrate` as the release migration step.
- **Database:** provision PostgreSQL and set its connection string only in the backend host's `DATABASE_URL`.
- Set a new `JWT_SECRET` on the backend host. Use HTTPS so the production admin cookie can be marked Secure. Run the seed and one-time admin creation commands against the production database through the host's secure environment, then remove the one-time password variable.

The existing public Vercel URL is listed above; the new API-backed behavior will use production data after the backend and database have been provisioned and `VITE_API_URL` is configured for a frontend deployment.

## Repository layout

```text
frontend/                  React and Vite application
backend/prisma/            PostgreSQL schema, migrations, seed, admin setup
backend/src/                Express routes, controllers, services, middleware
backend/tests/              API behavior tests
.github/workflows/ci.yml    Build and verification workflow
```
