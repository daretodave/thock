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
    /**
     * Path to the loop-generated hero SVG under
     * `apps/web/public/group-buy-art/<vendor>-<slug>.svg`. Distinct
     * from `imageUrl` (which is vendor-supplied product imagery).
     * Phase 23 / bearings.md "Group-buy hero art" rule (locked
     * 2026-05-10): every group buy renders a colorful hero SVG.
     * Nullable so partial backfill never blocks a green build —
     * render surfaces fall back to a coral-tinted placeholder block
     * when the field is null.
     */
    heroImage: z.string().nullable(),
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
