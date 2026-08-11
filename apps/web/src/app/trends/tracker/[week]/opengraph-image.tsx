import { ImageResponse } from 'next/og'
import { getOgFonts } from '@/components/og/fonts'
import { siteConfig } from '@thock/seo'
import { getTrendSnapshotForOg } from '@/lib/data-runtime/og-runtime'
import { PillarOGContent } from '@/components/og/PillarOG'
import { describeTrackerWeek, weekKicker } from '@/lib/tracker'
import { truncate } from '@/lib/truncate'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ week: string }>
}) {
  const { week } = await params
  const snapshot = getTrendSnapshotForOg(week)
  const wk = weekKicker(week)
  const alt =
    snapshot && wk
      ? `Trends Tracker — Week ${wk.week}, ${wk.year} — ${siteConfig.name}`
      : `${siteConfig.name} — Trends Tracker Archive`
  return [{ id: 'og', size, contentType, alt }]
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ week: string }>
}) {
  const { week } = await params
  const snapshot = getTrendSnapshotForOg(week)

  if (!snapshot) {
    return new ImageResponse(
      (
        <PillarOGContent
          pillarLabel="Tracker Archive"
          tagline="Historical weekly snapshots of the mechanical keyboard trend stream."
        />
      ),
      { ...size, fonts: await getOgFonts() },
    )
  }

  const wk = weekKicker(snapshot.isoWeek)
  const pillarLabel = wk ? `Week ${wk.week}, ${wk.year}` : snapshot.isoWeek
  const summary = describeTrackerWeek(snapshot, wk)
  const tagline = truncate(summary, 90)

  return new ImageResponse(
    <PillarOGContent pillarLabel={pillarLabel} tagline={tagline} />,
    { ...size, fonts: await getOgFonts() },
  )
}
