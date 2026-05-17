import { afterEach, describe, expect, it } from 'vitest'
import { getAllBoards, getBoardBySlug } from '../../loaders/boards'
import { __resetForTests } from '../../loaders/memo'

describe('boards loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed board', () => {
    const all = getAllBoards()
    expect(all.length).toBeGreaterThanOrEqual(1)
    expect(all.map((b) => b.slug)).toContain('mode-sonnet')
  })

  it('returns sorted-by-slug order', () => {
    const slugs = getAllBoards().map((b) => b.slug)
    const sorted = [...slugs].sort()
    expect(slugs).toEqual(sorted)
  })

  it('resolves a known slug', () => {
    const board = getBoardBySlug('mode-sonnet')
    expect(board?.name).toBe('Mode Sonnet')
  })

  it('returns null for an unknown slug', () => {
    expect(getBoardBySlug('does-not-exist')).toBeNull()
  })
})
