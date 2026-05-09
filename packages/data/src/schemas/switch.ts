import { z } from 'zod'
import {
  DateOnlySchema,
  HousingMaterialSchema,
  IsoDateSchema,
  SlugSchema,
  StemMaterialSchema,
} from './shared'

export const SwitchSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(2),
  vendorSlug: SlugSchema,
  type: z.enum(['linear', 'tactile', 'clicky', 'silent-linear', 'silent-tactile']),
  housingTop: HousingMaterialSchema,
  housingBottom: HousingMaterialSchema,
  stem: StemMaterialSchema,
  springGrams: z.object({
    actuation: z.number().positive().max(200),
    bottomOut: z.number().positive().max(200),
  }),
  travelMm: z.number().positive().max(10),
  factoryLubed: z.boolean(),
  releasedAt: DateOnlySchema.nullable(),
  status: z.enum(['in-production', 'discontinued', 'limited']),
  description: z.string().min(20).max(800),
  updatedAt: IsoDateSchema,
})

export type Switch = z.infer<typeof SwitchSchema>
