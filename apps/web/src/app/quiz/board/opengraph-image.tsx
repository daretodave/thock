import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts-node'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const alt = `${siteConfig.name} — Find Your Board`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Find Your Board"
      tagline="Five questions to the board that fits how you build."
    />,
    { ...size, fonts: await getOgFonts() },
  )
}
