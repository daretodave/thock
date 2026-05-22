import { describe, expect, it } from 'vitest'
import type { ResolvedPart } from '@/lib/data-runtime'
import { isValidKind, sortParts } from '../helpers'

function makePart(
  name: string,
  status: string,
  kind: 'switch' | 'keycap-set' | 'board' = 'switch',
): ResolvedPart {
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  return { id: `${kind}:${slug}`, kind, slug, record: { slug, name, status } } as unknown as ResolvedPart
}

describe('isValidKind', () => {
  it('returns true for the three valid kinds', () => {
    expect(isValidKind('switch')).toBe(true)
    expect(isValidKind('keycap-set')).toBe(true)
    expect(isValidKind('board')).toBe(true)
  })

  it('returns false for unknown strings', () => {
    expect(isValidKind('foo')).toBe(false)
    expect(isValidKind('')).toBe(false)
    expect(isValidKind('Switch')).toBe(false)
    expect(isValidKind('switches')).toBe(false)
  })
})

describe('sortParts', () => {
  it('returns an empty array unchanged', () => {
    expect(sortParts([])).toEqual([])
  })

  it('places active-status parts before inactive ones', () => {
    const active = makePart('Alpha', 'in-production')
    const inactive = makePart('Beta', 'discontinued')
    expect(sortParts([inactive, active]).map((p) => p.record.name)).toEqual([
      'Alpha',
      'Beta',
    ])
  })

  it('sorts alphabetically within the active group', () => {
    const charlie = makePart('Charlie', 'in-stock', 'keycap-set')
    const alpha = makePart('Alpha', 'group-buy', 'keycap-set')
    const bravo = makePart('Bravo', 'limited')
    expect(sortParts([charlie, alpha, bravo]).map((p) => p.record.name)).toEqual([
      'Alpha',
      'Bravo',
      'Charlie',
    ])
  })

  it('sorts alphabetically within the inactive group', () => {
    const zulu = makePart('Zulu', 'discontinued', 'board')
    const mike = makePart('Mike', 'discontinued', 'board')
    expect(sortParts([zulu, mike]).map((p) => p.record.name)).toEqual([
      'Mike',
      'Zulu',
    ])
  })

  it('recognises all four production statuses as active', () => {
    const inactive = makePart('Inactive', 'discontinued')
    const inProduction = makePart('InProduction', 'in-production')
    const inStock = makePart('InStock', 'in-stock', 'keycap-set')
    const groupBuy = makePart('GroupBuy', 'group-buy', 'keycap-set')
    const limited = makePart('Limited', 'limited')
    const result = sortParts([inactive, inProduction, inStock, groupBuy, limited])
    expect(result[result.length - 1]?.record.name).toBe('Inactive')
  })

  it('does not mutate the input array', () => {
    const a = makePart('Alpha', 'discontinued')
    const b = makePart('Beta', 'in-production')
    const input = [a, b]
    sortParts(input)
    expect(input.map((p) => p.record.name)).toEqual(['Alpha', 'Beta'])
  })
})
