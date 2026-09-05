import { getArticlesByPillar } from '@/lib/data-runtime'
import {
  PILLARS,
  canonicalUrl,
  isPillar,
  pillarHref,
  pillarLabel,
  siteConfig,
  type Pillar,
} from '@thock/seo'
import { buildRssXml, FEED_ITEM_LIMIT, RSS_CONTENT_TYPE } from '@/lib/rss/buildRss'

export const revalidate = 3600

export function generateStaticParams(): { pillar: string }[] {
  return PILLARS.map((p) => ({ pillar: `${p.slug}.xml` }))
}

/**
 * Per-pillar RSS feed. Path shape is `/feed/<pillar>.xml`; Next's
 * dynamic segment captures `<pillar>.xml` so we strip the suffix
 * before the lookup. Unknown pillars 404.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pillar: string }> },
) {
  const { pillar: param } = await params
  const slug = param.endsWith('.xml') ? param.slice(0, -'.xml'.length) : param

  if (!isPillar(slug)) {
    return new Response(null, { status: 404 })
  }

  const pillar: Pillar = slug
  const articles = getArticlesByPillar(pillar).slice(0, FEED_ITEM_LIMIT)

  const xml = buildRssXml({
    title: `${pillarLabel(pillar)} — ${siteConfig.name}`,
    link: canonicalUrl(pillarHref(pillar)),
    selfUrl: canonicalUrl(`/feed/${pillar}.xml`),
    description: `${pillarLabel(pillar)} stories from ${siteConfig.name}.`,
    articles,
  })

  return new Response(xml, {
    headers: { 'content-type': RSS_CONTENT_TYPE },
  })
}
