/**
 * Minimal data-runtime for edge OG image handlers.
 *
 * Imports only og-manifest.generated.json (article slugs + the four
 * frontmatter fields needed for OG card generation, no body content;
 * plus tag slug/name/category for /tag/[slug] OG handlers).
 * At ~22 KB vs the full manifest's ~715 KB, this keeps the edge
 * function bundle under Vercel's 1 MB edge-function size limit.
 *
 * Only expose functions needed by OG image handlers here. Use
 * data-runtime/index.ts (full manifest) for all other server
 * components.
 */
import type { Pillar } from '@thock/content'
import type { Tag } from '@thock/content'

import ogManifestJson from './og-manifest.generated.json'

export type ArticleOGData = {
  slug: string
  readTime: number
  frontmatter: {
    title: string
    lede: string
    pillar: Pillar
    author: string
  }
}

export type TagOGData = {
  slug: string
  name: string
  category: Tag['category']
}

export type PartOGData = {
  slug: string
  kind: 'switch' | 'keycap-set' | 'board'
  name: string
}

type OGManifest = {
  articles: ArticleOGData[]
  tags: TagOGData[]
  parts: PartOGData[]
  generatedAt: string
}

const ogManifest = ogManifestJson as unknown as OGManifest

export function getArticleForOg(slug: string): ArticleOGData | null {
  return ogManifest.articles.find((a) => a.slug === slug) ?? null
}

export function getTagForOg(slug: string): TagOGData | null {
  return (ogManifest.tags ?? []).find((t) => t.slug === slug) ?? null
}

export function getPartForOg(kind: string, slug: string): PartOGData | null {
  return (ogManifest.parts ?? []).find((p) => p.kind === kind && p.slug === slug) ?? null
}
