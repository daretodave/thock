import Link from 'next/link'
import type { ReactElement } from 'react'
import type { Article, SourceCitation } from '@thock/content'

export type CitationRecord = {
  href: string
  /** Display text (first non-null citation we encountered for this href). */
  text: string | null
  /** Articles that cite this URL, in published-desc order. */
  articles: Article[]
}

export type CitationIndexProps = {
  citations: CitationRecord[]
}

/**
 * Build a deduped per-citation index from a flat list of
 * `(article, citation)` tuples. Articles are deduped per `href`
 * and sorted by publishedAt descending; the display text is the
 * first non-null text seen for each href (citations on the same
 * URL across articles tend to use similar wording — this is the
 * cheapest "good enough" pick).
 */
export function buildCitationIndex(
  pairs: Array<{ article: Article; citation: SourceCitation }>,
): CitationRecord[] {
  const byHref = new Map<
    string,
    { text: string | null; articleSlugs: Set<string>; articles: Article[] }
  >()

  for (const { article, citation } of pairs) {
    const existing = byHref.get(citation.href)
    if (existing) {
      if (!existing.articleSlugs.has(article.slug)) {
        existing.articleSlugs.add(article.slug)
        existing.articles.push(article)
      }
      if (existing.text === null && citation.text !== null) {
        existing.text = citation.text
      }
    } else {
      byHref.set(citation.href, {
        text: citation.text,
        articleSlugs: new Set([article.slug]),
        articles: [article],
      })
    }
  }

  const records: CitationRecord[] = []
  for (const [href, entry] of byHref.entries()) {
    entry.articles.sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
    records.push({ href, text: entry.text, articles: entry.articles })
  }

  records.sort((a, b) => {
    const aDate = a.articles[0]?.frontmatter.publishedAt ?? ''
    const bDate = b.articles[0]?.frontmatter.publishedAt ?? ''
    return bDate.localeCompare(aDate)
  })

  return records
}

function formatDisplayHref(href: string): string {
  try {
    const url = new URL(href)
    const path = url.pathname === '/' ? '' : url.pathname
    return `${url.hostname}${path}`.replace(/\/$/, '')
  } catch {
    return href
  }
}

/**
 * Per-citation index for /sources. Renders a deduped row per
 * unique href: the citation text (or the host+path when the tag
 * is self-closing), the source URL, and the list of articles
 * that cite it. Reader-facing complement to the per-article
 * `<SourceCounts>` aggregate above.
 */
export function CitationIndex({ citations }: CitationIndexProps): ReactElement {
  if (citations.length === 0) {
    return (
      <div
        data-testid="citation-index-empty"
        className="border border-border bg-surface p-8 max-w-[60ch]"
      >
        <p className="font-serif text-h3 text-text-2">
          No external citations yet.
        </p>
        <p className="mt-3 text-body text-text-2">
          As articles add cited sources, the per-citation index lands here.
        </p>
      </div>
    )
  }

  return (
    <ul
      data-testid="citation-index"
      className="flex flex-col divide-y divide-border border-y border-border"
    >
      {citations.map(({ href, text, articles }) => {
        const display = text ?? formatDisplayHref(href)
        return (
          <li
            key={href}
            data-testid="citation-index-row"
            data-href={href}
            className="flex flex-col gap-2 py-5 sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-8 sm:items-baseline"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <a
                href={href}
                rel="noopener"
                target="_blank"
                className="font-serif text-h3 text-text underline decoration-border-hi underline-offset-4 hover:text-accent hover:decoration-accent transition-colors break-words"
              >
                {display}
              </a>
              <span
                data-testid="citation-index-host"
                className="font-mono text-micro uppercase tracking-[0.08em] text-text-2 break-all"
              >
                {formatDisplayHref(href)}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-small text-text-2 min-w-0 sm:justify-end sm:text-right">
              {articles.map((article, idx) => (
                <span key={article.slug} className="inline-flex items-baseline">
                  {idx > 0 && (
                    <span aria-hidden="true" className="mr-3 text-text-4">
                      ·
                    </span>
                  )}
                  <Link
                    href={`/article/${article.slug}`}
                    className="text-text-2 hover:text-text transition-colors break-words"
                  >
                    {article.frontmatter.title}
                  </Link>
                </span>
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
