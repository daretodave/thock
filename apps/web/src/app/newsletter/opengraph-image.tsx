import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts'
import { siteConfig } from '@thock/seo'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `Newsletter — ${siteConfig.name}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent
      pillarLabel="Newsletter"
      tagline="Signal from the mechanical keyboard world, delivered."
    />,
    { ...size, fonts: await getOgFonts() },
  )
}
