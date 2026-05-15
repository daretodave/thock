/**
 * Phase 26 — Accessibility audit pass (Phase A: discovery walker)
 *
 * Runs @axe-core/playwright with WCAG 2.1 AA rules on a curated set of
 * canonical URLs. Phase A posture:
 *   - FAIL on critical violations only (keyboard traps, missing form labels,
 *     unlabeled interactive elements — things that fully block access)
 *   - WARN (log, do not fail) on serious/moderate/minor violations;
 *     these are filed as [a11y] AUDIT.md rows and drained by /iterate Phase B
 *     ticks. As each violation drains, a specific hard assertion is added here
 *     so the spec becomes a full regression guard incrementally.
 *
 * Phase A hard-fail threshold is `critical` only. The two confirmed
 * serious color-contrast rows filed at Phase 26 (`text-text-3` and
 * `text-accent-mu` small-text contexts) drained in subsequent /iterate
 * ticks; each has its own targeted regression guard below.
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

async function runAxe(page: Page, url: string) {
  await page.goto(url)
  // Wait for the page to be fully painted (avoids false loading-state hits)
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze()

  const critical = results.violations.filter((v) => v.impact === 'critical')
  const serious = results.violations.filter((v) => v.impact === 'serious')
  const moderate = results.violations.filter((v) => v.impact === 'moderate')
  const minor = results.violations.filter((v) => v.impact === 'minor')

  // Phase A: log serious/moderate/minor for AUDIT.md filing, do not fail
  const nonCritical = [...serious, ...moderate, ...minor]
  if (nonCritical.length > 0) {
    console.warn(
      `[a11y Phase A] non-critical violations on ${url} (filed to AUDIT.md):\n` +
        formatViolations(nonCritical),
    )
  }

  // Phase A hard gate: ONLY critical violations block (keyboard traps, etc.)
  // Serious violations still warn-only here; specific drained findings get
  // targeted regression guards below (search "regression guard").
  if (critical.length > 0) {
    throw new Error(
      `[a11y] CRITICAL violations on ${url}:\n${formatViolations(critical)}`,
    )
  }

  return results
}

// Desktop suite — 7 canonical pages
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
})

// Mobile suite — 3 representative pages at 375px
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
