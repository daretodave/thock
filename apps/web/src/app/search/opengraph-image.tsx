import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `Search — ${siteConfig.name}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Search"
      tagline="Find switches, keycap sets, boards, and articles on thock."
    />,
    size,
  )
}
