#!/usr/bin/env node
// scripts/stale-updated-at-check.mjs
//
// Diffs an article's frontmatter `updatedAt` against the git history of its
// own content, so a substantive edit that forgets to bump `updatedAt` stops
// silently telling crawlers (`dateModified` JSON-LD, `article:modified_time`
// OG meta — both sourced solely from `updatedAt` per
// packages/seo/src/buildJsonLd.ts) that nothing changed.
//
// Five independent reactive fixes landed the same mechanism over three
// weeks (see plan/10-stale-updated-at-mechanical-check.md's "Why"): a
// content-fix commit edits an article's body or frontmatter but leaves
// `updatedAt` untouched. This script mirrors the shape of
// og-coverage-check.mjs / article-parts-check.mjs (gate / --write / --json
// modes, AUDIT.md row filing, dedup against pending rows) and
// group-buy-article-staleness-check.mjs's frontmatter-extraction
// conventions.
//
// Chunk 10.1 scope (plan/10-stale-updated-at-mechanical-check.md, A1, A2,
// A3, A4, A5, A7): the script + fixture tests. Survey-chain wiring into
// skills/march.lanes.md and skills/digest.md is chunk 10.2 — out of scope
// here; this script's --write contract already matches what both call
// sites will expect.
//
// Detection shape: for each article MDX file, walk `git log` on that file
// from newest to oldest, skipping any commit whose diff on the file
// touches only the frontmatter `updatedAt` line (a self-referential bump
// commit) to find the most recent commit that changed the file's actual
// body or any other frontmatter field. A drift where that commit's date
// is strictly after the frontmatter `updatedAt` date is a flag. Compared
// at date granularity (not timestamp) per the spec's upfront decision —
// avoids false positives from a same-day fix-then-bump landing in two
// commits minutes apart.
//
// Usage:
//   node scripts/stale-updated-at-check.mjs
//     Gate mode: exit 1 printing every flagged slug + both dates if any
//     hit, exit 0 otherwise.
//
//   node scripts/stale-updated-at-check.mjs --write
//     Scan mode: appends one seo-category plan/AUDIT.md row per hit,
//     deduplicated against existing pending rows. Exit 0.
//
//   node scripts/stale-updated-at-check.mjs --json
//     JSON output: { stale: [{ slug, updatedAt, lastContentCommitAt }] }.
//     Exit 0.
//
// Exit codes:
//   0 → clean (gate mode) or scan complete (--write/--json mode)
//   1 → stale articles found (gate mode) or unrecoverable error (any mode)
//
// Detection only — no change to updatedAt semantics or any JSON-LD/OG call
// site (A7). A parse miss or missing-field article is skipped (logged),
// never aborts the run; a raw git-command failure on one file is treated
// conservatively (see isSelfReferentialUpdatedAtOnly below).

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// ── Frontmatter extraction (mirrors group-buy-article-staleness-check.mjs) ──

function extractFrontmatterText(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ''
}

// Parses a single scalar frontmatter field from raw YAML frontmatter text.
// Handles the quoted ('...'/"...") and bare scalar shapes the corpus uses.
// Returns '' if the field is absent.
function parseFrontmatterField(frontmatterText, field) {
  const re = new RegExp(`^${field}:\\s*(.*)$`, 'm')
  const m = frontmatterText.match(re)
  if (!m) return ''
  let value = m[1].trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }
  return value
}

// The YYYY-MM-DD date portion of an ISO-8601-ish timestamp string — the
// spec's "date granularity, not timestamp" comparison.
function toDateOnly(isoString) {
  return isoString.slice(0, 10)
}

// ── Git history walking ──────────────────────────────────────────────────────

// Returns [{ sha, date }] for every commit that touched filePath, newest
// first — git log's own default order for a single path query. `date` is
// the commit's %cI (committer date, ISO-8601 with offset) string.
function getFileCommits(repoRoot, filePath) {
  let raw
  try {
    raw = execFileSync('git', ['log', '--format=%H%x00%cI', '--', filePath], {
      cwd: repoRoot,
      encoding: 'utf8',
    })
  } catch {
    return []
  }
  return raw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, date] = line.split('\0')
      return { sha, date }
    })
}

// True when every added/removed line in `sha`'s diff on filePath is a
// change to the frontmatter `updatedAt:` line — a self-referential bump
// commit that doesn't reflect the file's actual content changing. Context
// lines (unprefixed) and file-header lines (+++/---) are ignored. A
// commit with no +/- lines found on this path (defensive — the caller
// already filtered to commits git log says touched the path) counts as
// self-referential: there's nothing here to attribute staleness to. A
// git-show failure (corrupt history, bad sha) is treated as NOT
// self-referential — the conservative read, since silently skipping a
// commit we can't actually inspect could hide a real content change
// rather than merely under-report one.
function isSelfReferentialUpdatedAtOnly(repoRoot, sha, filePath) {
  let patch
  try {
    patch = execFileSync('git', ['show', '--format=', '-p', sha, '--', filePath], {
      cwd: repoRoot,
      encoding: 'utf8',
    })
  } catch {
    return false
  }

  const changedLines = patch
    .split('\n')
    .filter(
      (line) =>
        (line.startsWith('+') || line.startsWith('-')) &&
        !line.startsWith('+++') &&
        !line.startsWith('---'),
    )

  if (changedLines.length === 0) return true

  return changedLines.every((line) => /^updatedAt:\s*/.test(line.slice(1).trim()))
}

