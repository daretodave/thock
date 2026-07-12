import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { getNewsletterForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'
import { ArticleOGContent } from '@/components/og/ArticleOG'

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

  if (!newsletter) {
    return new ImageResponse(
      (
        <PillarOGContent
          pillarLabel="Newsletter"
          tagline="Weekly signal from the mechanical keyboard world, delivered."
        />
      ),
      size,
    )
  }

  const pillarLabel = `Issue ${String(newsletter.issue).padStart(2, '0')}`
  const title = newsletter.title
  const titleFontSize =
    title.length <= 36 ? 88 : title.length <= 56 ? 76 : title.length <= 72 ? 66 : 58
  const lede =
    newsletter.lede.length > 180
      ? `${newsletter.lede.slice(0, 177).trimEnd()}…`
      : newsletter.lede

  return new ImageResponse(
    (
      <ArticleOGContent
        pillarLabel={pillarLabel}
        title={title}
        lede={lede}
        author="thock"
        readTime={newsletter.readTime}
        titleFontSize={titleFontSize}
      />
    ),
    size,
  )
}
