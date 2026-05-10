import type { ReactElement } from 'react'
import { Container, Mono } from '@thock/ui'
import type { ResolvedPart } from '@/lib/data-runtime'

export type MentionedPartsRailProps = {
  parts: ResolvedPart[]
}

const KIND_LABEL: Record<ResolvedPart['kind'], string> = {
  switch: 'Switch',
  'keycap-set': 'Keycap set',
  board: 'Board',
}

/**
 * "Build sheet" rail. Renders one descriptive entry per resolved
 * part — kind label + name. Flat list shape, no interactive
 * styling. Hides when empty.
 *
 * Heading is "Build sheet" rather than "Mentioned in this article"
 * (critique pass 4 [MED] drain): the rail surfaces only
 * `frontmatter.mentionedParts`, which is curated by the editor
 * rather than auto-extracted from prose. Reframing the heading
 * matches that curated 2-item shape honestly without overpromising
 * exhaustiveness against every part the body names.
 *
 * Visual treatment is flat (no border, no hover, no card chrome)
 * because there's no per-part page to link to yet — bordered cards
 * with hover transitions read as clickable, and a reader who
 * hovers expecting a click-through is mis-led (critique pass 6
 * [MED] drain). When per-part pages ship, the items become anchors
 * and the card chrome can return.
 */
export function MentionedPartsRail({
  parts,
}: MentionedPartsRailProps): ReactElement | null {
  if (parts.length === 0) return null

  return (
    <Container as="section" className="py-10">
      <div className="flex flex-col gap-5">
        <h2 className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
          Build sheet
        </h2>
        <ul
          data-testid="mentioned-parts-rail"
          className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {parts.map((part) => (
            <li
              key={`${part.kind}:${part.slug}`}
              className="flex flex-col gap-1"
            >
              <span className="font-mono uppercase tracking-[0.08em] text-micro text-accent-mu">
                {KIND_LABEL[part.kind]}
              </span>
              <Mono className="text-body text-text">{part.record.name}</Mono>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
