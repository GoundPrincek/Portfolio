import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { projects } from '../../frontend/src/data/projects.js'
import { skillRows } from '../../frontend/src/data/skills.js'
import { journey } from '../../frontend/src/data/journey.js'
import { achievements } from '../../frontend/src/data/achievements.js'

const prisma = new PrismaClient()

try {
  for (const [index, project] of projects.entries()) {
    const data = {
      title: project.name,
      subtitle: project.title,
      localName: project.localName || null,
      tagline: project.tagline || null,
      slug: project.id,
      shortDescription: project.summary,
      description: project.overview,
      problem: project.problem,
      solution: project.solution,
      architecture: project.architecture,
      designQuestion: project.designQuestion,
      learned: project.learned,
      contribution: index === 0 ? 'Building the salary, budget, expense, goals, tasks, and analytics flows across the React interface and modular backend.' : null,
      kind: project.kind,
      status: project.status,
      technologies: project.technologies,
      features: project.features,
      githubUrl: project.repository,
      liveUrl: project.live || null,
      imageUrl: null,
      galleryUrls: [],
      featured: index === 0,
      sortOrder: index,
    }
    await prisma.project.upsert({ where: { slug: project.id }, create: data, update: data })
  }

  let skillOrder = 0
  for (const row of skillRows) {
    for (const name of row.items) {
      const data = { name, category: row.label, level: 'Practicing', sortOrder: skillOrder++ }
      await prisma.skill.upsert({ where: { name_category: { name, category: row.label } }, create: data, update: data })
    }
  }

  for (const [index, item] of journey.entries()) {
    const data = {
      title: item.title,
      organization: item.category === 'Professional experience' ? item.title : item.category,
      description: item.description,
      learned: item.learned,
      related: item.related,
      category: item.id === 'education' ? 'Education' : item.category,
      period: item.period,
      year: item.year || null,
      sortOrder: index,
    }
    const existing = await prisma.experience.findFirst({ where: { title: item.title } })
    if (existing) await prisma.experience.update({ where: { id: existing.id }, data })
    else await prisma.experience.create({ data })
  }

  const educationData = {
    institution: "Vidyavardhini's College of Engineering and Technology",
    degree: 'Engineering Student',
    field: 'Information Technology',
    description: 'IT Engineering · 2024–2028',
    sortOrder: 0,
  }
  const existingEducation = await prisma.education.findFirst({ where: { institution: educationData.institution } })
  if (existingEducation) await prisma.education.update({ where: { id: existingEducation.id }, data: educationData })
  else await prisma.education.create({ data: educationData })

  for (const [index, item] of achievements.entries()) {
    const data = {
      title: item.title,
      category: item.category,
      description: `${item.did} ${item.learned.join(' · ')}`,
      url: null,
      sortOrder: index,
    }
    const existing = await prisma.achievement.findFirst({ where: { title: item.title } })
    if (existing) await prisma.achievement.update({ where: { id: existing.id }, data })
    else await prisma.achievement.create({ data })
  }

  console.info(`Seeded ${projects.length} projects, ${skillOrder} skills, ${journey.length} experiences, 1 education record, ${achievements.length} achievements.`)
} catch (error) {
  console.error('Database seed failed:', error.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
