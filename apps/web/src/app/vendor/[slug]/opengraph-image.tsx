import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts'
import { siteConfig } from '@thock/seo'
import { getVendorForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'
import { truncate } from '@/lib/truncate'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vendor = getVendorForOg(slug)
  const alt = vendor
    ? `${vendor.name} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  return [{ id: 'og', size, contentType, alt }]
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vendor = getVendorForOg(slug)

  const pillarLabel = vendor?.name ?? 'Vendor'
  const tagline = vendor
    ? truncate(vendor.description, 90)
    : 'The makers and retailers behind the keyboards you love.'

  return new ImageResponse(
    <PillarOGContent pillarLabel={pillarLabel} tagline={tagline} />,
    { ...size, fonts: await getOgFonts() },
  )
}
