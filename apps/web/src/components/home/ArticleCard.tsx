import Link from 'next/link'
import Image from 'next/image'
import type { ReactElement } from 'react'
import type { Article, Tag } from '@thock/content'
import { pillarLabel } from '@thock/seo'
import { TagChip } from '@thock/ui'

export type ArticleCardVariant = 'hero' | 'large' | 'row' | 'compact'

export type ArticleCardProps = {
  article: Article
  variant: ArticleCardVariant
  /** Optional tag-by-slug map — drives the chip names + categories. */
  tagsBySlug?: Map<string, Tag>
  /** How many tag chips to show. Default 3 on hero, 1 elsewhere. */
  maxTags?: number
}

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

const HERO_IMAGE_TONE_CLASS = 'bg-bg-2 border border-border'

const variantToTitleClass: Record<ArticleCardVariant, string> = {
  hero: 'font-serif text-h1 sm:text-display text-text',
  large: 'font-serif text-h3 text-text',
  row: 'font-serif text-h3 text-text',
  compact: 'font-serif text-h3 text-text',
}

function PlaceholderImage({
  className,
  label,
}: {
  className: string
  label: string
}): ReactElement {
  return (
    <div
      data-testid="article-card-placeholder"
      aria-label={label}
      className={`${className} ${HERO_IMAGE_TONE_CLASS} flex items-center justify-center font-mono uppercase tracking-[0.12em] text-micro text-text-3`}
    >
      {label}
    </div>
  )
}

/**
 * Editorial card with four variants. Lives in `apps/web/` for now;
 * lifts to `packages/ui/` only when phase 7 (News pillar) needs it.
 *
 * - hero: full-width, large image (or placeholder) above title +
 *   lede + chips. Used as the home page H1.
 * - large: 4-up grid card — image on top, title below.
 * - row: horizontal card — image left, body right.
 * - compact: title + pillar + date only, no image.
 */
export function ArticleCard({
  article,
  variant,
  tagsBySlug,
  maxTags,
}: ArticleCardProps): ReactElement {
  const fm = article.frontmatter
  const path = `/article/${article.slug}`
  const formattedDate = PUBLISHED_FORMATTER.format(new Date(fm.publishedAt))
  const pillar = pillarLabel(fm.pillar)
  const tagSlugs = fm.tags.slice(0, maxTags ?? (variant === 'hero' ? 3 : 1))

  const eyebrow = (
    <span className="font-mono uppercase tracking-[0.1em] text-micro text-accent-mu">
      {pillar}
    </span>
  )

  const meta = (
    <div className="flex flex-wrap items-center gap-2 text-small text-text-3">
      <span>{fm.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={fm.publishedAt}>{formattedDate}</time>
      <span aria-hidden="true">·</span>
      <span>{article.readTime} min read</span>
    </div>
  )

  const tagRow =
    tagSlugs.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {tagSlugs.map((slug) => {
          const tag = tagsBySlug?.get(slug)
          const name = tag?.name ?? slug
          const category = tag?.category ?? 'misc'
          return (
            <TagChip
              key={slug}
              slug={slug}
              name={name}
              category={category}
              static
            />
          )
        })}
      </div>
    ) : null

  if (variant === 'hero') {
    return (
      <Link
        href={path}
        data-testid="hero-card"
        className="group flex flex-col gap-5 lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-8"
      >
        {fm.heroImage ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={fm.heroImage}
              alt={fm.heroImageAlt ?? ''}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderImage
            className="aspect-[16/10]"
            label="thock · hero"
          />
        )}
        <div className="flex flex-col gap-4">
          {eyebrow}
          <h1
            className={`${variantToTitleClass.hero} group-hover:text-accent transition-colors`}
          >
            {fm.title}
          </h1>
          <p className="text-h3 text-text-2 font-serif max-w-[60ch]">
            {fm.lede}
          </p>
          {tagRow}
          {meta}
        </div>
      </Link>
    )
  }

  if (variant === 'row') {
    return (
      <Link
        href={path}
        data-testid="article-card-row"
        className="group grid grid-cols-1 items-start gap-4 border-t border-border py-5 sm:grid-cols-[200px_1fr] sm:gap-6 first:border-t-0 first:pt-0"
      >
        {fm.heroImage ? (
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={fm.heroImage}
              alt={fm.heroImageAlt ?? ''}
              fill
              sizes="(min-width: 640px) 200px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderImage className="aspect-[4/3]" label="row" />
        )}
        <div className="flex flex-col gap-2">
          {eyebrow}
          <h3
            className={`${variantToTitleClass.row} group-hover:text-accent transition-colors`}
          >
            {fm.title}
          </h3>
          <p className="text-small text-text-2 line-clamp-2">{fm.lede}</p>
          {meta}
        </div>
      </Link>
    )
  }

  if (variant === 'large') {
    return (
      <Link
        href={path}
        data-testid="article-card-large"
        className="group flex flex-col gap-3"
      >
        {fm.heroImage ? (
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={fm.heroImage}
              alt={fm.heroImageAlt ?? ''}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderImage className="aspect-[4/3]" label="thock" />
        )}
        {eyebrow}
        <h3
          className={`${variantToTitleClass.large} group-hover:text-accent transition-colors line-clamp-3`}
        >
          {fm.title}
        </h3>
        {meta}
      </Link>
    )
  }

  // compact
  return (
    <Link
      href={path}
      data-testid="article-card-compact"
      className="group flex flex-col gap-1 border-t border-border py-3 first:border-t-0 first:pt-0"
    >
      {eyebrow}
      <h3
        className={`${variantToTitleClass.compact} group-hover:text-accent transition-colors`}
      >
        {fm.title}
      </h3>
      <time
        dateTime={fm.publishedAt}
        className="text-small text-text-3"
      >
        {formattedDate}
      </time>
    </Link>
  )
}
