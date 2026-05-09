import type { Article } from '@thock/content'
import { canonicalUrl, siteConfig } from '@thock/seo'

const escape = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const rfc822 = (iso: string): string => new Date(iso).toUTCString()

export type RssChannel = {
  /** Channel title — usually `siteConfig.name` or `<pillar> — siteConfig.name`. */
  title: string
  /** Link back to an HTML index page (`/`, `/news`, etc.). */
  link: string
  /** Channel description. */
  description: string
  articles: Article[]
}

/**
 * Build a minimal-but-valid RSS 2.0 XML body for the given articles.
 * No HTML in `<description>` — uses the article lede so feed readers
 * can preview safely.
 */
export function buildRssXml(channel: RssChannel): string {
  const items = channel.articles
    .map((a) => {
      const url = canonicalUrl(`/article/${a.slug}`)
      return [
        '    <item>',
        `      <title>${escape(a.frontmatter.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(a.frontmatter.publishedAt)}</pubDate>`,
        `      <description>${escape(a.frontmatter.lede)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const lastBuild = rfc822(new Date().toISOString())

  return [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escape(channel.title)}</title>`,
    `    <link>${channel.link}</link>`,
    `    <description>${escape(channel.description)}</description>`,
    `    <language>en</language>`,
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <generator>${escape(siteConfig.name)}</generator>`,
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter(Boolean)
    .join('\n')
}

export const RSS_CONTENT_TYPE = 'application/rss+xml; charset=utf-8'
