import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import {
  buildCitationIndex,
  CitationIndex,
  type CitationRecord,
} from '../CitationIndex'

function articleFixture(over: Partial<Article['frontmatter']> = {}): Article {
  const slug = over.slug ?? 'sample'
  return {
    slug,
    frontmatter: {
      slug,
      title: 'Sample article',
      lede: 'A lede long enough to satisfy the schema minimum length.',
      description: null,
      author: 'thock',
      pillar: 'news',
      tags: ['group-buy'],
      publishedAt: '2026-05-01T00:00:00.000Z',
      updatedAt: null,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection: null,
      mentionedParts: [],
      ...over,
    },
    body: 'Body',
    readTime: 1,
    filePath: `/fake/${slug}.mdx`,
  }
}

function cite(href: string, text: string | null = null, position = 0) {
  return { href, text, position }
}

describe('buildCitationIndex()', () => {
  it('returns an empty array for an empty input', () => {
    expect(buildCitationIndex([])).toEqual([])
  })

  it('returns one record for a single citation pair', () => {
    const article = articleFixture({ slug: 'article-a' })
    const result = buildCitationIndex([
      { article, citation: cite('https://example.com/page', 'Example page') },
    ])
    expect(result).toHaveLength(1)
    const [rec] = result
    expect(rec!.href).toBe('https://example.com/page')
    expect(rec!.text).toBe('Example page')
    expect(rec!.articles).toHaveLength(1)
    expect(rec!.articles[0]!.slug).toBe('article-a')
  })

  it('deduplicates the same href + same article appearing twice', () => {
    const article = articleFixture({ slug: 'article-a' })
    const result = buildCitationIndex([
      { article, citation: cite('https://example.com/', 'First') },
      { article, citation: cite('https://example.com/', 'Second') },
    ])
    expect(result).toHaveLength(1)
    expect(result[0]!.articles).toHaveLength(1)
  })

  it('collects multiple articles for the same href and sorts them by publishedAt desc', () => {
    const older = articleFixture({ slug: 'old', publishedAt: '2026-04-01T00:00:00.000Z' })
    const newer = articleFixture({ slug: 'new', publishedAt: '2026-05-10T00:00:00.000Z' })
    const result = buildCitationIndex([
      { article: older, citation: cite('https://vendor.com/', null) },
      { article: newer, citation: cite('https://vendor.com/', 'Vendor') },
    ])
    expect(result).toHaveLength(1)
    const [rec] = result
    expect(rec!.articles[0]!.slug).toBe('new')
    expect(rec!.articles[1]!.slug).toBe('old')
  })

  it('picks the first non-null text and ignores a later non-null for the same href', () => {
    const a = articleFixture({ slug: 'a' })
    const b = articleFixture({ slug: 'b' })
    const result = buildCitationIndex([
      { article: a, citation: cite('https://site.com/', null) },
      { article: b, citation: cite('https://site.com/', 'Site label') },
    ])
    expect(result[0]!.text).toBe('Site label')
  })

  it('sorts output entries by most-recent article publishedAt desc', () => {
    const early = articleFixture({ slug: 'early', publishedAt: '2026-03-01T00:00:00.000Z' })
    const late = articleFixture({ slug: 'late', publishedAt: '2026-05-15T00:00:00.000Z' })
    const result = buildCitationIndex([
      { article: early, citation: cite('https://alpha.com/', 'Alpha') },
      { article: late, citation: cite('https://beta.com/', 'Beta') },
    ])
    expect(result[0]!.href).toBe('https://beta.com/')
    expect(result[1]!.href).toBe('https://alpha.com/')
  })
})

describe('<CitationIndex>', () => {
  it('renders the empty state when citations is empty', () => {
    render(<CitationIndex citations={[]} />)
    expect(screen.getByTestId('citation-index-empty')).toBeInTheDocument()
    expect(screen.getByText(/no external citations yet/i)).toBeInTheDocument()
  })

  it('renders a list with one row per citation record', () => {
    const citations: CitationRecord[] = [
      {
        href: 'https://example.com/',
        text: 'Example',
        articles: [articleFixture({ slug: 'a', title: 'Article A' })],
      },
      {
        href: 'https://other.com/page',
        text: null,
        articles: [articleFixture({ slug: 'b', title: 'Article B' })],
      },
    ]
    render(<CitationIndex citations={citations} />)
    expect(screen.getByTestId('citation-index')).toBeInTheDocument()
    const rows = screen.getAllByTestId('citation-index-row')
    expect(rows).toHaveLength(2)
  })

  it('sets data-href on each row matching the citation href', () => {
    const citations: CitationRecord[] = [
      {
        href: 'https://vendor.io/',
        text: 'Vendor',
        articles: [articleFixture()],
      },
    ]
    render(<CitationIndex citations={citations} />)
    const row = screen.getByTestId('citation-index-row')
    expect(row).toHaveAttribute('data-href', 'https://vendor.io/')
  })

  it('renders the citation host in the host span', () => {
    const citations: CitationRecord[] = [
      {
        href: 'https://kbdfans.com/products/some-keycap',
        text: 'KBDfans listing',
        articles: [articleFixture()],
      },
    ]
    render(<CitationIndex citations={citations} />)
    const hosts = screen.getAllByTestId('citation-index-host')
    expect(hosts[0]!.textContent).toMatch(/kbdfans\.com/)
  })

  it('renders article links pointing to /article/<slug>', () => {
    const citations: CitationRecord[] = [
      {
        href: 'https://example.com/',
        text: 'Example',
        articles: [
          articleFixture({ slug: 'oil-king-deep-dive', title: 'Oil King Deep Dive' }),
        ],
      },
    ]
    render(<CitationIndex citations={citations} />)
    const link = screen.getByRole('link', { name: /oil king deep dive/i })
    expect(link).toHaveAttribute('href', '/article/oil-king-deep-dive')
  })
})
