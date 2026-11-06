import { z } from 'zod'
import {
  DateOnlySchema,
  HousingMaterialSchema,
  IsoDateSchema,
  SlugSchema,
  StemMaterialSchema,
} from './shared'

export const SwitchSchema = z
  .object({
    slug: SlugSchema,
    name: z.string().min(2),
    vendorSlug: SlugSchema,
    type: z.enum(['linear', 'tactile', 'clicky', 'silent-linear', 'silent-tactile']),
    housingTop: HousingMaterialSchema,
    housingBottom: HousingMaterialSchema,
    stem: StemMaterialSchema,
    springGrams: z
      .object({
        actuation: z.number().positive().max(200),
        bottomOut: z.number().positive().max(200),
      })
      .strict(),
    travelMm: z.number().positive().max(10),
    /**
     * How the switch detects a press. Orthogonal to `type` (feel):
     * a hall-effect or TMR switch can still be linear or tactile.
     * Defaults to `mechanical` so every pre-existing record (plain
     * contact switches) stays valid without a backfill. Spec 03.
     */
    sensing: z
      .enum(['mechanical', 'hall-effect', 'tmr', 'optical'])
      .default('mechanical'),
    /**
     * Adjustable actuation point range in mm, for hall-effect/TMR
     * switches with magnetic (rather than fixed mechanical) travel.
     * Optional — fixed-actuation and mechanical switches omit it.
     * Rapid-trigger and force-curve data are out of scope (spec 03
     * Design section); this is only the min/max actuation window.
     */
    actuationRangeMm: z
      .object({
        min: z.number().positive().max(10),
        max: z.number().positive().max(10),
      })
      .strict()
      .refine((r) => r.min <= r.max, {
        message: 'min must be less than or equal to max',
        path: ['min'],
      })
      .optional(),
    factoryLubed: z.boolean(),
    releasedAt: DateOnlySchema.nullable(),
    status: z.enum(['in-production', 'discontinued', 'limited']),
    description: z.string().min(20).max(800),
    updatedAt: IsoDateSchema,
  })
  .strict()

export type Switch = z.infer<typeof SwitchSchema>
