import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts'
import { siteConfig } from '@thock/seo'
import { getNewsletterForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'
import { ArticleOGContent } from '@/components/og/ArticleOG'
import { truncate } from '@/lib/truncate'

// Node.js runtime: Next 16 rejects `runtime = 'edge'` on routes that
// export `generateImageMetadata` (it is treated as static-param
// generation). `next/og` renders fine on the Node runtime.
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
          tagline="Signal from the mechanical keyboard world, delivered."
        />
      ),
      { ...size, fonts: await getOgFonts() },
    )
  }

  const pillarLabel = `Issue ${String(newsletter.issue).padStart(2, '0')}`
  const title = newsletter.title
  const titleFontSize =
    title.length <= 36 ? 88 : title.length <= 56 ? 76 : title.length <= 72 ? 66 : 58
  const lede = truncate(newsletter.lede, 180)

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
    { ...size, fonts: await getOgFonts() },
  )
}
