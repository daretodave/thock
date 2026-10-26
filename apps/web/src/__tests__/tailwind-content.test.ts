import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Regression guard for the silent-purge bug investigated 2026-05-14:
 *
 * Tailwind only emits a utility it finds in a source file it scans.
 * A utility used ONLY in a file outside that set is missing from the
 * compiled stylesheet — the className is present on the rendered DOM,
 * but the CSS rule does not exist, so `getComputedStyle(...).marginTop`
 * etc. return 0. This is silent: no warning, no build error, no broken
 * DOM, just missing visual rules.
 *
 * The bug surfaced as a Callout aside headbutting an H2 below it.
 * Two prior "spacing fixes" (Callout my-6 → my-8, SerifH2 mt-16 →
 * mt-20) never actually shipped to the compiled CSS because both
 * components live in @thock/content and Tailwind did not scan
 * packages/content/src/.
 *
 * Tailwind 4 scans apps/web itself on its own (MDX included); every
 * other workspace package that renders JSX needs an `@source` line in
 * globals.css. If a new workspace package starts rendering JSX, add
 * it to BOTH places: globals.css AND the array below.
 */
describe('globals.css — Tailwind source coverage', () => {
  const css = readFileSync(resolve(__dirname, '../app/globals.css'), 'utf8')

  const REQUIRED_SOURCES = [
    '../../../../packages/ui/src/**/*.{ts,tsx}',
    '../../../../packages/content/src/**/*.{ts,tsx}',
  ]

  for (const glob of REQUIRED_SOURCES) {
    it(`scans ${glob}`, () => {
      expect(css).toContain(`@source '${glob}';`)
    })
  }

  it('imports Tailwind 4 itself, so the @source lines are read', () => {
    expect(css).toMatch(/^@import 'tailwindcss';$/m)
  })
})
