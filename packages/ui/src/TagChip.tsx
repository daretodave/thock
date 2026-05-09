import type { ReactElement } from 'react'

export type TagChipCategory =
  | 'switch'
  | 'layout'
  | 'brand'
  | 'material'
  | 'profile'
  | 'misc'

export type TagChipProps = {
  /** Tag slug, also used as the link target (`/tag/<slug>`). */
  slug: string
  /** Display name. */
  name: string
  /**
   * Tag category — drives the categorical color tint per
   * `design/decisions.jsx` "tag color = category, not vibe".
   */
  category: TagChipCategory
  /** Override the default href (`/tag/<slug>`). Rare. */
  href?: string
  /** Render as a non-link static chip. Defaults to false. */
  static?: boolean
}

const TINT_BY_CATEGORY: Record<TagChipCategory, string> = {
  switch: 'border-tag-switch text-tag-switch',
  layout: 'border-tag-layout text-tag-layout',
  brand: 'border-tag-brand text-tag-brand',
  material: 'border-tag-material text-tag-material',
  profile: 'border-tag-profile text-tag-profile',
  misc: 'border-border-hi text-text-3',
}

const BASE_CLASSES =
  'inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-micro uppercase tracking-[0.08em] transition-colors'

/**
 * Categorical-color tag chip. Renders as a link to `/tag/<slug>` by
 * default; pass `static` for non-clickable display (e.g., when the
 * chip is rendered inside another link). Lives in packages/ui so
 * pillar pages, tag pages, and search results all share one truth.
 */
export function TagChip({
  slug,
  name,
  category,
  href,
  static: isStatic = false,
}: TagChipProps): ReactElement {
  const tint = TINT_BY_CATEGORY[category] ?? TINT_BY_CATEGORY.misc
  const className = `${BASE_CLASSES} ${tint} ${
    isStatic ? '' : 'hover:bg-surface'
  }`

  if (isStatic) {
    return (
      <span className={className} data-testid="tag-chip">
        <span aria-hidden="true">#</span>
        {name}
      </span>
    )
  }

  return (
    <a
      href={href ?? `/tag/${slug}`}
      className={className}
      data-testid="tag-chip"
    >
      <span aria-hidden="true">#</span>
      {name}
    </a>
  )
}
