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
 * optional full-bleed hero image. Mobile reflows: H1 sizes down via
 * Tailwind, image goes contained-with-rounded-corners instead of
 * full-bleed.
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
        <div className="flex flex-col gap-5 max-w-[60ch]">
          <div
            data-testid="article-hero-eyebrow"
            className="font-mono uppercase tracking-[0.12em] text-micro text-accent-mu"
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
      </Container>

      {heroImage && (
        <div
          data-testid="article-hero-image"
          className="relative mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-0"
        >
          <div className="relative aspect-[16/9] overflow-hidden lg:rounded-none rounded-md">
            <Image
              src={heroImage}
              alt={heroImageAlt ?? ''}
              fill
              priority
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </header>
  )
}
