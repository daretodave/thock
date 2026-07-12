import { describe, expect, it } from 'vitest'
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildWebSiteJsonLd,
} from '../buildJsonLd'
import { siteConfig } from '../siteConfig'

describe('buildWebSiteJsonLd', () => {
  it('builds a WebSite graph with publisher', () => {
    const ld = buildWebSiteJsonLd()
    expect(ld['@type']).toBe('WebSite')
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld.url).toBe(siteConfig.url)
    expect(ld.publisher).toEqual(siteConfig.publisher)
  })
})

describe('buildArticleJsonLd', () => {
  const base = {
    headline: 'Foo',
    description: 'lede',
    path: '/article/foo',
    publishedAt: '2026-05-01T12:00:00Z',
    author: 'Mara',
  }

  it('builds an Article graph', () => {
    const ld = buildArticleJsonLd(base)
    expect(ld['@type']).toBe('Article')
    expect(ld.headline).toBe('Foo')
    expect(ld.url).toBe(`${siteConfig.url}/article/foo`)
    expect(ld.mainEntityOfPage).toBe(`${siteConfig.url}/article/foo`)
    expect(ld.author).toEqual({ '@type': 'Person', name: 'Mara' })
  })

  it('falls back dateModified to publishedAt when updatedAt is absent', () => {
    const ld = buildArticleJsonLd(base)
    expect(ld.dateModified).toBe('2026-05-01T12:00:00Z')
  })

  it('uses updatedAt for dateModified when provided', () => {
    const ld = buildArticleJsonLd({
      ...base,
      updatedAt: '2026-05-08T12:00:00Z',
    })
    expect(ld.dateModified).toBe('2026-05-08T12:00:00Z')
  })

  it('includes image only when heroImage is set, pointing at the rendered OG PNG route', () => {
    const without = buildArticleJsonLd(base)
    expect(without.image).toBeUndefined()
    const withImg = buildArticleJsonLd({
      ...base,
      heroImage: '/hero-art/foo.svg',
    })
    expect(withImg.image).toBe(
      `${siteConfig.url}/article/foo/opengraph-image/og`,
    )
  })

  it('accepts a boolean heroImage for callers with no frontmatter hero art but a guaranteed OG route', () => {
    const ld = buildArticleJsonLd({ ...base, heroImage: true })
    expect(ld.image).toBe(`${siteConfig.url}/article/foo/opengraph-image/og`)
  })
})

describe('buildBreadcrumbListJsonLd', () => {
  it('emits ListItems with positions and absolute item urls', () => {
    const ld = buildBreadcrumbListJsonLd([
      { name: 'Home', path: '/' },
      { name: 'News', path: '/news' },
      { name: 'Foo', path: '/article/foo' },
    ])
    expect(ld['@type']).toBe('BreadcrumbList')
    const items = ld.itemListElement as Array<Record<string, unknown>>
    expect(items.map((i) => i['position'])).toEqual([1, 2, 3])
    expect(items[0]?.['item']).toBe(siteConfig.url)
    expect(items[1]?.['item']).toBe(`${siteConfig.url}/news`)
    expect(items[2]?.['item']).toBe(`${siteConfig.url}/article/foo`)
  })
})

describe('buildCollectionPageJsonLd', () => {
  it('builds a CollectionPage graph', () => {
    const ld = buildCollectionPageJsonLd({
      name: 'News',
      description: 'desc',
      path: '/news',
    })
    expect(ld['@type']).toBe('CollectionPage')
    expect(ld.url).toBe(`${siteConfig.url}/news`)
    expect((ld.isPartOf as Record<string, unknown>)['@type']).toBe('WebSite')
  })
})

describe('buildItemListJsonLd', () => {
  it('emits a numbered ListItem for each entry with absolute urls', () => {
    const ld = buildItemListJsonLd({
      name: 'Latest by pillar',
      items: [
        { name: 'A', path: '/article/a' },
        { name: 'B', path: '/article/b' },
      ],
    })
    expect(ld['@type']).toBe('ItemList')
    expect(ld.name).toBe('Latest by pillar')
    const items = ld.itemListElement as Array<Record<string, unknown>>
    expect(items.map((i) => i['position'])).toEqual([1, 2])
    expect(items[0]?.['url']).toBe(`${siteConfig.url}/article/a`)
    expect(items[1]?.['name']).toBe('B')
  })

  it('omits the name field when not provided', () => {
    const ld = buildItemListJsonLd({
      items: [{ name: 'Only', path: '/only' }],
    })
    expect(ld.name).toBeUndefined()
  })

  it('includes sameAs in ListItem when entry carries it', () => {
    const ld = buildItemListJsonLd({
      items: [
        {
          name: 'Mode Sonnet R2',
          url: 'https://cannonkeys.com/products/mode-sonnet-r2',
          sameAs: `${siteConfig.url}/article/mode-sonnet-r2-group-buy-coverage`,
        },
      ],
    })
    const items = ld.itemListElement as Array<Record<string, unknown>>
    expect(items[0]?.['sameAs']).toBe(
      `${siteConfig.url}/article/mode-sonnet-r2-group-buy-coverage`,
    )
  })

  it('omits sameAs from ListItem when entry does not carry it', () => {
    const ld = buildItemListJsonLd({
      items: [{ name: 'No link', path: '/group-buys' }],
    })
    const items = ld.itemListElement as Array<Record<string, unknown>>
    expect(items[0]).not.toHaveProperty('sameAs')
  })
})
