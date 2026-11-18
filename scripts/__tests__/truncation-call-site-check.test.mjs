// scripts/__tests__/truncation-call-site-check.test.mjs
//
// Unit tests for scripts/truncation-call-site-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { __test } from '../truncation-call-site-check.mjs'

const {
  scanContent,
  findHits,
  toRelPath,
  isVettedHelperPath,
  alreadyFiled,
  formatAuditRow,
  isScannableFile,
  DISPLAY_IDENTIFIERS,
  VETTED_HELPER_PATHS,
} = __test

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')
const SCRIPT_PATH = join(__dirname, '..', 'truncation-call-site-check.mjs')

// ── scanContent — violating fixture ──────────────────────────────────────────

describe('scanContent — violating fixture (gate mode would exit 1)', () => {
  test('flags a raw .slice(0, N) call on a display-named variable', () => {
    const fixture = `
export function renderCard(article) {
  const description = article.description
  const clipped = description.slice(0, 140)
  return clipped
}
`
    const hits = scanContent(fixture, 'apps/web/src/components/Card.tsx')
    assert.equal(hits.length, 1)
    assert.equal(hits[0].identifier, 'description')
    assert.equal(hits[0].method, 'slice')
    assert.equal(hits[0].line, 4)
  })

  test('flags a raw .substring(0, N) call on a display-named variable', () => {
    const fixture = `const headline = post.headline.substring(0, 80)\n`
    const hits = scanContent(fixture, 'apps/web/src/components/Headline.tsx')
    assert.equal(hits.length, 1)
    assert.equal(hits[0].identifier, 'headline')
    assert.equal(hits[0].method, 'substring')
  })

  test('flags a receiver split across lines', () => {
    const fixture = `
const clipped = summary
  .slice(0, 100)
`
    const hits = scanContent(fixture, 'apps/web/src/components/Summary.tsx')
    assert.equal(hits.length, 1)
    assert.equal(hits[0].identifier, 'summary')
  })

  test('flags every matching identifier in the display-text list', () => {
    for (const identifier of DISPLAY_IDENTIFIERS) {
      const fixture = `const x = ${identifier}.slice(0, 50)\n`
      const hits = scanContent(fixture, 'apps/web/src/components/Any.tsx')
      assert.equal(hits.length, 1, `expected ${identifier} to be flagged`)
    }
  })
})

// ── scanContent — clean fixture ──────────────────────────────────────────────

describe('scanContent — clean fixture (gate mode would exit 0)', () => {
  test('does not flag array pagination slicing', () => {
    const fixture = `
export function topFive(scored) {
  return scored.slice(0, 5)
}
`
    const hits = scanContent(fixture, 'apps/web/src/lib/quiz/recommend.ts')
    assert.deepEqual(hits, [])
  })

  test('does not flag ISO-date-prefix extraction', () => {
    const fixture = `const todayIso = now.toISOString().slice(0, 10)\n`
    const hits = scanContent(fixture, 'apps/web/src/components/Widget.tsx')
    assert.deepEqual(hits, [])
  })

  test('does not flag a non-display-named receiver even at length 0, N', () => {
    const fixture = `const trimmed = someArray.slice(0, 3)\n`
    const hits = scanContent(fixture, 'apps/web/src/lib/util.ts')
    assert.deepEqual(hits, [])
  })

  test('does not flag a display-named receiver immediately .length-compared', () => {
    const fixture = `if (description.slice(0, 100).length > 50) { doThing() }\n`
    const hits = scanContent(fixture, 'apps/web/src/components/Check.tsx')
    assert.deepEqual(hits, [])
  })

  test('does not flag a display-named receiver immediately array-indexed', () => {
    const fixture = `const first = title.slice(0, 10)[0]\n`
    const hits = scanContent(fixture, 'apps/web/src/components/Check.tsx')
    assert.deepEqual(hits, [])
  })

  test('does not flag a variable (non-literal) length argument', () => {
    const fixture = `const clipped = description.slice(0, max)\n`
    const hits = scanContent(fixture, 'apps/web/src/components/Clip.tsx')
    assert.deepEqual(hits, [])
  })
})

// ── scanContent — vetted helpers are never flagged ───────────────────────────

describe('scanContent — the two vetted helpers are never flagged', () => {
  test('apps/web/src/lib/truncate.ts internal slicing is excluded by path', () => {
    const fixture = `
export function truncate(text, max) {
  const sliced = text.slice(0, max)
  return sliced
}
`
    const hits = scanContent(fixture, 'apps/web/src/lib/truncate.ts')
    assert.deepEqual(hits, [])
  })

  test('packages/seo/src/buildMetadata.ts internal slicing is excluded by path', () => {
    const fixture = `
export function truncateForMeta(text, limit) {
  const cut = text.slice(0, limit - 1)
  return cut
}
`
    const hits = scanContent(fixture, 'packages/seo/src/buildMetadata.ts')
    assert.deepEqual(hits, [])
  })

  test('the same violating snippet IS flagged outside the vetted-helper paths', () => {
    const fixture = `const cut = text.slice(0, 160)\n`
    const hits = scanContent(fixture, 'apps/web/src/components/NotVetted.tsx')
    assert.equal(hits.length, 1)
  })

  test('VETTED_HELPER_PATHS contains exactly the two spec-named files', () => {
    assert.ok(VETTED_HELPER_PATHS.has('apps/web/src/lib/truncate.ts'))
    assert.ok(VETTED_HELPER_PATHS.has('packages/seo/src/buildMetadata.ts'))
    assert.equal(VETTED_HELPER_PATHS.size, 2)
  })

  test('isVettedHelperPath matches only the two vetted files', () => {
    assert.equal(isVettedHelperPath('apps/web/src/lib/truncate.ts'), true)
    assert.equal(isVettedHelperPath('packages/seo/src/buildMetadata.ts'), true)
    assert.equal(isVettedHelperPath('apps/web/src/lib/other.ts'), false)
  })
})

