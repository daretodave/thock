import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import type { Tag } from '@thock/content'
import type { TagChipCategory } from '@thock/ui'
import { TagGroup } from './TagGroup'

export const CATEGORY_ORDER: TagChipCategory[] = [
  'switch',
  'layout',
  'brand',
  'material',
  'profile',
  'misc',
]

export function groupTagsByCategory(
  tags: Tag[],
): Map<TagChipCategory, Tag[]> {
  const groups = new Map<TagChipCategory, Tag[]>()
  for (const cat of CATEGORY_ORDER) {
    groups.set(cat, [])
  }
  for (const tag of tags) {
    const cat = tag.category as TagChipCategory
    const bucket = groups.get(cat) ?? groups.get('misc')!
    bucket.push(tag)
  }
  return groups
}

type TagsIndexProps = {
  tags: Tag[]
}

export function TagsIndex({ tags }: TagsIndexProps): ReactElement {
  const groups = groupTagsByCategory(tags)

  return (
    <Container as="section" className="pb-16" data-testid="tags-index">
      {CATEGORY_ORDER.map((cat) => {
        const catTags = groups.get(cat) ?? []
        if (catTags.length === 0) return null
        return <TagGroup key={cat} category={cat} tags={catTags} />
      })}
    </Container>
  )
}
