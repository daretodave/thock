import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { PILLAR_OG_TAGLINES, PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — Deep Dives`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Deep Dives"
      tagline={PILLAR_OG_TAGLINES['deep-dives']!}
    />,
    size,
  )
}
