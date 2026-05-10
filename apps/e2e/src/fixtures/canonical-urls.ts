import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PILLARS } from '@thock/seo'

export type CanonicalUrl = {
  /** Site-relative path the smoke walker hits, e.g. "/article/foo". */
  path: string
  /**
   * Pattern key used to look up assertions in `page-reads.ts`.
   * E.g. "/article/[slug]" or "/news".
   */
  pattern: string
  /**
   * Whether the response is HTML (asserts H1 + canonical) or
   * non-HTML (asserts content-type only).
   */
  kind: 'html' | 'xml' | 'text'
}

const STATIC: CanonicalUrl[] = [
  { path: '/', pattern: '/', kind: 'html' },
  { path: '/news', pattern: '/news', kind: 'html' },
  { path: '/trends', pattern: '/trends', kind: 'html' },
  { path: '/trends/tracker', pattern: '/trends/tracker', kind: 'html' },
  { path: '/ideas', pattern: '/ideas', kind: 'html' },
  { path: '/deep-dives', pattern: '/deep-dives', kind: 'html' },
  { path: '/guides', pattern: '/guides', kind: 'html' },
  { path: '/group-buys', pattern: '/group-buys', kind: 'html' },
  { path: '/about', pattern: '/about', kind: 'html' },
  { path: '/newsletter', pattern: '/newsletter', kind: 'html' },
  { path: '/search', pattern: '/search', kind: 'html' },
  { path: '/sources', pattern: '/sources', kind: 'html' },
  { path: '/part/switch', pattern: '/part/[kind]', kind: 'html' },
  { path: '/part/keycap-set', pattern: '/part/[kind]', kind: 'html' },
  { path: '/part/board', pattern: '/part/[kind]', kind: 'html' },
  { path: '/sitemap.xml', pattern: '/sitemap.xml', kind: 'xml' },
  { path: '/robots.txt', pattern: '/robots.txt', kind: 'text' },
  { path: '/feed.xml', pattern: '/feed.xml', kind: 'xml' },
]

/**
 * Walk up from cwd to find the workspace root. We deliberately read
 * the filesystem directly here instead of going through @thock/content
 * / @thock/data — those packages use `import.meta.url`, which
 * Playwright's CJS test transformer rejects. The smoke walker only
 * needs slugs, not validated records.
 */
function findRepoRoot(): string {
  let dir = process.cwd()
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `[canonical-urls] could not find pnpm-workspace.yaml from ${process.cwd()}`,
  )
}

function listArticleSlugs(root: string): string[] {
  const dir = resolve(root, 'apps/web/src/content/articles')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort()
}

function listTagSlugs(root: string): string[] {
  const file = resolve(root, 'apps/web/src/content/tags.json')
  if (!existsSync(file)) return []
  const parsed = JSON.parse(readFileSync(file, 'utf-8')) as {
    tags: { slug: string }[]
  }
  return parsed.tags.map((t) => t.slug).sort()
}

function listPartSlugs(
  root: string,
  kind: 'switches' | 'keycap-sets' | 'boards',
): string[] {
  const dir = resolve(root, `data/${kind}`)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort()
}

/**
 * Single source of truth for every URL the site serves. Static
 * landings + dynamic articles + tags + per-pillar feeds. Adding a
 * new article or tag in the source automatically extends the smoke
 * walker — no manual edit.
 */
export function getCanonicalUrls(): CanonicalUrl[] {
  const root = findRepoRoot()
  const dynamic: CanonicalUrl[] = []

  for (const slug of listArticleSlugs(root)) {
    dynamic.push({
      path: `/article/${slug}`,
      pattern: '/article/[slug]',
      kind: 'html',
    })
  }
  for (const slug of listTagSlugs(root)) {
    dynamic.push({
      path: `/tag/${slug}`,
      pattern: '/tag/[slug]',
      kind: 'html',
    })
  }
  for (const slug of listPartSlugs(root, 'switches')) {
    dynamic.push({
      path: `/part/switch/${slug}`,
      pattern: '/part/[kind]/[slug]',
      kind: 'html',
    })
  }
  for (const slug of listPartSlugs(root, 'keycap-sets')) {
    dynamic.push({
      path: `/part/keycap-set/${slug}`,
      pattern: '/part/[kind]/[slug]',
      kind: 'html',
    })
  }
  for (const slug of listPartSlugs(root, 'boards')) {
    dynamic.push({
      path: `/part/board/${slug}`,
      pattern: '/part/[kind]/[slug]',
      kind: 'html',
    })
  }
  for (const p of PILLARS) {
    dynamic.push({
      path: `/feed/${p.slug}.xml`,
      pattern: '/feed/[pillar].xml',
      kind: 'xml',
    })
  }

  const seen = new Set<string>()
  const all = [...STATIC, ...dynamic].filter((u) => {
    if (seen.has(u.path)) return false
    seen.add(u.path)
    return true
  })
  all.sort((a, b) => a.path.localeCompare(b.path))
  return all
}
