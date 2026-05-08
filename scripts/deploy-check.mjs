#!/usr/bin/env node
// scripts/deploy-check.mjs
//
// "Checking last deployment" — the post-push gate.
//
// Polls the Netlify REST API for the deploy matching HEAD's commit SHA
// and exits when the deploy reaches a terminal state.
//
//   exit 0  →  deploy ready (site is green at the just-pushed commit)
//   exit 1  →  deploy errored or failed (read the log; do not push past)
//   exit 2  →  timeout (deploy never reached terminal state)
//   exit 3  →  config / auth failure (token missing, site unknown, 4xx)
//
// Usage:
//   pnpm deploy:check
//
// Required env (from .env or shell):
//   NETLIFY_AUTH_TOKEN   personal access token
//   NETLIFY_SITE_NAME    optional, defaults to "thock"
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

const TOKEN = process.env.NETLIFY_AUTH_TOKEN
const SITE_NAME = process.env.NETLIFY_SITE_NAME ?? 'thock'
const TIMEOUT_MS = 10 * 60 * 1000   // 10 min — Netlify Next.js builds can take 5+ min cold
const POLL_MS = 5 * 1000

if (!TOKEN) {
  console.error('NETLIFY_AUTH_TOKEN is not set.')
  console.error('  • Get a token at https://app.netlify.com/user/applications#personal-access-tokens')
  console.error('  • Add to .env as: NETLIFY_AUTH_TOKEN=nfp_...')
  console.error('  • .env is gitignored; never commit it.')
  process.exit(3)
}

const sha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
const auth = { Authorization: `Bearer ${TOKEN}` }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

console.log(`Checking last deployment for commit ${sha.slice(0, 7)} on site "${SITE_NAME}"...`)

// --- resolve site ---
const sitesRes = await fetch(
  `https://api.netlify.com/api/v1/sites?name=${encodeURIComponent(SITE_NAME)}`,
  { headers: auth },
)
if (!sitesRes.ok) {
  console.error(`Netlify API error fetching sites: ${sitesRes.status} ${sitesRes.statusText}`)
  if (sitesRes.status === 401) {
    console.error('  Token rejected — check NETLIFY_AUTH_TOKEN.')
  }
  process.exit(3)
}
const sites = await sitesRes.json()
const site = sites.find((s) => s.name === SITE_NAME) ?? sites[0]
if (!site) {
  console.error(`No Netlify site found for name "${SITE_NAME}".`)
  console.error('  Override with NETLIFY_SITE_NAME=<name> in .env.')
  process.exit(3)
}

// --- poll deploys ---
const start = Date.now()
let lastReportedState = null
let waitedForIngest = false

while (Date.now() - start < TIMEOUT_MS) {
  const elapsed = Math.round((Date.now() - start) / 1000)
  const res = await fetch(
    `https://api.netlify.com/api/v1/sites/${site.id}/deploys?per_page=10`,
    { headers: auth },
  )
  if (!res.ok) {
    console.error(`Netlify API error fetching deploys: ${res.status} (retrying in ${POLL_MS / 1000}s)`)
    await sleep(POLL_MS)
    continue
  }
  const deploys = await res.json()
  const match = deploys.find((d) => d.commit_ref === sha)

  if (!match) {
    if (!waitedForIngest) {
      console.log(`Netlify hasn't ingested commit ${sha.slice(0, 7)} yet (waiting...)`)
      waitedForIngest = true
    }
    await sleep(POLL_MS)
    continue
  }

  if (match.state !== lastReportedState) {
    console.log(`Deploy ${match.id.slice(0, 8)}: state=${match.state} (${elapsed}s elapsed)`)
    lastReportedState = match.state
  }

  if (match.state === 'ready') {
    console.log(`Deploy ready.`)
    if (match.deploy_ssl_url) console.log(`  Permalink: ${match.deploy_ssl_url}`)
    if (match.ssl_url) console.log(`  Site:      ${match.ssl_url}`)
    process.exit(0)
  }

  if (match.state === 'error' || match.state === 'failed') {
    console.error(`DEPLOY FAILED.`)
    if (match.error_message) console.error(`  Error: ${match.error_message}`)
    if (match.title) console.error(`  Title: ${match.title}`)
    if (match.summary?.messages?.length) {
      console.error(`  Summary:`)
      for (const msg of match.summary.messages.slice(0, 5)) {
        console.error(`    - ${msg.title}${msg.description ? `: ${msg.description}` : ''}`)
      }
    }
    console.error(`  Admin URL: ${match.admin_url}`)
    console.error(`  Full log:  ${match.log_access_attributes?.url ?? 'see admin URL'}`)
    console.error(``)
    console.error(`Read the log, patch the root cause, push again.`)
    console.error(`Do not push past this gate. (--no-verify is forbidden.)`)
    process.exit(1)
  }

  await sleep(POLL_MS)
}

console.error(`Deploy still pending after ${TIMEOUT_MS / 1000}s.`)
console.error(`  Check Netlify UI: https://app.netlify.com/sites/${SITE_NAME}/deploys`)
process.exit(2)
