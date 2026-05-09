import { siteConfig } from './siteConfig'
import { canonicalUrl } from './canonicalUrl'

type JsonLd<T extends string> = {
  '@context': 'https://schema.org'
  '@type': T
  [k: string]: unknown
}

export type WebSiteLd = JsonLd<'WebSite'>
export type ArticleLd = JsonLd<'Article'>
export type BreadcrumbListLd = JsonLd<'BreadcrumbList'>
export type CollectionPageLd = JsonLd<'CollectionPage'>
export type ItemListLd = JsonLd<'ItemList'>

export function buildWebSiteJsonLd(): WebSiteLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: siteConfig.publisher,
  }
}

export type BuildArticleJsonLdInput = {
  headline: string
  description: string
  path: string
  publishedAt: string
  updatedAt?: string
  author: string
  heroImage?: string | null
}

export function buildArticleJsonLd(
  input: BuildArticleJsonLdInput,
): ArticleLd {
  const url = canonicalUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: url,
    url,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { '@type': 'Person', name: input.author },
    publisher: siteConfig.publisher,
    ...(input.heroImage ? { image: input.heroImage } : {}),
  }
}

export type BreadcrumbInput = { name: string; path: string }

export function buildBreadcrumbListJsonLd(
  crumbs: BreadcrumbInput[],
): BreadcrumbListLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.path),
    })),
  }
}

export type BuildCollectionPageJsonLdInput = {
  name: string
  description: string
  path: string
}

export function buildCollectionPageJsonLd(
  input: BuildCollectionPageJsonLdInput,
): CollectionPageLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: canonicalUrl(input.path),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

/**
 * One ItemList entry. Provide either `path` (a site-relative path
 * canonicalized against `siteConfig.url`) or `url` (an absolute URL
 * passed through unchanged — used for outbound items like group
 * buys with no on-site detail page).
 */
export type ItemListEntry =
  | { name: string; path: string; url?: never }
  | { name: string; url: string; path?: never }
export type BuildItemListJsonLdInput = {
  name?: string
  items: ItemListEntry[]
}

export function buildItemListJsonLd(
  input: BuildItemListJsonLdInput,
): ItemListLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(input.name ? { name: input.name } : {}),
    itemListElement: input.items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: entry.url ?? canonicalUrl(entry.path as string),
    })),
  }
}
