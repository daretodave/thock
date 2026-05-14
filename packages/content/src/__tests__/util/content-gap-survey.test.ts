import { describe, it, expect } from 'vitest'
import { surveyContentGaps, formatAuditRow, PILLARS } from '../../util/content-gap-survey'
import type { SurveyArticle } from '../../util/content-gap-survey'

// Reference "today" for all tests (fixed for determinism)
const TODAY = new Date('2026-06-15T00:00:00.000Z')
const YESTERDAY = '2026-06-14'
const DAY_29 = '2026-05-17' // 29 days before today — still in window
const DAY_31 = '2026-05-15' // 31 days before today — outside window

// Helpers
function makeArticle(pillar: string, publishedAt: string): SurveyArticle {
  return { pillar: pillar as SurveyArticle['pillar'], publishedAt }
}

function comfortableSet(): SurveyArticle[] {
  // 2 recent articles per pillar — comfortable across the board
  return PILLARS.flatMap((p) => [
    makeArticle(p, YESTERDAY),
    makeArticle(p, DAY_29),
  ])
}

// ── Test A (required by build plan): 1 article in 30d, deep-dives ────────────
describe('surveyContentGaps — hot pursuit', () => {
  it('Test A: 1 article in 30d for deep-dives → rule=1 pillar="deep-dives" score=7.0', () => {
    const articles: SurveyArticle[] = [
      // All other pillars comfortable (2 each)
      makeArticle('news', YESTERDAY),
      makeArticle('news', DAY_29),
      makeArticle('trends', YESTERDAY),
      makeArticle('trends', DAY_29),
      makeArticle('ideas', YESTERDAY),
      makeArticle('ideas', DAY_29),
      makeArticle('guides', YESTERDAY),
      makeArticle('guides', DAY_29),
      // deep-dives: only 1 in window + 1 outside
      makeArticle('deep-dives', YESTERDAY),
      makeArticle('deep-dives', DAY_31), // outside 30d
    ]

    const result = surveyContentGaps(articles, TODAY)

    expect(result.status).toBe('candidate')
    if (result.status !== 'candidate') return

    expect(result.candidate.pillar).toBe('deep-dives')
    expect(result.candidate.state).toBe('hot-pursuit')
    expect(result.candidate.score).toBe(7.0)
    expect(result.candidate.windowCount).toBe(1)
    expect(result.candidate.impact).toBe(6)
  })
})

// ── Test B (required by build plan): 0 articles in 30d, news ─────────────────
describe('surveyContentGaps — critical hot pursuit', () => {
  it('Test B: 0 articles in 30d for news → score=9.5 critical-hot-pursuit', () => {
    const articles: SurveyArticle[] = [
      // All other pillars comfortable (2 each)
      makeArticle('trends', YESTERDAY),
      makeArticle('trends', DAY_29),
      makeArticle('ideas', YESTERDAY),
      makeArticle('ideas', DAY_29),
      makeArticle('deep-dives', YESTERDAY),
      makeArticle('deep-dives', DAY_29),
      makeArticle('guides', YESTERDAY),
      makeArticle('guides', DAY_29),
      // news: all articles outside the 30-day window
      makeArticle('news', DAY_31),
      makeArticle('news', '2026-04-01'),
    ]

    const result = surveyContentGaps(articles, TODAY)

    expect(result.status).toBe('candidate')
    if (result.status !== 'candidate') return

    expect(result.candidate.pillar).toBe('news')
    expect(result.candidate.state).toBe('critical-hot-pursuit')
    expect(result.candidate.score).toBe(9.5)
    expect(result.candidate.windowCount).toBe(0)
    expect(result.candidate.impact).toBe(7)
  })
})

// ── Comfortable state ─────────────────────────────────────────────────────────
describe('surveyContentGaps — comfortable', () => {
  it('all pillars at ≥2 articles in 30d → comfortable, no candidate', () => {
    const result = surveyContentGaps(comfortableSet(), TODAY)
    expect(result.status).toBe('comfortable')
  })

  it('empty article list → all pillars critical (news picked first by prominence)', () => {
    const result = surveyContentGaps([], TODAY)
    expect(result.status).toBe('candidate')
    if (result.status !== 'candidate') return
    // Trends has highest prominence when all are tied at 0 count + no most-recent
    expect(result.candidate.pillar).toBe('trends')
    expect(result.candidate.score).toBe(9.5)
  })
})

