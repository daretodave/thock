import { describe, expect, it } from 'vitest'
import { TagsConfigSchema } from '../../schema/tags'

describe('TagsConfigSchema', () => {
  it('accepts a valid taxonomy', () => {
    const result = TagsConfigSchema.safeParse({
      tags: [
        { slug: 'linear', name: 'Linear', category: 'switch' },
        { slug: 'pbt', name: 'PBT', category: 'material' },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('rejects an unknown category', () => {
    const result = TagsConfigSchema.safeParse({
      tags: [{ slug: 'linear', name: 'Linear', category: 'genre' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate slugs', () => {
    const result = TagsConfigSchema.safeParse({
      tags: [
        { slug: 'linear', name: 'Linear', category: 'switch' },
        { slug: 'linear', name: 'Linear (dup)', category: 'switch' },
      ],
    })
    expect(result.success).toBe(false)
  })
})
