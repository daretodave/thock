import { z } from 'zod'
import { DateOnlySchema, IsoDateSchema, SlugSchema, UrlSchema } from './shared'

export const GroupBuySchema = z
  .object({
    slug: SlugSchema,
    name: z.string().min(2),
    vendorSlug: SlugSchema,
    productSlug: SlugSchema.nullable(),
    productKind: z.enum(['board', 'keycap-set', 'switch', 'other']),
    startDate: DateOnlySchema,
    endDate: DateOnlySchema,
    region: z.enum(['global', 'us', 'eu', 'asia', 'oceania', 'mena']),
    url: UrlSchema,
    imageUrl: UrlSchema.nullable(),
    status: z.enum(['announced', 'live', 'closed', 'shipped']),
    description: z.string().min(20).max(800),
    updatedAt: IsoDateSchema,
  })
  .refine((g) => g.endDate >= g.startDate, {
    message: 'endDate must be on or after startDate',
    path: ['endDate'],
  })
  .refine((g) => !(g.productKind === 'other' && g.productSlug !== null), {
    message: "productSlug must be null when productKind is 'other'",
    path: ['productSlug'],
  })

export type GroupBuy = z.infer<typeof GroupBuySchema>
