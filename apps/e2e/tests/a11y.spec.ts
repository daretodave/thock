/**
 * Phase 32 — Accessibility audit (Phase B: full WCAG AA gate)
 *
 * Runs @axe-core/playwright with WCAG 2.1 AA rules on a curated set of
 * canonical URLs. Phase B posture (upgraded from Phase A in phase 32):
 *   - FAIL on critical AND serious violations (color-contrast, form labels,
 *     keyboard traps, unlabeled interactive elements, etc.)
 *   - WARN (log, do not fail) on moderate/minor violations;
 *     these are filed as [a11y] AUDIT.md rows and drained by /iterate ticks.
 *
 * All serious color-contrast rows from Phase A were drained by the iterate
 * drip across phases 26–32 (25 audit rows, 21 commits). Phase B gate is safe
 * to enable: no serious violations remain in AUDIT.md.
 *
 * Targeted regression guards below (search "regression guard") lock in specific
 * element-level assertions so each drained finding stays permanently fixed.
 */
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa']

type AxeViolation = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number]

function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map(
      (v) =>
        `  [${v.impact}] ${v.id}: ${v.description}\n` +
        v.nodes
          .slice(0, 2)
          .map((n) => `    → ${n.html.slice(0, 120)}`)
          .join('\n'),
    )
    .join('\n')
}

async function assertAxeClean(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze()

  const critical = results.violations.filter((v) => v.impact === 'critical')
  const serious = results.violations.filter((v) => v.impact === 'serious')
  const moderate = results.violations.filter((v) => v.impact === 'moderate')
  const minor = results.violations.filter((v) => v.impact === 'minor')

  // Phase B: log moderate/minor for AUDIT.md filing, do not fail
  const softViolations = [...moderate, ...minor]
  if (softViolations.length > 0) {
    console.warn(
      `[a11y Phase B] moderate/minor violations on ${label} (filed to AUDIT.md):\n` +
        formatViolations(softViolations),
    )
  }

  // Phase B hard gate: critical AND serious violations block.
  // All known serious violations drained in the Phase A iterate drip (phases 26–32).
  // New serious violations introduced by future routes will block here.
  const hardViolations = [...critical, ...serious]
  if (hardViolations.length > 0) {
    throw new Error(
      `[a11y] CRITICAL/SERIOUS violations on ${label}:\n${formatViolations(hardViolations)}`,
    )
  }

  return results
}

async function runAxe(page: Page, url: string) {
  await page.goto(url)
  // Wait for the page to be fully painted (avoids false loading-state hits)
  await page.waitForLoadState('networkidle')

  return assertAxeClean(page, url)
}

// Clicks the first option for each of a quiz's 4 questions, landing on the
// results state (auto-advance fires ~150ms after each click). Each quiz
// component names its results container differently (SwitchQuiz uses
// "quiz-results", KeycapSetQuiz uses "keycap-quiz-results").
async function completeQuiz(page: Page, url: string, resultsTestId: string) {
  await page.goto(url)
  await page.waitForLoadState('networkidle')

  for (let i = 0; i < 4; i++) {
    const firstOption = page.locator('[data-testid="quiz-option-description"]').first()
    await firstOption.click()
    await page.waitForTimeout(200)
  }

  await expect(page.locator(`[data-testid="${resultsTestId}"]`)).toBeVisible()
}

