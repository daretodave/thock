#!/usr/bin/env node
// scripts/loop-issue.mjs
//
// "Loop issue mirror" — opens / closes GitHub issues that mirror
// /iterate's pick-and-ship cycle. Phase 15a contract.
//
// Subcommands:
//
//   open --severity <high|med|low>
//        --category <bug|enhancement|content|data|docs|seo|a11y|perf>
//        --source <user|reader|audit|external>
//        --title "<title>"
//        --body-file <path>
//
//     Creates a new issue. Echoes the issue number to stdout
//     (just the number, nothing else, for clean shell capture).
//     Exits 0 on success, 1 on failure (caller falls back to
//     "no issue, just ship" — mirror is best-effort).
//
//   close-comment --number <N>
//                 --commit <sha>
//                 --deploy-url <url>
//
//     Posts a follow-up comment confirming the deploy. The
//     `Closes #N` trailer in the commit body auto-closes the
//     issue when pushed to main; no explicit `gh issue close`
//     is required. Failures are warnings, not blockers — the
//     fix has already shipped.
//
// Required env (from .env or shell):
//   GH_TOKEN    repo-scoped PAT
//   GH_REPO     owner/repo, e.g. daretodave/thock
//
// Reads .env using the same loader as scripts/deploy-check.mjs.

import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

// --- load .env if present (Node has no built-in .env loader) ---
if (fs.existsSync('.env')) {
  for (const line of fs.readFileSync('.env', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

const VALID_SEVERITY = new Set(['high', 'med', 'low'])
const VALID_SOURCE = new Set(['user', 'reader', 'audit', 'external'])
const VALID_CATEGORY = new Set([
  'bug',
  'enhancement',
  'content',
  'data',
  'docs',
  'seo',
  'a11y',
  'perf',
])

// Label palette (color hexes — GitHub takes hex without `#`).
// Created idempotently on first encounter via `gh label create`.
const LABEL_PALETTE = {
  'loop:opened': { color: '5319e7', description: 'Opened by the autonomous loop' },
  'severity:high': { color: 'b60205', description: 'High severity finding' },
  'severity:med': { color: 'fbca04', description: 'Medium severity finding' },
  'severity:low': { color: 'c5def5', description: 'Low severity finding' },
  'source:user': { color: '0e8a16', description: 'Originated from /jot' },
  'source:reader': { color: '1d76db', description: 'Originated from /critique reader' },
  'source:audit': { color: '5319e7', description: 'Originated from /iterate audit' },
  'source:external': { color: 'd93f0b', description: 'Routed in by /triage from a user-filed issue' },
  bug: { color: 'd73a4a', description: '' },
  enhancement: { color: 'a2eeef', description: '' },
  content: { color: '0075ca', description: '' },
  data: { color: '7057ff', description: '' },
  docs: { color: '0052cc', description: '' },
  seo: { color: 'bfdadc', description: '' },
  a11y: { color: '5319e7', description: '' },
  perf: { color: 'e99695', description: '' },
}

// --- argv parsing -----------------------------------------------------

function parseArgs(argv) {
  const flags = {}
  let i = 0
  while (i < argv.length) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true'
      flags[key] = val
      i += val === 'true' ? 1 : 2
    } else {
      i += 1
    }
  }
  return flags
}

// --- gh wrappers (extracted so tests can mock them) -------------------

function ghCall(args, opts = {}) {
  const r = spawnSync('gh', args, { encoding: 'utf-8', ...opts })
  return { status: r.status ?? 1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
}

function ensureLabel(name, repo) {
  const palette = LABEL_PALETTE[name] ?? { color: 'cccccc', description: '' }
  const r = spawnSync(
    'gh',
    [
      'label',
      'create',
      name,
      '--repo',
      repo,
      '--color',
      palette.color,
      '--description',
      palette.description ?? '',
    ],
    { encoding: 'utf-8' },
  )
  if (r.status === 0) return { created: true }
  // gh exits non-zero when the label already exists; that's the dominant
  // case after the first run. Swallow only that specific error.
  const out = (r.stderr ?? '') + (r.stdout ?? '')
  if (/already exists/i.test(out)) return { created: false }
  return { created: false, error: out.trim() || `gh label create exited ${r.status}` }
}

function parseIssueNumber(stdout) {
  // gh issue create prints the URL as its last line, e.g.
  //   https://github.com/daretodave/thock/issues/42
  const lines = stdout.trim().split(/\r?\n/).filter(Boolean)
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/\/issues\/(\d+)\s*$/)
    if (m) return Number(m[1])
  }
  return null
}

// --- subcommands ------------------------------------------------------

