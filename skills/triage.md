# Skill: triage

> **Issue review for the autonomous loop.** Read open GitHub
> issues at `daretodave/thock`, decide which the loop can absorb,
> apply a `triage:*` label, post a short comment, route actionable
> ones into the right backlog. **If there are no unlabeled
> issues, exit fast.** That's "keep humming."

## 1. Purpose

GitHub issues are the user's primary inbox to the loop. Without
triage, they pile up and the loop ignores them. With triage:

- The user files an issue ("Mode Sonnet missing from /data" or
  "header is broken on iPad").
- The loop's next `/march` tick sees the unlabeled issue, classifies
  it, labels it, comments, and routes it into the right backlog.
- A subsequent `/iterate` or `/ship-data` tick drains the backlog
  and addresses the issue.
- When the addressing commit lands, the loop closes the loop —
  closes or comments back on the issue with the commit hash.

Triage is **cheap when idle** (zero issues → exits in <1s) and
**non-blocking when busy** (issues are routed but not addressed
in the same tick — addressing is the lane the issue's category
selects).

## 2. Invocation

```
/triage                       # all unlabeled open issues
/triage <issue-number>        # focused pass
/triage all                   # re-evaluate every open issue
/triage dry-run               # classify + report, no labels/comments
```

`/march` invokes `/triage` as Step 1 of its dispatch cycle (see
§9). The user can also invoke manually.

## 3. Auth

Triage needs `gh` CLI authenticated. The PAT lives in `.env`:

```
GH_TOKEN=github_pat_...
GH_REPO=daretodave/thock      # optional; defaults to this
```

`gh` auto-reads `GH_TOKEN` from the environment. Before any `gh`
call, ensure the env is loaded:

```bash
# In a single bash invocation:
export GH_TOKEN=$(awk -F= '/^GH_TOKEN=/ {sub(/^GH_TOKEN=/, ""); print; exit}' .env)
export GH_REPO=$(awk -F= '/^GH_REPO=/ {sub(/^GH_REPO=/, ""); print; exit}' .env)
GH_REPO=${GH_REPO:-daretodave/thock}
gh auth status >/dev/null || { echo "GH_TOKEN missing/invalid"; exit 3; }
```

If `gh auth status` fails, exit per §8.

## 4. Label scheme

Triage applies one `triage:*` label to every issue it processes.
Labels are the state — already-labeled issues are skipped on the
default pass.

| Label | Meaning |
|---|---|
| `triage:loop-queued` | The loop will address this. Routed into AUDIT.md / BACKLOG.md / plan. |
| `triage:needs-user` | Actionable but requires a user judgment call (scope, opinion, brand). Surfaced in `oversight`. |
| `triage:closed` | Won't fix / duplicate / spam. Issue is closed with a comment. |
| `triage:reviewed` | Seen but no action this pass (e.g., waiting on something else). Re-eval on `/triage all`. |

Plus a content label paired with `triage:loop-queued`:

- `bug`, `enhancement`, `content`, `data`, `docs`, `seo`, `a11y`,
  `perf`

These already exist as standard GitHub labels in most repos. If
they don't exist on the repo yet, create them on first encounter
via `gh label create`.

**Provenance label (phase 15a):** `loop:opened` is a separate
label applied by `scripts/loop-issue.mjs open` to issues the
autonomous loop opens on itself. It is **not** a `triage:*`
state label — it marks "this issue's lifecycle is owned by
`/iterate`, not `/triage`." Triage's candidate query above filters
out `loop:opened` issues for this reason. A loop-opened issue
that somehow needs human triage (e.g., the loop opened it but
then got stuck and never closed it) can be hand-labeled with a
`triage:*` label, which `/triage all` will then pick up.

## 5. The procedure

### Step 0 — Pre-flight

Load env, verify auth (§3). If `gh` isn't installed or
`GH_TOKEN` missing → exit 3 per §8.

### Step 1 — List candidates

```bash
gh issue list \
  --repo "$GH_REPO" \
  --state open \
  --search "-label:triage:loop-queued -label:triage:needs-user -label:triage:closed -label:triage:reviewed -label:loop:opened" \
  --json number,title,body,labels,author,createdAt,updatedAt,comments \
  --limit 50
```

The `-label:loop:opened` clause excludes issues the loop opened
on itself (phase 15a — `/iterate` Step 2.5). Loop-opened issues
already have a known provenance (`source:user|reader|audit|external`)
and are about to auto-close via a `Closes #N` commit trailer; they
do not need `/triage` labeling.