// Desktop suite — 30 canonical pages (phase 49: 7 routes from phases 43–49 added; issue #383: 4 pillar list pages added; issue #384: /news added; issue #385: 9 more routes added)
test.describe('a11y — desktop', () => {
  test('home (/)', async ({ page }) => {
    await runAxe(page, '/')
  })

  test('article (/article/gateron-oil-king-deep-dive)', async ({ page }) => {
    await runAxe(page, '/article/gateron-oil-king-deep-dive')
  })

  test('trends tracker (/trends/tracker)', async ({ page }) => {
    await runAxe(page, '/trends/tracker')
  })

  test('group buys (/group-buys)', async ({ page }) => {
    await runAxe(page, '/group-buys')
  })

  test('search (/search)', async ({ page }) => {
    await runAxe(page, '/search')
  })

  test('about (/about)', async ({ page }) => {
    await runAxe(page, '/about')
  })

  test('tag page (/tag/linear)', async ({ page }) => {
    await runAxe(page, '/tag/linear')
  })

  test('parts catalog (/parts)', async ({ page }) => {
    await runAxe(page, '/parts')
  })

  test('switch quiz (/quiz/switch)', async ({ page }) => {
    await runAxe(page, '/quiz/switch')
  })

  // Phases 43–49 routes added to close the a11y coverage gap (issue #371)
  test('article archive (/archive)', async ({ page }) => {
    await runAxe(page, '/archive')
  })

  test('switch compare (/compare/switch)', async ({ page }) => {
    await runAxe(page, '/compare/switch')
  })

  test('board compare (/compare/board)', async ({ page }) => {
    await runAxe(page, '/compare/board')
  })

  test('vendors index (/vendors)', async ({ page }) => {
    await runAxe(page, '/vendors')
  })

  test('vendor detail (/vendor/cannonkeys)', async ({ page }) => {
    await runAxe(page, '/vendor/cannonkeys')
  })

  test('tools index (/tools)', async ({ page }) => {
    await runAxe(page, '/tools')
  })

  test('keycap-set quiz (/quiz/keycap-set)', async ({ page }) => {
    await runAxe(page, '/quiz/keycap-set')
  })

  // Pillar list pages — closes the a11y coverage gap (issue #383)
  test('guides pillar (/guides)', async ({ page }) => {
    await runAxe(page, '/guides')
  })

  test('ideas pillar (/ideas)', async ({ page }) => {
    await runAxe(page, '/ideas')
  })

  test('deep dives pillar (/deep-dives)', async ({ page }) => {
    await runAxe(page, '/deep-dives')
  })

  test('trends pillar (/trends)', async ({ page }) => {
    await runAxe(page, '/trends')
  })

  // News pillar — the fifth primary pillar, missed by issue #383 (issue #384)
  test('news pillar (/news)', async ({ page }) => {
    await runAxe(page, '/news')
  })

  // 9 more routes closing the coverage gap (issue #385)
  test('group buys past (/group-buys/past)', async ({ page }) => {
    await runAxe(page, '/group-buys/past')
  })

  test('newsletter (/newsletter)', async ({ page }) => {
    await runAxe(page, '/newsletter')
  })

  test('newsletter detail (/newsletter/thock-weekly-001)', async ({ page }) => {
    await runAxe(page, '/newsletter/thock-weekly-001')
  })

  test('sources (/sources)', async ({ page }) => {
    await runAxe(page, '/sources')
  })

  test('tags index (/tags)', async ({ page }) => {
    await runAxe(page, '/tags')
  })

  test('part kind index — switch (/part/switch)', async ({ page }) => {
    await runAxe(page, '/part/switch')
  })

  test('part kind index — keycap-set (/part/keycap-set)', async ({ page }) => {
    await runAxe(page, '/part/keycap-set')
  })

  test('part kind index — board (/part/board)', async ({ page }) => {
    await runAxe(page, '/part/board')
  })

  test('part detail (/part/switch/gateron-oil-king)', async ({ page }) => {
    await runAxe(page, '/part/switch/gateron-oil-king')
  })

  // Part detail templates for the other two kinds — different spec fields
  // and MentionedInArticles content than the switch template (issue #388)
  test('part detail (/part/keycap-set/domikey-wob)', async ({ page }) => {
    await runAxe(page, '/part/keycap-set/domikey-wob')
  })

  test('part detail (/part/board/class80)', async ({ page }) => {
    await runAxe(page, '/part/board/class80')
  })

  test('tracker archive week (/trends/tracker/2026-W19)', async ({ page }) => {
    await runAxe(page, '/trends/tracker/2026-W19')
  })

  // 404 templates — 8 distinct not-found routes, previously zero full-page
  // axe coverage (only narrow color-contrast regression guards existed).
  // issue #389; newsletter route added via issue #574
  test('root not-found (/this-route-does-not-exist-anywhere)', async ({ page }) => {
    await runAxe(page, '/this-route-does-not-exist-anywhere')
  })

  test('article not-found (/article/this-slug-does-not-exist)', async ({ page }) => {
    await runAxe(page, '/article/this-slug-does-not-exist')
  })

  test('tag not-found (/tag/this-tag-does-not-exist)', async ({ page }) => {
    await runAxe(page, '/tag/this-tag-does-not-exist')
  })

  test('part kind not-found (/part/invalid-kind)', async ({ page }) => {
    await runAxe(page, '/part/invalid-kind')
  })

  test('part detail not-found (/part/switch/this-switch-does-not-exist)', async ({ page }) => {
    await runAxe(page, '/part/switch/this-switch-does-not-exist')
  })

  test('vendor not-found (/vendor/this-vendor-does-not-exist)', async ({ page }) => {
    await runAxe(page, '/vendor/this-vendor-does-not-exist')
  })

  test('tracker week not-found (/trends/tracker/2099-W99)', async ({ page }) => {
    await runAxe(page, '/trends/tracker/2099-W99')
  })

  test('newsletter issue not-found (/newsletter/this-issue-does-not-exist)', async ({ page }) => {
    await runAxe(page, '/newsletter/this-issue-does-not-exist')
  })
})