function cmdOpen(flags) {
  const { severity, category, source, title } = flags
  const bodyFile = flags['body-file']
  const repo = process.env.GH_REPO

  if (!process.env.GH_TOKEN) {
    process.stderr.write('loop-issue: GH_TOKEN missing from env (.env not loaded?)\n')
    process.exit(1)
  }
  if (!repo) {
    process.stderr.write('loop-issue: GH_REPO missing (set in .env)\n')
    process.exit(1)
  }
  if (!VALID_SEVERITY.has(severity)) {
    process.stderr.write(`loop-issue: --severity must be one of ${[...VALID_SEVERITY].join('|')}\n`)
    process.exit(1)
  }
  if (!VALID_CATEGORY.has(category)) {
    process.stderr.write(`loop-issue: --category must be one of ${[...VALID_CATEGORY].join('|')}\n`)
    process.exit(1)
  }
  if (!VALID_SOURCE.has(source)) {
    process.stderr.write(`loop-issue: --source must be one of ${[...VALID_SOURCE].join('|')}\n`)
    process.exit(1)
  }
  if (!title || !bodyFile) {
    process.stderr.write('loop-issue: --title and --body-file are required\n')
    process.exit(1)
  }
  if (!fs.existsSync(bodyFile)) {
    process.stderr.write(`loop-issue: body file not found: ${bodyFile}\n`)
    process.exit(1)
  }

  const labels = [
    'loop:opened',
    `severity:${severity}`,
    `source:${source}`,
    category,
  ]

  // Ensure all labels exist (idempotent).
  for (const name of labels) {
    const r = ensureLabel(name, repo)
    if (r.error) {
      process.stderr.write(`loop-issue: label ensure failed for ${name}: ${r.error}\n`)
      process.exit(1)
    }
  }

  // Create the issue.
  const r = ghCall([
    'issue',
    'create',
    '--repo',
    repo,
    '--title',
    title,
    '--body-file',
    path.resolve(bodyFile),
    '--label',
    labels.join(','),
  ])
  if (r.status !== 0) {
    process.stderr.write(`loop-issue: gh issue create failed (${r.status})\n${r.stderr}\n`)
    process.exit(1)
  }
  const number = parseIssueNumber(r.stdout)
  if (!number) {
    process.stderr.write(`loop-issue: could not parse issue number from gh stdout:\n${r.stdout}\n`)
    process.exit(1)
  }
  process.stdout.write(`${number}\n`)
}

function cmdCloseComment(flags) {
  const number = flags.number
  const commit = flags.commit
  const deployUrl = flags['deploy-url']
  const repo = process.env.GH_REPO

  if (!process.env.GH_TOKEN || !repo) {
    process.stderr.write('loop-issue: GH_TOKEN/GH_REPO missing — skipping comment\n')
    return // best-effort: do not exit non-zero
  }
  if (!number || !commit || !deployUrl) {
    process.stderr.write('loop-issue: --number, --commit, --deploy-url required\n')
    return
  }

  const body = buildCloseCommentBody({ commit, deployUrl })
  const r = ghCall(['issue', 'comment', String(number), '--repo', repo, '--body', body])
  if (r.status !== 0) {
    process.stderr.write(`loop-issue: comment failed for #${number} (status ${r.status})\n${r.stderr}\n`)
    return // best-effort: do not exit non-zero
  }
}

export function buildCloseCommentBody({ commit, deployUrl }) {
  return [
    `Shipped in ${commit}.`,
    '',
    `Live at ${deployUrl} after deploy ready (~3–5 min).`,
    '',
    '_The autonomous loop closes this issue via the commit\'s `Closes #N` trailer; no manual close is required._',
  ].join('\n')
}

// --- entry point ------------------------------------------------------

function main(argv) {
  const [sub, ...rest] = argv
  const flags = parseArgs(rest)
  switch (sub) {
    case 'open':
      return cmdOpen(flags)
    case 'close-comment':
      return cmdCloseComment(flags)
    case '--help':
    case '-h':
    case 'help':
    case undefined:
      printHelp()
      return
    default:
      process.stderr.write(`loop-issue: unknown subcommand "${sub}"\n`)
      printHelp()
      process.exit(1)
  }
}

function printHelp() {
  process.stdout.write(`loop-issue.mjs — phase 15a issue mirror helper

Usage:
  node scripts/loop-issue.mjs open --severity <high|med|low> \\
      --category <bug|enhancement|content|data|docs|seo|a11y|perf> \\
      --source <user|reader|audit|external> \\
      --title "<title>" --body-file <path>
      → echoes the new issue number to stdout

  node scripts/loop-issue.mjs close-comment --number <N> \\
      --commit <sha> --deploy-url <url>
      → posts a follow-up comment; the Closes #N commit trailer auto-closes

Env (from .env or shell):
  GH_TOKEN, GH_REPO
`)
}

// Export internals for tests. ESM-safe.
export const __test = {
  parseArgs,
  parseIssueNumber,
  buildCloseCommentBody,
  LABEL_PALETTE,
  VALID_SEVERITY,
  VALID_CATEGORY,
  VALID_SOURCE,
}

// Run main only when invoked as a script, not when imported by tests.
const isMain = (() => {
  try {
    return import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
      import.meta.url.endsWith(path.basename(process.argv[1] ?? ''))
  } catch {
    return false
  }
})()
if (isMain) {
  main(process.argv.slice(2))
}
