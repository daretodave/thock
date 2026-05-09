# Cloud loop — operator's guide

> The cloud half of thock's autonomous loop. One scheduled GitHub
> Actions invocation = one `/march` tick. Local half is unchanged
> (`/loop /march` still works on your laptop); the cloud half just
> runs alongside.

## What it is

`.github/workflows/march.yml` runs on a cron and invokes the
[Claude Code GitHub Action](https://github.com/anthropics/claude-code-action)
with a cloud-mode brief. The agent reads `agents.md`, runs `/march`,
ships a tick (or exits cleanly if there's nothing to do), and
hands the runner back.

State lives where it always has — `plan/`, `data/`, `AUDIT.md`,
`BACKLOG.md`, `PHASE_CANDIDATES.md`, the build plan. The cloud
agent reads these from `origin/main`, writes its commit, pushes,
and exits. No memory between ticks. Each tick is hermetic.

## What it costs

If you're authenticating via `CLAUDE_CODE_OAUTH_TOKEN` (Claude
Pro / Max subscription), the cloud loop is **$0 marginal** —
quota is shared with your local Claude Code sessions.

GitHub Actions minutes are **free for public repos** (which thock
is). On private repos the workflow burns ~5–15 min per tick
against your monthly cap.

If you're authenticating via `ANTHROPIC_API_KEY` instead, expect
roughly:
- Sonnet 4.6: ~$0.40–0.60/tick → ~$3–5/day at 7 ticks
- Opus 4.7:   ~$2.00–3.00/tick → ~$15–20/day at 7 ticks

The 12-commit/24h ceiling caps the worst case either way.

## Setup (one-time)

Three secrets get added once. The first authenticates the agent;
the other two are tools the agent uses inside the tick.

### 1. `CLAUDE_CODE_OAUTH_TOKEN` — agent auth

In a local terminal with Claude Code installed:

```
claude setup-token
```

Follow the prompts. You'll get a long token starting with
`sk-ant-oat...`. This authenticates against your Claude Pro/Max
subscription — quota is shared with your local sessions.

```
gh secret set CLAUDE_CODE_OAUTH_TOKEN
# paste the token when prompted
```

### 2. `ACTIONS_PAT` — git push + gh CLI as your user

The cloud loop commits as `daretodave`, not as
`github-actions[bot]`. That requires a personal access token
the workflow uses for both `git push` and the agent's `gh`
calls.

Create a fine-grained PAT at
https://github.com/settings/tokens?type=beta scoped to **the
thock repo only**, with these permissions:

- **Contents: read+write** (push commits)
- **Issues: read+write** (open `triage:cloud-failed` issues, apply labels)
- **Metadata: read** (default)
- **Pull requests: read+write** (only if you want the agent to open PRs; not used today)

Copy the token (starts with `github_pat_...`) and add it:

```
gh secret set ACTIONS_PAT
# paste the token when prompted
```

If you already have this PAT in `.env` for local use, just copy
the same value into the secret — they're interchangeable.

### 3. `NETLIFY_AUTH_TOKEN` — deploy gate

The cloud agent runs `pnpm deploy:check` after every push,
identical to your local loop. Same token you have in `.env`:

```
gh secret set NETLIFY_AUTH_TOKEN
# paste your nfp_... token from
# https://app.netlify.com/user/applications#personal-access-tokens
```

### 4. Validate with a manual run

The schedule is already on, but for the first tick you want to
watch it live:

```
gh workflow run march.yml
gh run watch
```

If the tick fails, read the run log; the most common first-run
issues are:
- `CLAUDE_CODE_OAUTH_TOKEN not found` → secret name typo.
- `Authentication failed` (Claude side) → OAuth token expired; rerun
  `claude setup-token` and update the secret.
- `Permission denied` on `git push` → ACTIONS_PAT missing or
  scoped wrong. The PAT needs `Contents: write` on this repo.
- `gh: command not found` → not possible on GitHub-hosted
  runners; only happens on self-hosted with a stripped image.
- `pnpm verify` red → not a cloud problem; the local code is broken
  on `main`. Fix locally first.

## Operating it

### Normal operation

The cron fires at `0 1,3,5,7,9,11,23 * * *` UTC (every 2h between
18:00 and 06:00 ET, off-peak). ~7 ticks/day. You don't have to do
anything.

Each tick:
1. Runs the daily commit-ceiling check (12 cloud commits / 24h).
   If reached, exits 0 with a log note — no work this tick.
2. Configures git as `github-actions[bot]`.
3. Runs `/march` in cloud mode (skips `/oversight` and `/critique`).
4. The agent ships a phase, a data update, an iterate finding, or
   nothing — depending on what's queued.
5. If anything goes red, opens a `triage:cloud-failed` issue and
   exits. The next tick picks it up via `/triage`.

### Pausing the cloud loop

Two ways:

```
# Soft: disable the schedule but keep workflow_dispatch alive
gh workflow disable march.yml
```

```
# Hard: delete the cron line. Edit .github/workflows/march.yml,
# remove the schedule: block, push.
```

### Manually triggering a tick

```
gh workflow run march.yml
```

Useful when you've just merged something locally and want the
cloud to pick it up before the next scheduled firing.

### The `Cloud-Run:` trailer convention

Every commit shipped from the cloud loop ends with a single
trailer:

```
Cloud-Run: https://github.com/daretodave/thock/actions/runs/<run-id>
```

This is the discriminator between cloud-shipped commits and
your local work — both author as `daretodave`, but only cloud
commits carry the trailer. The workflow's daily ceiling check
counts trailer-bearing commits in the last 24h; the ceiling
bounds *cloud volume*, not your local commit volume.

The cloud-mode brief in the workflow makes the trailer
mandatory. If you ever see a cloud-shipped commit without one,
that's a bug — the agent broke its contract. Open an issue.

### Watching what shipped

```
gh run list --workflow march.yml --limit 10

# All cloud-shipped commits in the last 24h:
git log --since='24 hours ago' --grep='Cloud-Run:' --oneline

# All cloud-shipped commits, full history:
git log --grep='Cloud-Run:' --oneline

# Local commits only (everything sans cloud trailer):
git log --invert-grep --grep='Cloud-Run:' --oneline
```

`git log --grep='Cloud-Run:'` is the canonical filter once the
convention is in place.

## Upgrading the model

Default is Sonnet 4.6 because it's cheap-on-quota and fast enough
for `/march`'s decision logic. To upgrade to Opus 4.7:

1. Watch your local `/cost` indicator for a week. Opus is roughly
   2x Sonnet's weight against the Max weekly cap.
2. If after a real week of mixed usage you've consumed <30% of
   weekly cap, you have headroom for Opus.
3. Edit `.github/workflows/march.yml`:

   ```yaml
   claude_args: |
     {
       "model": "claude-opus-4-7"
     }
   ```

4. Commit, push. Next tick uses Opus.

If you ever hit weekly-cap pressure, drop back to Sonnet by
reverting the model line. No other changes needed.

## What the cloud agent will not do

These are encoded in the brief and in `agents.md`'s standing rules:

- **Will not run `/oversight`.** It's interactive; cloud has no human.
- **Will not run `/critique`.** Reader sub-agent needs Chrome.
- **Will not promote `/expand` candidates.** Only local `/oversight` does that.
- **Will not `--no-verify` or force-push.** Standing rule.
- **Will not half-commit.** A blocked tick exits without committing.
- **Will not amend or rewrite published commits.** Always a new commit.

If you find the cloud agent doing any of the above, that is a
bug worth reporting — either in the brief, in `/march`, or in the
underlying skill it dispatched to.

## Failure mode quick reference

| Symptom | Likely cause | Fix |
|---|---|---|
| Workflow not firing on schedule | Schedule disabled, or repo inactive (GH pauses crons after 60d of no commits) | `gh workflow enable march.yml` and push something |
| `OAuth token expired` (Claude side) | Token revoked or rotated | `claude setup-token`, update `CLAUDE_CODE_OAUTH_TOKEN` secret |
| `Permission denied` on `git push` | PAT expired or rescoped | Mint a new fine-grained PAT with `contents:write`, update `ACTIONS_PAT` |
| `triage:cloud-failed` issue open | Tick hit a real error | Read the issue body for the run URL; fix root cause; close issue |
| Loop appears stuck | A previous tick is still running and concurrency group is holding | `gh run list --workflow march.yml --status in_progress`, cancel the stale one |
| Repeated red deploys | Netlify-side regression | Check Netlify dashboard; root-cause as you would locally |
| Quota pressure on Max | Cloud + heavy local work overlapping | Drop cloud cadence: change cron to every 4h instead of 2h |

## Why this is structured this way

A few decisions that aren't obvious from reading the YAML:

- **Author is daretodave via PAT, not github-actions[bot].**
  Cleaner git log — every commit looks like yours, because every
  commit *is* yours: the cloud agent acts on your behalf with
  your authorization. The cost is one PAT to manage, scoped to
  this repo, refreshable when it rotates. The same PAT lives in
  your local `.env` so there's nothing extra to remember.

- **Schedule is on by default.** Some teams gate the schedule
  behind workflow_dispatch-only until validated; we trust the
  ceiling + concurrency group + failure-as-issue safety net to
  bound the blast radius of a bad first tick.

- **Concurrency group `march` instead of `cancel-in-progress`.**
  A tick that's already shipping should finish, not be aborted
  mid-`pnpm verify`. The next firing waits.

- **The brief is in the workflow YAML, not a separate file.**
  10 lines of cloud-mode instructions don't justify a file on
  their own. If the brief grows past ~30 lines, split it into
  `.github/cloud-brief.md` and read it via `cat` into the prompt.

- **Failure issues, not workflow re-runs.** Auto-retry of failed
  ticks is tempting but masks the underlying bug. A red tick
  surfaces as an issue that the next tick triages — same address
  loop the rest of the project uses.
