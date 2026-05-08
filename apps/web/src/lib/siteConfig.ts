/**
 * siteConfig — minimal, hand-edited canonical metadata.
 *
 * The full @thock/seo package lands in phase 4. Phase 1 ships just
 * enough for the page title, description, and Open Graph defaults.
 */
export const siteConfig = {
  name: 'thock',
  url: 'https://thock.netlify.app',
  description:
    'Editorial content hub for mechanical keyboard enthusiasts — switches, keycaps, layouts, and the people who obsess over them.',
  tagline: 'keyboards, deeply.',
} as const

export type SiteConfig = typeof siteConfig
