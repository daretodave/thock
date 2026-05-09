import { z } from 'zod'
import { IsoDateSchema, SlugSchema } from '@thock/data'

export const NewsletterFrontmatterSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(4).max(200),
  lede: z.string().min(20).max(400),
  issue: z.number().int().positive(),
  publishedAt: IsoDateSchema,
})

export type NewsletterFrontmatter = z.infer<typeof NewsletterFrontmatterSchema>
