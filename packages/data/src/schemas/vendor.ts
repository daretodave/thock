import { z } from 'zod'
import { CountryCodeSchema, IsoDateSchema, SlugSchema, UrlSchema } from './shared'

export const VendorSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(2),
  url: UrlSchema,
  countryCode: CountryCodeSchema,
  description: z.string().min(20).max(600),
  status: z.enum(['active', 'inactive']),
  updatedAt: IsoDateSchema,
})

export type Vendor = z.infer<typeof VendorSchema>
