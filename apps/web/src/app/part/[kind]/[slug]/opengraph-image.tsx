import { ImageResponse } from 'next/og'
import { siteConfig } from '@thock/seo'
import { getPartForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const KIND_TAGLINE: Record<string, string> = {
  switch: 'Switch · Specs, feel, and articles on thock.',
  'keycap-set': 'Keycap set · Profile, material, and build notes on thock.',
  board: 'Keyboard · Layout, mount style, and coverage on thock.',
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>
}) {
  const { kind, slug } = await params
  const part = getPartForOg(kind, slug)
  const alt = part
    ? `${part.name} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  return [{ id: 'og', size, contentType, alt }]
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>
}) {
  const { kind, slug } = await params
  const part = getPartForOg(kind, slug)

  if (!part) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1c20',
            color: '#e8e6e1',
            fontFamily: 'serif',
            fontSize: 64,
          }}
        >
          {siteConfig.name}
        </div>
      ),
      size,
    )
  }

  const tagline = KIND_TAGLINE[part.kind] ?? `On ${siteConfig.name}.`

  return new ImageResponse(<PillarOGContent pillarLabel={part.name} tagline={tagline} />, size)
}