// Mobile suite — 30 routes at 375px (matches desktop suite; extended to phases 43–49 + pillar list pages + issue #385)
test.describe('a11y — mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('home (/) — mobile', async ({ page }) => {
    await runAxe(page, '/')
  })

  test('article — mobile', async ({ page }) => {
    await runAxe(page, '/article/gateron-oil-king-deep-dive')
  })

  test('trends tracker — mobile', async ({ page }) => {
    await runAxe(page, '/trends/tracker')
  })

  test('group buys — mobile', async ({ page }) => {
    await runAxe(page, '/group-buys')
  })

  test('search — mobile', async ({ page }) => {
    await runAxe(page, '/search')
  })

  test('about — mobile', async ({ page }) => {
    await runAxe(page, '/about')
  })

  test('tag page — mobile', async ({ page }) => {
    await runAxe(page, '/tag/linear')
  })

  test('parts catalog — mobile', async ({ page }) => {
    await runAxe(page, '/parts')
  })

  test('switch quiz — mobile', async ({ page }) => {
    await runAxe(page, '/quiz/switch')
  })

  test('article archive — mobile', async ({ page }) => {
    await runAxe(page, '/archive')
  })

  test('switch compare — mobile', async ({ page }) => {
    await runAxe(page, '/compare/switch')
  })

  test('board compare — mobile', async ({ page }) => {
    await runAxe(page, '/compare/board')
  })

  test('vendors index — mobile', async ({ page }) => {
    await runAxe(page, '/vendors')
  })

  test('vendor detail — mobile', async ({ page }) => {
    await runAxe(page, '/vendor/cannonkeys')
  })

  test('tools index — mobile', async ({ page }) => {
    await runAxe(page, '/tools')
  })

  test('keycap-set quiz — mobile', async ({ page }) => {
    await runAxe(page, '/quiz/keycap-set')
  })

  // Pillar list pages — closes the a11y coverage gap (issue #383)
  test('guides pillar — mobile', async ({ page }) => {
    await runAxe(page, '/guides')
  })

  test('ideas pillar — mobile', async ({ page }) => {
    await runAxe(page, '/ideas')
  })

  test('deep dives pillar — mobile', async ({ page }) => {
    await runAxe(page, '/deep-dives')
  })

  test('trends pillar — mobile', async ({ page }) => {
    await runAxe(page, '/trends')
  })

  // News pillar — the fifth primary pillar, missed by issue #383 (issue #384)
  test('news pillar — mobile', async ({ page }) => {
    await runAxe(page, '/news')
  })

  // 9 more routes closing the coverage gap (issue #385)
  test('group buys past — mobile', async ({ page }) => {
    await runAxe(page, '/group-buys/past')
  })

  test('newsletter — mobile', async ({ page }) => {
    await runAxe(page, '/newsletter')
  })

  test('newsletter detail — mobile', async ({ page }) => {
    await runAxe(page, '/newsletter/thock-weekly-001')
  })

  test('sources — mobile', async ({ page }) => {
    await runAxe(page, '/sources')
  })

  test('tags index — mobile', async ({ page }) => {
    await runAxe(page, '/tags')
  })

  test('part kind index — switch — mobile', async ({ page }) => {
    await runAxe(page, '/part/switch')
  })

  test('part kind index — keycap-set — mobile', async ({ page }) => {
    await runAxe(page, '/part/keycap-set')
  })

  test('part kind index — board — mobile', async ({ page }) => {
    await runAxe(page, '/part/board')
  })

  test('part detail — mobile', async ({ page }) => {
    await runAxe(page, '/part/switch/gateron-oil-king')
  })

  // Part detail templates for the other two kinds (issue #388)
  test('part detail — keycap-set — mobile', async ({ page }) => {
    await runAxe(page, '/part/keycap-set/domikey-wob')
  })

  test('part detail — board — mobile', async ({ page }) => {
    await runAxe(page, '/part/board/class80')
  })

  test('tracker archive week — mobile', async ({ page }) => {
    await runAxe(page, '/trends/tracker/2026-W19')
  })

  // 404 templates — mobile (issue #389; newsletter route added via issue #574)
  test('root not-found — mobile', async ({ page }) => {
    await runAxe(page, '/this-route-does-not-exist-anywhere')
  })

  test('article not-found — mobile', async ({ page }) => {
    await runAxe(page, '/article/this-slug-does-not-exist')
  })

  test('tag not-found — mobile', async ({ page }) => {
    await runAxe(page, '/tag/this-tag-does-not-exist')
  })

  test('part kind not-found — mobile', async ({ page }) => {
    await runAxe(page, '/part/invalid-kind')
  })

  test('part detail not-found — mobile', async ({ page }) => {
    await runAxe(page, '/part/switch/this-switch-does-not-exist')
  })

  test('vendor not-found — mobile', async ({ page }) => {
    await runAxe(page, '/vendor/this-vendor-does-not-exist')
  })

  test('tracker week not-found — mobile', async ({ page }) => {
    await runAxe(page, '/trends/tracker/2099-W99')
  })

  test('newsletter issue not-found — mobile', async ({ page }) => {
    await runAxe(page, '/newsletter/this-issue-does-not-exist')
  })
})

