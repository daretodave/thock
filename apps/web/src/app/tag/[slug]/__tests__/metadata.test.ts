import { describe, expect, it } from 'vitest'
import { generateMetadata } from '../page'

describe('tag generateMetadata', () => {
  it('marks an unresolved slug non-indexable', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'this-slug-does-not-exist' }),
    })
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})
