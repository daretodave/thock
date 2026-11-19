// scripts/__tests__/stale-updated-at-check.test.mjs
//
// Unit tests for scripts/stale-updated-at-check.mjs.
// Uses Node's built-in node:test runner — no devDeps required.
//
// The git-history-walking half of this script (getFileCommits,
// isSelfReferentialUpdatedAtOnly, findLastContentCommit, checkArticle,
// scanArticles) reads real git history, so it's exercised against a
// scratch git repo with controlled commits — mirroring
// scripts/__tests__/plan-check.test.mjs's scratchRepo() approach (the
// only other git-fixture-repo precedent in this test suite) rather than
// og-coverage-check.test.mjs's pure-function/fake-path approach, which
// doesn't apply here since this script's core logic isn't filesystem-pure
// — it has to shell out to git.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { __test } from '../stale-updated-at-check.mjs'

const {
  extractFrontmatterText,
  parseFrontmatterField,
  toDateOnly,
  checkArticle,
  scanArticles,
  formatAuditRow,
  alreadyFiled,
} = __test

// ── Scratch git repo helpers ──────────────────────────────────────────────────

function git(dir, args, env) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } })
}

// Creates a fresh scratch git repo with an articles/ directory and local
// (not global) commit identity — never touches the real repo's config.
function makeRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'suac-test-'))
  git(dir, ['init', '-q'])
  git(dir, ['config', 'user.email', 'test@example.com'])
  git(dir, ['config', 'user.name', 'Test'])
  git(dir, ['config', 'commit.gpgsign', 'false'])
  const articlesDir = join(dir, 'articles')
  mkdirSync(articlesDir)
  return { dir, articlesDir }
}

// Writes `slug`.mdx and commits it, with both author and committer date
// pinned to `isoDate` (date-only is all this script compares, but a full
// ISO timestamp is what git actually wants).
function commitFile(dir, relPath, content, isoDate, message) {
  writeFileSync(join(dir, relPath), content, 'utf8')
  git(dir, ['add', relPath])
  const dateEnv = { GIT_AUTHOR_DATE: isoDate, GIT_COMMITTER_DATE: isoDate }
  git(dir, ['commit', '-q', '-m', message], dateEnv)
}

function mdx(updatedAt, body, slug = 'test-article') {
  return `---
slug: ${slug}
title: "Test Article"
lede: "A test article."
author: thock
pillar: deep-dives
publishedAt: '2026-01-01T00:00:00.000Z'
updatedAt: '${updatedAt}'
---
${body}
`
}

// ── checkArticle / scanArticles — fixture-repo cases (A2, A3) ───────────────

