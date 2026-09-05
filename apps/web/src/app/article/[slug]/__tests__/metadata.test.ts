import { describe, expect, it } from 'vitest'
import { generateMetadata } from '../page'

describe('article generateMetadata', () => {
  it('leaves robots unset for an unresolved slug — Next.js auto-injects noindex on notFound()', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'this-slug-does-not-exist' }),
    })
    expect(metadata.robots).toBeUndefined()
  })
})
