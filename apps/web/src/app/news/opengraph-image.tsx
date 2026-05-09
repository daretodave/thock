import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { PILLAR_OG_TAGLINES, PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — News`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent pillarLabel="News" tagline={PILLAR_OG_TAGLINES.news!} />,
    size,
  )
}