describe('checkArticle — fixture-repo staleness detection', () => {
  test('flags an article whose updatedAt predates a later content-changing commit (A2)', () => {
    const { dir, articlesDir } = makeRepo()
    try {
      const relPath = 'articles/test-article.mdx'
      commitFile(
        dir,
        relPath,
        mdx('2026-01-01T00:00:00.000Z', 'Original body text.'),
        '2026-01-01T00:00:00+00:00',
        'add test-article',
      )
      commitFile(
        dir,
        relPath,
        mdx('2026-01-01T00:00:00.000Z', 'Revised body text — a factual correction.'),
        '2026-01-15T00:00:00+00:00',
        'fix test-article body',
      )

      const result = checkArticle(dir, join(articlesDir, 'test-article.mdx'))
      assert.ok(result, 'expected a stale flag')
      assert.equal(result.slug, 'test-article')
      assert.equal(result.updatedAt, '2026-01-01')
      assert.equal(result.lastContentCommitAt, '2026-01-15')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  test('passes an article whose updatedAt is already current (A2)', () => {
    const { dir, articlesDir } = makeRepo()
    try {
      const relPath = 'articles/test-article.mdx'
      commitFile(
        dir,
        relPath,
        mdx('2026-02-01T00:00:00.000Z', 'Original body text, current as of its updatedAt.'),
        '2026-02-01T00:00:00+00:00',
        'add test-article',
      )

      const result = checkArticle(dir, join(articlesDir, 'test-article.mdx'))
      assert.equal(result, null)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  test('does not re-flag an article whose only post-updatedAt commit is a self-referential updatedAt-only bump (A3)', () => {
    const { dir, articlesDir } = makeRepo()
    try {
      const relPath = 'articles/test-article.mdx'
      // Commit 1: created with updatedAt matching its own date.
      commitFile(
        dir,
        relPath,
        mdx('2026-04-01T00:00:00.000Z', 'Original body text.'),
        '2026-04-01T00:00:00+00:00',
        'add test-article',
      )
      // Commit 2: a real content edit, landing before updatedAt is bumped.
      commitFile(
        dir,
        relPath,
        mdx('2026-04-01T00:00:00.000Z', 'Revised body text — a factual correction.'),
        '2026-04-10T00:00:00+00:00',
        'fix test-article body',
      )
      // Commit 3: a self-referential bump — touches only the updatedAt
      // line, catching the frontmatter up to the content commit's date.
      // Its own commit date (2026-04-12) is later still: a naive "most
      // recent commit touching this file" read would compare that date
      // against updatedAt and wrongly flag this as stale.
      commitFile(
        dir,
        relPath,
        mdx('2026-04-10T00:00:00.000Z', 'Revised body text — a factual correction.'),
        '2026-04-12T00:00:00+00:00',
        'bump updatedAt',
      )

      const result = checkArticle(dir, join(articlesDir, 'test-article.mdx'))
      assert.equal(result, null, 'the self-referential bump commit must not be mistaken for a content change')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  test('scanArticles scans every .mdx file and returns only the stale ones', () => {
    const { dir, articlesDir } = makeRepo()
    try {
      commitFile(
        dir,
        'articles/stale-one.mdx',
        mdx('2026-01-01T00:00:00.000Z', 'Body.', 'stale-one'),
        '2026-01-01T00:00:00+00:00',
        'add stale-one',
      )
      commitFile(
        dir,
        'articles/stale-one.mdx',
        mdx('2026-01-01T00:00:00.000Z', 'Edited body.', 'stale-one'),
        '2026-01-20T00:00:00+00:00',
        'fix stale-one body',
      )
      commitFile(
        dir,
        'articles/clean-one.mdx',
        mdx('2026-02-01T00:00:00.000Z', 'Body.', 'clean-one'),
        '2026-02-01T00:00:00+00:00',
        'add clean-one',
      )

      const stale = scanArticles(dir, articlesDir)
      assert.equal(stale.length, 1)
      assert.equal(stale[0].slug, 'stale-one')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

// ── extractFrontmatterText / parseFrontmatterField ──────────────────────────

describe('extractFrontmatterText / parseFrontmatterField', () => {
  test('extracts frontmatter text between --- delimiters', () => {
    const content = mdx('2026-01-01T00:00:00.000Z', 'Body.')
    const fm = extractFrontmatterText(content)
    assert.match(fm, /slug: test-article/)
  })

  test('parses a quoted field, stripping quotes', () => {
    const fm = `updatedAt: '2026-01-01T00:00:00.000Z'`
    assert.equal(parseFrontmatterField(fm, 'updatedAt'), '2026-01-01T00:00:00.000Z')
  })

  test('parses a bare (unquoted) field', () => {
    const fm = `slug: test-article`
    assert.equal(parseFrontmatterField(fm, 'slug'), 'test-article')
  })

  test('returns empty string when field is absent', () => {
    assert.equal(parseFrontmatterField('slug: x', 'updatedAt'), '')
  })
})

// ── toDateOnly ────────────────────────────────────────────────────────────────

describe('toDateOnly', () => {
  test('truncates an ISO timestamp with Z to its date', () => {
    assert.equal(toDateOnly('2026-08-24T00:00:00.000Z'), '2026-08-24')
  })

  test('truncates an ISO timestamp with an offset to its date', () => {
    assert.equal(toDateOnly('2026-08-25T10:00:00+09:00'), '2026-08-25')
  })
})

// ── formatAuditRow / alreadyFiled ────────────────────────────────────────────

describe('formatAuditRow — AUDIT.md row formatting (A4)', () => {
  test('files a seo-category row with slug, updatedAt and lastContentCommitAt', () => {
    const row = formatAuditRow(
      { slug: 'test-article', updatedAt: '2026-01-01', lastContentCommitAt: '2026-01-15' },
      new Date('2026-02-01T00:00:00.000Z'),
    )
    assert.match(row, /\[seo\]/)
    assert.match(row, /test-article/)
    assert.match(row, /updatedAt: 2026-01-01/)
    assert.match(row, /lastContentCommitAt: 2026-01-15/)
    assert.match(row, /filed: 2026-02-01 by stale-updated-at-check\.mjs — test-article/)
  })
})

describe('alreadyFiled — deduplication (A4)', () => {
  test('returns true when a pending row exists for the slug', () => {
    const audit = `### [ ] [seo] [5.4] test-article frontmatter updatedAt is stale
- category: seo
- filed: 2026-02-01 by stale-updated-at-check.mjs — test-article
`
    assert.equal(alreadyFiled(audit, 'test-article'), true)
  })

  test('returns false when no row exists for the slug', () => {
    const audit = `### [ ] [seo] [5.4] other-article frontmatter updatedAt is stale
- filed: 2026-02-01 by stale-updated-at-check.mjs — other-article
`
    assert.equal(alreadyFiled(audit, 'test-article'), false)
  })

  test('returns false when the existing row is already completed ([x])', () => {
    const audit = `### [x] [seo] [5.4] test-article frontmatter updatedAt is stale
- filed: 2026-02-01 by stale-updated-at-check.mjs — test-article
`
    assert.equal(alreadyFiled(audit, 'test-article'), false)
  })

  test('returns false on empty AUDIT.md content', () => {
    assert.equal(alreadyFiled('', 'test-article'), false)
  })
})
