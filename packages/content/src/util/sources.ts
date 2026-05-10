/**
 * Count `<Source ...>` MDX component occurrences in an article body.
 *
 * thock articles cite external references via the inline `<Source
 * href="..." />` (or `<Source href="..." text="...">...</Source>`)
 * MDX component. The /sources page surfaces a per-article tally;
 * `extractSourceCitations` below is the per-citation extractor.
 *
 * Implementation is a literal regex `/<Source\s/g` — false positives
 * are vanishingly unlikely (no other component starts with `<Source `).
 */
export function countSourceTags(body: string): number {
  const matches = body.match(/<Source\s/g)
  return matches ? matches.length : 0
}

export type SourceCitation = {
  /** Resolved citation URL (`href` attribute, raw). */
  href: string
  /**
   * Inner text content of the `<Source>` tag — what the reader
   * clicks. Whitespace-collapsed and trimmed. `null` when the
   * tag is self-closing (no children).
   */
  text: string | null
  /** Character offset of the opening `<` in the body, for ordering. */
  position: number
}

const HREF_RE = /href\s*=\s*["']([^"']+)["']/

/**
 * Extract every `<Source ...>` citation from an MDX article body.
 *
 * Returns each citation as `{ href, text, position }` in document
 * order. Both self-closing (`<Source href="..." />`) and paired
 * (`<Source href="...">text</Source>`) forms are recognized.
 *
 * Inner text is normalized: whitespace runs collapse to single
 * spaces and the result is trimmed. MDX is text-with-JSX, so
 * inner content is the literal characters between the tags —
 * nested components inside a `<Source>` would survive as raw
 * source text, but the corpus does not currently nest.
 *
 * The /sources page uses this to render a deduped per-citation
 * index alongside the per-article aggregate from `countSourceTags`.
 */
export function extractSourceCitations(body: string): SourceCitation[] {
  const citations: SourceCitation[] = []
  const TAG_RE = /<Source\s+([^>]*?)(?:\s*\/>|>([\s\S]*?)<\/Source>)/g
  let match: RegExpExecArray | null

  while ((match = TAG_RE.exec(body)) !== null) {
    const attrString = match[1] ?? ''
    const innerRaw = match[2]
    const hrefMatch = attrString.match(HREF_RE)
    if (!hrefMatch) continue
    const href = hrefMatch[1]!
    const text =
      innerRaw === undefined ? null : innerRaw.replace(/\s+/g, ' ').trim()
    citations.push({ href, text, position: match.index })
  }

  return citations
}
