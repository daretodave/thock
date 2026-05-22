import type { ResolvedPart } from '@/lib/data-runtime'

export const VALID_KINDS = ['switch', 'keycap-set', 'board'] as const
export type ValidKind = (typeof VALID_KINDS)[number]

export function isValidKind(kind: string): kind is ValidKind {
  return (VALID_KINDS as readonly string[]).includes(kind)
}

export const PRODUCTION_STATUSES = new Set([
  'in-production',
  'in-stock',
  'group-buy',
  'limited',
])

export function sortParts(parts: ResolvedPart[]): ResolvedPart[] {
  return [...parts].sort((a, b) => {
    const aActive = PRODUCTION_STATUSES.has(a.record.status)
    const bActive = PRODUCTION_STATUSES.has(b.record.status)
    if (aActive !== bActive) return aActive ? -1 : 1
    return a.record.name.localeCompare(b.record.name)
  })
}