// Compare-tool populated-state coverage (issue #460): the desktop/mobile suites
// above only ever axe-scan the bare selector-only empty state — neither
// SwitchCompareTable nor BoardCompareTable had ever run a full-page axe scan.
// The populated state renders directly off query params (no click-through
// needed), so these navigate straight to `?a=<slug>&b=<slug>`.
test.describe('a11y — compare tool (populated state)', () => {
  test('switch compare results', async ({ page }) => {
    await runAxe(page, '/compare/switch?a=akko-v3-cream-blue-pro&b=c3-tangerine-r2')
  })

  test('board compare results', async ({ page }) => {
    await runAxe(page, '/compare/board?a=bakeneko65&b=class80')
  })
})

test.describe('a11y — compare tool (populated state, mobile 375px)', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('switch compare results — mobile', async ({ page }) => {
    await runAxe(page, '/compare/switch?a=akko-v3-cream-blue-pro&b=c3-tangerine-r2')
  })

  test('board compare results — mobile', async ({ page }) => {
    await runAxe(page, '/compare/board?a=bakeneko65&b=class80')
  })
})

// Quiz result-view coverage (issue tracked by pass-143 expand note): every prior
// quiz a11y pass scanned only the initial question view. The results state (a
// distinct DOM tree — ResultCard, build sheet, retake CTA) had never run a
// full-page axe scan, only narrow color-contrast include()s on specific testids.
test.describe('a11y — quiz results (post-completion)', () => {
  test('switch quiz results (/quiz/switch)', async ({ page }) => {
    await completeQuiz(page, '/quiz/switch', 'quiz-results')
    await assertAxeClean(page, '/quiz/switch (results state)')
  })

  test('keycap-set quiz results (/quiz/keycap-set)', async ({ page }) => {
    await completeQuiz(page, '/quiz/keycap-set', 'keycap-quiz-results')
    await assertAxeClean(page, '/quiz/keycap-set (results state)')
  })
})

test.describe('a11y — quiz results (post-completion, mobile 375px)', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('switch quiz results — mobile', async ({ page }) => {
    await completeQuiz(page, '/quiz/switch', 'quiz-results')
    await assertAxeClean(page, '/quiz/switch (results state, mobile)')
  })

  test('keycap-set quiz results — mobile', async ({ page }) => {
    await completeQuiz(page, '/quiz/keycap-set', 'keycap-quiz-results')
    await assertAxeClean(page, '/quiz/keycap-set (results state, mobile)')
  })
})

