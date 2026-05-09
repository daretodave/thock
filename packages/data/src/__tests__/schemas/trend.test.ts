import { describe, expect, it } from 'vitest'
import { TrendSnapshotSchema } from '../../schemas/trend'

const VALID = {
  isoWeek: '2026-W19',
  publishedAt: '2026-05-08T00:00:00.000Z',
  rows: [
    {
      name: 'Gateron Oil King',
      category: 'switch' as const,
      direction: 'up' as const,
      score: 42,
      spark: [10, 20, 30, 42],
      articleSlug: null,
    },
  ],
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('TrendSnapshotSchema', () => {
  it('accepts a valid snapshot', () => {
    expect(TrendSnapshotSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects a malformed isoWeek', () => {
    expect(TrendSnapshotSchema.safeParse({ ...VALID, isoWeek: '2026-19' }).success).toBe(
      false,
    )
  })

  it('rejects an empty rows array', () => {
    expect(TrendSnapshotSchema.safeParse({ ...VALID, rows: [] }).success).toBe(false)
  })

  it('rejects a score outside [-100, 100]', () => {
    const result = TrendSnapshotSchema.safeParse({
      ...VALID,
      rows: [{ ...VALID.rows[0], score: 250 }],
    })
    expect(result.success).toBe(false)
  })
})
