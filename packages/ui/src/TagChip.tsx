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
  misc: 'border-border-hi text-text-2',
}

const CATEGORY_PREFIX: Record<TagChipCategory, string | null> = {
  switch: 'switch',
  layout: 'layout',
  brand: 'brand',
  material: 'material',
  profile: 'profile',
  misc: null,
}

const BASE_CLASSES =
  'inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-micro uppercase tracking-[0.08em] transition-colors'

/**
 * Categorical-color tag chip. Renders the category as a small
 * leading prefix so first-time readers can decode unfamiliar
 * tag names (e.g. `LAYOUT · ALICE` reads as a layout style, not a
 * person's name). Filed as a HIGH critique by a user landing on
 * the home page and asking "who's Alice?". Misc-category chips
 * keep the legacy `#name` form since there's no useful prefix.
 *
 * Renders as a link to `/tag/<slug>` by default; pass `static`
 * for non-clickable display (e.g., inside another link). Lives in
 * packages/ui so pillar pages, tag pages, and search results all
 * share one truth.
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
  const prefix = CATEGORY_PREFIX[category]
  const ariaLabel = prefix ? `${prefix} tag: ${name}` : `tag: ${name}`

  const inner = prefix ? (
    <>
      <span data-testid="tag-chip-category" className="opacity-70">
        {prefix}
      </span>
      <span aria-hidden="true" className="opacity-50">
        ·
      </span>
      <span data-testid="tag-chip-name">{name}</span>
    </>
  ) : (
    <>
      <span aria-hidden="true">#</span>
      <span data-testid="tag-chip-name">{name}</span>
    </>
  )

  if (isStatic) {
    return (
      <span
        className={className}
        data-testid="tag-chip"
        data-category={category}
        aria-label={ariaLabel}
      >
        {inner}
      </span>
    )
  }

  return (
    <a
      href={href ?? `/tag/${slug}`}
      className={className}
      data-testid="tag-chip"
      data-category={category}
      aria-label={ariaLabel}
    >
      {inner}
    </a>
  )
}
