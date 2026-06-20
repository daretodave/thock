import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — Compare Switches`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Compare Switches"
      tagline="Side-by-side specs for any two switches in the catalog."
    />,
    size,
  )
}
