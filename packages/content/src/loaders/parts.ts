import {
  getBoardBySlug,
  getKeycapSetBySlug,
  getSwitchBySlug,
  type Board,
  type KeycapSet,
  type Switch,
} from '@thock/data'
import type { Article } from './articles'
import type { ArticlePartReference } from '../schema/frontmatter'

export type ResolvedPart =
  | { id: string; kind: 'switch'; slug: string; record: Switch }
  | { id: string; kind: 'keycap-set'; slug: string; record: KeycapSet }
  | { id: string; kind: 'board'; slug: string; record: Board }

/**
 * Resolves an article's `mentionedParts` against `@thock/data`.
 * Drops references whose data slug doesn't resolve (the validate
 * CLI flags those as a separate concern). Returns array stable in
 * frontmatter order.
 */
export function getReferencedParts(article: Article): ResolvedPart[] {
  const out: ResolvedPart[] = []
  for (const ref of article.frontmatter.mentionedParts as ArticlePartReference[]) {
    if (ref.kind === 'switch') {
      const record = getSwitchBySlug(ref.slug)
      if (record) out.push({ id: ref.id, kind: 'switch', slug: ref.slug, record })
    } else if (ref.kind === 'keycap-set') {
      const record = getKeycapSetBySlug(ref.slug)
      if (record) out.push({ id: ref.id, kind: 'keycap-set', slug: ref.slug, record })
    } else if (ref.kind === 'board') {
      const record = getBoardBySlug(ref.slug)
      if (record) out.push({ id: ref.id, kind: 'board', slug: ref.slug, record })
    }
  }
  return out
}
