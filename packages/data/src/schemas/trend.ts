import { z } from 'zod'
import { IsoDateSchema, IsoWeekSchema } from './shared'

export const TrendRowSchema = z.object({
  name: z.string().min(2).max(80),
  category: z.enum(['switch', 'keycap', 'layout', 'vendor', 'brand']),
  direction: z.enum(['up', 'down', 'flat']),
  score: z.number().min(-100).max(100),
  spark: z.array(z.number()).min(2).max(16),
  articleSlug: z.string().min(2).nullable(),
  note: z.string().min(20).max(280).nullable().optional(),
})

export const TrendSnapshotSchema = z.object({
  isoWeek: IsoWeekSchema,
  publishedAt: IsoDateSchema,
  rows: z.array(TrendRowSchema).min(1),
  updatedAt: IsoDateSchema,
})

export type TrendRow = z.infer<typeof TrendRowSchema>
export type TrendSnapshot = z.infer<typeof TrendSnapshotSchema>
