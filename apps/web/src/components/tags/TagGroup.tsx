import type { ReactElement } from 'react'
import { TagChip, type TagChipCategory } from '@thock/ui'
import type { Tag } from '@thock/content'

const CATEGORY_TINT: Record<TagChipCategory, string> = {
  switch: 'text-tag-switch',
  layout: 'text-tag-layout',
  brand: 'text-tag-brand',
  material: 'text-tag-material',
  profile: 'text-tag-profile',
  misc: 'text-text-3',
}

const CATEGORY_LABEL: Record<TagChipCategory, string> = {
  switch: 'Switch',
  layout: 'Layout',
  brand: 'Brand',
  material: 'Material',
  profile: 'Profile',
  misc: 'Misc',
}

type TagGroupProps = {
  category: TagChipCategory
  tags: Tag[]
}

export function TagGroup({ category, tags }: TagGroupProps): ReactElement {
  const tint = CATEGORY_TINT[category]
  const label = CATEGORY_LABEL[category]

  return (
    <section
      data-testid={`tag-group-${category}`}
      className="py-6 border-t border-border"
    >
      <h2
        data-testid="tag-group-heading"
        className={`font-mono uppercase tracking-[0.12em] text-micro mb-4 ${tint}`}
      >
        {label}
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagChip
            key={tag.slug}
            slug={tag.slug}
            name={tag.name}
            category={category}
          />
        ))}
      </div>
    </section>
  )
}
