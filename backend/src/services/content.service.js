import { AppError } from '../utils/errors.js'

export const projectView = (project, index = 0) => ({
  id: project.slug,
  slug: project.slug,
  index: String(index + 1).padStart(2, '0'),
  name: project.title,
  title: project.subtitle || project.title,
  localName: project.localName,
  tagline: project.tagline,
  summary: project.shortDescription,
  overview: project.description,
  problem: project.problem,
  solution: project.solution,
  architecture: project.architecture,
  designQuestion: project.designQuestion,
  learned: project.learned,
  contribution: project.contribution,
  kind: project.kind,
  status: project.status,
  technologies: project.technologies,
  features: project.features,
  repository: project.githubUrl,
  live: project.liveUrl,
  imageUrl: project.imageUrl,
  galleryUrls: project.galleryUrls,
  featured: project.featured,
})

export const experienceView = (item) => ({
  id: item.id,
  title: item.title,
  organization: item.organization,
  description: item.description,
  learned: item.learned,
  related: item.related,
  category: item.category,
  period: item.period,
  year: item.year,
  startDate: item.startDate,
  endDate: item.endDate,
  location: item.location,
})

const collections = {
  projects: { model: 'project', orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
  skills: { model: 'skill', orderBy: [{ sortOrder: 'asc' }, { category: 'asc' }, { name: 'asc' }] },
  experience: { model: 'experience', orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
  education: { model: 'education', orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
  achievements: { model: 'achievement', orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
}

export async function listContent(prisma, collection) {
  const config = collections[collection]
  const items = await prisma[config.model].findMany({ orderBy: config.orderBy })
  if (collection === 'projects') return items.map(projectView)
  if (collection === 'experience') return items.map(experienceView)
  return items
}

export async function getProjectBySlug(prisma, slug) {
  const item = await prisma.project.findUnique({ where: { slug } })
  if (!item) throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found.')
  return projectView(item)
}

export function getCollectionConfig(collection) {
  const config = collections[collection]
  if (!config) throw new AppError(404, 'NOT_FOUND', 'The requested resource was not found.')
  return config
}
