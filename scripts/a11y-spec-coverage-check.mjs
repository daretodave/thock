#!/usr/bin/env node
// scripts/a11y-spec-coverage-check.mjs
//
// Gate script: detects static canonical routes (from canonical-urls.ts)
// that are missing a page.goto(...) assertion in apps/e2e/tests/a11y.spec.ts —
// either in the desktop suite, the mobile suite, or both.
//
// Every new static route family needs a manual test() entry added to both
// a11y.spec.ts suites; nothing derives that automatically the way
// meta.spec.ts derives its JSON-LD checks from canonical-urls.ts. Phases
// 43–49 shipped 7 route families without those entries, requiring 4
// reactive a11y-coverage commits to catch up (expand pass 135). This script
// mirrors og-coverage-check.mjs's shape so the gap is detectable before the
// next iterate tick instead of after.
//
// Usage:
//   node scripts/a11y-spec-coverage-check.mjs
//     Gate mode: exit 1 if any static route is missing from either suite.
//
//   node scripts/a11y-spec-coverage-check.mjs --write
//     Scan all static routes; append `tests` AUDIT.md rows for gaps. Dedups.
//
//   node scripts/a11y-spec-coverage-check.mjs --json
//     JSON output: { gaps: [...] } — for programmatic use.
//
// Exit codes:
//   0 → all static routes covered in both suites, or scan complete (--write/--json)
//   1 → gaps found (gate mode) or error (any mode)

import { existsSync, readFileSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const CANONICAL_URLS_TS = join(
  REPO_ROOT,
  'apps',
  'e2e',
  'src',
  'fixtures',
  'canonical-urls.ts',
)
const A11Y_SPEC_TS = join(REPO_ROOT, 'apps', 'e2e', 'tests', 'a11y.spec.ts')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// Marker in a11y.spec.ts where the mobile suite begins — everything before
// this is the desktop suite, everything after is mobile.
const MOBILE_MARKER = "test.describe('a11y — mobile"

// ── Static route extraction ────────────────────────────────────────────────

/**
 * Parse the `path: '...'` / `kind: '...'` pairs out of the STATIC array in
 * canonical-urls.ts source, returning only 'html'-kind paths. Only STATIC
 * routes are checked — dynamic per-slug routes (article, tag, part, vendor,
 * tracker week) are represented in a11y.spec.ts by one hand-picked example
 * per family already, not enumerated per-slug.
 *
 * Pure function — takes source text, not a file path, for testability.
 */
function parseStaticHtmlRoutes(canonicalUrlsSrc) {
  const match = canonicalUrlsSrc.match(/const STATIC:[^[]*\[([\s\S]*?)\n\]/)
  if (!match) return []
  const block = match[1]
  const entries = [...block.matchAll(/\{\s*path:\s*'([^']+)',\s*pattern:\s*'[^']*',\s*kind:\s*'([^']+)'\s*\}/g)]
  return entries.filter(([, , kind]) => kind === 'html').map(([, path]) => path)
}

// ── a11y.spec.ts section split ─────────────────────────────────────────────

/**
 * Split a11y.spec.ts source into { desktop, mobile } sections at the
 * mobile-suite describe block.
 *
 * Pure function — takes source text, not a file path, for testability.
 */
function splitA11ySections(a11ySpecSrc) {
  const idx = a11ySpecSrc.indexOf(MOBILE_MARKER)
  if (idx === -1) return { desktop: a11ySpecSrc, mobile: '' }
  return { desktop: a11ySpecSrc.slice(0, idx), mobile: a11ySpecSrc.slice(idx) }
}

// ── Gap detection ───────────────────────────────────────────────────────────

/**
 * Returns a quoted-string match for `route` inside `sectionSrc`. Quote
 * delimiters on both sides make this precise against prefix collisions
 * (e.g. searching for '/trends' does not match inside '/trends/tracker').
 */
function hasRoute(sectionSrc, route) {
  return sectionSrc.includes(`'${route}'`)
}

/**
 * Given a list of static html routes and the split desktop/mobile section
 * text, return gap records for any route missing from either suite.
 *
 * Pure function — does not read the filesystem.
 */
function findGaps(routes, desktopSrc, mobileSrc) {
  const gaps = []
  for (const route of routes) {
    const missingDesktop = !hasRoute(desktopSrc, route)
    const missingMobile = !hasRoute(mobileSrc, route)
    if (missingDesktop || missingMobile) {
      gaps.push({ route, missingDesktop, missingMobile })
    }
  }
  return gaps
}

// ── Deduplication ───────────────────────────────────────────────────────────

/**
 * Returns true if AUDIT.md already has a pending (unchecked) tests row for
 * the given route filed by a11y-spec-coverage-check.
 */
function alreadyFiled(auditContent, route) {
  const marker = `a11y-spec-coverage-check.mjs — ${route}`
  const lines = auditContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      for (let j = i; j >= 0; j--) {
        if (lines[j].startsWith('### ')) {
          return lines[j].startsWith('### [ ]')
        }
      }
    }
  }
  return false
}

