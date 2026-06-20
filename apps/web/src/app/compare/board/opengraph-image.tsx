import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — Compare Boards`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Compare Boards"
      tagline="Layout, mount, PCB, case — side by side for any two boards."
    />,
    size,
  )
}
