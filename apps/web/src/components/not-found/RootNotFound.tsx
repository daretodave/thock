import Link from 'next/link'
import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'

const PILLAR_LINKS = [
  { href: '/news', label: 'News' },
  { href: '/trends', label: 'Trends' },
  { href: '/ideas', label: 'Ideas' },
  { href: '/deep-dives', label: 'Deep Dives' },
  { href: '/guides', label: 'Guides' },
] as const

/**
 * Branded global 404. Server component (the inline search is a
 * native HTML form POSTing to /search?q=…, no client JS needed).
 * Renders eyebrow + italic display H1 + lede + search input + a
 * five-link pillar nav so the reader recovers in one click.
 */
export function RootNotFound(): ReactElement {
  return (
    <Container as="section" className="py-16 sm:py-24">
      <Stack gap={8}>
        <Stack gap={3} className="max-w-[60ch]">
          <span
            data-testid="not-found-eyebrow"
            className="font-mono text-micro uppercase tracking-[0.12em] text-accent"
          >
            404
          </span>
          <h1 className="font-serif italic text-display text-text">
            Lost in the layout.
          </h1>
          <p className="font-serif text-h3 text-text-2">
            That URL doesn&apos;t match anything on thock. Search the site, or
            jump to one of the five pillars below.
          </p>
        </Stack>

        <form
          data-testid="not-found-search-form"
          action="/search"
          method="get"
          role="search"
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="not-found-q" className="sr-only">
            Search thock
          </label>
          <input
            id="not-found-q"
            type="search"
            name="q"
            placeholder="search articles, switches, builds…"
            className="flex-1 border border-border bg-surface px-4 py-3 text-body text-text placeholder:text-text-4 focus:outline-none focus:border-border-hi"
          />
          <button
            type="submit"
            className="border border-accent-mu px-6 py-3 font-mono text-small uppercase tracking-[0.08em] text-accent hover:text-accent-hi transition-colors"
          >
            Search
          </button>
        </form>

        <nav
          data-testid="not-found-pillar-nav"
          aria-label="Pillars"
          className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6"
        >
          {PILLAR_LINKS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-accent transition-colors"
            >
              {p.label} →
            </Link>
          ))}
        </nav>
      </Stack>
    </Container>
  )
}
