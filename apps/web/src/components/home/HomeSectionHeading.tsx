import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'

export type HomeSectionHeadingProps = {
  /** Mono-cased eyebrow text rendered above the title in accent. */
  kicker?: string
  /** Serif title for the section. */
  title: ReactNode
  /**
   * Optional trailing "more →" link. Rendered as a mono accent CTA
   * on the right side of the hairline.
   */
  more?: { label: string; href: string }
  /** Heading level — defaults to h2 since the page h1 belongs to the hero. */
  level?: 2 | 3
}

/**
 * Section heading used across the home composition. Mirrors the
 * `SectionHeading` block in `design/page-home.jsx`: kicker + title
 * on the left, hairline ruler in the middle, optional more-link on
 * the right. Stacks vertically on small viewports.
 */
export function HomeSectionHeading({
  kicker,
  title,
  more,
  level = 2,
}: HomeSectionHeadingProps): ReactElement {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <div
      data-testid="home-section-heading"
      className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="flex flex-1 flex-col gap-1">
        {kicker && (
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            {kicker}
          </span>
        )}
        <Heading className="font-serif text-h2 text-text">{title}</Heading>
      </div>
      <div
        aria-hidden="true"
        className="hidden h-px flex-1 bg-border sm:block"
      />
      {more && (
        <Link
          href={more.href}
          className="font-mono uppercase tracking-[0.08em] text-micro text-accent hover:text-accent-hi"
        >
          {more.label} →
        </Link>
      )}
    </div>
  )
}
