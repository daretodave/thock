// content-gap-survey.ts
//
// Pure Rule-1 sliding-window freshness survey for the content-gap queue.
// Called by scripts/content-gap-survey.mjs (CLI) and tested via Vitest.
//
// Rule 1 (bearings.md): each pillar carries ≥2 articles published within
// the last 30 days, measured rolling. Three states:
//   comfortable        → count ≥ 2 — no row filed
//   hot-pursuit        → count === 1 — score 7.0
//   critical-hot-pursuit → count === 0 — score 9.5

export const PILLARS = ['news', 'trends', 'ideas', 'deep-dives', 'guides'] as const
export type Pillar = (typeof PILLARS)[number]

// Editorial prominence ordering for tie-breaking (lower index = higher prominence)
const PROMINENCE: Record<Pillar, number> = {
  trends: 0,
  news: 1,
  ideas: 2,
  'deep-dives': 3,
  guides: 4,
}

// Per-pillar impact score (Rule-1 impact ramp from bearings.md / skills/iterate.md §4.A)
const PILLAR_IMPACT: Record<Pillar, number> = {
  trends: 8,
  news: 7,
  ideas: 7,
  'deep-dives': 6,
  guides: 5,
}

export type SurveyArticle = {
  pillar: Pillar
  publishedAt: string // ISO date string
}

export type ContentGapState = 'comfortable' | 'hot-pursuit' | 'critical-hot-pursuit'

export type ContentGapCandidate = {
  pillar: Pillar
  state: ContentGapState
  score: number
  windowCount: number
  windowStart: string // ISO date string (today - 30d, midnight UTC)
  mostRecentPublishedAt: string | null // ISO date of most-recent article in corpus (or null if 0)
  impact: number
}

export type SurveyResult =
  | { status: 'comfortable' }
  | { status: 'candidate'; candidate: ContentGapCandidate }

function toDateOnly(iso: string): string {
  // Normalise any ISO date string to YYYY-MM-DD for consistent comparison
  return iso.slice(0, 10)
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime())
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

/**
 * surveyContentGaps — the pure algorithm.
 *
 * @param articles  Flat list of all articles with pillar + publishedAt.
 *                  publishedAt may be any ISO-8601 string (date or datetime).
 * @param today     The reference date (Date object, UTC midnight assumed).
 * @returns         SurveyResult — comfortable (no action) or the top candidate.
 */
export function surveyContentGaps(articles: SurveyArticle[], today: Date): SurveyResult {
  const windowStart = addDays(today, -30)
  const windowStartStr = toDateOnly(windowStart.toISOString())

  // Count articles per pillar within the 30-day window
  const counts = new Map<Pillar, number>(PILLARS.map((p) => [p, 0]))
  const mostRecent = new Map<Pillar, string | null>(PILLARS.map((p) => [p, null]))

  for (const article of articles) {
    const pillar = article.pillar as Pillar
    if (!PILLARS.includes(pillar)) continue

    const dateStr = toDateOnly(article.publishedAt)

    // Update most-recent tracker (across all time, not just the window)
    const prev = mostRecent.get(pillar) ?? null
    if (prev === null || dateStr > prev) {
      mostRecent.set(pillar, dateStr)
    }

    // Window count
    if (dateStr >= windowStartStr) {
      counts.set(pillar, (counts.get(pillar) ?? 0) + 1)
    }
  }

  // Classify each pillar
  const candidates: ContentGapCandidate[] = []

  for (const pillar of PILLARS) {
    const count = counts.get(pillar) ?? 0
    let state: ContentGapState
    let score: number

    if (count >= 2) {
      state = 'comfortable'
      score = 0
    } else if (count === 1) {
      state = 'hot-pursuit'
      score = 7.0
    } else {
      state = 'critical-hot-pursuit'
      score = 9.5
    }

    if (state !== 'comfortable') {
      candidates.push({
        pillar,
        state,
        score,
        windowCount: count,
        windowStart: windowStartStr,
        mostRecentPublishedAt: mostRecent.get(pillar) ?? null,
        impact: PILLAR_IMPACT[pillar],
      })
    }
  }

  if (candidates.length === 0) {
    return { status: 'comfortable' }
  }

  // Sort: critical-hot-pursuit first, then hot-pursuit.
  // Within same state: oldest most-recent publishedAt first (longest gap).
  // Tie: lowest window count. Tie: prominence order.
  candidates.sort((a, b) => {
    // Score desc (critical > hot)
    if (b.score !== a.score) return b.score - a.score
    // Oldest most-recent publishedAt first (null = never published = oldest)
    const aDate = a.mostRecentPublishedAt ?? '0000-00-00'
    const bDate = b.mostRecentPublishedAt ?? '0000-00-00'
    if (aDate !== bDate) return aDate < bDate ? -1 : 1
    // Lowest window count
    if (a.windowCount !== b.windowCount) return a.windowCount - b.windowCount
    // Editorial prominence
    return PROMINENCE[a.pillar] - PROMINENCE[b.pillar]
  })

  // candidates.length > 0 is guaranteed by the guard above
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { status: 'candidate', candidate: candidates[0]! }
}

/**
 * formatAuditRow — renders the AUDIT.md row for the top candidate.
 */
export function formatAuditRow(candidate: ContentGapCandidate, today: Date): string {
  const todayStr = toDateOnly(today.toISOString())
  const stateLabel =
    candidate.state === 'critical-hot-pursuit' ? 'CRITICAL HOT PURSUIT' : 'HOT PURSUIT'
  const stateDesc =
    candidate.state === 'critical-hot-pursuit'
      ? `Zero articles published in the last 30 days — critical hot pursuit (score 9.5). Loop drops iterate/polish until the pillar recovers.`
      : `One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.`

  return `
### [${stateLabel}] [content-gap] [${candidate.score}] ${candidate.pillar} pillar — ${candidate.windowCount} of ≥2 articles in last 30d
- category: content-gaps
- impact: ${candidate.impact} (Rule 1 sliding window — ${candidate.state})
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ${candidate.pillar}
- window-count: ${candidate.windowCount}
- window-start: ${candidate.windowStart}
- score: ${candidate.score}
- next: /ship-content → ${candidate.pillar} pillar article
> Filed ${todayStr} by content-gap-survey.mjs (auto-refill). ${stateDesc}`.trimStart()
}
