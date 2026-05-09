import { z } from 'zod'
import { DateOnlySchema, IsoDateSchema, SlugSchema, UrlSchema } from './shared'

export const BoardSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(2),
  vendorSlug: SlugSchema,
  layout: z.enum(['tkl', '60', '65', '75', 'full', 'alice', 'split', 'ortho', 'other']),
  caseMaterial: z.enum([
    'aluminum',
    'polycarbonate',
    'wood',
    'fr4',
    'plastic',
    'mixed',
  ]),
  mountStyle: z.enum([
    'gasket',
    'top-mount',
    'tray-mount',
    'integrated-plate',
    'leaf-spring',
    'pcb-mount',
  ]),
  hotswap: z.boolean(),
  wireless: z.boolean(),
  releasedAt: DateOnlySchema.nullable(),
  status: z.enum(['in-stock', 'group-buy', 'discontinued']),
  imageUrl: UrlSchema.nullable(),
  description: z.string().min(20).max(800),
  updatedAt: IsoDateSchema,
})

export type Board = z.infer<typeof BoardSchema>
