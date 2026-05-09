/**
 * Web app data-runtime adapter.
 *
 * The packages @thock/data and @thock/content read JSON / MDX from
 * the workspace at runtime. That works locally (and in
 * `next start`) because the entire repo is on disk, but it does
 * NOT work inside Netlify's bundled lambda — the function's
 * filesystem doesn't include `pnpm-workspace.yaml` or `/data`,
 * so `findRepoRoot()` and friends throw.
 *
 * This module is the production read path. It imports a
 * pre-generated JSON manifest (see
 * `apps/web/scripts/generate-data-manifest.mts`) so webpack
 * inlines every record into the server bundle. Loaders here have
 * the same call shape as the package equivalents — pages can
 * swap one import for another with no behavior change.
 *
 * Tests + the data:validate CLI continue to use @thock/data /
 * @thock/content directly — those run in dev/CI contexts where
 * the workspace is intact.
 */
import type {
  Switch,
  KeycapSet,
  Board,
  Vendor,
  GroupBuy,
  TrendSnapshot,
} from '@thock/data'
import type { Article, Tag, Pillar } from '@thock/content'

import manifestJson from './manifest.generated.json'

type Manifest = {
  switches: Switch[]
  keycapSets: KeycapSet[]
  boards: Board[]
  vendors: Vendor[]
  groupBuys: GroupBuy[]
  trends: TrendSnapshot[]
  articles: Article[]
  tags: Tag[]
  generatedAt: string
}

const manifest = manifestJson as unknown as Manifest

/* ────────── @thock/data parity ────────── */

export function getAllSwitches(): Switch[] {
  return manifest.switches
}
export function getSwitchBySlug(slug: string): Switch | null {
  return manifest.switches.find((s) => s.slug === slug) ?? null
}

export function getAllKeycapSets(): KeycapSet[] {
  return manifest.keycapSets
}
export function getKeycapSetBySlug(slug: string): KeycapSet | null {
  return manifest.keycapSets.find((k) => k.slug === slug) ?? null
}

export function getAllBoards(): Board[] {
  return manifest.boards
}
export function getBoardBySlug(slug: string): Board | null {
  return manifest.boards.find((b) => b.slug === slug) ?? null
}

export function getAllVendors(): Vendor[] {
  return manifest.vendors
}
export function getVendorBySlug(slug: string): Vendor | null {
  return manifest.vendors.find((v) => v.slug === slug) ?? null
}

export function getAllGroupBuys(): GroupBuy[] {
  return manifest.groupBuys
}
export function getGroupBuyBySlug(slug: string): GroupBuy | null {
  return manifest.groupBuys.find((g) => g.slug === slug) ?? null
}

/** Same semantics as `@thock/data` — not closed/shipped + endDate ≥ today. */
export function getActiveGroupBuys(now: Date = new Date()): GroupBuy[] {
  const today = now.toISOString().slice(0, 10)
  return manifest.groupBuys
    .filter((g) => g.status !== 'closed' && g.status !== 'shipped')
    .filter((g) => g.endDate >= today)
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
}

export function getAllTrendSnapshots(): TrendSnapshot[] {
  return manifest.trends
}
export function getTrendSnapshot(isoWeek: string): TrendSnapshot | null {
  return manifest.trends.find((t) => t.isoWeek === isoWeek) ?? null
}
export function getLatestTrendSnapshot(): TrendSnapshot | null {
  const all = manifest.trends
  return all.length > 0 ? (all[all.length - 1] ?? null) : null
}

/* ────────── @thock/content parity ────────── */

export function getAllArticles(): Article[] {
  return manifest.articles
}
export function getArticleBySlug(slug: string): Article | null {
  return manifest.articles.find((a) => a.slug === slug) ?? null
}
export function getArticlesByPillar(pillar: Pillar): Article[] {
  return manifest.articles.filter((a) => a.frontmatter.pillar === pillar)
}
export function getArticlesByTag(tagSlug: string): Article[] {
  return manifest.articles.filter((a) => a.frontmatter.tags.includes(tagSlug))
}

/**
 * Same scoring as `@thock/content`'s `getRelatedArticles`:
 * weight = sharedTags*2 + (samePillar ? 3 : 0); filter to
 * samePillar OR ≥2 shared tags; sort weight desc, then
 * publishedAt desc; cap at n.
 */
export function getRelatedArticles(article: Article, n = 4): Article[] {
  const candidates = manifest.articles.filter((a) => a.slug !== article.slug)
  const articleTags = new Set(article.frontmatter.tags)

  const scored = candidates
    .map((a) => {
      const shared = a.frontmatter.tags.filter((t) => articleTags.has(t)).length
      const samePillar = a.frontmatter.pillar === article.frontmatter.pillar
      const weight = shared * 2 + (samePillar ? 3 : 0)
      return { article: a, weight, shared, samePillar }
    })
    .filter((s) => s.samePillar || s.shared >= 2)
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      return b.article.frontmatter.publishedAt.localeCompare(
        a.article.frontmatter.publishedAt,
      )
    })

  return scored.slice(0, n).map((s) => s.article)
}

export function getAllTags(): Tag[] {
  return [...manifest.tags].sort((a, b) => a.slug.localeCompare(b.slug))
}
export function getTagBySlug(slug: string): Tag | null {
  return manifest.tags.find((t) => t.slug === slug) ?? null
}

/** Manifest build timestamp — useful for debugging staleness. */
export function manifestGeneratedAt(): string {
  return manifest.generatedAt
}
