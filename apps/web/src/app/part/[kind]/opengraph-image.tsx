import { ImageResponse } from 'next/og'
import { PillarOGContent } from '@/components/og/PillarOG'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const KIND_LABEL: Record<string, string> = {
  switch: 'Switches',
  'keycap-set': 'Keycap sets',
  board: 'Boards',
}

const KIND_TAGLINE: Record<string, string> = {
  switch: 'Every switch in the thock catalog — specs, opinions, and deep dives.',
  'keycap-set': 'Every keycap set in the thock catalog — profile, material, and build notes.',
  board: 'Every board in the thock catalog — layout, mount style, and coverage.',
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ kind: string }>
}) {
  const { kind } = await params
  const label = KIND_LABEL[kind] ?? 'Parts'
  const tagline = KIND_TAGLINE[kind] ?? 'Browse parts on thock.'

  return new ImageResponse(<PillarOGContent pillarLabel={label} tagline={tagline} />, size)
}
