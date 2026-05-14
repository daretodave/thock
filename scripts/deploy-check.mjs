#!/usr/bin/env node
// scripts/deploy-check.mjs
//
// "Checking last deployment" — the post-push gate.
//
// Polls the Vercel REST API for the deployment matching HEAD's commit SHA
// and exits when the deployment reaches a terminal state.
//
//   exit 0  →  deploy ready (site is green at the just-pushed commit)
//   exit 1  →  deploy errored, failed, or canceled (read the log; do not push past)
//   exit 2  →  timeout (deployment never reached terminal state)
//   exit 3  →  config / auth failure (token missing, project unknown, 4xx)
//
// Usage:
//   pnpm deploy:check
//
// Required env (from .env or shell):
//   VERCEL_TOKEN          personal access token
//   VERCEL_PROJECT_NAME   optional, defaults to "thock" (the project's name —
//                         the public custom domain is thock.xyz)
//   VERCEL_TEAM_ID        required for this repo (project is team-scoped,
//                         not personal). See agents.md "Operational secrets"
//                         for the lookup command.
//
// The shipping skills (ship-a-phase, ship-data, iterate) run this as
// Step 12 ("Confirm deploy"). A red exit is treated identically to a
// red verify gate — read the log, patch the root cause, push again.

import { execSync } from 'node:child_process'
import fs from 'node:fs'

// --- load .env if present (Node has no built-in .env loader) ---
if (fs.existsSync('.env')) {
  for (const line of fs.readFileSync('.env', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

const TOKEN = process.env.VERCEL_TOKEN
const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME ?? 'thock'
const TEAM_ID = process.env.VERCEL_TEAM_ID ?? ''
const TIMEOUT_MS = 10 * 60 * 1000 // 10 min — Vercel Next.js builds can take a few minutes cold
const POLL_MS = 5 * 1000

if (!TOKEN) {
  console.error('VERCEL_TOKEN is not set.')
  console.error('  • Get a token at https://vercel.com/account/tokens')
  console.error('  • Add to .env as: VERCEL_TOKEN=...')
  console.error('  • .env is gitignored; never commit it.')
  process.exit(3)
}

const sha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
const subject = execSync('git log -1 --pretty=%s', { encoding: 'utf-8' }).trim()
const auth = { Authorization: `Bearer ${TOKEN}` }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const teamQuery = TEAM_ID ? `&teamId=${encodeURIComponent(TEAM_ID)}` : ''

console.log(
  `Checking deploy for HEAD ${sha.slice(0, 7)} ("${subject}") on Vercel project "${PROJECT_NAME}"...`,
)

// --- poll deployments ---
//
// Vercel `GET /v6/deployments?app=<project>&limit=20` returns the most
// recent deployments, newest first. We filter by `meta.githubCommitSha`
// to find the one matching the just-pushed HEAD.
//
// Possible deployment states: QUEUED, INITIALIZING, BUILDING, UPLOADING,
// READY, ERROR, CANCELED.

const start = Date.now()
let lastReportedState = null
let waitedForIngest = false

while (Date.now() - start < TIMEOUT_MS) {
  const elapsed = Math.round((Date.now() - start) / 1000)
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?app=${encodeURIComponent(PROJECT_NAME)}&limit=20${teamQuery}`,
    { headers: auth },
  )
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      console.error(`Vercel API auth error: ${res.status} ${res.statusText}`)
      console.error('  Token rejected — check VERCEL_TOKEN in .env.')
      process.exit(3)
    }
    if (res.status === 404) {
      console.error(`Vercel project "${PROJECT_NAME}" not found (404).`)
      console.error('  Override with VERCEL_PROJECT_NAME=<slug> in .env.')
      console.error('  If the project is in a team scope, also set VERCEL_TEAM_ID.')
      process.exit(3)
    }
    console.error(
      `Vercel API error fetching deployments: ${res.status} (retrying in ${POLL_MS / 1000}s)`,
    )
    await sleep(POLL_MS)
    continue
  }
  const body = await res.json()
  const deployments = body.deployments ?? []
  const match = deployments.find((d) => d.meta?.githubCommitSha === sha)

  if (!match) {
    if (!waitedForIngest) {
      console.log(`Vercel hasn't ingested commit ${sha.slice(0, 7)} yet (waiting...)`)
      waitedForIngest = true
    }
    await sleep(POLL_MS)
    continue
  }

  if (match.state !== lastReportedState) {
    console.log(
      `Deployment ${match.uid.slice(0, 12)}: state=${match.state} (${elapsed}s elapsed)`,
    )
    lastReportedState = match.state
  }

  if (match.state === 'READY') {
    console.log('Deploy ready.')
    // Show the full commit range the deploy contains — useful when a
    // push bundles multiple commits so the operator sees what actually
    // landed in production, not just HEAD.
    const previousReady = deployments.find(
      (d) =>
        d.state === 'READY' &&
        d.meta?.githubCommitSha &&
        d.meta.githubCommitSha !== sha,
    )
    if (previousReady?.meta?.githubCommitSha) {
      try {
        const range = execSync(
          `git log ${previousReady.meta.githubCommitSha}..${sha} --oneline --no-merges`,
          { encoding: 'utf-8' },
        ).trim()
        if (range) {
          const lines = range.split('\n')
          console.log(
            `  Includes ${lines.length} commit${lines.length === 1 ? '' : 's'}:`,
          )
          for (const line of lines) console.log(`    ${line}`)
        }
      } catch {
        // Previous-deploy SHA may not be in local history (shallow clone,
        // squash-merged history, etc.) — skip the range silently.
      }
    }
    // Prefer the project's canonical alias (e.g. thock.xyz) over
    // Vercel's auto-generated <project>-<hash>-<team>.vercel.app
    // permanent URL — the latter leaks the team slug into logs.
    const canonicalAlias = match.alias?.find(
      (a) => !a.includes('-') || a.endsWith('-git-main.vercel.app'),
    )
    if (canonicalAlias) {
      console.log(`  Site:      https://${canonicalAlias}`)
    }
    if (match.inspectorUrl) console.log(`  Inspect:   ${match.inspectorUrl}`)
    process.exit(0)
  }

  if (match.state === 'ERROR' || match.state === 'CANCELED') {
    console.error(`DEPLOY ${match.state}.`)
    if (match.errorMessage) console.error(`  Error: ${match.errorMessage}`)
    if (match.errorCode) console.error(`  Code:  ${match.errorCode}`)
    if (match.inspectorUrl) console.error(`  Inspect:   ${match.inspectorUrl}`)
    console.error('')
    console.error('Read the log, patch the root cause, push again.')
    console.error('Do not push past this gate. (--no-verify is forbidden.)')
    process.exit(1)
  }

  await sleep(POLL_MS)
}

console.error(`Deploy still pending after ${TIMEOUT_MS / 1000}s.`)
console.error(`  Check Vercel UI: https://vercel.com/dashboard`)
process.exit(2)
