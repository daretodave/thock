import matter from 'gray-matter'
import {
  ArticleFrontmatterSchema,
  type ArticleFrontmatter,
  type Pillar,
} from '../schema/frontmatter'
import { listArticleFiles, readUtf8, fileBaseName } from './paths'
import { computeReadTime } from '../util/readTime'
import { memo } from './memo'
import { getAllTags } from './tags'

export type Article = {
  slug: string
  frontmatter: ArticleFrontmatter
  body: string
  readTime: number
  filePath: string
}

const loadAll = memo<Article[]>('articles', () => {
  const validTagSlugs = new Set(getAllTags().map((t) => t.slug))
  const articles: Article[] = []
  for (const file of listArticleFiles()) {
    const baseName = fileBaseName(file)
    const raw = readUtf8(file)
    const { data, content } = matter(raw)
    const parsed = ArticleFrontmatterSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error(
        `[@thock/content] frontmatter parse failed in ${file}: ${parsed.error.message}`,
      )
    }
    if (parsed.data.slug !== baseName) {
      throw new Error(
        `[@thock/content] slug "${parsed.data.slug}" does not match filename "${baseName}.mdx"`,
      )
    }
    for (const tag of parsed.data.tags) {
      if (!validTagSlugs.has(tag)) {
        throw new Error(
          `[@thock/content] unknown tag "${tag}" in ${file}; add to apps/web/src/content/tags.json or fix the article`,
        )
      }
    }
    articles.push({
      slug: parsed.data.slug,
      frontmatter: parsed.data,
      body: content,
      readTime: computeReadTime(content),
      filePath: file,
    })
  }
  // newest first
  articles.sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  )
  return articles
})

export function getAllArticles(): Article[] {
  return loadAll()
}

export function getArticleBySlug(slug: string): Article | null {
  return getAllArticles().find((a) => a.slug === slug) ?? null
}

export function getArticlesByPillar(pillar: Pillar): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.pillar === pillar)
}

export function getArticlesByTag(tagSlug: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.tags.includes(tagSlug))
}

/**
 * Related-articles ranking with a tag-overlap fallback.
 *
 * Weight = sharedTags*2 + (samePillar ? 3 : 0). Higher weight =
 * stronger relation. Sort weight desc, then publishedAt desc.
 *
 * Two-tier filter (critique pass 5 [LOW] drain — the
 * `/article/<news>/Keep reading rail thins to a single tile`
 * row at line 47 of plan/CRITIQUE.md):
 *
 * 1. **Strict tier:** same pillar OR shared ≥ 2 tags. The original
 *    contract — strong relations get top placement.
 * 2. **Loose tier (fallback):** any article with shared ≥ 1 tag.
 *    Used to backfill remaining slots when the strict tier
 *    returns fewer than `n` picks.
 *
 * Excludes self. Caps at `n`. The return order surfaces strict
 * picks first, then loose backfill — both already sorted by
 * weight + publishedAt within their tier.
 */
export function getRelatedArticles(article: Article, n = 4): Article[] {
  const candidates = getAllArticles().filter((a) => a.slug !== article.slug)
  const articleTags = new Set(article.frontmatter.tags)

  const scored = candidates
    .map((a) => {
      const shared = a.frontmatter.tags.filter((t) => articleTags.has(t)).length
      const samePillar = a.frontmatter.pillar === article.frontmatter.pillar
      const weight = shared * 2 + (samePillar ? 3 : 0)
      return { article: a, weight, shared, samePillar }
    })
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      return b.article.frontmatter.publishedAt.localeCompare(
        a.article.frontmatter.publishedAt,
      )
    })

  const strict = scored.filter((s) => s.samePillar || s.shared >= 2)
  if (strict.length >= n) return strict.slice(0, n).map((s) => s.article)

  const strictSlugs = new Set(strict.map((s) => s.article.slug))
  const loose = scored.filter(
    (s) => !strictSlugs.has(s.article.slug) && s.shared >= 1,
  )
  return [...strict, ...loose].slice(0, n).map((s) => s.article)
}
