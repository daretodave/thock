# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The nexus kit upgraded to 0.6.2, locally, at 18:51 UTC (`a01a9118`)** — and that one commit explains most of tonight's story. Its own body names: `Support: fix-all`, an aged-candidate auto-promotion valve gated behind a `loop:veto` window, three new generators, weekly field research, and "the UI walk on critique and iterate." One minute later the next cloud `march` tick (18:52→18:59) shipped `critique: pass 12 — 4 findings` (`13bfe66c`, `Cloud-Run:` trailer confirms cloud-shipped) — the **first confirmed cloud-run `/critique` pass**, directly falsifying the standing `plan/CANDIDATES.md` `[needs-user-call] [score 6.5]` row that concluded (pass 218, 2026-07-23) "cloud mode categorically skips `/critique`." Annotated that row tonight rather than closing it myself (`/oversight` promotes/closes). The same upgrade's pulse fix — its body states "pulse counts open rows only (critique read 69 pending for 1, audit 0 for 10)" — also appears to resolve `plan/AUDIT.md`'s own `[4.8]` four-bug report about `scripts/pulse.mjs`; tonight's fresh pulse pull prints `thock` (not `<PROJECT_LOWER>`), `audit 10 pending` (not 0), and `critique 5 pending, last pass 21h ago` (not NaN) — annotated that row too. Separately and locally, the owner also landed a from-scratch dependency/toolchain pass across 6 commits between 19:28 and 21:03 UTC — every open security alert cleared, the full Vitest stack (vitest 5, `@vitejs/plugin-react` 6, jsdom 30, jest-dom 7), ESLint flat config (eslint 9 + `eslint-config-next` 16), Tailwind 4 CSS-first, TypeScript 6.0 + React 19.3, self-hosted fonts (Newsreader/IBM Plex Sans/JetBrains Mono) — each gated leg-by-leg, substantially completing the standing `[score 5.0]` "Dev-toolchain major migration" candidate (annotated; the remaining version gaps — TS 7, ESLint 10, `@types/node` 26 — are now deliberately Dependabot-held per `67490c48`, not forgotten). Two more local kit-fixes landed overnight addressing exactly the kind of cloud-tick fragility this digest's own cloud instructions guard against: `8e01f5a1` stopped a retried tick's push (actor `github-actions[bot]`) from being refused by `allowed_bots`, and `25f97a81` moved the verify gate's e2e leg out from behind the Bash tool's 10-minute foreground ceiling — the same ceiling this very digest tick worked around by running `pnpm verify` as 8 sequential foreground legs. Cloud ticks shipped two more picks overnight: the new weekly field-research generator filed 2 catalog-schema candidates (`a2cf077b`), a content dispatch opened and closed issue #1051 with newsletter issue 13 (`b3ba95c0`/`d2df27a7`/`70745043`), and expand pass 441 used the new aged-promotion valve for the first time — spec 01 (content-fact-vs-catalog numeric audit) promoted with its veto window open until 2026-10-30 (issue #1055), while 5 stale-but-uncompetitive candidates were cut by the pending cap. **This tick's own fresh `pnpm verify` is fully green**, run as 8 sequential foreground legs: typecheck, lint, 1242/1242 unit tests (109+ files across 7 workspaces), 269/269 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget (largest tracked page 146.3 KB / 175 KB), and 1343/1343 e2e (~8.2m) against `next start :4173`. `pnpm deploy:check` confirmed `READY` at HEAD going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-26 17:30 | *(last digest committed, `f160b534`)* | baseline |
| 18:51 | owner, local | nexus kit → 0.6.2: `Support: fix-all`, aged-promotion valve behind `loop:veto`, 3 generators, weekly field research, critique/iterate UI walk (`a01a9118`) |
| 18:52→18:59 | cloud march | **shipped** — critique pass 12, 4 findings (1 high, 1 medium, 2 low) — first confirmed cloud-run critique pass (`13bfe66c`) |
| 19:28→21:03 | owner, local | dependency/toolchain majors: every open security alert cleared; vitest 5 + plugin-react 6 + jsdom 30 + jest-dom 7; ESLint flat config + eslint-config-next 16; Tailwind 4 CSS-first; TypeScript 6.0 + React 19.3; Dependabot holds the rest with reasons (`0ce94fdb`/`1ee378ff`/`7d25d7eb`/`67490c48`/`0ad127e4`) |
| 21:02 | owner, local | ci: `actions/create-github-app-token` v3 + `download-artifact` v8, covers Dependabot #1045/#1046 (`5ae4348b`) |
| 21:18→21:46 | cloud march | **shipped** — weekly field research, 2 catalog-schema candidates filed (`a2cf077b`) |
| 23:12 | owner, local | fix: thock.xyz draws its own fonts — Newsreader, IBM Plex Sans, JetBrains Mono (`f170d92d`) |
| 23:45 | owner, local | fix: ESLint `globals` 17 for the shared config, lands Dependabot #1050 (`968b552d`) |
| 2026-10-27 01:04→01:22 | cloud march | **shipped** — content dispatch opened + closed issue #1051, newsletter issue 13 published (`b3ba95c0`/`d2df27a7`/`70745043`) |
| 05:25 | owner, local | fix: a tick lost to background work now retries the lane/pass it had actually picked (`15bee622`) |
| 07:14→07:30 | cloud march | no-op (clean pass, no commit) |
| 07:30→07:32 | cloud march retry | **failed** — retry's push read actor `github-actions[bot]`, refused by `allowed_bots` |
| 10:36 | owner, local | fix: `allowed_bots` lets the github-actions bot's chained retries reach the model (`8e01f5a1`) |
| 11:06 | owner, local | ci: the verify gate's long leg (e2e) runs foreground; Bash ceiling raised to an hour (`25f97a81`) |
| 13:54→14:18 | cloud march | **shipped** — expand pass 441: 0 candidates filed, first aged-promotion (spec 01, veto until 2026-10-30, issue #1055), 5 cut (`84a74151`) |
| 15:55→ (now) | night (this tick) | in progress |

Since the last digest: **6 completed `march` runs** (5 `success`, 1 `failure` retry), all cloud-shipped work carrying its `Cloud-Run:` trailer correctly. **12 local commits** landed directly to `main` outside the cloud loop — a toolchain/dependency pass plus 4 nexus-kit reliability fixes — none of them need a digest AUDIT row; they're already clean, verified work.

## Shipped

1. **Nexus kit → 0.6.2** (local) — `Support: fix-all`, aged-promotion valve behind a `loop:veto` window, 3 new generators, weekly field research, critique/iterate UI walk; also fixes `march.yml`'s v1 problem-check step ordering and (per this digest's own check) `scripts/pulse.mjs`'s open-row counting (`a01a9118`)
2. **Critique pass 12** — 4 findings filed to `plan/CRITIQUE.md` (1 high, 1 medium, 2 low); first confirmed cloud-run critique pass (`13bfe66c`)
3. **Dependency/toolchain majors** — security alerts cleared; vitest 5, `@vitejs/plugin-react` 6, jsdom 30, jest-dom 7; ESLint flat config + eslint-config-next 16; Tailwind 4 CSS-first; TypeScript 6.0 + React 19.3; self-hosted fonts (Newsreader/IBM Plex Sans/JetBrains Mono); `actions/create-github-app-token` v3 + `download-artifact` v8; Dependabot holds on TS 6.1+/ESLint 10/major Node-types with blockers named (`0ce94fdb`, `1ee378ff`, `7d25d7eb`, `67490c48`, `0ad127e4`, `5ae4348b`, `f170d92d`, `968b552d`)
4. **Weekly field research** — 2 new catalog-schema candidates filed: switch-type enum missing magnetic/hall-effect, group-buy status enum missing delayed/non-fulfilled (`a2cf077b`)
5. **Content dispatch + newsletter issue 13** — issue #1051 opened and closed, `thock-weekly-013` published (`b3ba95c0`/`d2df27a7`/`70745043`)
6. **Dispatcher reliability, 3 fixes** — a lost-to-background tick now retries its own picked work (`15bee622`); a retry's `github-actions[bot]` actor is now allowed through (`8e01f5a1`); the verify gate's long leg runs foreground with the Bash ceiling raised to an hour (`25f97a81`)
7. **Expand pass 441** — first use of the aged-promotion valve: spec 01 (content-fact-vs-catalog numeric audit) promoted, veto open until 2026-10-30 (issue #1055); 5 candidates cut by the pending cap (`84a74151`)

## Queues now

**plan:** 1 spec, 0 chunks left, 0 held — spec 01 just aged-promoted and has no chunks defined yet; `/plan-a-spec` is the next step.
**audit:** 10 pending (4 `[needs-user-call]`, see Needs you). One non-needs-user-call row, `[4.8]` `scripts/pulse.mjs`'s four-bug report, now carries this tick's own annotation that all four symptoms read clean — likely already fixed by tonight's `a01a9118` upgrade, just not marked closed.
**critique:** 5 pending, last pass 21h ago (tonight's cloud-run pass 12).
**candidates:** 33 pending (44 >21d — counted across every `- proposed:` line in the Pending section, the same raw scan `pulse.mjs` uses for its oldest-age figure, which still carries a handful of already-`[x]` audit-trail rows kept in place), oldest 167d. `Promote: aged`.
**Support (fix-all):** 0 open user issues · first response none (1 opened in 7d) · close 750.7h mean (2 closed in 7d).
**Quota:** unknown — no cached `seven_day` reading.
**data/BACKLOG.md:** 0 pending (3 rows, all `[x]` already shipped).

## Needs you

- No `escalate #N` lines (0 open `triage:needs-user` issues past the 7-day `escalate_days` default) and no `triage:needs-user`/`loop:do` issues open at all.
- 6 standing `[needs-user-call]` rows:
  - AUDIT `[3.6]` GTM analytics ships with no consent gate; `bearings.md` still documents the originally-planned Plausible tag.
  - AUDIT `[4.2]` `/article`/`/tag` soft-404 fix is structurally blocked (real-404 vs. "did you mean" UX are mutually exclusive under current routing).
  - AUDIT `[3.0]` mirrored `loop:opened` GitHub issues can go permanently un-drained if not picked the same tick they're filed.
  - AUDIT `[1.3]` default-state UI-component borders fail WCAG 1.4.11 non-text contrast — needs a global dark-theme lightness call.
  - CRITIQUE `[MED]` production GA `/g/collect` beacons returning 503 — analytics config sits outside the repo.
  - CANDIDATES `[score 6.5]` "Critique gate diagnostic" — **now flagged as falsified by tonight's own evidence** (see Headline); recommend `/oversight` close or retitle rather than carry the stale diagnosis forward.
- **oversight needed: candidate queue silting (44 pending >21d, oldest 167d)** — `Promote: aged` is new as of tonight's kit upgrade but the sweep only acts on `Held` roadmap lines with an open issue, not directly on `CANDIDATES.md`'s own aging Pending rows; the silting is unchanged by it.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 1 awaiting (spec 01's own veto window, issue #1055, open until 2026-10-30 — already landed by this morning's expand pass 441, not a fresh promotion).
- Candidates cut by the pending cap since the last digest (`node scripts/plan/promote.mjs cuts --since 2026-10-26`):
  - cut 2026-10-27 [score 2.5] Dead-prop cleanup residue — `TagChip`'s `static` prop + 1 stray article frontmatter field remain after the schema half shipped
  - cut 2026-10-27 [score 4] Interactive-tools completion instrumentation gap — `/quiz/*` and `/compare/*` emit zero custom analytics events, only generic pageviews
  - cut 2026-10-27 [score 4.5] Tracker topic history page `/trends/tracker/topic/[slug]` — longitudinal single-topic view across all snapshots
  - cut 2026-10-27 [score 5] Tracker 8-week editorial analysis — long-form trends synthesis article covering W19–W25
  - cut 2026-10-27 [score 5] Accessory parts kind — implement spec §7's `accessory` Part category (`/part/accessory/[slug]`)
- No motion-stalled alert — shipped 10 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); 9 shipped so far this week (2026-W44).
- No secrets-rotation note — `secrets.mjs audit` is local-only; this is a cloud run, so it's skipped per the standing rule.

## Today's intent

No ready spec/chunk — spec 01 was just aged-promoted and has 0 chunks defined yet, so `/plan-a-spec` is the actionable next step there, not `/ship-a-chunk`. Top finding for the next `/iterate`/`/oversight` pass: AUDIT `[4.8]` `scripts/pulse.mjs`'s four-bug report — this digest's own check found all four symptoms already gone, most likely from tonight's `a01a9118` kit upgrade, so confirming and closing it should be a one-line commit, not a re-fix. Runner-up: the two parked `[2.7]`/`[2.0]` stale Mode-Sonnet hero-art rows (`next: /ship-asset`), unchanged and still below the autonomous-pick floor.

## Tuning proposals

None filed as new `plan/CANDIDATES.md` rows tonight. This tick's two substantive observations — the `[4.8]` pulse.mjs row reading as already-fixed, and the `[score 6.5]` critique-gate-diagnostic row reading as falsified by tonight's own cloud-run critique pass — are evidence updates against rows that already exist, appended directly to `plan/AUDIT.md` and `plan/CANDIDATES.md` as part of this notes-only commit, not new gate/cadence mistunings. Nothing in tonight's pulse (a fully green breadth check, no motion stall, no fresh crash signal) points to a gate that needs retuning.
