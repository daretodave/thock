import { describe, expect, it } from 'vitest'
import { getReferencedParts } from '../../loaders/parts'
import type { Article } from '../../loaders/articles'

function makeArticle(
  mentionedParts: Array<{ id: string; kind: 'switch' | 'keycap-set' | 'board'; slug: string }>,
): Article {
  return { frontmatter: { mentionedParts } } as unknown as Article
}

describe('getReferencedParts', () => {
  it('returns empty array for no mentionedParts', () => {
    expect(getReferencedParts(makeArticle([]))).toEqual([])
  })

  it('resolves a switch ref using a known seed slug', () => {
    const result = getReferencedParts(
      makeArticle([{ id: 'oil-king', kind: 'switch', slug: 'gateron-oil-king' }]),
    )
    expect(result).toHaveLength(1)
    const [part] = result
    expect(part).toMatchObject({ id: 'oil-king', kind: 'switch', slug: 'gateron-oil-king' })
    expect(part?.record).toBeDefined()
  })

  it('resolves a keycap-set ref using a known seed slug', () => {
    const result = getReferencedParts(
      makeArticle([{ id: 'olivia', kind: 'keycap-set', slug: 'gmk-olivia' }]),
    )
    expect(result).toHaveLength(1)
    const [part] = result
    expect(part).toMatchObject({ id: 'olivia', kind: 'keycap-set', slug: 'gmk-olivia' })
    expect(part?.record).toBeDefined()
  })

  it('resolves a board ref using a known seed slug', () => {
    const result = getReferencedParts(
      makeArticle([{ id: 'sonnet', kind: 'board', slug: 'mode-sonnet' }]),
    )
    expect(result).toHaveLength(1)
    const [part] = result
    expect(part).toMatchObject({ id: 'sonnet', kind: 'board', slug: 'mode-sonnet' })
    expect(part?.record).toBeDefined()
  })

  it('drops refs whose slug does not resolve', () => {
    const result = getReferencedParts(
      makeArticle([{ id: 'ghost', kind: 'switch', slug: 'does-not-exist' }]),
    )
    expect(result).toHaveLength(0)
  })

  it('preserves frontmatter order and drops unresolvable entries', () => {
    const result = getReferencedParts(
      makeArticle([
        { id: 'a', kind: 'board', slug: 'mode-sonnet' },
        { id: 'b', kind: 'switch', slug: 'ghost-slug' },
        { id: 'c', kind: 'switch', slug: 'gateron-oil-king' },
      ]),
    )
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ id: 'a', kind: 'board' })
    expect(result[1]).toMatchObject({ id: 'c', kind: 'switch' })
  })
})
