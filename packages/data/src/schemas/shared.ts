import { z } from 'zod'

export const SlugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case (a-z0-9-)')

export const IsoDateSchema = z.string().datetime({ offset: true })

export const DateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')

export const UrlSchema = z.string().url()

export const CountryCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}$/, 'must be ISO 3166-1 alpha-2 (e.g. US, DE)')

export const IsoWeekSchema = z
  .string()
  .regex(
    /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/,
    'must be YYYY-Www (ISO 8601 week, e.g. 2026-W19)',
  )

export const HousingMaterialSchema = z.enum([
  'pc',
  'pom',
  'nylon',
  'pa66',
  'lcp',
  'mixed',
  'unknown',
])

export const StemMaterialSchema = z.enum(['pom', 'pc', 'lcp', 'mixed', 'unknown'])
