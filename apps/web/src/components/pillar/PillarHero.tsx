import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'
import { Container } from '@thock/ui'
import { type Pillar, pillarLabel, PILLARS } from '@thock/seo'

export type PillarHeroProps = {
  pillar: Pillar
  /** Lede paragraph rendered under the H1 inside a 60ch column. */
  lede: string
  /**
   * Optional headline override. Defaults to the pillar's canonical
   * label rendered in italic. Pass a ReactNode to italicize a single
   * token rather than the whole word (matches `<em>` in the design).
   */
  heading?: ReactNode
  /**
   * Optional right-rail "feed" pill. Renders only when provided —
   * each pillar that has an RSS endpoint passes its href + label.
   */
  rssLink?: { href: string; label: string; sublabel?: string }
}

const PILLAR_NUMBER: Record<Pillar, string> = (() => {
  const out = {} as Record<Pillar, string>
  PILLARS.forEach((p, i) => {
    out[p.slug] = `${String(i + 1).padStart(2, '0')} of ${String(
      PILLARS.length,
    ).padStart(2, '0')}`
  })
  return out
})()

/**
 * Canonical pillar-landing hero. Eyebrow `PILLAR · NN of 05`,
 * italic display H1, lede paragraph, optional RSS pill on the right
 * rail at desktop. Stacks vertically on mobile.
 *
 * Lives in `apps/web/src/components/pillar/` and is the reusable
 * unit phases 8–11 import to ship the remaining four pillar
 * landings.
 */
export function PillarHero({
  pillar,
  lede,
  heading,
  rssLink,
}: PillarHeroProps): ReactElement {
  const label = pillarLabel(pillar)
  const headingNode = heading ?? <em className="italic">{label}</em>

  return (
    <header
      data-testid="pillar-hero"
      className="border-b border-border"
    >
      <Container as="div" className="py-12 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-4">
            <span
              data-testid="pillar-hero-eyebrow"
              className="font-mono uppercase tracking-[0.12em] text-micro text-accent"
            >
              pillar · {PILLAR_NUMBER[pillar]}
            </span>
            <h1 className="font-serif text-h1 sm:text-display text-text">
              {headingNode}
            </h1>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              {lede}
            </p>
          </div>
          {rssLink && (
            <Link
              href={rssLink.href}
              data-testid="pillar-hero-rss"
              className="inline-flex flex-col gap-1 border border-border bg-surface px-5 py-4 transition-colors hover:border-border-hi"
            >
              <span className="font-mono uppercase tracking-[0.1em] text-micro text-text-3">
                {rssLink.sublabel ?? 'subscribe'}
              </span>
              <span className="font-serif text-h3 text-text">
                {rssLink.label} →
              </span>
            </Link>
          )}
        </div>
      </Container>
    </header>
  )
}
