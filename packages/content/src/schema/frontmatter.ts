import { z } from 'zod'
import { IsoDateSchema, SlugSchema } from '@thock/data'

export const PillarSchema = z.enum([
  'news',
  'trends',
  'ideas',
  'deep-dives',
  'guides',
])
export type Pillar = z.infer<typeof PillarSchema>

export const PartReferenceSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['switch', 'keycap-set', 'board']),
  slug: SlugSchema,
})
export type ArticlePartReference = z.infer<typeof PartReferenceSchema>

export const ArticleFrontmatterSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(4).max(200),
  lede: z.string().min(20).max(400),
  author: z.string().min(2),
  pillar: PillarSchema,
  tags: z.array(z.string()).min(1).max(8),
  publishedAt: IsoDateSchema,
  updatedAt: IsoDateSchema.nullable().default(null),
  heroImage: z
    .string()
    .min(1)
    .refine(
      (v) => v.startsWith('/') || /^https?:\/\//.test(v),
      'heroImage must be an absolute path (starts with /) or a full URL',
    )
    .nullable()
    .default(null),
  heroImageAlt: z.string().min(2).nullable().default(null),
  featured: z.boolean().default(false),
  popularityScore: z.number().min(0).max(100).default(0),
  guideSection: z
    .enum(['firmware', 'modding', 'switches', 'keycaps'])
    .nullable()
    .default(null),
  mentionedParts: z.array(PartReferenceSchema).default([]),
})

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>
