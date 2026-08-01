import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Newsletter } from '@thock/content'

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export type NewsletterArchiveProps = {
  newsletters: Newsletter[]
}

/**
 * Past-digests archive on `/newsletter`. Empty state ships at
 * phase 15 — no digests authored yet. Once the first issue lands
 * via /iterate or /ship-data the archive populates automatically
 * because `getAllNewsletters` reads from
 * `apps/web/src/content/newsletters/*.mdx`.
 */
export function NewsletterArchive({
  newsletters,
}: NewsletterArchiveProps): ReactElement {
  if (newsletters.length === 0) {
    return (
      <div
        data-testid="newsletter-archive-empty"
        className="border border-border bg-surface p-8"
      >
        <p className="font-serif text-h3 text-text-2">
          No digests yet.
        </p>
        <p className="mt-3 text-body text-text-2" data-testid="newsletter-empty-body">
          The first issue lands soon. Subscribe above and we&apos;ll send you
          the first one when it ships. Prefer feeds?{' '}
          <Link href="/feed.xml" className="text-accent hover:text-accent-hi">
            Grab the RSS
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <ul
      data-testid="newsletter-archive"
      className="flex flex-col divide-y divide-border border-y border-border"
    >
      {newsletters.map((n) => (
        <li
          key={n.slug}
          data-testid="newsletter-archive-row"
          className="flex flex-col gap-2 py-5"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-2">
              issue {String(n.frontmatter.issue).padStart(2, '0')}
            </span>
            <time
              dateTime={n.frontmatter.publishedAt}
              className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
            >
              {PUBLISHED_FORMATTER.format(new Date(n.frontmatter.publishedAt))}
            </time>
          </div>
          <Link
            href={`/newsletter/${n.slug}`}
            data-testid="newsletter-archive-link"
            className="font-serif text-h3 text-text hover:text-accent rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
          >
            {n.frontmatter.title}
          </Link>
          <p className="text-small text-text-2 line-clamp-2">
            {n.frontmatter.lede}
          </p>
        </li>
      ))}
    </ul>
  )
}
