import { z } from 'zod'
import { DateOnlySchema, IsoDateSchema, SlugSchema, UrlSchema } from './shared'

export const KeycapSetSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(2),
  vendorSlug: SlugSchema,
  profile: z.enum(['cherry', 'oem', 'mt3', 'sa', 'kat', 'kam', 'xda', 'dsa']),
  material: z.enum(['abs', 'pbt', 'resin', 'mixed']),
  legendType: z.enum(['doubleshot', 'dye-sub', 'pad-printed', 'engraved', 'blank']),
  designer: z.string().min(1).nullable(),
  releasedAt: DateOnlySchema.nullable(),
  status: z.enum(['in-stock', 'sold-out', 'group-buy', 'discontinued']),
  imageUrl: UrlSchema.nullable(),
  description: z.string().min(20).max(800),
  updatedAt: IsoDateSchema,
})

export type KeycapSet = z.infer<typeof KeycapSetSchema>
