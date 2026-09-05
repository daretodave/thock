import { getAllArticles } from '@/lib/data-runtime'
import { canonicalUrl, siteConfig } from '@thock/seo'
import { buildRssXml, FEED_ITEM_LIMIT, RSS_CONTENT_TYPE } from '@/lib/rss/buildRss'

export const revalidate = 3600

export function GET() {
  const articles = getAllArticles().slice(0, FEED_ITEM_LIMIT)
  const xml = buildRssXml({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    link: canonicalUrl('/'),
    selfUrl: canonicalUrl('/feed.xml'),
    description: siteConfig.description,
    articles,
  })

  return new Response(xml, {
    headers: { 'content-type': RSS_CONTENT_TYPE },
  })
}
