import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getAdjacentWeeks } from '../helpers'

vi.mock('@/lib/data-runtime', () => ({
  getAllTrendSnapshots: vi.fn(),
}))

import { getAllTrendSnapshots } from '@/lib/data-runtime'

const mockGetAll = getAllTrendSnapshots as ReturnType<typeof vi.fn>

function snapshot(isoWeek: string) {
  return { isoWeek, publishedAt: '2026-05-01T00:00:00.000Z', rows: [] }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getAdjacentWeeks', () => {
  it('returns both null for an empty snapshot list', () => {
    mockGetAll.mockReturnValue([])
    expect(getAdjacentWeeks('2026-W21')).toEqual({ prev: null, next: null })
  })

  it('returns both null when only one snapshot exists', () => {
    mockGetAll.mockReturnValue([snapshot('2026-W21')])
    expect(getAdjacentWeeks('2026-W21')).toEqual({ prev: null, next: null })
  })

  it('returns prev=null for the first week in the list', () => {
    mockGetAll.mockReturnValue([
      snapshot('2026-W19'),
      snapshot('2026-W20'),
      snapshot('2026-W21'),
    ])
    expect(getAdjacentWeeks('2026-W19')).toEqual({
      prev: null,
      next: '2026-W20',
    })
  })

  it('returns next=null for the last week in the list', () => {
    mockGetAll.mockReturnValue([
      snapshot('2026-W19'),
      snapshot('2026-W20'),
      snapshot('2026-W21'),
    ])
    expect(getAdjacentWeeks('2026-W21')).toEqual({
      prev: '2026-W20',
      next: null,
    })
  })

  it('returns both neighbours for a middle week', () => {
    mockGetAll.mockReturnValue([
      snapshot('2026-W19'),
      snapshot('2026-W20'),
      snapshot('2026-W21'),
    ])
    expect(getAdjacentWeeks('2026-W20')).toEqual({
      prev: '2026-W19',
      next: '2026-W21',
    })
  })
})
