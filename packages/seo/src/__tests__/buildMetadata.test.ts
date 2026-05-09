import { describe, expect, it } from 'vitest'
import { buildMetadata } from '../buildMetadata'
import { siteConfig } from '../siteConfig'

describe('buildMetadata', () => {
  it('returns title as { absolute } so the layout template applies exactly once', () => {
    // Regression guard for plan/CRITIQUE.md MED "every page <title>
    // duplicates the site name". The layout's `title.template`
    // applies on nested routes but skips the root segment, so a
    // raw string here yielded "Page — thock — thock" on /news but
    // just "keyboards, deeply." on /. Using { absolute } skips the
    // template entirely and produces consistent single-suffix
    // titles on every page.
    const meta = buildMetadata({
      title: 'News',
      description: 'desc',
      path: '/news',
    })
    expect(meta.title).toEqual({ absolute: `News — ${siteConfig.name}` })
  })

  it('matches the document title across openGraph and twitter slots', () => {
    const meta = buildMetadata({
      title: 'News',
      description: 'desc',
      path: '/news',
    })
    const og = meta.openGraph as { title?: string } | undefined
    const tw = meta.twitter as { title?: string } | undefined
    expect(og?.title).toBe(`News — ${siteConfig.name}`)
    expect(tw?.title).toBe(`News — ${siteConfig.name}`)
  })

  it('sets canonical to the absolute url', () => {
    const meta = buildMetadata({
      title: 'A',
      description: 'b',
      path: '/article/foo',
    })
    expect(meta.alternates?.canonical).toBe(`${siteConfig.url}/article/foo`)
  })

  it('defaults type to website', () => {
    const meta = buildMetadata({
      title: 'A',
      description: 'b',
      path: '/',
    })
    expect((meta.openGraph as { type?: string } | undefined)?.type).toBe(
      'website',
    )
  })

  it('flips openGraph type to "article" when type=article', () => {
    const meta = buildMetadata({
      title: 'Foo',
      description: 'b',
      path: '/article/foo',
      type: 'article',
      publishedAt: '2026-05-08T00:00:00Z',
      author: 'Mara',
    })
    const og = meta.openGraph as Record<string, unknown> | undefined
    expect(og?.['type']).toBe('article')
    expect(og?.['publishedTime']).toBe('2026-05-08T00:00:00Z')
    expect(og?.['authors']).toEqual(['Mara'])
  })

  it('forwards an ogImage to openGraph + twitter', () => {
    const meta = buildMetadata({
      title: 'A',
      description: 'b',
      path: '/',
      ogImage: '/foo.png',
    })
    const og = meta.openGraph as Record<string, unknown> | undefined
    expect(og?.['images']).toEqual([{ url: '/foo.png' }])
    expect(meta.twitter && (meta.twitter as { images?: unknown }).images).toEqual([
      '/foo.png',
    ])
  })

  it('always uses summary_large_image for twitter card', () => {
    const meta = buildMetadata({
      title: 'A',
      description: 'b',
      path: '/',
    })
    expect((meta.twitter as { card?: string } | undefined)?.card).toBe(
      'summary_large_image',
    )
  })
})
