import Link from 'next/link'
import Image from 'next/image'
import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import { pillarHref, pillarLabel, type Pillar } from '@thock/seo'
import { ArticleByline } from './ArticleByline'

export type ArticleHeroProps = {
  pillar: Pillar
  title: string
  lede: string
  author: string
  publishedAt: string
  readTime: number
  heroImage: string | null
  heroImageAlt: string | null
}

/**
 * Article hero — eyebrow (pillar link), H1 (serif), lede, byline,
 * optional hero image.
 *
 * **Mobile / tablet (< xl, 1280px):** text block and hero image stack
 * vertically, both constrained to `max-w-[60ch]` so the hero image
 * follows the same column rules as the body prose below it.
 *
 * **Desktop (≥ xl):** text block stays in the 60ch column on the
 * left; the hero image moves to the right of the text, occupying
 * the right-side whitespace at the top of the article so the visual
 * lands "under nav, above the initial header" — large, bold, and
 * visually anchoring the article without dominating the column rules
 * that everything else on the page follows.
 *
 * Layout uses flex-row at xl with `items-start` so text and hero
 * both anchor at the top. The hero image preserves the SVG hero-art
 * 1200×750 native ratio (16/10) so it never crops the source artwork.
 */
export function ArticleHero({
  pillar,
  title,
  lede,
  author,
  publishedAt,
  readTime,
  heroImage,
  heroImageAlt,
}: ArticleHeroProps): ReactElement {
  return (
    <header data-testid="article-hero" className="border-b border-border">
      <Container as="div" className="py-12 sm:py-16">
        <div
          className={
            heroImage
              ? 'flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12'
              : ''
          }
        >
          {/* TEXT BLOCK — stays in the 60ch column at every breakpoint. */}
          <div className="flex flex-col gap-5 max-w-[60ch] xl:flex-shrink-0">
            <div
              data-testid="article-hero-eyebrow"
              className="font-mono uppercase tracking-[0.12em] text-micro text-accent"
            >
              <Link href={pillarHref(pillar)} className="hover:text-accent">
                {pillarLabel(pillar)}
              </Link>
            </div>

            <h1 className="font-serif text-h1 sm:text-display text-text">
              {title}
            </h1>

            <p className="font-serif text-h3 text-text-2">{lede}</p>

            <ArticleByline
              author={author}
              publishedAt={publishedAt}
              readTime={readTime}
            />
          </div>

          {/* HERO ART — column-bound on mobile, right-aligned at xl.
           *  Native 16/10 ratio matches the 1200×750 hero-art SVGs so
           *  the artwork is never cropped. Aspect locked via the wrapper
           *  div so next/image's fill mode has a sized parent. */}
          {heroImage && (
            <div
              data-testid="article-hero-image"
              className="w-full max-w-[60ch] xl:max-w-none xl:flex-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-md">
                <Image
                  src={heroImage}
                  alt={heroImageAlt ?? ''}
                  fill
                  priority
                  sizes="(min-width: 1280px) 40rem, 60ch"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
