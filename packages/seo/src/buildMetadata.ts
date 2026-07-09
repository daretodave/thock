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

/** Google's practical SERP snippet truncation point. */
const META_DESCRIPTION_LIMIT = 160

/**
 * Clamp a description to `limit` characters for SERP-facing meta
 * fields (meta description, og:description, twitter:description).
 * Cuts at the last word boundary at or before the limit so the
 * result never ends mid-word, then appends an ellipsis. Text
 * already within the limit passes through unchanged. JSON-LD and
 * on-page copy are unaffected — this only trims the three
 * length-constrained SERP slots.
 */
export function truncateForMeta(
  text: string,
  limit: number = META_DESCRIPTION_LIMIT,
): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut
  return `${trimmed}…`
}

/**
 * Compose a Next.js Metadata object for one route. Centralizes
 * canonical URL, OG defaults, and the document `<title>`.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = canonicalUrl(input.path)
  const isArticle = input.type === 'article'
  const fullTitle = SUFFIXED(input.title)
  const description = truncateForMeta(input.description)

  const meta: Metadata = {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
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
      description,
      ...(input.ogImage ? { images: [input.ogImage] } : {}),
    },
  }

  return meta
}
