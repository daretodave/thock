// scripts/__tests__/itemlist-jsonld-parity-check.test.mjs
//
// Unit tests for scripts/itemlist-jsonld-parity-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { __test } from '../itemlist-jsonld-parity-check.mjs'

const { evaluateRoute } = __test

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')
const SCRIPT_PATH = join(__dirname, '..', 'itemlist-jsonld-parity-check.mjs')

const FIXTURE_FILE = 'apps/web/src/app/fixture/page.tsx'

// ── evaluateRoute — fixture cases ────────────────────────────────────────────
//
// Each fixture builds a fake ROUTE_MAP-shaped entry (never touching the real
// ROUTE_MAP or real app files) plus a fake `fileContents` Map keyed by
// repo-relative path, exactly the shape `evaluateRoute(entry, fileContents)`
// expects — the same `{ pattern, token }` `confirm` anchor list the real
// mapping uses for routes whose derivation isn't a single auto-extractable
// chain. Using `confirm` on both sides keeps the fixtures fully
// self-contained: no real source expressions, no real files on disk.

describe('evaluateRoute — identical ordered token lists (clean)', () => {
  test('reports clean when jsonld and rendered resolve the same tokens in the same order', () => {
    const entry = {
      route: '/fixture/clean',
      file: FIXTURE_FILE,
      jsonld: {
        kind: 'confirm',
        items: [
          { pattern: /aaa/, token: 'a' },
          { pattern: /bbb/, token: 'b' },
          { pattern: /ccc/, token: 'c' },
        ],
      },
      rendered: {
        items: [
          { pattern: /aaa/, token: 'a' },
          { pattern: /bbb/, token: 'b' },
          { pattern: /ccc/, token: 'c' },
        ],
      },
    }
    const fileContents = new Map([[FIXTURE_FILE, 'aaa bbb ccc']])
    const result = evaluateRoute(entry, fileContents)
    assert.equal(result.status, 'clean')
    assert.deepEqual(result.jsonldTokens, ['a', 'b', 'c'])
    assert.deepEqual(result.renderedTokens, ['a', 'b', 'c'])
  })
})

describe('evaluateRoute — same token set, different order (order-mismatch)', () => {
  test('flags order-mismatch when jsonld and rendered resolve the same tokens in a different order', () => {
    const entry = {
      route: '/fixture/order-mismatch',
      file: FIXTURE_FILE,
      jsonld: {
        kind: 'confirm',
        items: [
          { pattern: /aaa/, token: 'a' },
          { pattern: /bbb/, token: 'b' },
          { pattern: /ccc/, token: 'c' },
        ],
      },
      rendered: {
        // Same three anchors, curated in reverse order — standing in for a
        // rendered section that iterates the same URLs in a different
        // sequence than the JSON-LD side was computed from.
        items: [
          { pattern: /ccc/, token: 'c' },
          { pattern: /bbb/, token: 'b' },
          { pattern: /aaa/, token: 'a' },
        ],
      },
    }
    const fileContents = new Map([[FIXTURE_FILE, 'aaa bbb ccc']])
    const result = evaluateRoute(entry, fileContents)
    assert.equal(result.status, 'order-mismatch')
    assert.deepEqual(result.jsonldTokens, ['a', 'b', 'c'])
    assert.deepEqual(result.renderedTokens, ['c', 'b', 'a'])
  })
})

describe('evaluateRoute — divergent token sets (set-difference)', () => {
  test('flags set-difference, naming extra and missing tokens, when the two sides cover different URLs', () => {
    const entry = {
      route: '/fixture/set-difference',
      file: FIXTURE_FILE,
      jsonld: {
        kind: 'confirm',
        items: [
          { pattern: /aaa/, token: 'a' },
          { pattern: /bbb/, token: 'b' },
          { pattern: /ccc/, token: 'c' },
        ],
      },
      rendered: {
        // Shares a/b with the jsonld side but swaps in `ddd` for `ccc` —
        // the rendered array includes a URL the JSON-LD array omits, and
        // the JSON-LD array includes one the rendered array doesn't.
        items: [
          { pattern: /aaa/, token: 'a' },
          { pattern: /bbb/, token: 'b' },
          { pattern: /ddd/, token: 'd' },
        ],
      },
    }
    const fileContents = new Map([[FIXTURE_FILE, 'aaa bbb ccc ddd']])
    const result = evaluateRoute(entry, fileContents)
    assert.equal(result.status, 'set-difference')
    assert.deepEqual(result.extra, ['c'])
    assert.deepEqual(result.missing, ['d'])
  })
})

// ── gate mode — real apps/web/src/app tree (A6 real-corpus assertion) ───────

describe('gate mode — real apps/web/src/app tree', () => {
  test('exits 0 against the current corpus (no live parity gaps today)', () => {
    assert.doesNotThrow(() => {
      execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, stdio: 'pipe' })
    })
  })
})
