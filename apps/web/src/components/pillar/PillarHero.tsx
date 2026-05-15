import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'
import { Container } from '@thock/ui'
import { type Pillar, pillarLabel } from '@thock/seo'

export type PillarHeroPill = {
  href: string
  label: string
  sublabel?: string
  /** Stable id used as the `data-testid` suffix. Default: 'rss'. */
  testId?: string
}

export type PillarHeroProps = {
  pillar: Pillar
  /** Lede paragraph rendered under the H1 inside a 60ch column. */
  lede: string
  /**
   * Optional eyebrow override — defaults to `PILLAR · <slug>`.
   * Tracker passes a `SIGNATURE · TRENDS TRACKER` framing.
   */
  eyebrow?: string
  /**
   * Optional headline override. Defaults to the pillar's canonical
   * label rendered in italic. Pass a ReactNode to italicize a single
   * token rather than the whole word (matches `<em>` in the design).
   */
  heading?: ReactNode
  /**
   * Optional right-rail pills, rendered top-to-bottom. The first
   * pill keeps the legacy `pillar-hero-rss` testid for back-compat
   * with phase 7 News e2e specs.
   */
  pills?: PillarHeroPill[]
  /**
   * Legacy single-pill prop. Kept as a thin wrapper around `pills`
   * so existing callers don't break.
   */
  rssLink?: { href: string; label: string; sublabel?: string }
  /**
   * Optional right-rail node — replaces the pill list when set.
   * Used by the tracker header for the big week-number block.
   */
  rightRail?: ReactNode
}

/**
 * Canonical pillar-landing hero. Eyebrow `PILLAR · <slug>` — a
 * descriptive label (matching the breadcrumb idiom) rather than a
 * mechanical sequence position. Italic display H1, lede paragraph,
 * optional RSS pill on the right rail at desktop. Stacks vertically
 * on mobile.
 *
 * Lives in `apps/web/src/components/pillar/` and is the reusable
 * unit phases 8–11 import to ship the remaining four pillar
 * landings.
 */
export function PillarHero({
  pillar,
  lede,
  eyebrow,
  heading,
  pills,
  rssLink,
  rightRail,
}: PillarHeroProps): ReactElement {
  const label = pillarLabel(pillar)
  const headingNode = heading ?? <em className="italic">{label}</em>
  const eyebrowText = eyebrow ?? `pillar · ${pillar}`

  const resolvedPills: PillarHeroPill[] = pills ?? []
  if (resolvedPills.length === 0 && rssLink) {
    resolvedPills.push({ ...rssLink, testId: 'rss' })
  } else if (resolvedPills.length > 0 && resolvedPills[0] && !resolvedPills[0].testId) {
    resolvedPills[0] = { ...resolvedPills[0], testId: 'rss' }
  }

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
              {eyebrowText}
            </span>
            <h1 className="font-serif text-h1 sm:text-display text-text">
              {headingNode}
            </h1>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              {lede}
            </p>
          </div>
          {rightRail ? (
            <div data-testid="pillar-hero-rail">{rightRail}</div>
          ) : resolvedPills.length > 0 ? (
            <div className="flex flex-col gap-3">
              {resolvedPills.map((pill, i) => (
                <Link
                  key={`${pill.href}-${i}`}
                  href={pill.href}
                  data-testid={`pillar-hero-${pill.testId ?? `pill-${i}`}`}
                  className="inline-flex flex-col gap-1 border border-border bg-surface px-5 py-4 transition-colors hover:border-border-hi"
                >
                  <span
                    data-testid="pillar-hero-pill-sublabel"
                    className="font-mono uppercase tracking-[0.1em] text-micro text-text-2"
                  >
                    {pill.sublabel ?? 'subscribe'}
                  </span>
                  <span className="font-serif text-h3 text-text">
                    {pill.label} →
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  )
}