If the result is `[]` (empty array): print
`"triage: 0 unlabeled open issues — humming on."` and exit 0
**without committing anything**. This is the dominant case.

### Step 2 — Classify each issue

For each issue in the list, decide:

1. **Category** — read title + body + first 5 comments. Pick one:
   - `bug` — something broken on the live site or in the code.
   - `enhancement` — feature request, new surface.
   - `content` — request for an article, deeper coverage of a topic.
   - `data` — entity missing from `/data` (switch, vendor, board,
     keycap set, group buy).
   - `docs` — documentation gap.
   - `seo` / `a11y` / `perf` — non-functional concern.

2. **Routing** — pick one:
   - **`triage:loop-queued`** — the loop can address autonomously.
     Rule of thumb: a confident `/iterate` finding could ship a
     fix without product judgment.
   - **`triage:needs-user`** — actionable but the loop shouldn't
     pick the answer (e.g., "should we cover this controversial
     vendor?"). Surfaces in `/oversight`.
   - **`triage:closed`** — duplicate, spam, won't-fix. Close.
   - **`triage:reviewed`** — seen but waiting on something else.
     E.g., a feature request blocked by a phase that hasn't
     shipped.

3. **Backlog target** (only if `loop-queued`):
   - `bug` / `seo` / `a11y` / `perf` → `plan/AUDIT.md` Pending
   - `content` → `plan/AUDIT.md` Pending (content-curator picks
     it up via `/iterate`)
   - `data` → `data/BACKLOG.md` Pending
   - `enhancement` (small, on-strategy) → new row in
     `plan/steps/01_build_plan.md` "Carry-overs" section, OR
     `plan/AUDIT.md` Pending if cosmetic
   - `enhancement` (large, off-strategy) → re-route to
     `triage:needs-user`
   - `docs` → `plan/AUDIT.md` Pending

### Step 3 — Apply labels + comment

For each issue, in this order:

```bash
# 1. Add labels (creates them if missing)
gh issue edit "$NUM" --repo "$GH_REPO" \
  --add-label "triage:loop-queued,bug"

# 2. Post comment
gh issue comment "$NUM" --repo "$GH_REPO" --body "$(cat <<'EOF'
Triaged → bug. The loop will address this; tracked in
[`plan/AUDIT.md`](https://github.com/daretodave/thock/blob/main/plan/AUDIT.md)
under the `external-issue` category. A future `/iterate` tick
will ship the fix and reference this issue's number in the
commit body.
EOF
)"

# 3. (only for triage:closed)
gh issue close "$NUM" --repo "$GH_REPO" --reason "not planned"
```

### Step 4 — Append to the backlog

For each `triage:loop-queued` issue, append a row to the routing
target. Include the issue number so `/iterate` can cross-reference.

`plan/AUDIT.md` Pending row format:

```markdown
### [user-issue #42] [HIGH] header overlaps content on iPad
- category: external-issue
- impact: 8 (mobile breakage on common viewport)
- ease: 6 (CSS fix in <Header> + e2e regression test)
- next: /iterate will pick up; reference #42 in commit body.
```

`data/BACKLOG.md` row format:

```markdown
- [ ] add switch gateron-oil-king (issue #57 — referenced in
      Trends Tracker entry)
```

### Step 5 — Commit + push (if any backlog changes)

If Step 4 modified any plan or data files:

```bash
git add plan/AUDIT.md data/BACKLOG.md plan/steps/01_build_plan.md
git commit -m "$(cat <<'EOF'
triage: <K> issues processed (<L> queued, <M> user-call, <N> closed)

Routed via /triage:
- #42 → loop-queued (bug, plan/AUDIT.md)
- #57 → loop-queued (data, data/BACKLOG.md)
- #58 → needs-user (enhancement; cc @daretodave via /oversight)
- #60 → closed (duplicate of #42)

Labels applied: triage:loop-queued, triage:needs-user, triage:closed.
Comments posted on each.
EOF
)"
git push origin main
```

If Step 4 made no file changes (e.g., all `triage:closed` or
`triage:reviewed`), do not create an empty commit. Print a 1-line
summary and exit.

### Step 6 — Confirm deploy

```bash
pnpm deploy:check
```

Plan-only commits still rebuild on Netlify; verify green.

### Step 7 — Done

Print 2–3 lines:

```
triage processed: <K>. queued: <L>. needs-user: <M>. closed: <N>.
plan/AUDIT.md +<X> rows. data/BACKLOG.md +<Y> rows.
loop next: <iterate | ship-data | ship-a-phase | march>.
```

## 6. Closing the loop (when iterate / ship-data ships a fix)

When a downstream skill ships a fix referencing a triaged issue,
it should update the issue:

In the shipping commit body:

```
- Closes #42: header CSS in <Header> updated; mobile e2e at 768px added.
```

After push, the shipping skill posts a follow-up comment:

```bash
gh issue comment 42 --repo "$GH_REPO" --body "Shipped in <commit>. Live at https://thock-coral.vercel.app after deploy ready (~5 min)."
gh issue close 42 --repo "$GH_REPO"
```

This is documented in `skills/iterate.md` §5 (Step 5 — Commit) as
a sub-step when an `external-issue` finding is being addressed.
The shipping skill should not require triage to coordinate — once
labels point to the right backlog, addressing is a normal iterate
tick that happens to reference a number.

## 7. Hard rules

1. **Labels are the state.** Never re-process an already-labeled
   issue on a default pass.
2. **One commit per triage pass** with the action summary in the
   body. No empty commits.
3. **Idempotency.** Running `/triage` twice with no new issues =
   no-op. Running `/triage` against a partially-processed batch
   resumes cleanly (already-labeled = skipped).
4. **Be honest in comments.** Don't promise specific fix dates;
   say "the loop will address this" and link to the routing file.
   Never say "I'll do this" — the loop does it.
5. **Never close an issue without a comment** explaining why.
6. **Don't over-classify.** When in doubt, `triage:needs-user`
   beats inventing a category.
7. **No emojis. No `Co-Authored-By:`.** Carry over.
8. **`gh` calls only.** No raw curl unless `gh` is unavailable.

## 8. Failure modes

1. **`gh` not installed.** Exit 3. Print install instructions
   (https://cli.github.com). The loop continues — triage is
   rate-limited and non-blocking.
2. **`GH_TOKEN` missing or rejected.** Exit 3. Print link to
   create one. Loop continues.
3. **Rate limit hit** (5000 req/hour for PATs; rare). Exit 2.
   `/march` will retry next tick.
4. **An issue's classification is genuinely ambiguous after
   reading title + body + comments.** Default to
   `triage:needs-user`. The user can re-classify in `/oversight`.
5. **`gh issue edit` fails** (e.g., label doesn't exist).
   Auto-create the label via `gh label create` and retry once.
6. **Network failure mid-pass.** Persist what's done; the next
   tick resumes (already-labeled issues are skipped).

Everything else: classify, label, comment, ship.

## 9. When `/march` invokes `/triage`

`/march` runs triage as **Step 1** of every dispatch tick — it's
the cheapest gate. The check:

```bash
gh issue list --repo "$GH_REPO" --state open \
  --search "-label:triage:loop-queued -label:triage:needs-user -label:triage:closed -label:triage:reviewed -label:loop:opened" \
  --json number --jq 'length'
```

Returns a count. If `> 0`, dispatch to `/triage`. If `== 0`,
fall through to the next gate (critique → phase → data → iterate).

This means: every march tick ensures issues are not piling up
unaddressed, but triage rarely runs because labels keep the
unlabeled set small.

## 10. Quick reference

```bash
# Auth (load .env first)
export GH_TOKEN=$(awk -F= '/^GH_TOKEN=/ {sub(/^GH_TOKEN=/, ""); print; exit}' .env)
export GH_REPO=$(awk -F= '/^GH_REPO=/ {sub(/^GH_REPO=/, ""); print; exit}' .env)
GH_REPO=${GH_REPO:-daretodave/thock}

# List (excludes loop-opened issues per phase 15a)
gh issue list --repo "$GH_REPO" --state open --search "-label:triage:loop-queued -label:triage:needs-user -label:triage:closed -label:triage:reviewed -label:loop:opened" --json number,title,body,labels --limit 50

# Label
gh issue edit <N> --repo "$GH_REPO" --add-label "triage:loop-queued,bug"

# Comment
gh issue comment <N> --repo "$GH_REPO" --body "..."

# Close
gh issue close <N> --repo "$GH_REPO" --reason "not planned"

# Create label (idempotent — ignores "already exists" errors)
gh label create "triage:loop-queued" --repo "$GH_REPO" --color "0e8a16" --description "Loop will address" 2>/dev/null || true

# Backlog updates
plan/AUDIT.md           # bugs, content, seo, a11y, perf, docs
data/BACKLOG.md         # data records
plan/steps/01_build_plan.md  # small enhancements, carry-overs

# Commit
git add <changed plan/data files>
git commit -m "triage: ..."
git push origin main
pnpm deploy:check
```
