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

const TITLE_TEMPLATE = (title: string): string =>
  `${title} — ${siteConfig.name}`

/**
 * Compose a Next.js Metadata object for one route. Centralizes
 * canonical URL, OG defaults, and the `<title>` template.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = canonicalUrl(input.path)
  const isArticle = input.type === 'article'

  const meta: Metadata = {
    title: TITLE_TEMPLATE(input.title),
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: TITLE_TEMPLATE(input.title),
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
      title: TITLE_TEMPLATE(input.title),
      description: input.description,
      ...(input.ogImage ? { images: [input.ogImage] } : {}),
    },
  }

  return meta
}
