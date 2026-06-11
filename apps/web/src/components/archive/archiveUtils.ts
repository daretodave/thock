import type { Article } from '@thock/content'

export type MonthGroup = {
  /** ISO month key, e.g. "2026-05" */
  key: string
  /** Human-readable label, e.g. "May 2026" */
  label: string
  articles: Article[]
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function toMonthKey(iso: string): string {
  return iso.slice(0, 7)
}

function labelFromKey(key: string): string {
  const parts = key.split('-')
  const year = parts[0] ?? key
  const month = parts[1] ?? '01'
  const idx = parseInt(month, 10) - 1
  return `${MONTH_NAMES[idx] ?? month} ${year}`
}

/**
 * Groups articles by calendar month derived from publishedAt.
 * Returns months newest-first; articles within each month newest-first.
 */
export function groupArticlesByMonth(articles: Article[]): MonthGroup[] {
  const map = new Map<string, Article[]>()
  for (const article of articles) {
    const key = toMonthKey(article.frontmatter.publishedAt)
    const bucket = map.get(key)
    if (bucket) {
      bucket.push(article)
    } else {
      map.set(key, [article])
    }
  }

  for (const bucket of map.values()) {
    bucket.sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
  }

  const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a))

  return sortedKeys.map((key) => ({
    key,
    label: labelFromKey(key),
    articles: map.get(key)!,
  }))
}
