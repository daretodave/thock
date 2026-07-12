import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { getNewsletterForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const newsletter = getNewsletterForOg(slug)
  const alt = newsletter
    ? `${newsletter.title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  return [{ id: 'og', size, contentType, alt }]
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const newsletter = getNewsletterForOg(slug)

  const pillarLabel = newsletter
    ? `Issue ${String(newsletter.issue).padStart(2, '0')}`
    : 'Newsletter'
  const tagline = newsletter
    ? newsletter.lede.length > 120
      ? `${newsletter.lede.slice(0, 117).trimEnd()}…`
      : newsletter.lede
    : 'Weekly signal from the mechanical keyboard world, delivered.'

  return new ImageResponse(
    <PillarOGContent pillarLabel={pillarLabel} tagline={tagline} />,
    size,
  )
}
