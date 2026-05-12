import { describe, expect, it } from 'vitest'
import { groupTagsByCategory, CATEGORY_ORDER } from '../TagsIndex'
import type { Tag } from '@thock/content'

const makeTags = (): Tag[] => [
  { slug: 'linear', name: 'Linear', category: 'switch' },
  { slug: 'tactile', name: 'Tactile', category: 'switch' },
  { slug: '65', name: '65%', category: 'layout' },
  { slug: 'gateron', name: 'Gateron', category: 'brand' },
  { slug: 'pbt', name: 'PBT', category: 'material' },
  { slug: 'mt3', name: 'MT3', category: 'profile' },
  { slug: 'group-buy', name: 'Group buy', category: 'misc' },
]

describe('groupTagsByCategory', () => {
  it('puts tags into the correct category bucket', () => {
    const groups = groupTagsByCategory(makeTags())
    expect(groups.get('switch')).toHaveLength(2)
    expect(groups.get('layout')).toHaveLength(1)
    expect(groups.get('brand')).toHaveLength(1)
    expect(groups.get('material')).toHaveLength(1)
    expect(groups.get('profile')).toHaveLength(1)
    expect(groups.get('misc')).toHaveLength(1)
  })

  it('produces keys for every category in CATEGORY_ORDER even when empty', () => {
    const groups = groupTagsByCategory([])
    for (const cat of CATEGORY_ORDER) {
      expect(groups.has(cat)).toBe(true)
      expect(groups.get(cat)).toHaveLength(0)
    }
  })

  it('falls back unknown categories to misc', () => {
    const tags: Tag[] = [
      { slug: 'weird', name: 'Weird', category: 'misc' },
    ]
    const groups = groupTagsByCategory(tags)
    expect(groups.get('misc')).toContainEqual(
      expect.objectContaining({ slug: 'weird' }),
    )
  })

  it('preserves insertion order within a bucket', () => {
    const groups = groupTagsByCategory(makeTags())
    const switchTags = groups.get('switch') ?? []
    expect(switchTags[0]?.slug).toBe('linear')
    expect(switchTags[1]?.slug).toBe('tactile')
  })
})

describe('CATEGORY_ORDER', () => {
  it('starts with switch and ends with misc', () => {
    expect(CATEGORY_ORDER[0]).toBe('switch')
    expect(CATEGORY_ORDER[CATEGORY_ORDER.length - 1]).toBe('misc')
  })

  it('has 6 categories', () => {
    expect(CATEGORY_ORDER).toHaveLength(6)
  })
})
