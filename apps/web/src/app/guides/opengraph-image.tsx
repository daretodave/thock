import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts'
import { siteConfig } from '@thock/seo'
import { PILLAR_OG_TAGLINES, PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — Guides`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    <PillarOGContent pillarLabel="Guides" tagline={PILLAR_OG_TAGLINES.guides!} />,
    { ...size, fonts: await getOgFonts() },
  )
}