// ── findHits — multi-file aggregation ────────────────────────────────────────

describe('findHits — aggregates across files', () => {
  test('combines hits from multiple file entries, respecting vetted-path exclusion', () => {
    const entries = [
      {
        path: join(REPO_ROOT, 'apps/web/src/lib/truncate.ts'),
        content: `const sliced = text.slice(0, max)\n`,
      },
      {
        path: join(REPO_ROOT, 'apps/web/src/components/Bad.tsx'),
        content: `const clipped = description.slice(0, 140)\n`,
      },
    ]
    const hits = findHits(entries)
    assert.equal(hits.length, 1)
    assert.equal(hits[0].file, 'apps/web/src/components/Bad.tsx')
  })
})

// ── toRelPath ─────────────────────────────────────────────────────────────────

describe('toRelPath', () => {
  test('converts an absolute path under REPO_ROOT to a forward-slash relative path', () => {
    const abs = join(REPO_ROOT, 'apps', 'web', 'src', 'lib', 'truncate.ts')
    assert.equal(toRelPath(abs), 'apps/web/src/lib/truncate.ts')
  })
})

// ── isScannableFile ───────────────────────────────────────────────────────────

describe('isScannableFile', () => {
  test('accepts .ts and .tsx files', () => {
    assert.equal(isScannableFile('/x/y/Card.tsx'), true)
    assert.equal(isScannableFile('/x/y/util.ts'), true)
  })

  test('rejects .test.ts and .test.tsx files', () => {
    assert.equal(isScannableFile('/x/y/util.test.ts'), false)
    assert.equal(isScannableFile('/x/y/Card.test.tsx'), false)
  })

  test('rejects non-TS extensions', () => {
    assert.equal(isScannableFile('/x/y/styles.css'), false)
    assert.equal(isScannableFile('/x/y/readme.md'), false)
  })
})

// ── alreadyFiled ──────────────────────────────────────────────────────────────

describe('alreadyFiled — deduplication by file:line', () => {
  test('returns true when a pending row exists for the file:line', () => {
    const audit = `### [ ] [engineering] [4.2] \`apps/web/src/components/Bad.tsx:4\` raw .slice bypass
- filed: 2026-06-21 by truncation-call-site-check.mjs — apps/web/src/components/Bad.tsx:4
`
    assert.equal(alreadyFiled(audit, 'apps/web/src/components/Bad.tsx:4'), true)
  })

  test('returns false when no row exists for that file:line', () => {
    const audit = `### [ ] [engineering] [4.2] \`apps/web/src/components/Other.tsx:9\` raw .slice bypass
- filed: 2026-06-21 by truncation-call-site-check.mjs — apps/web/src/components/Other.tsx:9
`
    assert.equal(alreadyFiled(audit, 'apps/web/src/components/Bad.tsx:4'), false)
  })

  test('returns false when the row is already completed ([x])', () => {
    const audit = `### [x] [engineering] [4.2] \`apps/web/src/components/Bad.tsx:4\` raw .slice bypass
- filed: 2026-06-21 by truncation-call-site-check.mjs — apps/web/src/components/Bad.tsx:4
`
    assert.equal(alreadyFiled(audit, 'apps/web/src/components/Bad.tsx:4'), false)
  })

  test('returns false on empty AUDIT.md content', () => {
    assert.equal(alreadyFiled('', 'apps/web/src/components/Bad.tsx:4'), false)
  })

  test('does not collide on same line number in a different file', () => {
    const audit = `### [ ] [engineering] [4.2] \`apps/web/src/components/Other.tsx:4\` raw .slice bypass
- filed: 2026-06-21 by truncation-call-site-check.mjs — apps/web/src/components/Other.tsx:4
`
    assert.equal(alreadyFiled(audit, 'apps/web/src/components/Bad.tsx:4'), false)
  })
})

// ── formatAuditRow ────────────────────────────────────────────────────────────

describe('formatAuditRow', () => {
  test('includes the engineering category, file:line, and snippet', () => {
    const hit = {
      file: 'apps/web/src/components/Bad.tsx',
      line: 4,
      identifier: 'description',
      method: 'slice',
      snippet: 'description.slice(0, 140)',
    }
    const row = formatAuditRow(hit, new Date('2026-11-18T00:00:00Z'))
    assert.match(row, /\[engineering\]/)
    assert.match(row, /apps\/web\/src\/components\/Bad\.tsx:4/)
    assert.match(row, /description\.slice\(0, 140\)/)
    assert.match(row, /category: engineering/)
    assert.match(row, /2026-11-18/)
  })
})

// ── gate mode — real tree (A3 / A4 real-tree assertion) ──────────────────────

describe('gate mode — real apps/web/src and packages/*/src trees', () => {
  test('exits 0 against the current codebase (no live violations today)', () => {
    assert.doesNotThrow(() => {
      execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, stdio: 'pipe' })
    })
  })
})
