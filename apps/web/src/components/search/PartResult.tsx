import type { ReactElement } from 'react'
import Link from 'next/link'
import type { PartSearchHit } from '@/lib/search/runtime'

const KIND_LABEL: Record<PartSearchHit['kind'], string> = {
  'switch': 'Switch',
  'keycap-set': 'Keycap Set',
  'board': 'Board',
  'vendor': 'Vendor',
  'newsletter': 'Newsletter',
  'group-buy': 'Group Buy',
  'tracker-week': 'Tracker Week',
}

export type PartResultProps = {
  hit: PartSearchHit
}

/**
 * One row in the /search parts results list. Shows kind chip,
 * name, and links to the /part/[kind]/[slug] detail page.
 */
export function PartResult({ hit }: PartResultProps): ReactElement {
  return (
    <div
      data-testid="search-part-result"
      data-slug={hit.slug}
      data-kind={hit.kind}
      className="border-t border-border py-4 first:border-t-0 first:pt-0"
    >
      <div className="flex items-center gap-2">
        <span
          data-testid="search-part-kind"
          className="font-mono uppercase tracking-[0.08em] text-micro text-text-2"
        >
          {KIND_LABEL[hit.kind]}
        </span>
      </div>
      <h3 className="mt-1 font-serif text-h4 text-text">
        <Link
          href={hit.href}
          className="hover:text-accent transition-colors"
        >
          {hit.name}
        </Link>
      </h3>
    </div>
  )
}
