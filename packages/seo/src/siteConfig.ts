/**
 * Canonical site metadata. Single source of truth — every consumer
 * reads through `@thock/seo`, never hard-codes these values.
 */
export const siteConfig = {
  name: 'thock',
  url: 'https://thock.xyz',
  description:
    'Editorial content hub for mechanical keyboard enthusiasts — switches, keycaps, layouts, and the people who obsess over them.',
  tagline: 'keyboards, deeply.',
  publisher: {
    '@type': 'Organization' as const,
    name: 'thock',
    url: 'https://thock.xyz',
    logo: {
      '@type': 'ImageObject' as const,
      url: 'https://thock.xyz/apple-icon',
      width: 180,
      height: 180,
    },
  },
} as const

export type SiteConfig = typeof siteConfig
