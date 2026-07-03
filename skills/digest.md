# Skill: digest

> **The night shift.** One tick a day: take the loop's pulse,
> run the breadth check too slow for the per-commit path (the
> full verify gate, with fresh eyes), write the morning
> briefing to `plan/DIGEST.md`, propose gate tunings as
> candidates — never apply them. The instrument panel,
> delivered instead of fetched.

## 1. Purpose

The dispatcher's ticks are visible one at a time; nobody reads
twenty-four run logs. This verb compresses a day of loop
activity — shipped ticks, no-ops, crashes, queue movement —
into one committed, phone-readable file, and owns the nightly
breadth run that catches rot (dependency drift, flaky legs,
content-check regressions) before it lands in a real tick.

## 2. Invocation

```
/digest                      # the full nightly pass
```

Runs from `.github/workflows/night.yml` (daily, ~06:30 ET) or
by hand. Never dispatched by `/march` — it is its own loop
shape with its own cadence.

## 3. The procedure

1. **Sync:** `git pull --ff-only`.
2. **Gather the pulse:**

   ```bash
   git log --since="26 hours ago" --oneline
   gh run list --workflow march -L 30 \
     --json displayTitle,conclusion,createdAt,updatedAt
   gh run list --workflow lighthouse -L 2 --json conclusion
   gh run list --workflow night -L 2 --json conclusion
   pnpm deploy:check                      # deploy state at HEAD
   ```

   Plus queue states: build-plan `[ ]` count + the next
   pending phase; `plan/AUDIT.md` open rows (the cross-link
   drain especially — how many `[4.5]` rows remain);
   `plan/CRITIQUE.md` last pass number + age (**call out
   staleness loudly** — critique is local-only, and a
   months-stale queue means the fresh-eyes loop has stopped);
   `plan/PHASE_CANDIDATES.md` pending + `/expand` pass count;
   `data/BACKLOG.md` pending; open `triage:*` issues.
3. **Breadth check — the full gate, fresh eyes:**

   ```bash
   pnpm verify        # FOREGROUND, never backgrounded
   ```

   This is breadth, not the commit gate: the digest's own diff
   is `plan/` prose only. A red leg becomes a HIGH
   `plan/AUDIT.md` row — the digest files it and still ships;
   the next dispatcher tick fixes it. (Run it as sequential
   foreground legs if one call is too slow.)
4. **Write `plan/DIGEST.md`** — overwrite entirely; it is a
   snapshot, not a ledger. Sections, in order: `Headline`,
   `While you were out` (pulse table: tick, verb, outcome —
   no-ops included), `Shipped`, `Queues now` (build plan,
   cross-link drain, critique age, candidates, backlog),
   `Breadth verdict` (the verify run + latest lighthouse),
   `Needs you` (blocked rows, `triage:needs-user` issues,
   stale critique), `Today's intent` (next `[ ]` phase + top
   finding), `Tuning proposals` (step 5, or "none").
5. **Meta-loop, within rails:** if the pulse shows a mistuned
   gate (critique starved for months, the ceiling hibernating
   productive days, `/expand` at dozens of consecutive
   no-candidate passes), file the tuning as a
   `plan/PHASE_CANDIDATES.md` candidate citing the pulse
   numbers. **Never edit gates, cadences, ceilings, or rules
   directly** — proposals only; `/oversight` promotes. The
   loop does not vote on its own constraints.
6. **Commit + push + deploy:** one commit
   `digest: <YYYY-MM-DD>`, push, then `pnpm deploy:check`
   (the push triggers a Vercel deploy; confirm it lands).

## 4. Hard rules

1. Overwrite `plan/DIGEST.md` whole; history lives in git.
2. Ship nothing else — breadth failures become findings, not
   fixes. The night shift briefs; the dispatcher ships.
3. Proposals, never actions (the meta-loop rail).
4. A quiet day still gets a digest — "quiet" is information.
5. **The digest's own commit is notes-only** (`plan/` prose;
   the `/jot` carve-out) — the `pnpm verify` in step 3 is the
   nightly breadth check, not the commit's gate, which is why
   a red breadth run files a finding instead of blocking the
   digest.
6. The breadth check runs FOREGROUND — never
   `run_in_background`, same as every gate invocation in this
   repo (agents.md §3).
7. One commit; cloud ticks carry the `Cloud-Run:` trailer.
8. No `Co-Authored-By`, no emojis, no `--no-verify` — the
   standing rules apply at 3am too.

## 5. Failure modes

1. **`gh` unavailable** — degrade to a git-only pulse; note
   the degradation in the digest itself.
2. **Breadth check red** — that's a finding (HIGH AUDIT row),
   not a stop; the digest ships with the finding filed.
3. **`git pull` divergence** — stop, per the standing rules.
4. **Deploy red after the digest push** — a `plan/`-only diff
   should never break the deploy; if it does, that is a real
   signal — file it HIGH and stop loud.

## 6. Quick reference

```bash
plan/DIGEST.md                          # the deliverable (overwrite)
plan/AUDIT.md                           # breadth failures land here
plan/PHASE_CANDIDATES.md                # tuning proposals land here
gh run list --workflow march -L 30      # the invisible no-ops
pnpm verify                             # the nightly breadth leg (foreground)
git commit -m "digest: <YYYY-MM-DD>" && git push origin main
pnpm deploy:check
```
