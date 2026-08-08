import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — All Tags`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="All Tags"
      tagline="Browse every topic — switches, layouts, brands, and more."
    />,
    { ...size, fonts: await getOgFonts() },
  )
}
