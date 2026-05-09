import { siteConfig } from './siteConfig'

/**
 * Compose an absolute canonical URL for a given site-relative path.
 *
 * - Path must start with `/`.
 * - `/` returns the bare site URL (no trailing slash).
 * - Other paths return `siteUrl + path` with no trailing slash.
 */
export function canonicalUrl(path: string): string {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    throw new Error(
      `[@thock/seo] canonicalUrl: path must start with "/" (got ${JSON.stringify(path)})`,
    )
  }
  const base = siteConfig.url.replace(/\/+$/, '')
  if (path === '/') return base
  const trimmed = path.replace(/\/+$/, '')
  return `${base}${trimmed}`
}
