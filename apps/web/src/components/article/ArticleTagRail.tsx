import type { ReactElement } from 'react'
import { Container, TagChip, type TagChipCategory } from '@thock/ui'
import type { Tag } from '@thock/content'

export type ArticleTagRailProps = {
  /** Tag slugs from frontmatter, in their authored order. */
  tagSlugs: string[]
  /** Lookup-able tag taxonomy. Slugs not in the taxonomy fall back. */
  tagsBySlug: Map<string, Tag>
}

/**
 * Horizontal rail of category-tinted `<TagChip>` links. Hides
 * itself when there are zero tags.
 */
export function ArticleTagRail({
  tagSlugs,
  tagsBySlug,
}: ArticleTagRailProps): ReactElement | null {
  if (tagSlugs.length === 0) return null

  return (
    <Container as="div" className="border-y border-border py-6">
      <ul
        data-testid="article-tag-rail"
        className="flex flex-wrap gap-2"
      >
        {tagSlugs.map((slug) => {
          const tag = tagsBySlug.get(slug)
          const name = tag?.name ?? slug
          const category: TagChipCategory =
            (tag?.category as TagChipCategory | undefined) ?? 'misc'
          return (
            <li key={slug}>
              <TagChip slug={slug} name={name} category={category} />
            </li>
          )
        })}
      </ul>
    </Container>
  )
}
