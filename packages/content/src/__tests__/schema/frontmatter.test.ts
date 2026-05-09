import { describe, expect, it } from 'vitest'
import { ArticleFrontmatterSchema } from '../../schema/frontmatter'

const VALID = {
  slug: 'beginners-switch-buying-guide',
  title: "A beginner's guide to picking your first switch",
  lede: 'A short three-family overview that lets a newcomer pick one and stick with it for a month before iterating.',
  author: 'Reza Patel',
  pillar: 'guides',
  tags: ['linear', 'tactile', 'beginner'],
  publishedAt: '2026-04-30T09:00:00.000Z',
  updatedAt: null,
  heroImage: null,
  heroImageAlt: null,
  featured: false,
  popularityScore: 51,
  guideSection: 'switches',
  mentionedParts: [
    { id: 'oil-king', kind: 'switch', slug: 'gateron-oil-king' },
  ],
}

describe('ArticleFrontmatterSchema', () => {
  it('accepts a valid frontmatter object', () => {
    expect(ArticleFrontmatterSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects an unknown pillar', () => {
    expect(
      ArticleFrontmatterSchema.safeParse({ ...VALID, pillar: 'reviews' }).success,
    ).toBe(false)
  })

  it('rejects a malformed mentionedParts entry', () => {
    expect(
      ArticleFrontmatterSchema.safeParse({
        ...VALID,
        mentionedParts: [{ id: 'oil-king', kind: 'switchee', slug: 'x' }],
      }).success,
    ).toBe(false)
  })

  it('applies defaults for optional fields', () => {
    const minimal = {
      slug: 'minimum-shape',
      title: 'A title with at least four characters',
      lede: 'A lede that satisfies the twenty-character minimum.',
      author: 'TT',
      pillar: 'news',
      tags: ['group-buy'],
      publishedAt: '2026-05-01T00:00:00.000Z',
    }
    const result = ArticleFrontmatterSchema.parse(minimal)
    expect(result.featured).toBe(false)
    expect(result.popularityScore).toBe(0)
    expect(result.mentionedParts).toEqual([])
    expect(result.updatedAt).toBeNull()
    expect(result.guideSection).toBeNull()
  })

  it('rejects a too-short title', () => {
    expect(ArticleFrontmatterSchema.safeParse({ ...VALID, title: 'hi' }).success).toBe(
      false,
    )
  })

  it('accepts heroImage as an absolute path under /hero-art/', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...VALID,
      heroImage: '/hero-art/beginners-switch-buying-guide.svg',
      heroImageAlt: 'Switch cross-section with exploded housing.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts heroImage as a full https URL', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...VALID,
      heroImage: 'https://example.com/some/photo.jpg',
      heroImageAlt: 'A photograph of a keyboard build.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects heroImage that is neither a path nor a URL', () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...VALID,
      heroImage: 'just-a-bare-string.svg',
      heroImageAlt: 'Some alt text.',
    })
    expect(result.success).toBe(false)
  })
})
