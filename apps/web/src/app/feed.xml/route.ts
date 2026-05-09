import { getAllArticles } from '@thock/content'
import { canonicalUrl, siteConfig } from '@thock/seo'
import { buildRssXml, RSS_CONTENT_TYPE } from '@/lib/rss/buildRss'

const GLOBAL_FEED_LIMIT = 20

export function GET() {
  const articles = getAllArticles().slice(0, GLOBAL_FEED_LIMIT)
  const xml = buildRssXml({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    link: canonicalUrl('/'),
    description: siteConfig.description,
    articles,
  })

  return new Response(xml, {
    headers: { 'content-type': RSS_CONTENT_TYPE },
  })
}
