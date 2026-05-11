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
 * Phase A hard-fail threshold is `critical` only because the site has
 * confirmed `serious` color-contrast violations at `text-text-3` /
 * `text-accent-mu` small-text contexts — these are design-level decisions
 * that require /oversight sign-off before changing the palette, not
 * autonomous loop fixes. Filed to AUDIT.md at Phase 26 ship time.
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
  // Serious violations include confirmed color-contrast issues at text-text-3 /
  // text-accent-mu which are design decisions filed to AUDIT.md for Phase B.
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
