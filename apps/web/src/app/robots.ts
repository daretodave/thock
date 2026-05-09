import type { MetadataRoute } from 'next'
import { canonicalUrl, siteConfig } from '@thock/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: canonicalUrl('/'),
  }
}
