import { z } from 'zod'
import { SlugSchema } from '@thock/data'

export const TagCategorySchema = z.enum([
  'switch',
  'layout',
  'brand',
  'material',
  'profile',
  'misc',
])
export type TagCategory = z.infer<typeof TagCategorySchema>

export const TagSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(1).max(60),
  category: TagCategorySchema,
})
export type Tag = z.infer<typeof TagSchema>

export const TagsConfigSchema = z
  .object({
    tags: z.array(TagSchema).min(1),
  })
  .superRefine((cfg, ctx) => {
    const seen = new Set<string>()
    for (const t of cfg.tags) {
      if (seen.has(t.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate tag slug: ${t.slug}`,
          path: ['tags'],
        })
      }
      seen.add(t.slug)
    }
  })
export type TagsConfig = z.infer<typeof TagsConfigSchema>
