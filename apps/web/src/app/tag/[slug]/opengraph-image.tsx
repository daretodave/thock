import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts-node'
import { siteConfig } from '@thock/seo'
import { getTagForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'
import { OG_PALETTE } from '@/components/og/palette'

// Node.js runtime: Next 16 rejects `runtime = 'edge'` on routes that
// export `generateImageMetadata` (it is treated as static-param
// generation). `next/og` renders fine on the Node runtime.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CATEGORY_TAGLINE: Record<string, string> = {
  switch: 'Switch picks, specs, and deep dives on thock.',
  layout: 'Layout coverage, form-factor roundups, and build notes on thock.',
  brand: 'Vendor profiles, brand coverage, and maker spotlights on thock.',
  material: 'Material guides, acoustic comparisons, and spec breakdowns on thock.',
  profile: 'Keycap profile comparisons, sculpt guides, and spec notes on thock.',
  misc: 'Articles and deep dives on thock.',
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tag = getTagForOg(slug)
  const alt = tag
    ? `${tag.name} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  return [{ id: 'og', size, contentType, alt }]
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tag = getTagForOg(slug)

  if (!tag) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: OG_PALETTE.bg,
            color: OG_PALETTE.text,
            fontFamily: 'serif',
            fontSize: 64,
          }}
        >
          {siteConfig.name}
        </div>
      ),
      { ...size, fonts: await getOgFonts() },
    )
  }

  const tagline =
    CATEGORY_TAGLINE[tag.category] ?? `Articles tagged ${tag.name} on ${siteConfig.name}.`

  return new ImageResponse(
    <PillarOGContent pillarLabel={tag.name} tagline={tagline} />,
    { ...size, fonts: await getOgFonts() },
  )
}