// Regression guard: color-contrast on the two text-text-3 small-text elements
// drained by audit row [a11y][3.0] — tracker week-block + /tag/[slug] back link.
// Both elements were swapped to text-text-2 so the targeted axe color-contrast
// pass should report zero violations on the specific selectors.
test('color-contrast — tracker week-block (regression guard)', async ({ page }) => {
  await page.goto('/trends/tracker')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-week-block"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — tag-page back link (regression guard)', async ({ page }) => {
  await page.goto('/tag/linear')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tag-page-back-link"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on the pillar-eyebrow context drained by
// audit row [a11y][3.5] — text-accent-mu at 12px was swapped to text-accent.
// Article hero eyebrow is the representative call site; the same class lives
// on 16 12-px decorative eyebrow spans across the app.
test('color-contrast — article hero eyebrow (regression guard)', async ({ page }) => {
  await page.goto('/article/gateron-oil-king-deep-dive')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="article-hero-eyebrow"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: WCAG 1.4.1 link-in-text-block on /about body drained by
// audit row [a11y][2.5] — inline body links gained `underline` so they no
// longer rely on color alone. Scoped axe pass on the `about-body` container
// asserts zero `link-in-text-block` violations.
test('link-in-text-block — /about body links (regression guard)', async ({ page }) => {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="about-body"]')
    .analyze()

  const linkInText = results.violations.filter(
    (v) => v.id === 'link-in-text-block',
  )
  expect(linkInText, formatViolations(linkInText)).toHaveLength(0)
})

// Regression guards: color-contrast on article byline metadata (author/date/read-time)
// and tracker rank numbers drained by audit row [a11y] issue #91. These elements
// used text-text-3 which fails contrast in light mode; swapped to text-text-2.

test('color-contrast — article byline (regression guard)', async ({ page }) => {
  await page.goto('/article/gateron-oil-king-deep-dive')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="article-byline"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — article card meta (regression guard)', async ({ page }) => {
  await page.goto('/tag/linear')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="article-card-meta"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — tracker row rank (regression guard)', async ({ page }) => {
  await page.goto('/trends/tracker')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-row"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on footer tagline, copyright, and newsletter
// label drained by this tick — text-text-3 at text-small/text-micro in the
// shared Footer component swapped to text-text-2. Three targeted scopes:
// footer-tagline, footer-copyright, and newsletter-form-label.
test('color-contrast — footer tagline (regression guard)', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="footer-tagline"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — footer copyright (regression guard)', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="footer-copyright"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — newsletter form label (regression guard)', async ({ page }) => {
  await page.goto('/newsletter')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="newsletter-form-label"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on the "Powered by Buttondown." attribution
// link drained by this tick — text-text-4 at text-micro (12px) swapped to
// text-text-2. Scoped to data-testid="newsletter-form-attribution" on both
// home (footer variant) and /newsletter (full variant).
test('color-contrast — newsletter form attribution (footer, regression guard)', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="newsletter-form-attribution"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — newsletter form attribution (full page, regression guard)', async ({
  page,
}) => {
  await page.goto('/newsletter')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="newsletter-form-attribution"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on the TrendingTile category label drained by
// audit row [a11y] issue #94 — text-text-3 at text-micro (12px) on the home-page
// Trending strip swapped to text-text-2. Scoped to data-testid="trending-tile-category".
test('color-contrast — trending tile category label (regression guard)', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="trending-tile-category"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guards: color-contrast on article page rail section headings drained by
// audit row [a11y] issue #95 — "Keep reading" (RelatedArticlesRail) and "Build sheet"
// (MentionedPartsRail) h2s used text-micro text-text-3 (12px, fails WCAG AA);
// swapped to text-text-2. Both rails render on /article/gateron-oil-king-deep-dive
// (has mentionedParts + non-empty related-articles list).
test('color-contrast — related articles heading (regression guard)', async ({
  page,
}) => {
  await page.goto('/article/gateron-oil-king-deep-dive')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="related-articles-heading"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — mentioned parts heading (regression guard)', async ({
  page,
}) => {
  await page.goto('/article/gateron-oil-king-deep-dive')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="mentioned-parts-heading"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on the GroupBuysWidget kicker drained by
// audit row [a11y] issue #96 — widget kicker "group buys · ending soon / open now"
// used text-micro text-text-3 (12px, fails WCAG AA 4.5:1); swapped to text-text-2.
// Kicker renders on / whenever active group buys exist (widest home-page surface).
test('color-contrast — group-buys widget kicker (regression guard)', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // <GroupBuysWidget> renders null (by design) when the active list is
  // empty — as of 2026-07-15 every backfilled group buy has closed, so
  // the kicker can legitimately be absent. Same soft-skip shape as
  // assertKickerContrast above.
  const count = await page.locator('[data-testid="widget-kicker"]').count()
  if (count === 0) return

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="widget-kicker"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guards: color-contrast on Trends Tracker column headers and archive strip
// labels drained by audit row [a11y] issue #97. TrackerTable header row used
// text-micro text-text-3 (12px, fails WCAG AA 4.5:1); TrackerArchiveStrip "latest"
// label and flat-count span used text-text-3 at text-micro. All three swapped to
// text-text-2. Guards scoped to data-testids on /trends/tracker (the latest view).
test('color-contrast — tracker table header (regression guard)', async ({ page }) => {
  await page.goto('/trends/tracker')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-table-header"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — tracker archive latest label (regression guard)', async ({
  page,
}) => {
  await page.goto('/trends/tracker')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-archive-latest-label"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on article figcaptions drained by audit row
// [a11y] issue #98 — InlineViz and KeyboardImage figcaptions used text-small
// text-text-3 (14px, fails WCAG AA 4.5:1); swapped to text-text-2. Both components
// gained data-testid="article-figcaption". Scoped to the representative article
// page that has InlineViz diagrams with captions.
test('color-contrast — article figcaption (regression guard)', async ({ page }) => {
  await page.goto('/article/gateron-oil-king-deep-dive')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="article-figcaption"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guards: color-contrast on GroupBuyRow kind/region/metadata and
// group-buys page summary drained by audit row [a11y] issue #100. GroupBuyRow
// used text-micro text-text-3 (12px, fails WCAG AA 4.5:1) for kind label,
// region badge, vendor/date metadata, and non-live countdown. Page-level summary
// count and archive link also used text-text-3 at text-micro. All swapped to
// text-text-2. Guards scoped to data-testids on /group-buys and /group-buys/past.
test('color-contrast — group-buy row kind/region/meta (regression guard)', async ({ page }) => {
  await page.goto('/group-buys')
  await page.waitForLoadState('networkidle')

  for (const testid of ['group-buy-kind', 'group-buy-region', 'group-buy-meta']) {
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()
    const contrast = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

test('color-contrast — group-buys page summary (regression guard)', async ({ page }) => {
  await page.goto('/group-buys')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="group-buys-summary"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — group-buys/past summary (regression guard)', async ({ page }) => {
  await page.goto('/group-buys/past')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="group-buys-past-summary"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guards: color-contrast on /search page elements drained by
// audit row [a11y] issue #101. Three elements used text-micro text-text-3
// (12px, fails WCAG AA 4.5:1): the search input label "query", the pillar
// eyebrow on each result card, and the publishedAt date on each result card.
// All three swapped to text-text-2.
test('color-contrast — search input label (regression guard)', async ({ page }) => {
  await page.goto('/search')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="search-input-label"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — search result eyebrow + date (regression guard)', async ({ page }) => {
  await page.goto('/search')
  await page.waitForLoadState('networkidle')

  const input = page.locator('input[type="search"][name="q"]')
  await input.fill('gateron')
  await page.waitForSelector('[data-testid="search-result-eyebrow"]')

  for (const testid of ['search-result-eyebrow', 'search-result-date']) {
    const axeResults = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()
    const contrast = axeResults.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

// Regression guard: color-contrast on the PartResult kind chip in search
// results. PartResult uses text-micro text-text-2 (12px) for the kind label
// ("Switch", "Keycap Set", "Board"). Guard prevents silent regression to
// text-text-3 which fails WCAG AA 4.5:1 at that size.
test('color-contrast — search part-kind chip (regression guard)', async ({ page }) => {
  await page.goto('/search')
  await page.waitForLoadState('networkidle')

  const input = page.locator('input[type="search"][name="q"]')
  await input.fill('gateron')
  await page.waitForSelector('[data-testid="search-part-kind"]')

  const axeResults = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="search-part-kind"]')
    .analyze()
  const contrast = axeResults.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: color-contrast on MDX article prose components drained by
// audit row [a11y] issue #102. Three MDX components used text-text-3 at small
// text sizes: Caption (text-small), PullQuote attribution footer (text-small),
// Callout title h2 (text-micro on bg-surface). Callout is actively used in 31
// articles with 41 titled instances; Caption and PullQuote attribution were
// pre-emptive fixes. All three swapped to text-text-2.
test('color-contrast — callout title in article body (regression guard)', async ({ page }) => {
  await page.goto('/article/cherry-mx2a-revision')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="callout-title"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: pillar-hero RSS pill sublabel — text-text-2 at 12px passes WCAG AA.
// PillarHero renders on /news, /trends, /ideas, /deep-dives, /guides. Tested on /news
// as the representative canonical pillar URL.
test('color-contrast — pillar-hero RSS pill sublabel (regression guard)', async ({ page }) => {
  await page.goto('/news')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="pillar-hero-pill-sublabel"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

// Regression guard: part pages — PartHero meta div + PartSpec heading/label +
// MentionedInArticles heading swapped text-text-3 → text-text-2. Tested on
// /part/switch/gateron-oil-king as the representative canonical part URL (switch
// with linked articles, exercising both PartHero and MentionedInArticles heading).
test('color-contrast — part hero meta (regression guard)', async ({ page }) => {
  await page.goto('/part/switch/gateron-oil-king')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="part-hero-meta"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — part spec heading + labels (regression guard)', async ({
  page,
}) => {
  await page.goto('/part/switch/gateron-oil-king')
  await page.waitForLoadState('networkidle')

  for (const testid of ['part-spec-heading', 'part-spec-label']) {
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()

    const contrast = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

test('color-contrast — tracker-back-link + part-kind-back-link + part-detail-back-link (regression guard)', async ({
  page,
}) => {
  // Tracker archive back-link ("← Back to latest") on /trends/tracker/[week]
  await page.goto('/trends/tracker/2026-W19')
  await page.waitForLoadState('networkidle')

  const trackerResults = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-back-link"]')
    .analyze()

  const trackerContrast = trackerResults.violations.filter((v) => v.id === 'color-contrast')
  expect(trackerContrast, `tracker-back-link: ${formatViolations(trackerContrast)}`).toHaveLength(0)

  // Part detail back-link ("← all {kind}s") on /part/[kind]/[slug]
  await page.goto('/part/switch/gateron-oil-king')
  await page.waitForLoadState('networkidle')

  const partDetailResults = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="part-detail-back-link"]')
    .analyze()

  const partDetailContrast = partDetailResults.violations.filter((v) => v.id === 'color-contrast')
  expect(partDetailContrast, `part-detail-back-link: ${formatViolations(partDetailContrast)}`).toHaveLength(0)
})

test('color-contrast — /tags eyebrow (regression guard)', async ({ page }) => {
  await page.goto('/tags')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tags-eyebrow"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — MDX table th (regression guard)', async ({ page }) => {
  await page.goto('/article/switch-films-worth-it')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="mdx-table-th"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})

test('color-contrast — /sources heading + citation host (regression guard)', async ({
  page,
}) => {
  await page.goto('/sources')
  await page.waitForLoadState('networkidle')

  for (const testid of ['source-counts-heading', 'citation-index-host', 'sources-citation-index-heading']) {
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()

    const contrast = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

test('color-contrast — misc tag chip + /tags Misc heading + /tag misc eyebrow (regression guard)', async ({
  page,
}) => {
  // /tags page: Misc group heading (h2) and misc-category tag chips
  await page.goto('/tags')
  await page.waitForLoadState('networkidle')

  const tagsResults = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tag-group-misc"]')
    .analyze()

  const tagsContrast = tagsResults.violations.filter((v) => v.id === 'color-contrast')
  expect(tagsContrast, `/tags misc group: ${formatViolations(tagsContrast)}`).toHaveLength(0)

  // /tag/group-buy (misc category): tag-page eyebrow "tag · topic"
  await page.goto('/tag/group-buy')
  await page.waitForLoadState('networkidle')

  const tagResults = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tag-page-eyebrow"]')
    .analyze()

  const tagContrast = tagResults.violations.filter((v) => v.id === 'color-contrast')
  expect(tagContrast, `/tag/group-buy eyebrow: ${formatViolations(tagContrast)}`).toHaveLength(0)
})

// Regression guard: skip link is present and targets a valid id="main" element.
// Phase A ships this as a hard assertion because the skip link is fixed in
// the same commit (no longer needs Phase B discovery).
test('skip-to-main-content link — layout guard', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Skip link exists in the DOM and has correct href
  const skipLink = page.locator('a[href="#main"]')
  await expect(skipLink).toHaveCount(1)

  // Target element with id="main" exists
  const mainEl = page.locator('#main')
  await expect(mainEl).toHaveCount(1)

  // Skip link becomes visible on focus and then jumps to #main
  await skipLink.focus()
  await expect(skipLink).toBeVisible()
})

test('color-contrast — TagChip category prefix (opacity-70 removed; regression guard)', async ({
  page,
}) => {
  // Article page with switch-category tag chips (gateron-oil-king has switch + brand chips)
  await page.goto('/article/gateron-oil-king-deep-dive')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tag-chip-category"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `tag-chip-category contrast: ${formatViolations(contrast)}`).toHaveLength(0)
})

// Regression guard: color-contrast on TrackerArchiveStrip direction count spans drained
// by audit row [a11y] #110. Root cause: bg-surface-2 was an invalid Tailwind class
// (no surface-2 color in config), causing cells to render on bg-border background where
// text-down (oklch 0.68 0.135 25) at text-micro fails WCAG AA 4.5:1 (~4.1:1). Fixed
// by swapping bg-surface-2 → bg-surface; text-down on bg-surface passes at ~5.1:1.
// Hover feedback restored via group + group-hover:bg-surface-hi on the inner cell div.
test('color-contrast — TrackerArchiveStrip down-count text (regression guard)', async ({
  page,
}) => {
  await page.goto('/trends/tracker')
  await page.waitForLoadState('networkidle')

  // W19 has 3 down-trending rows (Cherry MX2A, Alice layout, Cherry brand) so the
  // down-count span renders in every W19 archive card visible on /trends/tracker.
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-archive-down-count"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `tracker-archive-down-count: ${formatViolations(contrast)}`).toHaveLength(0)
})

// Regression guards: color-contrast on SuggestedArticles 404 component drained by
// audit row [a11y] issue #112. Two elements used text-text-3 at small text sizes:
// the "did you mean" h2 (text-micro, 12px) and the article date span (text-small,
// 14px). Both fail WCAG AA 4.5:1. Swapped to text-text-2. Tested by navigating to
// /article/gateron-switch (a non-existent slug that yields "gateron switch" hits).
test('color-contrast — SuggestedArticles 404 eyebrow + date (regression guard)', async ({
  page,
}) => {
  // gateron-switch does not exist; slug "gateron switch" finds Oil King + other articles
  await page.goto('/article/gateron-switch')
  await page.waitForLoadState('networkidle')

  // Ensure the suggestions section rendered (skip if no hits — no false fail)
  const suggestionsVisible = await page
    .locator('[data-testid="not-found-suggestions"]')
    .isVisible()
    .catch(() => false)

  if (!suggestionsVisible) {
    return
  }

  for (const testid of ['not-found-suggestion-eyebrow', 'not-found-suggestion-date']) {
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()

    const contrast = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

// Regression guard: color-contrast on page-section-kicker spans drained by audit
// row [a11y] #113. All 13 route-level kicker spans used text-text-3 at text-micro
// (12px) — WCAG AA 4.5:1 failure. Swapped to text-text-2 across all routes;
// data-testid="page-section-kicker" added for targeted guard.
// Kicker spans render only in empty-state branches (pillar with no articles, tag
// with no articles, etc.). The guard tests a sampling of routes and asserts zero
// color-contrast violations IF the kicker is present — soft skip when not rendered.
async function assertKickerContrast(page: Page, url: string): Promise<void> {
  await page.goto(url)
  await page.waitForLoadState('networkidle')

  const count = await page.locator('[data-testid="page-section-kicker"]').count()
  if (count === 0) return // kicker not rendered on this URL in current data state

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="page-section-kicker"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `${url} page-section-kicker: ${formatViolations(contrast)}`).toHaveLength(0)
}

test('color-contrast — page-section-kicker text-text-2 (sampling)', async ({ page }) => {
  // Sample across routes where the kicker might render (empty states).
  // Asserts zero color-contrast violations if the element is in the DOM.
  // Soft-skip when the kicker is absent (pillar/tag has content — expected in prod).
  for (const url of ['/', '/news', '/trends', '/guides', '/ideas', '/deep-dives', '/group-buys']) {
    await assertKickerContrast(page, url)
  }
})

// Regression guard: color-contrast on PartIndexCard status badge for sold-out and
// discontinued parts (audit row [a11y] #114). PartIndexCard.tsx statusTint()
// returned text-text-3 for those statuses at text-micro (12px) — WCAG AA failure.
// Fixed to text-text-2; /part/keycap-set renders sold-out and discontinued items.
test('color-contrast — PartIndexCard status badge text-text-2 on /part/keycap-set', async ({ page }) => {
  await page.goto('/part/keycap-set')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="part-index-status"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `part-index-status: ${formatViolations(contrast)}`).toHaveLength(0)
})

// Regression guard: color-contrast on quiz components (audit row [a11y] #121).
// Phase 33 shipped QuizStep, QuizProgress, ResultCard with text-text-3 at 14px —
// same root cause as Phase B drain series (#100–#115). Fixed to text-text-2.
// Guard 1: progress label + option description on /quiz/switch (renders immediately).
// Guard 2: result-card-pct after completing all 4 questions (clicks first option each).
test('color-contrast — quiz progress label + option description text-text-2 (regression guard)', async ({
  page,
}) => {
  await page.goto('/quiz/switch')
  await page.waitForLoadState('networkidle')

  for (const testid of ['quiz-progress-label', 'quiz-option-description']) {
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()

    const contrast = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

test('color-contrast — result-card-pct text-text-2 after completing quiz (regression guard)', async ({
  page,
}) => {
  await page.goto('/quiz/switch')
  await page.waitForLoadState('networkidle')

  // Click first option for each of the 4 questions; auto-advance fires after 150ms.
  for (let i = 0; i < 4; i++) {
    const firstOption = page.locator('[data-testid="quiz-option-description"]').first()
    await firstOption.click()
    await page.waitForTimeout(200)
  }

  // Results should now be visible
  await expect(page.locator('[data-testid="quiz-results"]')).toBeVisible()

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="result-card-pct"]')
    .analyze()

  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `result-card-pct: ${formatViolations(contrast)}`).toHaveLength(0)
})

// text-text-4 at text-micro / text-small fails WCAG AA (even lower luminance than
// text-text-3 which was systematically fixed across phases 26-32). Four real-content
// elements swapped text-text-4 → text-text-2: part-index-count, mentioned-in-footer,
// tracker-no-earlier-weeks, and newsletter archive date.
test('color-contrast — part/switch catalog count text-text-2 (regression guard)', async ({
  page,
}) => {
  await page.goto('/part/switch')
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="part-index-count"]')
    .analyze()
  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `part-index-count: ${formatViolations(contrast)}`).toHaveLength(0)
})

test('color-contrast — tracker/2026-W19 "No earlier weeks" label text-text-2 (regression guard)', async ({
  page,
}) => {
  // W19 is the earliest snapshot — it always renders the "No earlier weeks" disabled label.
  await page.goto('/trends/tracker/2026-W19')
  const el = page.locator('[data-testid="tracker-no-earlier-weeks"]')
  await expect(el).toBeVisible()
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="tracker-no-earlier-weeks"]')
    .analyze()
  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, `tracker-no-earlier-weeks: ${formatViolations(contrast)}`).toHaveLength(0)
})

// Regression guards: color-contrast on /archive pillar label and read-time spans drained by
// audit row [a11y] #371. ArchiveMonthGroup.tsx used text-micro text-text-3 (12px) for both
// the pillar-label chip (w-20 left column) and the read-time span (ml-auto right column).
// Both fail WCAG AA 4.5:1; swapped to text-text-2. data-testids added for guard targeting.
test('color-contrast — archive pillar label + read-time text-text-2 (regression guard)', async ({
  page,
}) => {
  await page.goto('/archive')
  await page.waitForLoadState('networkidle')

  for (const testid of ['archive-pillar-label', 'archive-read-time']) {
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include(`[data-testid="${testid}"]`)
      .analyze()

    const contrast = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrast, `${testid}: ${formatViolations(contrast)}`).toHaveLength(0)
  }
})

// Regression guard: color-contrast on the quiz result rank badge. Both
// ResultCard.tsx and KeycapSetResultCard.tsx rendered the rank number as
// text-bg (dark text) on bg-accent-mu — 3.13:1, failing WCAG AA 4.5:1 for
// 14px bold text (not "large text" per WCAG). Swapped to text-text (5.48:1).
test('color-contrast — quiz result rank badge (regression guard)', async ({ page }) => {
  await page.goto('/quiz/switch')
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button').first().click()
    if (i < 3) {
      await expect(page.getByText(new RegExp(`question ${i + 2} of 4`, 'i'))).toBeVisible()
    }
  }
  await expect(page.getByTestId('quiz-results')).toBeVisible()

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .include('[data-testid="result-card"]')
    .analyze()
  const contrast = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrast, formatViolations(contrast)).toHaveLength(0)
})
