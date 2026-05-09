import type { Article } from '@thock/content'

export const BUILD_OF_THE_WEEK_TAG = 'build-of-the-week'

/**
 * Newest article tagged build-of-the-week, or null when none.
 * Pure helper extracted out of `page.tsx` because Next.js's
 * route-typing forbids non-route exports from page modules.
 */
export function pickBuildOfTheWeek(articles: Article[]): Article | null {
  const candidates = articles.filter((a) =>
    a.frontmatter.tags.includes(BUILD_OF_THE_WEEK_TAG),
  )
  if (candidates.length === 0) return null
  return [...candidates].sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  )[0] ?? null
}

/** ISO week number for a publish timestamp. */
export function isoWeekNumber(iso: string): number {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 0
  const target = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  )
  const dayNum = (target.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const diff = (target.getTime() - firstThursday.getTime()) / 86_400_000
  return (
    1 +
    Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
  )
}
