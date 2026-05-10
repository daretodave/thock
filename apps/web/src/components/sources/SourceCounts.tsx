import Link from 'next/link'
import type { ReactElement } from 'react'
import type { Article, Pillar } from '@thock/content'

export type ArticleSourceCount = {
  article: Article
  sourceCount: number
}

export type SourceCountsProps = {
  rows: ArticleSourceCount[]
}

const PILLARS: Pillar[] = ['news', 'trends', 'ideas', 'deep-dives', 'guides']
const PILLAR_LABEL: Record<Pillar, string> = {
  news: 'News',
  trends: 'Trends',
  ideas: 'Ideas',
  'deep-dives': 'Deep Dives',
  guides: 'Guides',
}

/**
 * Per-article aggregate of citation counts. Articles with zero
 * `<Source>` tags are omitted so the page surfaces only what's
 * actually cited. Rows are grouped by pillar to mirror the rest
 * of the site's information architecture.
 *
 * When every visible row has the same `sourceCount`, the page
 * loses the value-add of "which articles cite more" — the badge
 * reads as auto-generated. In that case (critique pass 3 [MED])
 * we swap to a "Source linked" / "Sources linked" chip that does
 * not tease a count, so uniform tallies don't look like a stub.
 */
export function SourceCounts({ rows }: SourceCountsProps): ReactElement {
  const cited = rows.filter((r) => r.sourceCount > 0)

  if (cited.length === 0) {
    return (
      <div
        data-testid="source-counts-empty"
        className="border border-border bg-surface p-8 max-w-[60ch]"
      >
        <p className="font-serif text-h3 text-text-2">
          No cited articles yet.
        </p>
        <p className="mt-3 text-body text-text-3">
          Articles with cited sources show up here. We&apos;re adding them as
          the catalog grows.
        </p>
      </div>
    )
  }

  const uniqueCounts = new Set(cited.map((r) => r.sourceCount))
  const isUniform = uniqueCounts.size === 1
  const uniformValue = isUniform ? cited[0]!.sourceCount : null

  const byPillar = new Map<Pillar, ArticleSourceCount[]>()
  for (const row of cited) {
    const p = row.article.frontmatter.pillar
    const existing = byPillar.get(p) ?? []
    existing.push(row)
    byPillar.set(p, existing)
  }
  for (const list of byPillar.values()) {
    list.sort((a, b) =>
      b.article.frontmatter.publishedAt.localeCompare(
        a.article.frontmatter.publishedAt,
      ),
    )
  }

  return (
    <div data-testid="source-counts" className="flex flex-col gap-12">
      {PILLARS.flatMap((p) => {
        const list = byPillar.get(p)
        if (!list || list.length === 0) return []
        return [
          <section
            key={p}
            data-testid={`source-counts-section-${p}`}
            className="flex flex-col gap-4"
          >
            <h2 className="font-mono text-micro uppercase tracking-[0.12em] text-text-3">
              {PILLAR_LABEL[p]}
            </h2>
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {list.map(({ article, sourceCount }) => (
                <li
                  key={article.slug}
                  data-testid="source-counts-row"
                  className="flex items-baseline justify-between gap-4 py-4"
                >
                  <Link
                    href={`/article/${article.slug}`}
                    className="font-serif text-h3 text-text hover:text-accent transition-colors"
                  >
                    {article.frontmatter.title}
                  </Link>
                  <span
                    data-testid="source-counts-badge"
                    data-uniform={isUniform ? 'true' : 'false'}
                    className="font-mono text-small uppercase tracking-[0.08em] text-text-3 shrink-0"
                  >
                    {isUniform
                      ? `Source${uniformValue === 1 ? '' : 's'} linked`
                      : `${sourceCount} cite${sourceCount === 1 ? '' : 's'}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>,
        ]
      })}
    </div>
  )
}
