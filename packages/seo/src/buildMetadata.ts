import type { Metadata } from 'next'
import { siteConfig } from './siteConfig'
import { canonicalUrl } from './canonicalUrl'

export type BuildMetadataInput = {
  /** Page-specific title; the full <title> applies the site template. */
  title: string
  description: string
  /** Canonical site-relative path (must start with "/"). */
  path: string
  /** Optional OG image override; falls back to the route default. */
  ogImage?: string
  /** Defaults to "website". Articles flip to "article". */
  type?: 'website' | 'article'
  /** ISO timestamp; only used when type is "article". */
  publishedAt?: string
  updatedAt?: string
  /** Per-article author byline (article type only). */
  author?: string
}

/**
 * Page title with the site-name suffix applied exactly once. Used
 * across the document `<title>`, the OG title, and the Twitter
 * title.
 *
 * Returned via `title: { absolute }` so Next.js skips the parent
 * layout's `title.template`. Without `absolute`, the template
 * applies on every nested route (`<title>News — thock — thock`)
 * but skips the root segment (`<title>keyboards, deeply.`),
 * yielding inconsistent suffix counts. Filed as MED critique
 * "every page `<title>` duplicates the site name".
 */
const SUFFIXED = (title: string): string => `${title} — ${siteConfig.name}`

/**
 * Compose a Next.js Metadata object for one route. Centralizes
 * canonical URL, OG defaults, and the document `<title>`.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = canonicalUrl(input.path)
  const isArticle = input.type === 'article'
  const fullTitle = SUFFIXED(input.title)

  const meta: Metadata = {
    title: { absolute: fullTitle },
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url,
      siteName: siteConfig.name,
      type: isArticle ? 'article' : 'website',
      ...(input.ogImage ? { images: [{ url: input.ogImage }] } : {}),
      ...(isArticle && input.publishedAt
        ? { publishedTime: input.publishedAt }
        : {}),
      ...(isArticle && input.updatedAt
        ? { modifiedTime: input.updatedAt }
        : {}),
      ...(isArticle && input.author ? { authors: [input.author] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: input.description,
      ...(input.ogImage ? { images: [input.ogImage] } : {}),
    },
  }

  return meta
}
