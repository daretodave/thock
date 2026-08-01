import { describe, expect, it, vi, beforeEach } from 'vitest'
import { generateMetadata } from '../page'

vi.mock('@/lib/data-runtime', () => ({
  getAllArticles: vi.fn(() => []),
  getAllTrendSnapshots: vi.fn(),
  getTrendSnapshot: vi.fn(),
}))

import { getAllTrendSnapshots, getTrendSnapshot } from '@/lib/data-runtime'

const mockGetAll = getAllTrendSnapshots as ReturnType<typeof vi.fn>
const mockGetOne = getTrendSnapshot as ReturnType<typeof vi.fn>

function snapshot(isoWeek: string) {
  return { isoWeek, publishedAt: '2026-05-01T00:00:00.000Z', rows: [] }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('trends tracker week generateMetadata', () => {
  it('returns empty metadata for an unresolved week', async () => {
    mockGetOne.mockReturnValue(undefined)
    mockGetAll.mockReturnValue([])
    const metadata = await generateMetadata({
      params: Promise.resolve({ week: '2026-W99' }),
    })
    expect(metadata).toEqual({})
  })

  it('canonicalizes the latest week to the evergreen /trends/tracker path', async () => {
    const snapshots = [snapshot('2026-W19'), snapshot('2026-W20')]
    mockGetAll.mockReturnValue(snapshots)
    mockGetOne.mockReturnValue(snapshot('2026-W20'))
    const metadata = await generateMetadata({
      params: Promise.resolve({ week: '2026-W20' }),
    })
    expect(metadata.alternates?.canonical).toBe(
      'https://thock.xyz/trends/tracker',
    )
  })

  it('canonicalizes an archived week to its own path', async () => {
    const snapshots = [snapshot('2026-W19'), snapshot('2026-W20')]
    mockGetAll.mockReturnValue(snapshots)
    mockGetOne.mockReturnValue(snapshot('2026-W19'))
    const metadata = await generateMetadata({
      params: Promise.resolve({ week: '2026-W19' }),
    })
    expect(metadata.alternates?.canonical).toBe(
      'https://thock.xyz/trends/tracker/2026-W19',
    )
  })
})