// Walks filePath's commit history newest-to-oldest, skipping self-
// referential updatedAt-only bumps, and returns the first (most recent)
// commit that changed the file's actual body or any other frontmatter
// field. Returns null if every commit touching the file was a bump (not
// expected in practice — the file-creation commit always carries body
// content) or if the file has no git history at all.
function findLastContentCommit(repoRoot, filePath) {
  const commits = getFileCommits(repoRoot, filePath)
  for (const commit of commits) {
    if (!isSelfReferentialUpdatedAtOnly(repoRoot, commit.sha, filePath)) {
      return commit
    }
  }
  return null
}

// ── Per-article check ─────────────────────────────────────────────────────────

// Checks one article file for staleness. Returns { slug, updatedAt,
// lastContentCommitAt } (both YYYY-MM-DD) if stale, null if clean or if
// there's nothing to compare (no updatedAt field, or no content commit
// found in history).
function checkArticle(repoRoot, filePath) {
  const content = readFileSync(filePath, 'utf8')
  const frontmatterText = extractFrontmatterText(content)
  const slug = parseFrontmatterField(frontmatterText, 'slug')
  const updatedAtRaw = parseFrontmatterField(frontmatterText, 'updatedAt')
  if (!updatedAtRaw) return null

  const lastContentCommit = findLastContentCommit(repoRoot, filePath)
  if (!lastContentCommit) return null

  const updatedAtDate = toDateOnly(updatedAtRaw)
  const commitDate = toDateOnly(lastContentCommit.date)

  if (commitDate > updatedAtDate) {
    return {
      slug: slug || filePath,
      updatedAt: updatedAtDate,
      lastContentCommitAt: commitDate,
    }
  }
  return null
}

// Scans every .mdx file under articlesDir for staleness. A parse miss or
// unreadable file logs and is skipped — never aborts the run.
function scanArticles(repoRoot, articlesDir) {
  const files = readdirSync(articlesDir).filter((f) => f.endsWith('.mdx'))
  const stale = []
  for (const file of files) {
    const filePath = join(articlesDir, file)
    try {
      const result = checkArticle(repoRoot, filePath)
      if (result) stale.push(result)
    } catch (err) {
      console.error(`stale-updated-at-check: failed to check ${file} — ${err.message}`)
    }
  }
  return stale
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(item, today) {
  const todayStr = today.toISOString().slice(0, 10)
  return `
### [ ] [seo] [5.4] ${item.slug} frontmatter updatedAt is stale
- category: seo
- filed: ${todayStr} by stale-updated-at-check.mjs — ${item.slug}
- impact: 6 (dateModified JSON-LD and article:modified_time OG meta both source solely from updatedAt — crawlers are told nothing changed since ${item.updatedAt} even though the content last changed ${item.lastContentCommitAt})
- ease: 9 (single frontmatter date bump, no code or schema change)
- score: 5.4 (impact × ease / 10)
- article: apps/web/src/content/articles/${item.slug}.mdx
- updatedAt: ${item.updatedAt}
- lastContentCommitAt: ${item.lastContentCommitAt}
- action: bump updatedAt in ${item.slug}.mdx's frontmatter to ${item.lastContentCommitAt} (or later)
`
}

// ── Deduplication (mirrors og-coverage-check.mjs's alreadyFiled) ────────────

// Returns true if AUDIT.md already has a pending (unchecked) seo row for
// the given slug filed by stale-updated-at-check.
function alreadyFiled(auditContent, slug) {
  const marker = `stale-updated-at-check.mjs — ${slug}`
  const lines = auditContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      // Walk back to find the nearest ### heading.
      for (let j = i; j >= 0; j--) {
        if (lines[j].startsWith('### ')) {
          return lines[j].startsWith('### [ ]')
        }
      }
    }
  }
  return false
}

// ── __test export ─────────────────────────────────────────────────────────────

export const __test = {
  extractFrontmatterText,
  parseFrontmatterField,
  toDateOnly,
  getFileCommits,
  isSelfReferentialUpdatedAtOnly,
  findLastContentCommit,
  checkArticle,
  scanArticles,
  formatAuditRow,
  alreadyFiled,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Imported as library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')

  let stale
  try {
    stale = scanArticles(REPO_ROOT, ARTICLES_DIR)
  } catch (err) {
    console.error(`stale-updated-at-check: failed to scan articles — ${err.message}`)
    process.exit(1)
  }

  if (doJson) {
    console.log(JSON.stringify({ stale }, null, 2))
    process.exit(0)
  }

  if (doWrite) {
    if (stale.length === 0) {
      console.log('stale-updated-at-check: all articles current — no AUDIT rows filed.')
      process.exit(0)
    }

    let auditContent = ''
    try {
      if (existsSync(AUDIT_MD)) {
        auditContent = readFileSync(AUDIT_MD, 'utf8')
      }
    } catch (err) {
      console.error(`stale-updated-at-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const item of stale) {
      if (alreadyFiled(auditContent, item.slug)) {
        console.log(`stale-updated-at-check: ${item.slug} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(item, today))
      console.log(
        `stale-updated-at-check: ${item.slug} updatedAt (${item.updatedAt}) predates last content commit (${item.lastContentCommitAt}) — filing AUDIT row`,
      )
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`stale-updated-at-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`stale-updated-at-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print flags and exit 1.
  if (stale.length === 0) {
    console.log('stale-updated-at-check: all articles current.')
    process.exit(0)
  }

  for (const item of stale) {
    console.error(
      `STALE updatedAt: ${item.slug} — updatedAt=${item.updatedAt}, last content commit=${item.lastContentCommitAt}`,
    )
  }
  console.error(
    `stale-updated-at-check: ${stale.length} article(s) have a stale frontmatter updatedAt — bump updatedAt before shipping.`,
  )
  process.exit(1)
}
