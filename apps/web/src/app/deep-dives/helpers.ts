import type { Article } from '@thock/content'

/**
 * Sort comparator for the deep-dives pillar: longest reads first.
 * Tie-break by `publishedAt` desc, then `slug` asc for build
 * stability. Pure helper extracted out of `page.tsx` because
 * Next.js's route-typing forbids non-route exports from page
 * modules.
 */
export function sortDeepDivesByLength(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    if (a.readTime !== b.readTime) return b.readTime - a.readTime
    if (a.frontmatter.publishedAt !== b.frontmatter.publishedAt) {
      return b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
    }
    return a.slug.localeCompare(b.slug)
  })
}
