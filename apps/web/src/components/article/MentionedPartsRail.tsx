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
 * "Build sheet" rail. Renders one card per resolved part — name,
 * kind label, brief context. Hides when empty.
 *
 * Heading is "Build sheet" rather than "Mentioned in this article"
 * (critique pass 4 [MED] drain): the rail surfaces only
 * `frontmatter.mentionedParts`, which is curated by the editor
 * rather than auto-extracted from prose. Reframing the heading
 * matches that curated 2-item shape honestly without overpromising
 * exhaustiveness against every part the body names. The
 * auto-extract path (MDX walker) stays as a phase-shaped audit row.
 *
 * Phase 5 ships the basic card; phase 13 (group buys) and later
 * polish passes layer in pricing, vendor links, and stock state.
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
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {parts.map((part) => (
            <li
              key={`${part.kind}:${part.slug}`}
              className="border border-border bg-surface p-4 transition-colors hover:border-border-hi"
            >
              <div className="flex flex-col gap-1.5">
                <span className="font-mono uppercase tracking-[0.08em] text-micro text-accent-mu">
                  {KIND_LABEL[part.kind]}
                </span>
                <Mono className="text-body text-text">{part.record.name}</Mono>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
