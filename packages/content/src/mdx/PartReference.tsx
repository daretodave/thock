import type { ReactElement } from 'react'
import { Mono } from '@thock/ui'
import { getReferencedParts, type ResolvedPart } from '../loaders/parts'
import type { Article } from '../loaders/articles'

export type PartReferenceProps = {
  id: string
  /** Provided by ArticleBody at render time — list of resolved refs for this article. */
  parts?: ResolvedPart[]
  /** Alternative: pass the article directly (server-component path). */
  article?: Article
  fallback?: string
}

/**
 * Renders a Mono token for the resolved part with an inline link
 * to the vendor URL. Tooltip-on-hover lands in phase 5.
 */
export function PartReference({
  id,
  parts,
  article,
  fallback,
}: PartReferenceProps): ReactElement {
  const resolved = parts ?? (article ? getReferencedParts(article) : [])
  const part = resolved.find((p) => p.id === id) ?? null

  if (!part) {
    return <Mono>{fallback ?? `[unknown part:${id}]`}</Mono>
  }

  const name = part.record.name
  const vendorHref = (() => {
    if (part.kind === 'switch') return null // switch records don't carry a URL today
    if (part.kind === 'keycap-set') return part.record.imageUrl
    if (part.kind === 'board') return part.record.imageUrl
    return null
  })()

  if (!vendorHref) {
    return <Mono>{name}</Mono>
  }
  return (
    <a
      href={vendorHref}
      rel="sponsored noopener"
      target="_blank"
      className="hover:text-accent transition-colors"
    >
      <Mono>{name}</Mono>
    </a>
  )
}
