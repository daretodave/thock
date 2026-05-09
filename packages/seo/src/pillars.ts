export type Pillar = 'news' | 'trends' | 'ideas' | 'deep-dives' | 'guides'

export type PillarMeta = {
  slug: Pillar
  label: string
  href: `/${string}`
}

export const PILLARS: readonly PillarMeta[] = [
  { slug: 'news', label: 'News', href: '/news' },
  { slug: 'trends', label: 'Trends', href: '/trends' },
  { slug: 'ideas', label: 'Ideas', href: '/ideas' },
  { slug: 'deep-dives', label: 'Deep Dives', href: '/deep-dives' },
  { slug: 'guides', label: 'Guides', href: '/guides' },
] as const

const BY_SLUG = new Map<Pillar, PillarMeta>(PILLARS.map((p) => [p.slug, p]))

export function pillarMeta(slug: Pillar): PillarMeta {
  const meta = BY_SLUG.get(slug)
  if (!meta) {
    throw new Error(`[@thock/seo] pillarMeta: unknown pillar "${slug}"`)
  }
  return meta
}

export function pillarLabel(slug: Pillar): string {
  return pillarMeta(slug).label
}

export function pillarHref(slug: Pillar): string {
  return pillarMeta(slug).href
}

export function isPillar(value: string): value is Pillar {
  return BY_SLUG.has(value as Pillar)
}
