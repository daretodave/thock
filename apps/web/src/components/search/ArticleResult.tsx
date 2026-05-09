import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Tag } from '@thock/content'
import { TagChip, type TagChipCategory } from '@thock/ui'
import { pillarLabel } from '@thock/seo'
import type { SearchHit } from '@/lib/search/runtime'

export type ArticleResultProps = {
  hit: SearchHit
  tagsBySlug?: Map<string, Tag>
}

/**
 * One row in the /search results list. Compact: title + lede +
 * pillar pill + tag chips. Score is exposed via `data-score` on
 * the wrapper so e2e can assert ordering without rendering it.
 */
export function ArticleResult({
  hit,
  tagsBySlug,
}: ArticleResultProps): ReactElement {
  return (
    <article
      data-testid="search-result"
      data-slug={hit.slug}
      data-score={hit.score.toFixed(3)}
      className="border-t border-border py-5 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono uppercase tracking-[0.08em] text-micro text-text-3">
          {pillarLabel(hit.pillar)}
        </span>
        <span aria-hidden="true" className="font-mono text-micro text-text-4">
          ·
        </span>
        <span className="font-mono text-micro text-text-3">{hit.publishedAt.slice(0, 10)}</span>
      </div>
      <h2 className="mt-1 font-serif text-h3 text-text">
        <Link
          href={`/article/${hit.slug}`}
          className="hover:text-accent transition-colors"
        >
          {hit.title}
        </Link>
      </h2>
      <p className="mt-2 max-w-[68ch] text-small text-text-2 line-clamp-2">
        {hit.lede}
      </p>
      {hit.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {hit.tags.slice(0, 6).map((slug) => {
            const tag = tagsBySlug?.get(slug)
            const name = tag?.name ?? slug
            const category: TagChipCategory =
              (tag?.category as TagChipCategory | undefined) ?? 'misc'
            return (
              <TagChip
                key={slug}
                slug={slug}
                name={name}
                category={category}
              />
            )
          })}
        </div>
      )}
    </article>
  )
}
