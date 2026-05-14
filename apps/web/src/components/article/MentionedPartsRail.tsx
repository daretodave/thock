import type { ReactElement } from 'react'
import Link from 'next/link'
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
 * part — kind label + name, wrapped in a `<Link>` to the per-part
 * page at `/part/<kind>/<slug>` (phase 21).
 *
 * Heading is "Build sheet" rather than "Mentioned in this article"
 * (critique pass 4 [MED] drain): the rail surfaces only
 * `frontmatter.mentionedParts`, which is curated by the editor
 * rather than auto-extracted from prose. Reframing the heading
 * matches that curated shape honestly without overpromising
 * exhaustiveness against every part the body names.
 *
 * Visual treatment stays flat (no card chrome) — the links are
 * subtle text-color affordance only. The pass-6 [MED] drain
 * stripped the bordered-card chrome because items had nowhere to
 * go; phase 21 ships the destinations, so the items are now real
 * anchors. Card chrome can return in a later visual pass if reader
 * feedback wants more affordance density.
 */
export function MentionedPartsRail({
  parts,
}: MentionedPartsRailProps): ReactElement | null {
  if (parts.length === 0) return null

  return (
    <Container as="section" className="py-10">
      <div className="flex flex-col gap-5">
        <h2
          data-testid="mentioned-parts-heading"
          className="font-mono uppercase tracking-[0.12em] text-micro text-text-2"
        >
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
              <Link
                href={`/part/${part.kind}/${part.slug}`}
                data-testid="mentioned-parts-rail-item"
                className="group flex flex-col gap-1"
              >
                <span className="font-mono uppercase tracking-[0.08em] text-micro text-accent">
                  {KIND_LABEL[part.kind]}
                </span>
                <Mono className="text-body text-text group-hover:text-accent transition-colors">
                  {part.record.name}
                </Mono>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
