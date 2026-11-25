// scripts/__tests__/heading-semantics-coverage-check.test.mjs
//
// Unit tests for scripts/heading-semantics-coverage-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { __test } from '../heading-semantics-coverage-check.mjs'

const { scanSiblingContent } = __test

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')
const SCRIPT_PATH = join(__dirname, '..', 'heading-semantics-coverage-check.mjs')

const FIXTURE_PATH = 'apps/web/src/components/fixtures/FixtureList.tsx'

// ── scanSiblingContent — fixture cases ───────────────────────────────────────
//
// scanSiblingContent (rather than scanCuratedContent) is the right function
// for synthetic fixtures here: it requires a `.map()`/`.flatMap()` call per
// its own doc comment, which is easy to construct inline, and it's the path
// that exercises the component-name (`<Heading as="h3">`) heuristic exactly
// as a real sibling component would hit it.

describe('scanSiblingContent — bare span/Link with no heading ancestor (flagged)', () => {
  test('flags a title rendered inside a bare <span> inside a .map()', () => {
    const content = `
function FixtureList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  )
}
`
    const flagged = scanSiblingContent(FIXTURE_PATH, content)
    assert.equal(flagged.length, 1)
    assert.equal(flagged[0].expr, 'item.title')
    assert.equal(flagged[0].propName, 'title')
  })

  test('flags a title rendered inside a bare <Link> inside a .map()', () => {
    const content = `
function FixtureList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Link href={item.href}>{item.title}</Link>
        </li>
      ))}
    </ul>
  )
}
`
    const flagged = scanSiblingContent(FIXTURE_PATH, content)
    assert.equal(flagged.length, 1)
    assert.equal(flagged[0].expr, 'item.title')
  })
})

describe('scanSiblingContent — title inside a literal heading tag (clean)', () => {
  test('does not flag a title rendered inside an <h2>', () => {
    const content = `
function FixtureList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <h2>{item.title}</h2>
        </li>
      ))}
    </ul>
  )
}
`
    const flagged = scanSiblingContent(FIXTURE_PATH, content)
    assert.deepEqual(flagged, [])
  })

  test('does not flag a title rendered inside an <h3>', () => {
    const content = `
function FixtureList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <h3>{item.title}</h3>
        </li>
      ))}
    </ul>
  )
}
`
    const flagged = scanSiblingContent(FIXTURE_PATH, content)
    assert.deepEqual(flagged, [])
  })
})

describe('scanSiblingContent — <Heading as="h3">-style wrapper (clean, component-name heuristic)', () => {
  test('does not flag a title rendered inside an H-prefixed wrapper component', () => {
    const content = `
function FixtureList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Heading as="h3">{item.title}</Heading>
        </li>
      ))}
    </ul>
  )
}
`
    const flagged = scanSiblingContent(FIXTURE_PATH, content)
    assert.deepEqual(flagged, [])
  })
})

// ── gate mode — real apps/web/src tree (A6 real-tree assertion) ─────────────

describe('gate mode — real apps/web/src tree', () => {
  test('exits 0 against the current codebase (no live violations today)', () => {
    assert.doesNotThrow(() => {
      execFileSync('node', [SCRIPT_PATH], { cwd: REPO_ROOT, stdio: 'pipe' })
    })
  })
})
