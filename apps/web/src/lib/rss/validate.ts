/**
 * Minimal RSS 2.0 validator. Walks an RSS XML string and asserts:
 *   1. Top-level `<rss version="2.0">` element.
 *   2. Single `<channel>` with required `<title>`, `<link>`,
 *      `<description>`.
 *   3. ≥ 1 `<item>`, each with required `<title>`, `<link>`,
 *      `<pubDate>` (matched in order regardless of internal element
 *      order — RSS 2.0 doesn't require a specific child ordering).
 *
 * No new dependency — handwritten regex-based check is enough for
 * the locked feed shape `apps/web/src/lib/rss/buildRss.ts` produces.
 * The validator throws on the first failure with a precise message
 * so test output points at the missing element.
 */

export type RssValidationResult = {
  itemCount: number
  channelTitle: string
  channelLink: string
}

const TAG_PATTERNS = {
  rssOpen: /<rss\s+[^>]*version="2\.0"[^>]*>/,
  channelOpen: /<channel\b[^>]*>/,
  channelClose: /<\/channel>/,
  itemOpen: /<item\b[^>]*>/g,
} as const

function extractFirst(
  xml: string,
  tag: string,
  scopeStart: number,
  scopeEnd: number,
): string | null {
  const opener = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`)
  const slice = xml.slice(scopeStart, scopeEnd)
  const m = opener.exec(slice)
  if (!m) return null
  return (m[1] ?? '').trim()
}

export function validateRssXml(xml: string): RssValidationResult {
  const rssMatch = TAG_PATTERNS.rssOpen.exec(xml)
  if (!rssMatch) {
    throw new Error('RSS validation: missing `<rss version="2.0">` root')
  }

  const channelOpen = TAG_PATTERNS.channelOpen.exec(xml)
  const channelClose = TAG_PATTERNS.channelClose.exec(xml)
  if (!channelOpen || !channelClose) {
    throw new Error('RSS validation: missing `<channel>` element')
  }
  if (channelClose.index < channelOpen.index) {
    throw new Error('RSS validation: malformed `<channel>` (close before open)')
  }

  const channelStart = channelOpen.index + channelOpen[0].length
  const channelEnd = channelClose.index

  // Channel-level metadata (title/link/description) must come from
  // direct children of <channel>, not from inside an <item>. Strip
  // every <item>...</item> block out of the slice before lookup so
  // a feed that has item titles but no channel title still fails.
  const channelInner = xml
    .slice(channelStart, channelEnd)
    .replace(/<item\b[\s\S]*?<\/item>/g, '')
  const channelOnlyXml = `<wrap>${channelInner}</wrap>`

  const channelTitle = extractFirst(
    channelOnlyXml,
    'title',
    0,
    channelOnlyXml.length,
  )
  const channelLink = extractFirst(
    channelOnlyXml,
    'link',
    0,
    channelOnlyXml.length,
  )
  const channelDescription = extractFirst(
    channelOnlyXml,
    'description',
    0,
    channelOnlyXml.length,
  )

  if (!channelTitle) {
    throw new Error('RSS validation: channel is missing `<title>`')
  }
  if (!channelLink) {
    throw new Error('RSS validation: channel is missing `<link>`')
  }
  if (channelDescription === null) {
    throw new Error('RSS validation: channel is missing `<description>`')
  }

  const items: Array<{ start: number; end: number }> = []
  TAG_PATTERNS.itemOpen.lastIndex = 0
  for (
    let m = TAG_PATTERNS.itemOpen.exec(xml);
    m !== null;
    m = TAG_PATTERNS.itemOpen.exec(xml)
  ) {
    const closeIdx = xml.indexOf('</item>', m.index)
    if (closeIdx < 0) {
      throw new Error('RSS validation: unclosed `<item>` element')
    }
    items.push({ start: m.index + m[0].length, end: closeIdx })
  }
  if (items.length === 0) {
    throw new Error('RSS validation: channel has no `<item>` elements')
  }

  for (const [i, range] of items.entries()) {
    const itemTitle = extractFirst(xml, 'title', range.start, range.end)
    const itemLink = extractFirst(xml, 'link', range.start, range.end)
    const itemPubDate = extractFirst(xml, 'pubDate', range.start, range.end)
    if (!itemTitle) {
      throw new Error(`RSS validation: item ${i} is missing \`<title>\``)
    }
    if (!itemLink) {
      throw new Error(`RSS validation: item ${i} is missing \`<link>\``)
    }
    if (!itemPubDate) {
      throw new Error(`RSS validation: item ${i} is missing \`<pubDate>\``)
    }
  }

  return {
    itemCount: items.length,
    channelTitle,
    channelLink,
  }
}
