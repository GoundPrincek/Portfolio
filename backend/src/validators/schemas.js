import { z } from 'zod'

const url = z.string().url().max(2048).or(z.literal('')).transform((value) => value || null)
const text = (max = 5000) => z.string().trim().min(1).max(max)
const optionalText = (max = 5000) => z.string().trim().max(max).optional().default('')
const stringList = z.array(z.string().trim().min(1).max(80)).max(40)
const date = z.string().datetime().or(z.literal('')).transform((value) => value ? new Date(value) : null).optional()
const order = z.coerce.number().int().min(0).max(9999).default(0)

export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(200) })
export const contactSchema = z.object({
  name: text(100), email: z.string().trim().email().max(254), subject: optionalText(160),
  message: text(5000).refine((value) => value.length >= 10, 'Message is too short.'), website: optionalText(300),
})

export const projectSchema = z.object({
  title: text(120), slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  subtitle: optionalText(180), localName: optionalText(80), tagline: optionalText(180),
  shortDescription: text(400), description: text(5000), problem: text(5000), solution: text(5000),
  architecture: text(5000), designQuestion: optionalText(2000), learned: optionalText(2000), contribution: optionalText(2000),
  kind: text(120), status: text(80), technologies: stringList, features: stringList,
  githubUrl: z.string().url().max(2048), liveUrl: url.optional(), imageUrl: url.optional(),
  galleryUrls: z.array(z.string().url().max(2048)).max(12).default([]), featured: z.boolean().default(false), sortOrder: order,
})
export const skillSchema = z.object({ name: text(80), category: text(80), level: text(80).default('Practicing'), sortOrder: order })
export const experienceSchema = z.object({
  title: text(160), organization: text(160), description: text(5000), learned: optionalText(2000), related: optionalText(300),
  category: text(100), period: text(100), year: optionalText(12), startDate: date, endDate: date,
  location: optionalText(160), sortOrder: order,
})
export const educationSchema = z.object({
  institution: text(200), degree: text(120), field: text(120), startDate: date, endDate: date,
  description: text(3000), sortOrder: order,
})
export const achievementSchema = z.object({
  title: text(160), category: text(100), description: text(3000), date, url: url.optional(), sortOrder: order,
})
export const messageStatusSchema = z.object({ status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']) })
