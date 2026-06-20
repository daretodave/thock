import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — Find Your Keycap Set`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Find Your Keycap Set"
      tagline="Profile, material, legends — matched to how you work."
    />,
    size,
  )
}
