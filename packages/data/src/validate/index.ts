import type { Board } from '../schemas/board'
import type { GroupBuy } from '../schemas/group-buy'
import type { KeycapSet } from '../schemas/keycap-set'
import type { Switch } from '../schemas/switch'
import type { TrendSnapshot } from '../schemas/trend'
import type { Vendor } from '../schemas/vendor'
import { checkCrossRefs, type CrossRefError, type RecordSet } from './crossrefs'
import { walkAll, type ParseFailure } from './walk'

export type ValidationError = {
  kind: string
  file?: string
  slug?: string
  field?: string
  message: string
}

export type ValidationResult = {
  ok: boolean
  errors: ValidationError[]
  counts: Record<string, number>
}

const KIND_TO_BUCKET: Record<string, keyof RecordSet> = {
  vendors: 'vendors',
  switches: 'switches',
  'keycap-sets': 'keycapSets',
  boards: 'boards',
  'group-buys': 'groupBuys',
  trends: 'trends',
}

/**
 * Walks /data/, validates every record against its schema, then
 * checks cross-references. Optionally takes a synthetic record set
 * (tests use this).
 */
export function validateAll(input?: { records: Partial<RecordSet> }): ValidationResult {
  const errors: ValidationError[] = []
  const counts: Record<string, number> = {}

  let records: RecordSet
  if (input?.records) {
    records = {
      vendors: input.records.vendors ?? [],
      switches: input.records.switches ?? [],
      keycapSets: input.records.keycapSets ?? [],
      boards: input.records.boards ?? [],
      groupBuys: input.records.groupBuys ?? [],
      trends: input.records.trends ?? [],
    }
  } else {
    const { parsed, failures } = walkAll()
    for (const f of failures) {
      errors.push({
        kind: f.kind,
        file: f.file,
        field: f.path,
        message: f.message,
      })
    }

    const buckets: RecordSet = {
      vendors: [],
      switches: [],
      keycapSets: [],
      boards: [],
      groupBuys: [],
      trends: [],
    }
    for (const rec of parsed) {
      const bucketKey = KIND_TO_BUCKET[rec.kind]
      if (!bucketKey) continue
      const data = rec.data as { slug?: string; isoWeek?: string }
      // Filename ↔ identity check.
      const expected = data.slug ?? data.isoWeek
      if (expected && expected !== rec.baseName) {
        errors.push({
          kind: rec.kind,
          file: rec.file,
          slug: expected,
          message: `filename "${rec.baseName}" does not match record identity "${expected}"`,
        })
        continue
      }
      // Push the data into the right bucket. Type narrowing is by kind.
      if (bucketKey === 'vendors') buckets.vendors.push(rec.data as Vendor)
      else if (bucketKey === 'switches') buckets.switches.push(rec.data as Switch)
      else if (bucketKey === 'keycapSets') buckets.keycapSets.push(rec.data as KeycapSet)
      else if (bucketKey === 'boards') buckets.boards.push(rec.data as Board)
      else if (bucketKey === 'groupBuys') buckets.groupBuys.push(rec.data as GroupBuy)
      else if (bucketKey === 'trends') buckets.trends.push(rec.data as TrendSnapshot)
    }
    records = buckets
  }

  const crossErrors = checkCrossRefs(records)
  for (const e of crossErrors) {
    errors.push({
      kind: e.kind,
      slug: e.slug,
      field: e.field,
      message: e.message,
    })
  }

  counts['vendors'] = records.vendors.length
  counts['switches'] = records.switches.length
  counts['keycap-sets'] = records.keycapSets.length
  counts['boards'] = records.boards.length
  counts['group-buys'] = records.groupBuys.length
  counts['trends'] = records.trends.length

  return { ok: errors.length === 0, errors, counts }
}

export type { ParseFailure, CrossRefError, RecordSet }