// ── AUDIT.md row formatting ─────────────────────────────────────────────────

function describeGap({ missingDesktop, missingMobile }) {
  if (missingDesktop && missingMobile) return 'missing from both desktop and mobile suites'
  if (missingDesktop) return 'missing from the desktop suite'
  return 'missing from the mobile suite'
}

function formatAuditRow(gap, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const { route } = gap
  return `
### [ ] [tests] [3.2] ${route} ${describeGap(gap)} in apps/e2e/tests/a11y.spec.ts
- category: tests
- filed: ${todayStr} by a11y-spec-coverage-check.mjs — ${route}
- impact: 4 (${route} ships with no WCAG regression coverage in the ${describeGap(gap).includes('both') ? 'a11y' : describeGap(gap).includes('desktop') ? 'desktop' : 'mobile'} suite)
- ease: 8 (add one test() entry per missing suite; runAxe(page, '${route}') pattern is proven across 25+ routes)
- score: 3.2 (impact × ease / 10)
- route: ${route}
- action: add test('<label> (${route})', ...) calling runAxe(page, '${route}') to the missing suite(s) in apps/e2e/tests/a11y.spec.ts
`
}

// ── __test export ───────────────────────────────────────────────────────────

export const __test = {
  parseStaticHtmlRoutes,
  splitA11ySections,
  hasRoute,
  findGaps,
  alreadyFiled,
  formatAuditRow,
  MOBILE_MARKER,
}

// ── CLI entry (only runs when this file is invoked directly) ───────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Imported as library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')

  const canonicalSrc = readFileSync(CANONICAL_URLS_TS, 'utf8')
  const a11ySrc = readFileSync(A11Y_SPEC_TS, 'utf8')

  const routes = parseStaticHtmlRoutes(canonicalSrc)
  const { desktop, mobile } = splitA11ySections(a11ySrc)
  const gaps = findGaps(routes, desktop, mobile)

  if (doJson) {
    console.log(JSON.stringify({ gaps }, null, 2))
    process.exit(0)
  }

  if (gaps.length === 0) {
    if (!doWrite) {
      console.log('a11y-spec-coverage-check: all static routes covered in both suites.')
    } else {
      console.log('a11y-spec-coverage-check: all routes covered — no AUDIT rows filed.')
    }
    process.exit(0)
  }

  if (doWrite) {
    let auditContent = ''
    try {
      if (existsSync(AUDIT_MD)) {
        auditContent = readFileSync(AUDIT_MD, 'utf8')
      }
    } catch (err) {
      console.error(`a11y-spec-coverage-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const gap of gaps) {
      if (alreadyFiled(auditContent, gap.route)) {
        console.log(`a11y-spec-coverage-check: ${gap.route} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(gap, today))
      console.log(`a11y-spec-coverage-check: ${gap.route} ${describeGap(gap)} — filing AUDIT row`)
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`a11y-spec-coverage-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`a11y-spec-coverage-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print gaps and exit 1
  for (const gap of gaps) {
    console.error(`MISSING A11Y COVERAGE: ${gap.route} — ${describeGap(gap)}`)
  }
  console.error(
    `a11y-spec-coverage-check: ${gaps.length} route(s) with a11y.spec.ts coverage gaps.`,
  )
  process.exit(1)
}
