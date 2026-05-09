import { getArticlesByPillar } from '@thock/content'
import {
  canonicalUrl,
  isPillar,
  pillarHref,
  pillarLabel,
  siteConfig,
  type Pillar,
} from '@thock/seo'
import { buildRssXml, RSS_CONTENT_TYPE } from '@/lib/rss/buildRss'

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
  const articles = getArticlesByPillar(pillar)

  const xml = buildRssXml({
    title: `${pillarLabel(pillar)} — ${siteConfig.name}`,
    link: canonicalUrl(pillarHref(pillar)),
    description: `${pillarLabel(pillar)} stories from ${siteConfig.name}.`,
    articles,
  })

  return new Response(xml, {
    headers: { 'content-type': RSS_CONTENT_TYPE },
  })
}