// ── Tie-breaking ──────────────────────────────────────────────────────────────
describe('surveyContentGaps — tie-breaking', () => {
  it('critical beats hot when both present', () => {
    const articles: SurveyArticle[] = [
      // news: 0 in window (critical)
      makeArticle('news', DAY_31),
      // deep-dives: 1 in window (hot)
      makeArticle('deep-dives', YESTERDAY),
      // all other pillars comfortable
      makeArticle('trends', YESTERDAY),
      makeArticle('trends', DAY_29),
      makeArticle('ideas', YESTERDAY),
      makeArticle('ideas', DAY_29),
      makeArticle('guides', YESTERDAY),
      makeArticle('guides', DAY_29),
    ]
    const result = surveyContentGaps(articles, TODAY)
    expect(result.status).toBe('candidate')
    if (result.status !== 'candidate') return
    expect(result.candidate.state).toBe('critical-hot-pursuit')
    expect(result.candidate.pillar).toBe('news')
  })

  it('among equal-state tie: pillar with older most-recent publishedAt wins', () => {
    const articles: SurveyArticle[] = [
      // ideas: 0 in window, most-recent 2026-04-01
      makeArticle('ideas', '2026-04-01'),
      // deep-dives: 0 in window, most-recent 2026-03-01 (older → should win)
      makeArticle('deep-dives', '2026-03-01'),
      // all other pillars comfortable
      makeArticle('news', YESTERDAY),
      makeArticle('news', DAY_29),
      makeArticle('trends', YESTERDAY),
      makeArticle('trends', DAY_29),
      makeArticle('guides', YESTERDAY),
      makeArticle('guides', DAY_29),
    ]
    const result = surveyContentGaps(articles, TODAY)
    expect(result.status).toBe('candidate')
    if (result.status !== 'candidate') return
    // deep-dives has older most-recent publishedAt → picked first
    expect(result.candidate.pillar).toBe('deep-dives')
  })

  it('among equal-state + equal most-recent: lower window count wins', () => {
    const articles: SurveyArticle[] = [
      // news: 1 in window, most-recent = DAY_29
      makeArticle('news', DAY_29),
      // guides: 1 in window, most-recent = DAY_29 (same date)
      makeArticle('guides', DAY_29),
      // all other pillars comfortable
      makeArticle('trends', YESTERDAY),
      makeArticle('trends', DAY_29),
      makeArticle('ideas', YESTERDAY),
      makeArticle('ideas', DAY_29),
      makeArticle('deep-dives', YESTERDAY),
      makeArticle('deep-dives', DAY_29),
    ]
    // Both news and guides have 1 in window and same most-recent date.
    // Prominence tiebreak: news=1 vs guides=4 → news wins.
    const result = surveyContentGaps(articles, TODAY)
    expect(result.status).toBe('candidate')
    if (result.status !== 'candidate') return
    expect(result.candidate.pillar).toBe('news')
  })
})

// ── formatAuditRow ─────────────────────────────────────────────────────────────
describe('formatAuditRow', () => {
  it('hot-pursuit row includes correct score and pillar label', () => {
    const articles = [
      makeArticle('deep-dives', YESTERDAY),
      ...comfortableSet().filter((a) => a.pillar !== 'deep-dives'),
    ]
    const result = surveyContentGaps(articles, TODAY)
    if (result.status !== 'candidate') throw new Error('expected candidate')
    const row = formatAuditRow(result.candidate, TODAY)
    expect(row).toContain('HOT PURSUIT')
    expect(row).toContain('deep-dives')
    expect(row).toContain('7.0')
    expect(row).toContain('category: content-gaps')
    expect(row).toContain('rule: Rule 1')
  })

  it('critical-hot-pursuit row includes 9.5 score and emergency description', () => {
    const result = surveyContentGaps(
      comfortableSet().filter((a) => a.pillar !== 'news'),
      TODAY
    )
    if (result.status !== 'candidate') throw new Error('expected candidate')
    const row = formatAuditRow(result.candidate, TODAY)
    expect(row).toContain('CRITICAL HOT PURSUIT')
    expect(row).toContain('9.5')
    expect(row).toContain('critical hot pursuit')
  })
})
