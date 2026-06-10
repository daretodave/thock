# Site audit

> Latest findings from `/iterate audit` and `/oversight`. Open
> items live here until a shipping skill drains them.

> **Rule 1: sliding window (locked 2026-05-14 — see `plan/bearings.md`
> § Rule 1).** Each pillar carries ≥2 articles published within the
> last 30 days, always. The rule is self-replenishing — articles
> aging out generate new shortfalls without any external priming.
>
> Three states, codified in bearings.md and emitted by the audit-row
> generator (phase 30 ships `scripts/content-gap-survey.mjs`):
>
> - **Comfortable** — every pillar ≥ 2 in 30d. No Rule-1 row files.
> - **Hot pursuit** — one or more pillars at exactly 1 in 30d. Row
>   files at score **7.0** for that pillar. Loop ships on next tick.
> - **Critical hot pursuit** — one or more pillars at 0 in 30d. Row
>   files at score **9.5**, above every other priority. Loop drops
>   iterate / polish until the pillar recovers.
>
> Pillar selection when multiple are cold: oldest most-recent
> publishedAt wins; tie-breaker is lowest count, then editorial
> prominence (Trends > News > Ideas > Deep Dives > Guides).
>
> **Current state (2026-05-14):** all 40 articles aged 1–10 days,
> all pillars at 8 in 30d → comfortable. First natural shortfall
> arrives in ~20 days as the oldest articles cross the threshold.
> No Rule-1 row to file yet.
>
> Rules 2 / 3 / 4 (tracker linkage, group-buy companion, publishedAt
> gap-fill) are unchanged. They compete on raw `impact × ease`.

> **POSTURE: drained 2026-05-09** — the brand-assets-first
> posture set at 12:30Z is cleared. All four drain items shipped
> the same day: (1) favicon — `apps/web/src/app/icon.svg` +
> `apple-icon.tsx` wired via Next App Router auto-discovery
> (`0e7c9fd`); (2) default OG — already in place at
> `apps/web/src/app/opengraph-image.tsx` since phase 4 (`fc1b0b0`);
> (3) per-pillar OG variants — five `apps/web/src/app/<pillar>/opengraph-image.tsx`
> handlers + shared `<PillarOGContent>` template (`0dab0a8`);
> (4) hero placeholders for the six seed articles — SVGs at
> `apps/web/public/hero-art/<slug>.svg` + provenance JSON siblings
> + frontmatter `heroImage`/`heroImageAlt` wiring (`0e7c9fd`).
> `/march` resumes normal dispatch — phase 15 (Newsletter) is the
> next pending phase.

> **Iterate-bias category: cleared 2026-05-09** along with the
> posture. Iterate scoring returns to category-neutral.

> **Article hero art directive (locked 2026-05-09 — durable
> after the posture drained):** every article (current and future)
> renders a colorful keyboard SVG as its hero placeholder until
> real photography backfills. Style: simple, single splash of
> color, line-drawing weight consistent across articles,
> illustrative of the article's subject (switch cross-section
> for switch-deep-dives, keycap profile silhouette for keycap
> pieces, keyboard outline + callout for build pieces, sparkline
> for trends pieces, layout silhouette for ergonomic pieces).
> Hero SVGs land under `apps/web/public/hero-art/<slug>.svg` with
> a sibling `<slug>.svg.json` provenance file. The article
> frontmatter `heroImage` field references the absolute path.
>
> **Forward-looking wiring (added 2026-05-09 same drain):** new
> articles drafted by `/iterate` no longer ship art-less. The
> iterate skill's content-gap delegation now bundles
> `content-curator` (prose) + `brander` (hero SVG) + frontmatter
> wiring as a single commit — see `skills/iterate.md` § Step 3.
> The audit's "articles missing `heroImage`" finding (§4.A) is
> reserved for backfilling already-shipped articles, not for
> letting new ones slip through. Non-article asset findings
> (broken favicon, missing OG variant, stale render) still go
> through `/ship-asset` directly — that lane stays demand-pull
> per `skills/ship-asset.md` §1.

### [x] [content] [6.3] gmk-cyl-prussian-alert — dcs-olivetti-comeback cross-link missing at profile-rotation mention
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (gmk-cyl-prussian-alert line 71 mentions "DCS Olivetti's recent close" as evidence of enthusiast attention rotating away from Cherry profile — the exact editorial premise of dcs-olivetti-comeback; dcs-olivetti-comeback already links back to gmk-cyl-prussian-alert explicitly; cross-link is unidirectional)
- ease: 9 (single inline link replacement at named reference — same pattern as all prior cross-link fixes)
- score: 6.3 (impact × ease / 10)
- observation: gmk-cyl-prussian-alert's closing paragraph cites "DCS Olivetti's recent close" as a signal that enthusiasm may rotate away from Cherry profile, without linking to the companion piece that covers that story. dcs-olivetti-comeback already links back to gmk-cyl-prussian-alert; completing the bidirectional pair is the natural reader path.
- evidence: apps/web/src/content/articles/gmk-cyl-prussian-alert.mdx:71 — "DCS Olivetti's recent close already hints in that direction" — no link; grep for "dcs-olivetti-comeback" returns 0 matches; dcs-olivetti-comeback.mdx:58 already cross-links back.
- suggested fix: replace plain text with [DCS Olivetti's recent close](/article/dcs-olivetti-comeback)
- issue: #310
- addressed in: 07225a1

### [x] [content] [6.3] trends-tracker-preview — alice-layout-decline cross-link missing at worked example Alice mention
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (trends-tracker-preview popularityScore=30; zero outgoing article cross-links; "alice" tag in frontmatter; worked example at line 51 explicitly names Alice layout at -18 — the exact editorial premise of alice-layout-decline whose lede cites W19 Alice at -18; two articles are companion pieces sharing the same data point with no path between them)
- ease: 9 (single follow-on sentence appended inline after the Alice clause — same pattern as all prior cross-link fixes)
- score: 6.3 (impact × ease / 10)
- observation: trends-tracker-preview uses Alice layout at -18 as its worked example for how to read a tracker row. alice-layout-decline's lede directly cites W19 Alice at -18 as the editorial premise for a full deep-dive on the decline. The two articles share the same data point; a reader following the trends-tracker-preview worked example has no path to the companion piece that unpacks the full story.
- evidence: apps/web/src/content/articles/trends-tracker-preview.mdx line 51 — "Alice layout read -18 with the slope still pointing down — eight weeks of softening interest after the last wave of group buys closed." — no link; grep for "alice-layout-decline" returns 0 matches; article has 0 outgoing cross-links to rest of corpus.
- suggested fix: append follow-on sentence inline after Alice clause → "For the longer story on where Alice interest went and why, see [the slow fade of Alice layouts](/article/alice-layout-decline)."
- issue: [mirror-failed: 2026-06-09T00:00:00Z]
- addressed in: 81a603e

### [x] [content] [5.4] beginners-switch-buying-guide — clicky-switches-deep-dive cross-link missing at clicky family section close
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 6 (beginners-switch-buying-guide popularityScore=51, primary entry-point for switch selection; clicky-switches-deep-dive has 0 incoming cross-links from the article corpus; the clicky paragraph at line 62 describes the click-jacket mechanism and closes with a practical advice sentence but provides no navigation path forward for beginners who choose clickies; the deep-dive explicitly addresses "mechanical-keyboard newcomers" as the second constituency cohort and explains click-bar vs click-jacket in depth)
- ease: 9 (single closing sentence appended to the clicky paragraph — same pattern as all 40 prior cross-link fixes)
- score: 5.4 (impact × ease / 10)
- observation: beginners-switch-buying-guide's clicky section (line 62) introduces the clicky family and closes with "A clicky switch is a great choice in a private room and a poor choice in an open office." There is no link to clicky-switches-deep-dive, which provides the natural next step for a beginner who picks clicky — explaining how click-jacket and click-bar mechanisms differ and what that means for build decisions. The deep-dive currently has 0 incoming links from the 48-article corpus.
- evidence: apps/web/src/content/articles/beginners-switch-buying-guide.mdx:62 — clicky paragraph closes with "A clicky switch is a great choice in a private room and a poor choice in an open office." with no link; grep for "clicky-switches-deep-dive" returns nothing in the file.
- suggested fix: append closing sentence to clicky paragraph → "For a deeper look at how click mechanisms work and what separates click-bar from click-jacket designs, see [clicky switches, a deep dive](/article/clicky-switches-deep-dive)."
- issue: [mirror-failed: 2026-06-09T00:00:00Z]
- addressed in: d191cab

### [x] [content] [5.4] 75-percent-default — gasket-mount-reality cross-link missing at Build-shape watch Callout
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 6 (trends article with zero article cross-links; Build-shape watch Callout explicitly names "gasket-mount internals as default rather than option" — the precise subject of gasket-mount-reality — with no companion link; both articles share "75" and "mode" tags; readers of 75-percent-default are the primary audience for the gasket-mount guide)
- ease: 9 (single sentence appended to Callout body — same pattern as gasket-mount-reality line 49's plate-materials cross-link)
- score: 5.4 (impact × ease / 10)
- issue: #303
- observation: 75-percent-default has zero article cross-links despite its Build-shape watch Callout explicitly naming gasket-mount internals as the default chassis shape converging across 2026 75% boards. The gasket-mount-reality article covers exactly what that convergence means in practice — how different gasket implementations translate to feel and acoustics across the $90–$400 price ladder — but there was no path from the trends piece to the guide.
- evidence: apps/web/src/content/articles/75-percent-default.mdx:101-107 — Callout body closes "but the chassis intent is converging" with no link; grep for "gasket-mount-reality" returned nothing in the file; grep for "[/article/" returned zero matches across the entire file.
- suggested fix: append closing sentence to Callout body → "For what gasket-mount internals actually deliver across the price ladder, see [what gasket mount actually delivers](/article/gasket-mount-reality)."
- addressed in: e93a152

### [x] [content] [5.4] gateron-oil-king-deep-dive — switch-housings-compared cross-link missing at housing section close
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 6 (gateron-oil-king-deep-dive popularityScore 38; "The housing, in two halves" section covers PC/nylon/POM resin combination in detail but provides no navigation path to switch-housings-compared — the dedicated guide on housing material acoustics with 0 incoming article cross-links before this fix; the closing paragraph directly parallels the plate-materials cross-link pattern already present at line 60)
- ease: 9 (single inline sentence appended to housing section closing paragraph — same pattern as line 60's plate-materials cross-link)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-09T00:00:00Z]
- addressed in: fa7d2619b86d4c67e50be97374c1534caaed4274
- observation: gateron-oil-king-deep-dive's "The housing, in two halves" section covers polycarbonate/nylon/POM resin combinations in depth but closes without a navigation path to switch-housings-compared — the dedicated guide covering how different housing resins shape switch acoustics across the catalog. The article already uses the pattern at line 60 ("For a full treatment of how... see [plate materials deep-dive]") but only for plate materials; the housing section lacks the companion handoff.
- evidence: apps/web/src/content/articles/gateron-oil-king-deep-dive.mdx:44 — housing section closes "most competitors pick one resin and live with the trade-off" with no link; grep for "switch-housings-compared" returned nothing in the file.
- suggested fix: append closing sentence to housing section paragraph at line 44 → "For a full comparison of how different housing resins — nylon, polycarbonate, POM, and their mixed combinations — shape switch acoustics across the catalog, see [switch housings, compared](/article/switch-housings-compared)."
- addressed in: aa2eb2a

### [x] [content] [5.4] case-materials-compared — plate-materials-explained cross-link missing at plate material mention in intro
- category: content
- impact: 6
- ease: 9
- score: 5.4
- issue: #298
- observation: case-materials-compared intro names "plate material" as a downstream build decision (alongside switch choice and foam stack) without linking to the dedicated plate-materials-explained guide. Only 2 articles linked to it (gasket-mount-reality, gateron-oil-king-deep-dive); the case guide is the natural third entry for readers building their knowledge chain.
- evidence: apps/web/src/content/articles/case-materials-compared.mdx:31 — "plate material" was bare text; grep for "plate-materials" returned nothing.
- suggested fix: wrap "plate material" on line 31 with [plate material](/article/plate-materials-explained)
- addressed in: 6d70f2a, closes #298

### [x] [content] [6.3] spring-swaps-explained — pe-foam-mod cross-link missing at acoustic-mod list in conclusion
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (spring-swaps-explained "The take" section lists "PE foam, tape, films, lube — none of them change how hard the switch pushes back" with no links; readers following the acoustic-vs-force distinction have no path to pe-foam-mod which covers exactly this; the only outgoing link in the article is lubing-101)
- ease: 9 (single inline link — wrap "PE foam" → markdown link to /article/pe-foam-mod)
- score: 6.3 (impact × ease / 10)
- issue: #297
- addressed in: d5ec5c6

### [x] [content] [6.3] clicky-switches-deep-dive — drop-holy-panda-x-deep-dive cross-link missing at asymmetric-lube citation
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (clicky-switches-deep-dive had zero outgoing article links; line 96 cites "the same asymmetric-lube logic the Holy Panda X uses would be a meaningful upgrade" — drop-holy-panda-x-deep-dive dedicates its "The factory lube" section to exactly this asymmetric-lube approach; readers following clicky-switches-deep-dive's What to Watch claim had no navigation path to the companion tactile analysis)
- ease: 9 (single inline link — wrap "the Holy Panda X" at line 96 → markdown link to /article/drop-holy-panda-x-deep-dive)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-08T00:00:00Z]
- addressed in: 49e6567

### [x] [content] [6.3] divinikey-dcs-dolch-group-buy — dcs-grass-valley-decline cross-link missing at Grass Valley competitive mention
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (divinikey-dcs-dolch-group-buy line 81 names DCS Grass Valley as the direct competitive comparable for Dolch buyers — "Buyers who tracked Grass Valley but did not commit have an immediate adjacent option" — with no navigation path to dcs-grass-valley-decline; the Grass Valley article's own lede explicitly names Dolch and the shared calendar day, confirming editorial twinning; article already links to dcs-olivetti-comeback twice, so the DCS arc is established — Grass Valley is the missing third link)
- ease: 9 (single inline link — wrap "DCS Grass Valley" at line 81 → markdown link to /article/dcs-grass-valley-decline)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-08T00:00:00Z]
- addressed in: 25a0c44

### [x] [content] [6.3] split-ergo-cohort — zmk-mainstream-shift cross-link missing at ZMK force citation
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (split-ergo-cohort cites "ZMK's wireless story caught up to QMK's feature set" as the first of three forces enabling split/ergo growth; this is the central thesis of zmk-mainstream-shift; readers following split-ergo-cohort's Force 1 claim have no navigation path to the dedicated analysis; split-ergo-cohort already links to 75-percent-default but not to the ZMK article)
- ease: 9 (single inline link — wrap "ZMK's wireless story" at line 120 → markdown link to /article/zmk-mainstream-shift)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-08T00:00:00Z]
- addressed in: d928772

### [x] [content] [5.4] dcs-grass-valley-decline — dcs-olivetti-comeback cross-link missing at first Olivetti mention
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 6 (dcs-grass-valley-decline's central three-GB narrative thesis hinges on "the Olivetti signal" as the catalyst; the Olivetti is mentioned at the opening of the article body without a navigation path to dcs-olivetti-comeback; dcs-dolch article links to dcs-olivetti-comeback twice; readers following the DCS arc from dcs-grass-valley-decline had no direct path to the first chapter)
- ease: 9 (single inline link — wrap "a comeback group buy" at line 29 → markdown link to /article/dcs-olivetti-comeback)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-08T00:00:00Z]
- addressed in: d8b28a8

### [x] [content] [6.3] alice-layout-decline — split-ergo-cohort cross-link missing at split comparison
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (alice-layout-decline argues that split keyboards are now a "less-compromised purchase" — this is the article's central competitive claim, and split-ergo-cohort is the dedicated thock piece covering that shift; readers persuaded by the argument have no direct path to deeper coverage)
- ease: 9 (single inline link — wrap "Split keyboards" on line 97 → markdown link to /article/split-ergo-cohort)
- score: 6.3 (impact × ease / 10)
- issue: #295
- addressed in: fc4edf8, closes #295

### [x] [content] [5.4] building-mode-sonnet-with-oil-kings — switch-films-worth-it cross-link missing at gear spec filming mention
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 6 (building-mode-sonnet-with-oil-kings popularityScore 34; build gear spec at line 48 says "no filming" without explaining or linking the term; readers learning keyboard builds don't know what filming means or whether to do it; switch-films-worth-it is the dedicated ideas-pillar answer; only cross-linked from 2 other articles before this fix)
- ease: 9 (single inline link — wrap "filming" → markdown link to /article/switch-films-worth-it)
- score: 5.4 (impact × ease / 10)
- issue: #294
- addressed in: a00e9b0, closes #294

### [x] [content] [6.3] beginners-switch-buying-guide — switch-films-worth-it cross-link missing at filming mention
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (beginners-switch-buying-guide popularityScore 51, 4th highest on site; line 85 names "filming" alongside lubing in the "rabbit hole" close — lubing already links to /article/lubing-101 but filming has no link; switch-films-worth-it is the dedicated ideas-pillar article answering whether films are worth it; high-traffic source with no path forward for readers who want to understand switch films)
- ease: 9 (single inline link — wrap "filming" → markdown link to /article/switch-films-worth-it)
- score: 6.3 (impact × ease / 10)
- issue: #293
- addressed in: dde11a8, closes #293

### [x] [content] [5.4] hall-effect-keyboard-guide — keyboard-firmware-compared cross-link missing at MX firmware callout
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (hall-effect-keyboard-guide popularityScore 35; "Firmware complexity" tradeoffs section names "mature QMK or VIA on MX switches" as the MX ease advantage without linking to keyboard-firmware-compared, the dedicated QMK/VIA/VIAL guide; keyboard-firmware-compared popularityScore 47, 5th highest on site, previously had zero incoming article cross-links)
- ease: 9 (single inline link — "mature QMK or VIA" → markdown link to /article/keyboard-firmware-compared)
- score: 5.4 (impact × ease / 10)
- issue: #292
- addressed in: f7dbd46, closes #292

### [x] [content] [5.4] switch-housings-compared — lubing-101 cross-link missing at lube section
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (guides pillar; dedicated "How housings interact with lube" section discusses lube application in detail across nylon/PC/POM with zero cross-link to the companion technique guide)
- ease: 9 (single closing sentence appended to lube section)
- score: 5.4 (impact × ease / 10)
- issue: #291
- addressed in: 49fd299

### [x] [content] [5.4] case-materials-compared — mounting-styles-compared cross-link missing at mount callout
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (case-materials-compared popularityScore 42; the Callout "The mount interacts with all of this" explicitly instructs readers to read "The mounting styles guide" — without linking to mounting-styles-compared; readers following the recommendation have no navigation path)
- ease: 9 (single inline link wrap — "The mounting styles guide" → markdown link to /article/mounting-styles-compared)
- score: 5.4 (impact × ease / 10)
- issue: #290
- addressed in: d4b872e

### [x] [content] [4.5] gasket-mount-reality — plate-materials-explained cross-link missing at plate material section
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 5 (gasket-mount-reality popularityScore 28; "Plate material" subsection discusses PC, brass, FR4, POM plate properties in ~150 words but provided no navigation path to plate-materials-explained, the dedicated deep-dive covering plate material comparison across build contexts; gasket-mount-reality had zero article cross-links before this fix)
- ease: 9 (single inline sentence addition at end of "Plate material" subsection)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]
- addressed in: 31aca78

### [x] [content] [6.3] pe-foam-mod — stabilizer-servicing-guide cross-link missing at verdict close
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (pe-foam-mod verdict section names "properly tuned stabilizers" as the companion mod after PE foam and switch lube — without linking to stabilizer-servicing-guide (popularityScore 72, #1 on site); readers who follow the three-mod combo recommendation have no navigation path to the full stabilizer tuning guide)
- ease: 9 (single inline link wrap — "properly tuned stabilizers" → markdown link to /article/stabilizer-servicing-guide)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]
- addressed in: fa3caf1

### [x] [content] [6.3] tape-mod — sound-dampening-compared cross-link missing at verdict section
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (tape-mod popularityScore 67, 3rd-highest traffic on site; sound-dampening-compared popularityScore 65 is the hub guide covering all four acoustic mods — case foam, PE foam, tape mod, plate foam; tape-mod had pe-foam comparison sentence but no navigation path to the broader overview; sound-dampening-compared already linked to tape-mod [bbc42c1] but the reverse was absent)
- ease: 9 (single sentence addition after pe-foam comparison paragraph in verdict section)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]
- addressed in: 9329185

### [x] [content] [7.2] stabilizer-servicing-guide — lubing-101 cross-link missing at stem bore recommendation
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 8 (stabilizer-servicing-guide popularityScore 72, #1 on site; § "Lube selection" names Krytox GPL-205 G0 at line 56 as "the same lube used on switch stems" — without linking to lubing-101, the dedicated guide covering exactly that application; readers wanting to understand GPL-205 G0 on switch stems have no navigation path from the highest-traffic article on the site)
- ease: 9 (single inline link wrap — "The same lube used on switch stems" → markdown link to /article/lubing-101)
- score: 7.2 (impact × ease / 10)
- issue: #288
- addressed in: ccc6c3b, closes #288

### [x] [content] [6.3] keyboard-firmware-compared — ZMK mention missing link to zmk-mainstream-shift — addressed in 62834d2, closes #287
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (keyboard-firmware-compared popularityScore 47, 5th-highest on site; line 92 explicitly says "ZMK is out of scope for this guide" — the natural handoff signal — but provides no navigation path to zmk-mainstream-shift, the dedicated ZMK analysis; readers following the wireless track have no forward link)
- ease: 9 (single inline link wrap — "ZMK" at first prose mention in line 92)
- score: 6.3 (impact × ease / 10)
- issue: #287

### [x] [content] [5.4] case-materials-compared — sound-dampening guide cross-link missing at foam reference — addressed in e7fd1d9
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (case-materials-compared popularityScore 42; § "Budget first" references "a five-dollar foam sheet" for ABS acoustic limitations but provided no navigation path to sound-dampening-compared popularityScore 65, which covers PE foam, tape mod, and case foam options; only mounting-styles-compared linked to sound-dampening-compared across the 48-article corpus)
- ease: 9 (single inline link addition)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]

### [x] [content] [6.3] sound-dampening-compared — tape-mod guide cross-link missing at section close — addressed in bbc42c1
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (sound-dampening-compared popularityScore 65 is the hub overview for all four dampening mods; tape-mod popularityScore 67 is the dedicated deep-dive — readers of the overview had no navigation path to the full mechanics)
- ease: 9 (single prose sentence addition at end of §Tape mod)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]

### [x] [content] [5.4] stabilizers-explained — stabilizer-servicing-guide cross-link missing at tuning handoff — addressed in b01abc3, closes #285
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (stabilizers-explained § "Standard tuning sequence" lists housing feet in the lube table but provided no navigation path to stabilizer-servicing-guide, which deep-dives the housing-foot step that survives most incomplete service jobs; popularityScore 72 on the companion means high-traffic target readers were missing)
- ease: 9 (single cross-link sentence addition after Step four)
- score: 5.4 (impact × ease / 10)
- issue: #285

### [x] [content] [5.4] keychron-q-ultra-zmk — zmk-mainstream-shift bidirectional cross-link missing — addressed in 384362f
- category: content
- filed: 2026-06-06 by cloud /iterate audit
- impact: 6 (keychron-q-ultra-zmk § "ZMK as the platform" states "the firmware has moved out of niche-DIY into mainstream-prebuilt territory" — exactly the thesis of zmk-mainstream-shift; zmk-mainstream-shift already links back to keychron (line 36) but the reverse link was absent; readers at the keychron article had no navigation path to the broader ZMK analysis)
- ease: 9 (single markdown link addition in existing prose)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-06T00:00:00Z]

### [x] [content] [4.5] mounting-styles-compared — 'sound-dampening guide' prose reference not linked — addressed in e5e5ca4, closes #282
- category: content
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (guides pillar article; line 76 names "the sound-dampening guide" in plain text but provides no navigation path; readers wanting the acoustic mod stack described in that sentence could not reach the guide without a manual search)
- ease: 9 (single-token markdown link addition)
- score: 4.5 (impact × ease / 10)
- issue: #282

### [x] [data] [4.5] drop-holy-panda-x-deep-dive missing gazzew-boba-u4t in mentionedParts — addressed in 33ce740, closes #280
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (drop-holy-panda-x-deep-dive uses the Boba U4T as the canonical D-shaped bump benchmark in 4 body passages and the InlineViz alt text; gazzew-boba-u4t data record added to catalog 2026-06-06; /part/switch/gazzew-boba-u4t "mentioned in" rail gains cross-link from the site's primary tactile-bump-geometry analysis)
- ease: 9 (single frontmatter mentionedParts entry addition; updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #280

### [x] [data] [4.5] gmk-cyl-prussian-alert missing gmk-cyl-selene in mentionedParts — addressed in c720ca6
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (prussian-alert is a live buy article currently on /group-buys; opening paragraph compares pre-GB momentum against "Metro System and Selene" — the Selene keycap-set catalog record exists as gmk-cyl-selene (added 2026-06-01) but was absent from mentionedParts; /part/keycap-set/gmk-cyl-selene "mentioned in" rail gains a cross-link from a closely related active buy article in the same GMK CYL sub-line)
- ease: 9 (single frontmatter entry addition + PartReference swap; updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-06T00:00:00Z]

### [x] [data] [4.5] mounting-styles-compared missing class80 — last orphan board; all 34 catalog parts now cited — addressed in 750f133, closes #277
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (class80 is the MM Studio Class80, a CNC aluminum TKL with multi-mode mount; mounting-styles-compared explicitly names Mode Sonnet and kbd75v3 as gasket examples and notes kbd75v3 as "without moving to a full TKL" — class80 is the natural TKL counterpart; /part/board/class80 "mentioned in" rail was empty; all 34 catalog parts are now cited in ≥1 article for the first time)
- ease: 9 (one sentence + PartReference + frontmatter mentionedParts entry; e2e test updated to verify mentioned-in rail renders)
- score: 4.5 (impact × ease / 10)
- issue: #277

### [x] [data] [4.0] keycap-profiles-compared Cherry section missing domikey-wob — orphan PBT keycap set — addressed in 1dc769f, closes #275
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (guides pillar primary keycap-selection article; Domikey WoB is the catalog's benchmark PBT Cherry-profile set — in-stock evergreen utility pick at a price well below GMK group-buy; /part/keycap-set/domikey-wob "mentioned in" rail is empty despite being a canonical PBT alternative to the ABS sets already named in the Cherry section)
- ease: 8 (one sentence addition to Cherry recommendation paragraph + one frontmatter mentionedParts entry; same pattern as gmk-olivia addition in 365f896)
- score: 4.0 (impact × ease / 10)
- issue: #275

### [x] [data] [4.8] keycap-profiles-compared Cherry section missing gmk-olivia PartReference — orphan keycap set — addressed in 365f896, closes #273
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 6 (guides pillar primary keycap-selection article; gmk-olivia is the catalog's most iconic discontinued Cherry-profile set — the community-defining pink-and-cream set from 2018; /part/keycap-set/gmk-olivia "mentioned in" rail is empty despite being first-class catalog data)
- ease: 8 (one sentence addition to Cherry section + one frontmatter mentionedParts entry; same pattern as sa-godspeed + mt3-devtty additions in this article)
- score: 4.8 (impact × ease / 10)
- issue: #273

### [x] [data] [4.8] beginners-switch-buying-guide silent section had no named example; gazzew-boba-u4 orphaned — addressed in 27e279f, closes #268
- category: data
- filed: 2026-06-05 by cloud /iterate audit
- impact: 6 (high-popularity guide article; gazzew-boba-u4 had zero mentionedParts references across all 48 articles; /part/switch/gazzew-boba-u4 "mentioned in" rail was empty; silent section now has a concrete named example matching the same pattern as the linear and clicky sections)
- ease: 8 (single sentence + PartReference + frontmatter entry)
- score: 4.8 (impact × ease / 10)
- issue: #268

### [x] [data] [4.5] switch-films-worth-it missing drop-holy-panda-x in mentionedParts — addressed in 20abb34
- category: data
- filed: 2026-06-05 by cloud /iterate audit
- impact: 5 (Holy Panda X is named in a comparison table row with verdict "Worth trying"; drop-holy-panda-x part page gains a "mentioned in" cross-link from the ideas pillar; switch-films article gains HPX in its parts rail)
- ease: 9 (single frontmatter addition)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-05T00:00:00Z]

### [x] [data] [3.5] gmk-cyl-selene missing keycap-set record and mentionedParts link — addressed in 6ec0722
- category: data
- filed: 2026-06-04 by cloud /iterate audit
- impact: 5 (GMK CYL Selene is live at KBDfans through 2026-06-19, scoring +31 in W23 tracker; companion article had no mentionedParts field at all; new /part/keycap-set/gmk-cyl-selene page now exists and Selene enters the parts catalog and quiz result set)
- ease: 7 (add keycap-set JSON record + mentionedParts field to article; ship-data pattern well-established)
- score: 3.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-04]

### [x] [data] [4.5] clicky-switches-deep-dive missing kailh-box-white in mentionedParts — addressed in 1332652
- category: data
- filed: 2026-06-04 by cloud /iterate audit
- impact: 5 (clicky-switches-deep-dive is the site's primary editorial resource on clicky switches; line 54 names "The Kailh Box family — Jade, Navy, White, Pale Blue — gave clickies a second wind..."; kailh-box-white was added to catalog in phase 34 but the article predates it; /part/switch/kailh-box-white gains a "mentioned in" cross-link from the most prominent clicky deep-dive on the site)
- ease: 9 (add single mentionedParts entry + wrap "White" in Mono tag to match Box Jade / Box Navy style; same pattern as prior fixes)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-04T00:00:00Z]

### [x] [data] [4.5] keycap-profiles-compared missing mt3-devtty in mentionedParts — addressed in 8687211, closes #266
- category: data
- filed: 2026-06-03 by cloud /iterate audit
- impact: 5 (Guides pillar keycap-profiles article explicitly names "MT3 /dev/tty" as the canonical MT3 example that introduced typists to the profile; /part/keycap-set/mt3-devtty gains "mentioned in" cross-link from a high-traffic beginner Guides piece)
- ease: 9 (add single mentionedParts entry + swap Mono tag to PartReference; same pattern as 8 prior fixes)
- score: 4.5 (impact × ease / 10)
- issue: #266

### [x] [content-gaps] [3.0] W23 DCS Grass Valley null articleSlug — proactive Rule 2 before 2026-06-15 — addressed in 8eb26ec, closes #264
- category: content-gaps
- filed: 2026-06-03 by cloud /iterate audit
- impact: 6 (W23 tracker row "DCS Grass Valley (keycap) dir=down score=-18" null articleSlug; Rule 2 14-day window fires 2026-06-15; article proactively written to prevent violation; W23 tracker now wired to dcs-grass-valley-decline; dcs tag grows from 2 to 3 articles)
- ease: 5 (new trends article via content-curator; 900–1200 word target; publishedAt gap-fill May 19)
- score: 3.0 (impact × ease / 10)
- issue: #264
> **Resolved (2026-06-03):** Drafted ~1100-word trends article "DCS Grass Valley closes: what the profile's 2026 run tells us" covering the three-GB 2026 DCS revival (Olivetti W19, Grass Valley W21–W23, Dolch W23). Hero SVG: ochre DCS profile keycap row silhouette. 3 InlineViz: tracker arc, profile comparison, GB timeline. W23 DCS Grass Valley tracker row wired (articleSlug: dcs-grass-valley-decline). Language gate clean. 703 e2e green. `8eb26ec`

### [x] [content] [4.5] divinikey-dcs-dolch-group-buy — mode-sonnet missing from mentionedParts despite body mention — addressed in b1d2fb3, closes #263
- category: content
- filed: 2026-06-03 by cloud /iterate audit
- impact: 5 (live group-buy companion article; Mode Sonnet board named in body prose at line 53 as a reference chassis example; /part/board/mode-sonnet gains "mentioned in" cross-link from a live buy article)
- ease: 9 (add structured mentionedParts entry + swap plain text to PartReference; updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #263
> **Resolved (2026-06-03):** Added structured mentionedParts entry (id: mode-sonnet, kind: board, slug: mode-sonnet). Replaced plain-text "the Mode Sonnet" with `<PartReference id="mode-sonnet" />` at line 53. updatedAt bumped to 2026-06-03. /part/board/mode-sonnet now shows divinikey-dcs-dolch-group-buy in its "mentioned in" rail. Language gate clean. 700 e2e green. `b1d2fb3`

### [x] [data] [4.5] clicky-switches-deep-dive missing drop-holy-panda-x in mentionedParts — addressed in 1ae85e1, closes #260
- category: data
- filed: 2026-06-03 by cloud /iterate audit
- impact: 5 (Deep Dives pillar piece explicitly names "the Holy Panda X" at line 90 as the engineering benchmark for factory-tuned tactile lube approach; /part/switch/drop-holy-panda-x gains "mentioned in" cross-link from a substantive clicky-focused deep-dive)
- ease: 9 (single frontmatter array entry addition)
- score: 4.5 (impact × ease / 10)
- issue: #260

### [x] [data] [5.4] drop-holy-panda-x-deep-dive missing gateron-oil-king + hmx-cloud in mentionedParts — addressed in a2bc454, closes #259
- category: data
- filed: 2026-06-03 by cloud /iterate audit
- impact: 6 (Oil King and HMX Cloud are the two primary linear benchmarks the article triangulates against, with explicit force-curve specs; absent from mentionedParts breaks bidirectional cross-reference rails on both part pages)
- ease: 9 (frontmatter edit — add two slug entries)
- score: 5.4 (impact × ease / 10)

### [x] [data] [4.5] W23 tracker: DCS Grass Valley score +18 on a down row — should be -18 — addressed in this commit, closes #255
- category: data
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (Trends Tracker W23 keycap section: formatDelta(18, 'down') renders "+18% ▼" instead of "-18% ▼"; groupByCategory places DCS Grass Valley above Cherry MX2A in the positive region; all other down rows across W19–W23 consistently use negative scores)
- ease: 9 (two fields in one JSON record: score and spark values)
- score: 4.5 (impact × ease / 10)
- issue: #255

### [x] [data] [3.6] hall-effect-mainstream missing mode-sonnet in mentionedParts — addressed in a74f5cf, closes #254
- category: data
- filed: 2026-06-02 by cloud /iterate audit
- impact: 4 (article discusses Mode Sonnet R2 as a concrete HE mainstream signal in 3+ body passages; /part/board/mode-sonnet gains "mentioned in" cross-link from a substantive Trends pillar article)
- ease: 9 (single frontmatter entry addition)
- score: 3.6 (impact × ease / 10)
- issue: #254

### [x] [data] [4.5] building-mode-sonnet-with-oil-kings mentionedParts missing bakeneko65 — addressed in f62670b, closes #253
- category: data
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (article is an Ideas pillar build piece that explicitly compares the Mode Sonnet vs Bakeneko65 sound character with the same Oil Kings; /part/board/bakeneko65 gains a "mentioned in" cross-link from a substantive build comparison — "Compared to the same switches in a Bakeneko65 built last summer, the Sonnet sounds about a half-octave lower and considerably less metallic")
- ease: 9 (single frontmatter array entry addition)
- score: 4.5 (impact × ease / 10)
- issue: #253

### [x] [data] [4.5] acoustic-spec-rise mentionedParts missing hmx-cloud, gateron-oil-king, mode-sonnet — addressed in 2570671, closes #252
- category: data
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (article is a Trends pillar piece naming three data-catalog entities in prose; part pages for hmx-cloud, gateron-oil-king, and mode-sonnet all gain "mentioned in" cross-link from substantive editorial context)
- ease: 9 (single frontmatter array update — three items)
- score: 4.5 (impact × ease / 10)
- issue: #252

### [x] [data] [3.6] drop-holy-panda-x-deep-dive missing tecsee-sapphire-v2 in mentionedParts — addressed in c5a75ec, closes #250
- category: data
- filed: 2026-06-02 by cloud /iterate audit
- impact: 4 (Tecsee Sapphire named 3× in the HPX deep-dive as the primary D-shaped tactile comparison; /part/switch/tecsee-sapphire-v2 gains "mentioned in" cross-link from a quality deep-dive)
- ease: 9 (single frontmatter entry addition)
- score: 3.6 (impact × ease / 10)
- issue: #250

### [x] [data] [4.5] clicky-switches-deep-dive missing mentionedParts for kailh-box-jade — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7
- category: data
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (article is a prominent deep-dive where Kailh Box Jade is the canonical click-bar example across 4 body sections; readers on /part/switch/kailh-box-jade see no "mentioned in" rail for this article; kailh-box-jade shipped phase 34 cf656ef but article predates the data record)
- ease: 9 (add mentionedParts frontmatter field — one entry)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-02T00:00:00Z]

### [x] [content] [3.5] GMK CYL Selene (live, Jun 19 close) has no companion article — Rule 3 violation — addressed in 87136a8, closes #246
- category: content-gaps
- filed: 2026-06-01 by cloud /iterate audit
- impact: 7 (live buy through 2026-06-19; +31 up in W23 tracker; kbdfans-gmk-cyl-selene.json status=live with no relatedArticle; Rule 3 mandates companion coverage for every live/announced buy)
- ease: 5 (new article via content-curator + brander; group-buy companion pattern well-established)
- score: 3.5 (impact × ease / 10)
- issue: #246
> **Resolved (2026-06-01):** Drafted ~1020-word companion article at apps/web/src/content/articles/gmk-cyl-selene-group-buy.mdx (news pillar, publishedAt 2026-05-15 per group-buy startDate exemption, four sections). Hero SVG at apps/web/public/hero-art/gmk-cyl-selene-group-buy.svg (dusty-violet + teal glitter-dot keycap cluster, moon-phase novelty glyph). relatedArticle set on kbdfans-gmk-cyl-selene.json; articleSlug set on W23 Selene tracker row. Language gate clean. 694 e2e green. `87136a8`

### [x] [data] [3.0] GMK CYL Selene active buy (May 15–Jun 19) — no group-buy record in data/group-buys/ — addressed in bf8cd58
- category: data
- filed: 2026-06-01 by cloud /iterate audit
- impact: 5 (active buy at +31 up in W23 tracker; absent from /group-buys active view and home GroupBuysWidget; no heroImage or companion article path; 5 other GMK CYL sets all have records)
- ease: 6 (scout research done; KBDfans vendor already exists; group-buy JSON + brander hero art; pattern well-established from 5 prior GMK CYL records)
- score: 3.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-01T00:00:00Z]
> **Resolved (2026-06-01):** Created data/group-buys/kbdfans-gmk-cyl-selene.json (status: live, May 15–Jun 19, KBDfans, global, $160 base kit). Hero art at apps/web/public/group-buy-art/kbdfans-gmk-cyl-selene.svg — Cherry-profile keycap cluster with dusty-rose splash and bronze dot, moon-phase glyph on focal alpha. 11 group-buys total. 691 e2e green. `bf8cd58`

### [x] [copy] [3.6] trends-tracker-preview — "modding" tag mismatch — article is a tracker explainer, not a modification guide — addressed in 9747d69, closes #245
- category: copy
- filed: 2026-06-01 by cloud /iterate audit
- impact: 4 (the /tag/modding page lists "Reading the Trends Tracker" alongside lubing-101, pe-foam-mod, tape-mod and other hands-on modification guides; misleads tag browsers; "modding" does not appear in article body)
- ease: 9 (remove one word from tags array + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #245

### [x] [data] [6.3] W23 tracker: DCS Dolch row null articleSlug — companion article divinikey-dcs-dolch-group-buy shipped same day — addressed in this commit, closes #244
- category: data
- filed: 2026-06-01 by cloud /iterate audit
- impact: 7 (DCS Dolch is +29 up — highest-scoring keycap row in W23; companion article shipped today; tracker rows without articleSlug render unlinked on the signature Trends Tracker surface)
- ease: 9 (one JSON field update in data/trends/2026-W23.json)
- score: 6.3 (impact × ease / 10)
- issue: #244

### [x] [data] [3.5] DCS Dolch live GB (Jun 1–Jul 1) not in database — add Divinikey vendor + group-buy record — addressed in 180461b, closes #242
- category: data
- filed: 2026-06-01 by cloud /iterate audit
- impact: 5 (DCS Dolch opened today at +29 in W23 tracker; absent from /group-buys active view; Divinikey also missing as vendor stub; Rule 3 companion opportunity fires next tick)
- ease: 7 (two JSON records + brander hero art; no schema change, no code change)
- score: 3.5 (impact × ease / 10)
- issue: #242
> **Resolved (2026-06-01):** Created `data/vendors/divinikey.json` (US, active, Los Angeles) and `data/group-buys/divinikey-dcs-dolch.json` (status: live, startDate: 2026-06-01, endDate: 2026-07-01, region: global). Hero art at `apps/web/public/group-buy-art/divinikey-dcs-dolch.svg` (DCS profile keycap cluster, charcoal + brass palette). Scout confirmed dates via Divinikey product page and Geekhack IC thread 123033; 9+ regional vendors confirmed. 685 e2e green. `180461b`

### [x] [copy] [4.0] mode-sonnet-r2-group-buy-coverage — callout/lede stale "announced for 2026-06-01" after buy opened today — addressed in 956e67a, closes #240
- category: copy
- filed: 2026-06-01 by cloud /iterate audit
- impact: 5 (update callout is the first content block readers see; "The buy is now announced for 2026-06-01" reads as if buy hasn't started when it opened today; lede "now scheduled for" reinforces the stale framing; both surfaces render in article cards on /news, /tag/mode, /tag/cannonkeys)
- ease: 8 (targeted prose edits in callout sentences + lede + updatedAt bump; data status flip "announced" → "live" bundled as supporting data fix)
- score: 4.0 (impact × ease / 10)
- issue: #240
> **Resolved (2026-06-01):** Lede: "now scheduled for 2026-06-01" → "now open from 2026-06-01". Update callout (2026-05-09): "announced for 2026-06-01 through 2026-07-15" → "opened on 2026-06-01 and runs through 2026-07-15". Timing callout: "Round now opens 2026-06-01" → "The buy opened on 2026-06-01". Data: cannonkeys-mode-sonnet-r2.json status "announced" → "live"; updatedAt bumped to 2026-06-01. 685 e2e green. `956e67a`

### [x] [copy] [3.6] gmk-cyl-king-of-the-seas-group-buy — title "opens" and lede "runs through" stale after May 31 close — addressed in 5bd3e52, closes #237
- category: copy
- filed: 2026-05-31 by cloud /iterate audit
- impact: 4 (title renders in article cards, OG title tag, and article header; lede renders in cards, search snippets, OG description — affect how closed-buy readers encounter the article)
- ease: 9 (two-word frontmatter edits: title "opens" → "opened"; lede "runs through" → "ran through")
- score: 3.6 (impact × ease / 10)
- note: body prose was past-tensed in 8dc45e4 but frontmatter title and lede were not updated in the same pass
- issue: #237
> **Resolved (2026-05-31):** Changed title "opens at KBDfans" → "opened at KBDfans"; lede "runs through 2026-05-31" → "ran through 2026-05-31". Consistent past tense throughout article after May 31 close. 682 e2e green. `5bd3e52`

### [x] [fix] [3.6] language gate: worth-revisiting form escapes unfulfillable-revisit pattern — addressed in f50088a
- category: fix
- filed: 2026-05-30 by cloud /iterate audit
- impact: 4 (guides article switch-films-worth-it.mdx; "It is worth revisiting in six months when more build data exists." is semantically identical to the already-gated "will revisit" but not caught by the existing unfulfillable-revisit pattern; future ship-content articles could reproduce the same self-update promise)
- ease: 9 (add one pattern to article-language-patterns.json + 2 unit tests + 1 corpus fix + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-30T00:00:00Z]
> **Resolved (2026-05-30):** Added unfulfillable-worth-revisiting pattern to scripts/article-language-patterns.json (match: "worth revisiting"). Added 2 unit tests (positive: "worth revisiting in six months" flagged; negative: "worth another look" clean). Test count: 39 → 41. Fixed corpus violation in switch-films-worth-it.mdx line 95: removed "It is worth revisiting in six months when more build data exists." — replaced closer with reader redirect to /guides and vendor forums. updatedAt bumped to 2026-05-30. Corpus scan clean. 673 e2e green. `f50088a`

### [x] [copy] [3.6] gmk-cyl-greg-2-group-buy — stale /group-buys link and "current window" phrasing after May 29 close — addressed in 459e252, closes #230
- category: copy
- filed: 2026-05-29 by cloud /iterate audit
- impact: 4 (closed buy article; "current window" is stale; link misdirects readers from /group-buys to /group-buys/past; same pattern as cannonkeys-nyawice 0bcbb47 and gmk-cyl-ishtar-r2 2705750)
- ease: 9 (single sentence edit + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #230
> **Resolved (2026-05-29):** Changed "Full configurator and the current window are at KBDfans's product page. The live entry alongside the rest of the open buys sits on /group-buys" → "Full configurator details are at KBDfans's product page. The archived entry is at /group-buys/past". updatedAt bumped to 2026-05-29. 673 e2e green. `459e252`

### [x] [data] [3.6] GMK CYL GREG 2 status stale — endDate 2026-05-29 passed, still marked live — addressed in 9ab3c45, closes #228
- category: data
- filed: 2026-05-29 by cloud /iterate audit
- impact: 4 (source-of-truth status field wrong; buy window closed today; renderer-side guard absorbs label leak on /group-buys, but /group-buys/past archive selection, JSON-LD, RSS, and any downstream consumer all see stale field)
- ease: 9 (one JSON field flip + loader test update; same pattern as Sweet Nightmare `3443fe9` and Nyawice `1d34cd8`)
- score: 3.6 (impact × ease / 10)
- issue: #228
> **Resolved (2026-05-29):** Flipped `status` from `"live"` to `"closed"` and bumped `updatedAt` to 2026-05-29T00:00:00.000Z on `data/group-buys/kbdfans-gmk-cyl-greg-2.json`. Updated `packages/data` group-buys loader test: removed greg-2 from the "active list includes live buys" assertion (now closed); King of the Seas (endDate 2026-05-31, status live) retained as the live-buy reference. Manifest + search index refreshed by data:validate step. 670 e2e green. `9ab3c45`

### [x] [fix] [3.6] language gate: "this quarter" bare temporal pattern missing; hall-effect-mainstream stale June 30 — addressed in 9645a36
- category: fix
- filed: 2026-05-28 by cloud /iterate audit
- impact: 4 (hall-effect-mainstream.mdx line 17 uses "at least one Tier-1 prebuilt launch this quarter" — a bare relative quarter reference that means Q2 2026 at the April 22 publication date; becomes stale July 1; no gate pattern catches "this quarter"; preventive measure consistent with tracker-href-bare-week and at-publication-bare-tracker additions)
- ease: 9 (one JSON pattern entry + 2 unit tests + one article word change; corpus scan confirms 1 violation)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-28T07:30:00Z]
> **Resolved (2026-05-28):** Added `relative-this-quarter` regex pattern to `scripts/article-language-patterns.json` (matches `\bthis quarter\b`; carve-out: "Q2 2026" and other absolute forms do not trigger). Fixed the one corpus violation: "at least one Tier-1 prebuilt launch this quarter" → "in Q2 2026" in `hall-effect-mainstream.mdx`. updatedAt bumped to 2026-05-28. 2 unit tests added (test count: 37 → 39). 670 e2e green. `9645a36`

### [x] [copy] [3.2] zmk-mainstream-shift — "At publication, the thock Trends Tracker had the ZMK row sloping up" — anachronistic claim; ZMK absent from all snapshots — addressed in ed2c700, closes #226
- category: copy
- filed: 2026-05-27 by cloud /iterate audit
- impact: 4 (trends article; publishedAt 2026-04-15 predates tracker launch (W19, 2026-05-06); "At publication, the thock Trends Tracker had the ZMK row" is an anachronism — the tracker did not exist at publication; additionally ZMK appears in no stored snapshot W19–W22; prior fix #216 removed the broken href but the prose claim itself remained)
- ease: 8 (one sentence deletion/rewrite preserving editorial observation; updatedAt bump)
- score: 3.2 (impact × ease / 10)
- issue: #226
> **Resolved (2026-05-27):** Removed "At publication, the thock Trends Tracker had the ZMK row sloping up and the wireless-firmware sub-thread sloping up alongside it; neither line had spiked, both were climbing on the cadence of a category settling into a default slot." Replaced with "ZMK and the wireless-firmware sub-thread were both climbing on the cadence of a category settling into a default slot rather than having a moment." — preserves the editorial observation without the unverifiable pre-tracker data source. updatedAt bumped to 2026-05-27. 670 e2e green. `ed2c700`

### [x] [copy] [3.2] gmk-cyl-greg-2-group-buy — bare /trends/tracker href in "DCS Olivetti row is on the same arc" clause; DCS Olivetti absent from W22 tracker
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 4 (live buy article through 2026-05-29; bare /trends/tracker href alongside "the DCS Olivetti row is on the same arc" takes readers to W22 tracker where DCS Olivetti is absent — replaced by DCS Grass Valley; same Variant B pattern as zmk-mainstream-shift `7662ecb`)
- ease: 8 (remove href from tracker link text: "[trends tracker](/trends/tracker)" → "Trends Tracker"; DCS Olivetti aside stays as editorial context; updatedAt bump)
- score: 3.2 (impact × ease / 10)
- issue: #224
> **Resolved (2026-05-26):** Removed href from "[trends tracker](/trends/tracker)" → "Trends Tracker" on line 44. DCS Olivetti aside ("the DCS Olivetti row is on the same arc") retained as editorial context; only the bare tracker link was misleading. updatedAt bumped to 2026-05-26. 670 e2e green. `43c4b55`

### [x] [copy] [3.2] hall-effect-mainstream — "At publication" tracker cite predates Hall-effect row; bare /trends/tracker href — addressed in this commit
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 4 ("At publication, the [Trends Tracker](/trends/tracker) showed the Hall-effect category on an upward slope" — article published 2026-04-22 (W17), before the tracker existed (W19 first snapshot); Hall-effect row first appears in W21 (+55, direction up); the "At publication" qualifier claims tracker data existed in April when it did not; bare href resolves to live W22 tracker)
- ease: 8 (change temporal qualifier + update href to W21 archive)
- score: 3.2 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-26T00:00:00Z]
> **Resolved (2026-05-26):** Changed "At publication, the [Trends Tracker](/trends/tracker) showed the Hall-effect category on an upward slope and the polling-rate sub-thread rising alongside it." → "The [2026-W21 Trends Tracker](/trends/tracker/2026-W21) showed the Hall-effect category at +55 and on an upward slope, with polling-rate configurability rising alongside it." Removes anachronistic "At publication" qualifier (W17 predates tracker and Hall-effect row); anchors to W21 (earliest snapshot with Hall-effect data at +55 direction up); links to archive not live tracker. updatedAt bumped to 2026-05-26. 670 e2e green.

### [x] [copy] [3.6] hmx-cloud-deep-dive lede — "sat...and lands" mixed tense; 07cf733 fixed "sits→sat" but left "lands" present — addressed in 998750e, closes #221
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 4 (lede renders in article hero, article cards across the site, related-articles rails, and OG metadata; the coordinated clause "sat second on our tracker and lands in half the $120 prebuilts" has inconsistent tense — past "sat" followed by present "lands" in the same clause; the previous fix 07cf733 converted "sits→sat" but left "lands" unchanged, making the incomplete fix more visible than the original)
- ease: 9 (single word change in frontmatter lede: "lands" → "landed"; no other files touched)
- score: 3.6 (impact × ease / 10)
- issue: #221
> **Resolved (2026-05-26):** Changed "lands" → "landed" in frontmatter lede. Consistent past tense throughout the lede clause ("sat second on our tracker and landed in half the $120 prebuilts"). 670 e2e green. `998750e`

### [x] [copy] [3.6] hmx-cloud-deep-dive lede: "Today the Cloud sits second on our W19 tracker" — present-tense "Today" decays across reads — addressed in 07cf733, closes #220
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 4 (lede text renders in article hero, article cards across the site, search results, OG metadata, and related-article rails; "Today" implies present tense that diverges from W22 reality — readers see "Today... W19 tracker" and must guess whether "today" means the publication date or the current date)
- ease: 9 (three-word change in frontmatter lede: "Today the Cloud sits second on our W19" → "In W19, the Cloud sat second on our"; present→past tense; updatedAt already current from f6053b4)
- score: 3.6 (impact × ease / 10)
- issue: #220
> **Resolved (2026-05-26):** Changed "Today the Cloud sits second on our W19 tracker" → "In W19, the Cloud sat second on our tracker". Removes the decaying "Today" relative reference; past tense anchors the statement to the W19 publication era, consistent with the body's [W19 Trends Tracker snapshot](/trends/tracker/2026-W19) link at line 26. 670 e2e green. `07cf733`

### [x] [copy] [3.6] hmx-cloud-deep-dive closing paragraph: unlinked W19 tracker citation (Variant C) — addressed in f6053b4
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 4 (deep-dives article closing sentence references "+36 on the W19 tracker" without href; line 26 of the same article already links the identical data as [W19 Trends Tracker snapshot](/trends/tracker/2026-W19); reader at the end of the article cannot navigate to the archived snapshot to verify the cited figure)
- ease: 9 (one markdown hyperlink change + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-26T00:00:00Z]

### [x] [data] [4.5] W22 tracker Prototypist row: null articleSlug despite vendor-first-customs existing — addressed in f2cadd4, closes #215
- category: data
- filed: 2026-05-25 by cloud /iterate audit
- impact: 5 (Trends Tracker row for an up-trending vendor has no article link on the tracker's signature surface; vendor-first-customs explicitly covers Prototypist as EU/UK fulfillment vendor and was linked in W19+W20)
- ease: 9 (one-field JSON fix in data/trends/2026-W22.json)
- score: 4.5 (impact × ease / 10)
- issue: #215
> **Resolved (2026-05-25):** Set `articleSlug: "vendor-first-customs"` on the Prototypist row in data/trends/2026-W22.json. The article explicitly references Prototypist's W19 tracker row and was the linked article in both W19 and W20 snapshots; W21 dropped it during a flat week; W22's up direction restores the link. 670 e2e green. `f2cadd4`

### [x] [test] [4.0] language-check: 5 patterns lack unit tests (stay-tuned, coming-soon, approximate-month, relative-months, tracker-will) — addressed in this commit, closes #212
- category: test
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (5 patterns in article-language-patterns.json have no unit tests; a regression in any — e.g. typo in match string, broken regex — would silently pass the test suite while letting violations through in the /ship-content language gate)
- ease: 8 (node:test additions following established pattern in scripts/__tests__/article-language-check.test.mjs)
- score: 4.0 (impact × ease / 10)
- issue: #212
> **Resolved (2026-05-24):** Added 6 tests across 5 new `describe` blocks in `scripts/__tests__/article-language-check.test.mjs`: `unfulfillable-stay-tuned` (1 test — "stay tuned"), `unfulfillable-coming-soon` (1 test — "coming soon"), `approximate-date-month` (1 test — "approximately June"), `relative-time-months` (1 test — "3 months from now"), `tracker-will` (2 tests — positive "tracker will be watching" + negative "tracker had" past-tense). All 14 patterns in article-language-patterns.json now have at least one unit test. Test count: 25 → 31. 667 e2e green (gate pending verify).

### [x] [copy] [5.4] gmk-cyl-ramune-group-buy — unfulfillable "tracker will be watching" closer in "What we're watching" — addressed in dd6ca9e, closes #210
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 6 (live buy article through 2026-06-20; unfulfillable forward-looking promise in closing paragraph misleads active buyers)
- ease: 9 (one sentence removal; language pattern added to article-language-patterns.json)
- score: 5.4 (impact × ease / 10)
- issue: #210
> **Resolved (2026-05-24):** Removed sentence "The tracker will be watching the close-week signal when the order books settle." from end of "What we're watching" section — the article's following closer ("Follow the [trends tracker] for post-close movement data.") already directs readers. Added tracker-will pattern to article-language-patterns.json; corpus scan filed AUDIT row for dcs-olivetti-comeback (same pattern). 667 e2e green. `dd6ca9e`

### [x] [copy] [3.6] gmk-cyl-ramune-group-buy — "it is running up" present-tense tracker citation with live link (W21 anchor exists) — addressed in 1dfe406, closes #209
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 4 (live buy article through 2026-06-20; readers checking buy intelligence see present-tense tracker description that decays; W21 snapshot confirms +38 direction up in the buy's first full active week)
- ease: 9 (two-word tense fix + href change to /trends/tracker/2026-W21 + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #209
> **Resolved (2026-05-24):** Changed `[trends tracker](/trends/tracker)` → `[2026-W21 Trends Tracker](/trends/tracker/2026-W21)` (first snapshot where Ramune appears at +38 direction up, the buy's first full active week). Changed "it is running up" → "it was running up" — past tense frames the momentum as a publication-era observation. Line 88 closer redirecting to live tracker for post-close data is unchanged. updatedAt bumped to 2026-05-24. 667 e2e green. `1dfe406`

### [x] [copy] [4.5] 75-percent-default — W19 score (+28) Source link resolves to live tracker (W21 shows +35) — addressed in 35db46a, closes #207
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (trends article; cites "score +28 and direction up across the eight-week window through 2026-W19" but Source href points to live tracker; W21 shows 75% Layout at +35; same score-mismatch pattern as W19 anchor series)
- ease: 9 (one href change + remove "live " adjective + past-tense verb + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #207
> **Resolved (2026-05-24):** Changed Source href from `https://thock.xyz/trends/tracker` to `https://thock.xyz/trends/tracker/2026-W19` so readers land on the historical W19 snapshot where 75% Layout at +28 is preserved (W21 shows +35). Removed "live " adjective and changed "has … sitting" → "had … sitting" (past-tense frames the +28 as W19 historical data). updatedAt bumped from null to 2026-05-24. 667 e2e green. `35db46a`

### [x] [copy] [3.6] mode-sonnet-r2-group-buy-coverage — Buying Notes close date "2026-06-15" stale after timeline shift to 2026-07-15 — addressed in ce9aecd, closes #206
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 4 (active announced buy opening 2026-06-01; Buying Notes section advises "The safest read of 2026-06-15…" when actual close is 2026-07-15; top callout already corrects dates but Buying Notes still misleads readers who jump directly to buying guidance)
- ease: 9 (single sentence update — replace "2026-06-15" with "revised 2026-07-15" + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #206

### [x] [copy] [4.5] split-ergo-cohort — W19 tracker Source link goes to live tracker; direction now flat in W21 — addressed in c0abfcd, closes #205
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (trends article; article claims split/ergo at +32 direction up in W19; live tracker now shows +34 direction flat in W21; readers clicking the Source citation see contradicting direction signal)
- ease: 9 (one href change + remove "live " adjective + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #205
> **Resolved (2026-05-24):** Changed Source href from `https://thock.xyz/trends/tracker` to `https://thock.xyz/trends/tracker/2026-W19` so readers land on the historical W19 snapshot where split/ergo at +32 direction up is preserved. W21 shows direction flat at +34 — anchoring to W19 removes the contradiction. Removed "live " adjective before the Source tag (the link now points to a snapshot, not the live tracker). updatedAt bumped from null to 2026-05-24. 667 e2e green. `c0abfcd`

### [x] [copy] [4.5] gmk-cyl-prussian-alert — W19 tracker citation (+38) links to live tracker (W21 shows +54) — addressed in 9d0b1c5, closes #203
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (live buy article through 2026-06-12; line 53 cites W19 score +38 "in the week before the buy opened" but href /trends/tracker resolves to W21 where Prussian Alert scores +54 — score mismatch for active buyers)
- ease: 9 (one href change + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #203
> **Resolved (2026-05-24):** Changed `[/trends/tracker](/trends/tracker)` → `[2026-W19 Trends Tracker](/trends/tracker/2026-W19)` so readers land on the historical W19 snapshot where Prussian Alert at +38 is preserved. W21 shows Prussian Alert at +54 — anchoring to W19 removes the contradiction. updatedAt bumped to 2026-05-24. 667 e2e green. `9d0b1c5`

### [x] [copy] [4.5] dcs-olivetti-comeback — W19 tracker citation links to live tracker (W21); DCS Olivetti not present in W21 — addressed in ce7a88f, closes #202
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (trends article whose core claim is built on W19 data; readers clicking the tracker link see W21 where DCS Olivetti does not appear — direct factual contradiction of the article's "+18 direction up in W19" claim)
- ease: 9 (one href change + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #202
> **Resolved (2026-05-24):** Changed `[Trends Tracker](/trends/tracker)` → `[Trends Tracker](/trends/tracker/2026-W19)` so the W19 citation resolves to the archived snapshot where DCS Olivetti at +18 is preserved. W21 no longer has a DCS Olivetti row (replaced by DCS Grass Valley). updatedAt bumped to 2026-05-24. 667 e2e green. `ce7a88f`

### [x] [copy] [4.5] cherry-mx2a-revision — "the live Trends Tracker" cites W19-era scores (−22/−14) that now differ from W21 (−28/−20) — addressed in 073d4de
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (deep-dives article read by Cherry-switch researchers; live tracker link now shows W21 scores −28/−20 while article claimed −22/−14; contradiction between article body and the page it links to)
- ease: 9 (href update + past-tense rewrite + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-24T00:00:00Z]
> **Resolved (2026-05-24):** Changed `href="/trends/tracker"` → `href="/trends/tracker/2026-W19"` so readers land on the historical W19 snapshot matching the cited scores. Rewrote "the live Trends Tracker has the MX2A line slipping at score −22 and Cherry-as-a-brand at −14" → "the 2026-W19 Trends Tracker snapshot pegged the MX2A line at score −22 and Cherry-as-a-brand at −14 — a slide that has continued since". Past-tense phrasing is stable regardless of future tracker updates. updatedAt bumped to 2026-05-24. 667 e2e green. `073d4de`

## Drained findings (kept for audit-trail; do not re-open)

### [x] Brand-assets-first posture — drain pass complete
> Filed 2026-05-09T12:30Z by `/oversight` after six page-family
> phases shipped on top of unshipped brand assets. Drained
> 2026-05-09 in three commits: `0dab0a8` (per-pillar OG
> handlers + shared `<PillarOGContent>` template), `0e7c9fd`
> (favicon set + six seed-article hero SVGs + frontmatter
> wiring + heroImage schema fix), and the same drain commit
> that updated `skills/iterate.md` to bundle hero rendering
> into new content shipping going forward. Phase 15+ unblocked.

### [x] [HIGH] Verification gap — `pnpm verify` doesn't exercise the production runtime
> Filed 2026-05-08 by `/oversight`. Drained by phase 4b
> (`d0147cc` + `1b3944c`): replaced the lambda's filesystem
> walk with a pre-built data manifest, added `pnpm
> deploy:smoke` post-push gate, migrated host to Vercel.
> Production probes 2xx across 10 patterns. Marked drained on
> 2026-05-09T12:30Z during oversight pass.

### [x] [copy] [3.6] alice-layout-decline — W19 tracker body citation unlinked (no hyperlink to archived snapshot) — addressed in b9c9bfc, closes #217
- category: copy
- filed: 2026-05-25 by cloud /iterate audit
- impact: 4 (trends article; body says "down 18 percent on the W19 tracker" without linking to the archived /trends/tracker/2026-W19 snapshot; split-ergo-cohort, dcs-olivetti-comeback, and hmx-cloud-deep-dive all link their W19 citations; alice-layout-decline was the only W19-citing trends article with an unlinked body mention)
- ease: 9 (one markdown hyperlink addition + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #217
> **Resolved (2026-05-25):** Changed "the W19 tracker" → "[W19 tracker snapshot](/trends/tracker/2026-W19)" in alice-layout-decline.mdx body at line 38. Readers can now verify the -18 score directly from the body sentence. updatedAt bumped to 2026-05-25. 670 e2e green. `b9c9bfc`

## Open findings

### [x] [fix] [3.5] /group-buys: announced buy past startDate never promotes to live section — addressed in 72d7e9d, closes #239
- category: fix
- filed: 2026-05-31 by cloud /iterate audit
- impact: 5 (cannonkeys-mode-sonnet-r2 opens 2026-06-01; without fix, /group-buys would show "1 announced" indefinitely instead of routing the started buy to the live section; readers land on an open buy listed under "Announced")
- ease: 7 (helpers.ts: extend isLive/isAnnounced/isEnded + partitionGroupBuys signature; 2 new unit tests)
- score: 3.5 (impact × ease / 10)
- issue: #239
> **Resolved (2026-05-31):** Extended `isLive()` to match `status==='announced' && startDate <= today`; updated `isAnnounced()` to only match future-announced buys (`startDate > today`); added `announced + past endDate → ended` case to `isEnded()`. `partitionGroupBuys` passes `today` to the updated `isAnnounced` signature. 2 new unit tests: announced-past-startDate routes to live; announced-past-endDate routes to ended. Existing test updated (ann fixture now has future startDate). 682 e2e green. `72d7e9d`

### [x] [content] [3.6] stabilizer-servicing-guide — missing stabilizers and lubing tags despite being explicitly about both — addressed in f3acf43, closes #236
- category: content
- filed: 2026-05-31 by cloud /iterate audit
- impact: 4 (stabilizer-servicing-guide is about stabilizer lubing; /tag/stabilizers and /tag/lubing each show only 1 article (stabilizers-explained) and omit this servicing guide; a reader who finds stabilizers-explained and clicks #stabilizers will not find the companion servicing piece)
- ease: 9 (frontmatter tag array edit + updatedAt bump; no schema change, no new files)
- score: 3.6 (impact × ease / 10)
- issue: #236
> **Resolved (2026-05-31):** Added `stabilizers` and `lubing` to tags array in stabilizer-servicing-guide.mdx. Tags updated from [modding, beginner, linear] to [modding, beginner, linear, stabilizers, lubing]. /tag/stabilizers and /tag/lubing each now show 2 articles. updatedAt bumped to 2026-05-31. 682 e2e green. `f3acf43`

### [x] [copy] [4.0] gmk-cyl-king-of-the-seas-group-buy — body prose present-tense stale after May 31 close — addressed in this commit
- category: copy
- filed: 2026-05-31 by cloud /iterate audit
- impact: 5 (intro paragraph "is live at KBDfans" is the first sentence readers see; "is the one already live" in the CYL ecosystem section and future conditionals in "What we're watching" all refer to the 2026-05-31 close as a future event; the previous fix 3b47199 addressed only the Buying Notes section)
- ease: 8 (targeted past-tense rewrites across 4 sentences in one article; no schema changes, no new files; updatedAt already 2026-05-31 from prior fix)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-31T07:32:00Z]
> **Resolved (2026-05-31):** Past-tense four body sentences that referred to the buy's live status or its close as a future event. (1) Intro: "is live at KBDfans. … runs through 2026-05-31 … The buy ships" → "ran at KBDfans from 2026-04-28 through 2026-05-31 … The buy shipped". (2) Narrative: "is the one already live" → "was already open when the other two launched". (3) Watching section: "If both Sovereign and Mutation clear inside the 2026-05-31 close … If only one clears" → "Whether both Sovereign and Mutation cleared the 2026-05-31 window … A two-palette clear … a single-palette result". (4) Closing: "closes 2026-05-31" → "closed 2026-05-31". 682 e2e green.

### [x] [data] [3.6] GMK CYL King of the Seas status stale — endDate 2026-05-31 passed, still marked live — addressed in f6f5a2b, closes #233
- category: data
- filed: 2026-05-31 by cloud /iterate audit
- impact: 4 (source-of-truth status field wrong; buy window closed today; renderer-side guard absorbs label leak on /group-buys, but /group-buys/past archive selection, JSON-LD, RSS, and any downstream consumer all see stale field)
- ease: 9 (one JSON field flip + loader test update; same pattern as Sweet Nightmare `3443fe9`, GREG 2 `9ab3c45`)
- score: 3.6 (impact × ease / 10)
- issue: #233
> **Resolved (2026-05-31):** Flipped `status` from `"live"` to `"closed"` and bumped `updatedAt` to 2026-05-31T00:00:00.000Z on `data/group-buys/kbdfans-gmk-cyl-king-of-the-seas.json`. Updated `packages/data` group-buys loader test: migrated the "includes live buy in active list" assertion from King of the Seas (now closed) to Prussian Alert (window 2026-05-15→2026-06-12, tested at 2026-05-20). Manifest + search index refreshed by data:validate step. 682 e2e green. `f6f5a2b`

### [x] [copy] [3.6] gmk-cyl-king-of-the-seas-group-buy — stale /group-buys link and "current window" phrasing after May 31 close — addressed in 3b47199, closes #234
- category: copy
- filed: 2026-05-31 by cloud /iterate audit
- impact: 4 (closed buy article; "the current window" phrasing and live /group-buys link misdirect readers who arrive post-close; same pattern as GREG 2 `459e252` and Nyawice `0bcbb47`)
- ease: 9 (single sentence edit + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #234
> **Resolved (2026-05-31):** Changed "Full configurator and the current window are at KBDfans's product page. The live entry alongside the rest of the open buys sits on /group-buys" → "Full configurator details are at KBDfans's product page. The archived entry is at /group-buys/past." Bumped updatedAt to 2026-05-31. 682 e2e green. `3b47199`

### [x] [copy] [3.5] gsk-sweet-nightmare-group-buy — stale "not yet in" uncertainty paragraph after May 11 close — addressed in 9cfab0a, closes #222
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 5 (news article for a buy closed 2026-05-11; line 53 "The editorial answer is not yet in" / "Neither reading is available yet" — stale present-tense uncertainty for a 15-day-old close; previous fix 84885e7 addressed closing-section phrases but missed this paragraph)
- ease: 7 (rewrite one paragraph to past-tense framing; updatedAt bump)
- score: 3.5 (impact × ease / 10)
- issue: #222
> **Resolved (2026-05-26):** Rewrote line 53 from "The editorial answer is not yet in... Neither reading is available yet." to past-tense framing: "The editorial answer was not available at close — variant-level sell-through data is not published for artisan resin runs." Preserves the two-reading analytical framework in conditional past tense. updatedAt bumped to 2026-05-26. 670 e2e green. `9cfab0a`

### [x] [test] [3.6] language gate: tracker-href-bare-week pattern missing — W-anchored links to bare /trends/tracker go undetected — addressed in 6fd79fb, closes #219
- category: test
- filed: 2026-05-25 by cloud /iterate audit
- impact: 4 (12+ articles required manual fixup where markdown links with ISO week references in their text pointed to the bare /trends/tracker URL instead of the archived snapshot; the gate has no pattern to prevent recurrence in future /ship-content articles)
- ease: 9 (one JSON entry in article-language-patterns.json + 2 unit tests; no code or content change)
- score: 3.6 (impact × ease / 10)
- issue: #219
> **Resolved (2026-05-25):** Added tracker-href-bare-week regex pattern to scripts/article-language-patterns.json: matches `\[[^\]]*\b(?:W\d{2}|\d{4}-W\d{2})\b[^\]]*\]\(/trends/tracker\)` — markdown links with an ISO week reference in their text pointing to the bare /trends/tracker URL. Carve-out: "Follow the [Trends Tracker](/trends/tracker)" directives contain no week reference and are not flagged. Added 2 unit tests: positive ([W19 Trends Tracker](/trends/tracker) → flagged) + negative (CTA form → clean). Corpus scan confirms clean. Test count: 33 → 35. 670 e2e green. `6fd79fb`

### [x] [copy] [4.0] trends-tracker-preview — "A current example" uses present-tense verbs for W19 snapshot data now 3 weeks stale — addressed in cc7192e
- category: copy
- filed: 2026-05-25 by cloud /iterate audit
- impact: 5 (canonical tracker methodology explainer linked from /about; "sits at +42", "reads -18", "is holding flat" etc describe W19 values that have diverged in W22: Oil King 41, Mode Designs 37, Wuque Studio 17, Alice −26 vs article's −18)
- ease: 8 (paragraph rewrite: "A current example" → "A worked example"; present → past tense; add W19 archive link; update InlineViz alt text; bump updatedAt)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-25T00:00:00Z]
> **Resolved (2026-05-25):** Changed "A current example" → "A worked example". Past-tense all verbs in the example paragraph (sat, read, held, was up at, was flat at). Added archive link: "In the [2026-W19 snapshot](/trends/tracker/2026-W19)". Removed "live" from InlineViz alt text ("live W19 Gateron Oil King row" → "2026-W19 Gateron Oil King row"). updatedAt bumped to 2026-05-25. 670 e2e green. `cc7192e`

### [x] [copy] [4.5] zmk-mainstream-shift — bare /trends/tracker link in "had the ZMK row sloping up" clause; W22 tracker has no ZMK row — addressed in this commit, closes #216
- category: copy
- filed: 2026-05-25 by cloud /iterate audit
- impact: 5 (reader following link sees no ZMK row on the W22 tracker — direct contradiction of "ZMK row sloping up"; ZMK tracker row pre-dates our W19 archive and is absent from all current snapshots W19–W22)
- ease: 9 (remove href, past-tense "had" framing already correct; bump updatedAt)
- score: 4.5 (impact × ease / 10)
- issue: #216
> **Resolved (2026-05-25):** Removed href from "[Trends Tracker](/trends/tracker)" → "thock Trends Tracker" in zmk-mainstream-shift.mdx line 211. The ZMK tracker row existed pre-W19 and is not present in any snapshot W19–W22; the bare href took readers to W22 where no ZMK row exists, directly contradicting the "ZMK row sloping up" claim. Past-tense "had" already scopes the observation to publication era; removing the broken href stops the contradiction without changing the editorial content. updatedAt bumped to 2026-05-25. 670 e2e green.

### [x] [copy] [5.4] acoustic-spec-rise — closing sentence "tracker will watch" escapes language gate via markdown-link form — addressed in 7caff73
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 6 (trends article; unfulfillable forward-looking promise — static MDX cannot speak for what the tracker will do next; the tracker-will pattern in article-language-patterns.json does not catch "[Trends Tracker](...) will" because the markdown link brackets break the substring match; same anti-pattern class as prior tracker-will fixes this session window)
- ease: 9 (single sentence rewrite: "will watch which lever" → "Follow…to see which lever"; updatedAt bump)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-24T00:00:00Z]
> **Resolved (2026-05-24):** Rewrote closing sentence "The [Trends Tracker](/trends/tracker) will watch which lever the industry picks up next." → "Follow the [Trends Tracker](/trends/tracker) to see which lever the industry picks up next." Removes the unfulfillable forward-looking promise while preserving the reader-directive intent. Language gate blind spot noted: tracker-will pattern does not match when "Tracker" is inside a markdown link — the ] bracket breaks the substring match; a future iterate tick should add a regex pattern to close the gap. updatedAt bumped to 2026-05-24. 667 e2e green. `7caff73`

### [x] [copy] [4.5] vendor-first-customs — 3 "W19 tracker row" links resolve to live tracker instead of /trends/tracker/2026-W19 — addressed in 806239c, closes #201
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 5 (3 explicitly W19-labeled anchors send readers to the live tracker which now shows W21 data; article body cites W19-specific scores +24/+18/+14 which differ from W21 values)
- ease: 9 (3 URL substitutions in one MDX file; /trends/tracker/2026-W19 is pre-rendered by Phase 27 generateStaticParams)
- score: 4.5 (impact × ease / 10)
- issue: #201
> **Resolved (2026-05-23):** Changed all 3 `/trends/tracker` hrefs to `/trends/tracker/2026-W19` in `vendor-first-customs.mdx` (lines 80, 95, 136). Readers clicking "W19 tracker row" links now land on the historical W19 snapshot instead of the current W21 tracker. 667 e2e green. `806239c`

### [x] [copy] [4.5] gmk-cyl-prussian-alert — "this week's tracker board at +38" stale; article published W19 (May 10), buy opened May 15, current W21 score is 54 — addressed in 97340c0, closes #186
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 5 (live buy article until 2026-06-12; readers checking the article for buy intelligence see "+38" as the current tracker score when the actual W21 score is 54; "this week's" implies present-tense currency when the article is 3 weeks old; the InlineViz alt text on the same page correctly labels the same number as "W19 trends tracker" — the body text contradicts its own infographic)
- ease: 9 (one sentence rewrite — past-tense "was tracking at +38 … in the week before the buy opened" removes both the stale time reference and the stale score claim)
- score: 4.5 (impact × ease / 10)
- action: change "sits on this week's [/trends/tracker](/trends/tracker) board at +38, direction up" → "was tracking at +38 on the [/trends/tracker](/trends/tracker) in the week before the buy opened, direction up"; bump updatedAt to 2026-05-23
- issue: #186
> **Resolved (2026-05-23):** Changed "sits on this week's [/trends/tracker] board at +38, direction up" → "was tracking at +38 on the [/trends/tracker] in the week before the buy opened, direction up". Past-tense phrasing frames the +38 as pre-open IC signal, not the current tracker score (W21 shows 54). Aligns with the InlineViz alt text on the same page which correctly labels the figure as "W19 trends tracker". updatedAt bumped to 2026-05-23. 664 e2e green. `97340c0`

### [x] [copy] [3.6] gmk-cyl-ishtar-r2-group-buy — 'is set to open' stale for Prussian Alert (opened 2026-05-15) — addressed in eb03e27, closes #185
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 4 (Ishtar R2 is a closed buy so traffic is lower than live-buy articles; stale forward-looking language for a companion buy that has been live for 8 days creates a factual inaccuracy for readers following the GMK CYL ecosystem)
- ease: 9 (single sentence rewrite + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #185
> **Resolved (2026-05-23):** Changed "is set to open at KBDfans on 2026-05-15" → "opened at KBDfans on 2026-05-15 and runs through 2026-06-12". Pattern matches gmk-cyl-king-of-the-seas (line 38 already correctly read "opened on 2026-05-15"). updatedAt bumped to 2026-05-23. 664 e2e green. `eb03e27`

### [x] [copy] [3.6] gmk-cyl-ishtar-r2-group-buy — closed buy buying-notes links to /group-buys (active) instead of /group-buys/past (archive) — addressed in 2705750, closes #184
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (closed buy article misdirects readers to active buys page; same /group-buys → /group-buys/past pattern fixed on Sweet Nightmare `3443fe9` and Nyawice `0bcbb47`)
- ease: 9 (single sentence edit + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #184
> **Resolved (2026-05-22):** "The live entries for buys still inside their windows sit on /group-buys" → "The archived entry is at /group-buys/past. Ishtar R2 closed 2026-05-10." updatedAt bumped to 2026-05-22. 664 e2e green. `2705750`

### [x] [copy] [3.6] gmk-cyl-greg-2-group-buy closing sentence: "We will revisit when the order numbers settle" is unfulfillable on a static MDX — addressed in 6fba00d, closes #180
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (live group buy closing 2026-05-29; same unfulfillable-promise pattern as #179 ramune fixed in 75ad5a0; a static MDX cannot revisit post-close data)
- ease: 9 (single sentence rewrite — last line of the article)
- score: 3.6 (impact × ease / 10)
- action: replace "GREG R2 closes 2026-05-29. We will revisit when the order numbers settle." with "GREG R2 closes 2026-05-29. Follow the [trends tracker](/trends/tracker) for post-close movement data."
- issue: #180
> **Resolved (2026-05-22):** Replaced closing sentence with tracker link. updatedAt bumped to 2026-05-22. 664 e2e green. `6fba00d`

### [x] [a11y] [4.8] /quiz/switch missing from axe desktop a11y suite — interactive ARIA surface never hardened by Phase B gate — addressed in 6868728, closes #170
- category: a11y
- filed: 2026-05-21 by cloud /iterate audit
- impact: 6 (/quiz/switch is the most complex ARIA surface on the site: role="progressbar", role="group", aria-pressed on option buttons; ships in phase 33; absent from the Phase B axe gate that hardens 8 other canonical pages)
- ease: 8 (add one runAxe(page, '/quiz/switch') test to the desktop suite — exact same copy-paste pattern as the /parts gap fix in 00da541)
- score: 4.8 (impact × ease / 10)
- action: add test('switch quiz (/quiz/switch)', ...) to the desktop suite; update count comment to 9 pages
- issue: #170
> **Resolved (2026-05-21):** Added `runAxe(page, '/quiz/switch')` to the Phase B desktop a11y suite as the 9th test. Desktop suite now covers 9 canonical pages. Gate passes green — quiz ARIA (role="progressbar", role="group", aria-pressed) is well-formed; all text uses text-text-2 which is Phase B-verified contrast-compliant. 662 e2e green (+1). `6868728`

### [x] [seo] [5.6] /part/[kind] BreadcrumbList missing /parts intermediate node; detail page has /part (404 path) — addressed in 825d30b, closes #171
- category: seo
- filed: 2026-05-21 by cloud /iterate audit
- impact: 7 (BreadcrumbList on all 3 kind-index pages omits the /parts landing — chain is Home → Switches instead of Home → Parts → Switches; detail page BreadcrumbList has { path: '/part' } which is a 404 URL, visible to search engines in JSON-LD rich results; phase 35 brief explicitly calls out the discovery triangle but the back-edge is broken — kind-index says ← home not ← all parts)
- ease: 8 (2-line change per file: add '/parts' to BreadcrumbList in kind-index + fix '/part' → '/parts' in detail; update back-link href+text in kind-index; add 1 e2e test)
- score: 5.6 (impact × ease / 10)
- action: (1) kind-index: add { name: 'Parts', path: '/parts' } to BreadcrumbList; update back-link to href="/parts" / ← all parts; (2) detail: change path: '/part' → path: '/parts'; (3) e2e: assert part-kind-back-link href="/parts"
- issue: #171

### [x] [content] [3.0] gmk-cyl-prussian-alert — ~470 prose words, well below 600-word quality threshold — addressed in f929776 (closes #172)
- category: content
- filed: 2026-05-22 by cloud /iterate audit
- impact: 5 (live group buy through 2026-06-12; article is the thinnest in the corpus; other GMK CYL companions range 1073–1309 prose words; thin content undersells a high-momentum buy)
- ease: 6 (content-curator expansion of existing article; no new components, data records, or schema changes)
- score: 3.0 (impact × ease / 10)
- issue: #172
- pages: /article/gmk-cyl-prussian-alert
- root cause: article was shipped as a lean news announcement covering timing, palette, and tracker signal, but omitted kit structure details, pricing context, and buying guidance that a reader considering the live buy needs
> **Resolved (2026-05-22):** Expanded "What's in the run" with kit structure (base/modifier/novelties/deskmat pattern, KBDfans as authoritative source for exact counts), pricing context ($110–155 USD base kit range; fully-kitted $165–240 territory), and colorway resale-value analysis. Expanded "Timing" with international shipping context (EU buyers: 20–25% import overhead without proxy), and production timeline (~9–12 months from GB close; Q1–Q2 2027 delivery window). Article now at ~700+ prose words. updatedAt bumped to 2026-05-22. 663 e2e green. `f929776`

### [x] [copy] [3.6] gmk-cyl-prussian-alert — "We will revisit when the GB closes" unfulfillable closer — addressed in f98048f, closes #181
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (live GB through 2026-06-12; same unfulfillable-promise pattern as #179 ramune fixed in 75ad5a0 and #180 greg-2 fixed in 6fba00d; static MDX cannot revisit post-close data)
- ease: 9 (single sentence rewrite — last line of the article body)
- score: 3.6 (impact × ease / 10)
- issue: #181
> **Resolved (2026-05-22):** Replaced "We will revisit when the GB closes and the order numbers settle." with "Follow the [trends tracker](/trends/tracker) for post-close movement data." updatedAt already 2026-05-22 from f929776. 664 e2e green. `f98048f`

### [x] [copy] [3.6] gmk-cyl-king-of-the-seas closing sentence: "will pick up the close-week signal" is unfulfillable on a static MDX — addressed in c25c1f0, closes #182
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (live group buy closing 2026-05-31; same unfulfillable-promise pattern as #179 ramune fixed in 75ad5a0, #180 greg-2 fixed in 6fba00d, #181 prussian-alert fixed in f98048f; the tracker records weekly community-wide signals, not close-week analysis for specific GBs)
- ease: 9 (single sentence rewrite — last line of the article)
- score: 3.6 (impact × ease / 10)
- action: replace "King of the Seas closes 2026-05-31. The [trends tracker](/trends/tracker) will pick up the close-week signal when the order numbers settle." with "King of the Seas closes 2026-05-31. Follow the [trends tracker](/trends/tracker) for post-close movement data."
- issue: #182
> **Resolved (2026-05-22):** Replaced closing sentence with tracker link. updatedAt bumped to 2026-05-22. 664 e2e green. `c25c1f0`

### [x] [ci] [4.8] Lighthouse CI workflow audits the SSO-protected per-deployment URL — every run fails, the gate produces zero signal — addressed in this commit (closes #190, #165)
- issue: #190
> **Resolved (2026-05-23):** `.github/workflows/lighthouse.yml` `urls:` swapped from `${{ github.event.deployment_status.target_url }}` (SSO-gated per-deployment hostname → 307 to vercel.com/login) to the public canonical alias `https://thock.xyz` for all four audited paths. Production-success `deployment_status` trigger preserved — only the audited URL changes. Detailed comment block added in-file referencing this AUDIT row. Pushed via local user session (cloud loop blocked on `workflow` PAT scope).

### [x] [copy] [3.6] building-mode-sonnet — unfulfillable 'report back' promise + stale R2 pointer — addressed in 9055ece (closes #191)
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 4 (ideas-pillar featured article; same unfulfillable-promise pattern fixed in previous ticks; stale vendor-page pointer misses published R2 coverage)
- ease: 9 (2 sentence rewrites + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #191
> **Resolved (2026-05-23):** Removed "We'll report back if that swap happens." — rewritten to state hypothesis without forward commitment. Updated "keep an eye on the Mode Designs Sonnet page" to link directly to /article/mode-sonnet-r2-group-buy-coverage (R2 announced 2026-06-01). updatedAt bumped to 2026-05-23. 664 e2e green. `9055ece`

### [x] [copy] [3.6] cannonkeys-nyawice-group-buy — stale 'current window' and unfulfillable closer (buy closed 2026-05-17) — addressed in 0bcbb47
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (closed buy article; "current window" in Source link and "/group-buys" link stale; "Thock will report back when builds begin shipping" unfulfillable — same pattern as Ramune/Prussian Alert/GREG 2/King of the Seas)
- ease: 9 (3 sentence rewrites + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-22T21:37:00Z]
> **Resolved (2026-05-22):** "the current window" → "build details"; "/group-buys" → "/group-buys/past" (buy is in archive). Closing sentence "Thock will report back when builds begin shipping." → "Follow the trends tracker for post-fulfillment movement data." updatedAt bumped to 2026-05-22. 664 e2e green. `0bcbb47`
- category: ci
- filed: 2026-05-21 by /oversight
- impact: 6 (the Lighthouse gate has never once passed: dormant while it filtered to Preview, then red on every run since `48adce0` switched it to gate Production. The perf / a11y / SEO regression signal phases #84/#85 shipped it for is entirely lost, and a permanent red ✘ on the Actions tab trains everyone to ignore CI status)
- ease: 8 (one-file change to `.github/workflows/lighthouse.yml` — swap the audited base URL; no app/package code)
- score: 4.8 (impact × ease / 10)
- root cause: `.github/workflows/lighthouse.yml` sets `urls:` from `${{ github.event.deployment_status.target_url }}`, which is Vercel's immutable per-deployment hostname (e.g. `https://thock-hig8pokji-funkycoffee.vercel.app`). That hostname has Vercel Deployment Protection (Authentication / SSO) enabled, so Lighthouse follows a 307 to `https://vercel.com/login?next=…` and audits Vercel's login page — which fails `categories.accessibility`, `categories.best-practices`, `categories.seo`, `color-contrast`, and ~12 other assertions. The page under test is never thock.
- evidence: run 26217540757 (2026-05-21T09:26Z) and every prior run — `##[error]21 results for https://vercel.com/login?next=%2Fsso-api%3Furl%3D…thock-hig8pokji-funkycoffee.vercel.app…`. The `march` workflow and `pnpm deploy:check` are unaffected and green — this is isolated to the Lighthouse workflow.
- why the loop was blind to it: `/iterate` audit and `/march` read Vercel `deploy:check` + `plan/AUDIT.md` / `CRITIQUE.md` only; a failing non-`march` GitHub Actions workflow is invisible to autonomous ticks. This row is the bridge — without it the workflow stays red indefinitely.
- action: change `lighthouse.yml` `urls:` to audit the public production alias `https://thock.xyz` (the canonical `siteConfig.siteUrl`, not SSO-protected) instead of `target_url` — hardcode the four paths (`/`, `/article/gateron-oil-king-deep-dive`, `/trends/tracker`, `/group-buys`) against that base. Keep the `deployment_status` Production-success trigger as the run signal; only the audited URL changes. Fallback host `thock-coral.vercel.app` also resolves public if `thock.xyz` is unsuitable. (Alternative: disable Vercel Deployment Protection for the project — an out-of-repo dashboard setting; the canonical-alias fix is in-repo and preferred.)
- once fixed: the run page should show real category scores. If the genuine site then fails an assertion, that is a separate, real audit row.
- issue: #165
- blocker: cloud loop cannot push `.github/workflows/` files — ACTIONS_PAT needs `workflow` scope (classic PAT) or `workflows: write` permission (fine-grained). The fix is one line in lighthouse.yml (confirmed correct; soft-reset after push rejected on 2026-05-21 cloud tick). Drain requires a local push or ACTIONS_PAT scope upgrade.

### [x] [copy] [3.2] gmk-cyl-ramune-group-buy — 'approximately 2026-06-20' imprecise; stale forward-looking closer — addressed in 75ad5a0, closes #179
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (live buy article visited by active buyers; 'approximately' is inaccurate since kbdfans-gmk-cyl-ramune.json has endDate: 2026-06-20 exactly; 'We will revisit when the numbers land' is an unfulfillable editorial promise on a static MDX article)
- ease: 8 (6 text substitutions: 3 body occurrences + 1 SVG alt text + 1 'around June 20' precision fix + closing sentence rewrite)
- score: 3.2 (impact × ease / 10)
- action: remove 'approximately ' from all date references; replace closing with tracker link; bump updatedAt
- issue: #179
> **Resolved (2026-05-22):** Removed 'approximately' from 3 body occurrences of '2026-06-20' and 1 InlineViz alt text. Fixed 'closes around June 20' → 'closes on 2026-06-20' in 'What we're watching'. Replaced 'Ramune closes approximately 2026-06-20. We will revisit when the numbers land.' with 'Ramune closes 2026-06-20. Follow the trends tracker for post-close movement data.' updatedAt bumped to 2026-05-22. 664 e2e green. `75ad5a0`

### [x] [copy] [3.6] home GroupBuysWidget kicker says "ending soon" — /group-buys page uses "Closing soon" for the same urgency band
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (affects / and /group-buys — two surfaces describing the same urgency band with different vocabulary)
- ease: 9 (single string change in one file)
- score: 3.6 (impact × ease / 10)
- evidence: `apps/web/src/components/home/GroupBuysWidget.tsx:64` uses `'group buys · ending soon'`; `apps/web/src/app/group-buys/page.tsx:118` uses `title="Closing soon"`. Widget heading on line 66 already says "Don't miss the close", making "ending soon" the odd-one-out.
- action: change GroupBuysWidget.tsx kicker from `'group buys · ending soon'` to `'group buys · closing soon'`
- issue: #176
> **Resolved (2026-05-22):** Kicker string changed from 'ending soon' to 'closing soon'; test updated. 664 e2e green. `00602dd`

### [x] [copy] [4.5] trends-tracker-preview says "updated every Friday" — tracker updates on Mondays since Phase 31 — addressed in 0975c4b, closes #175
- category: copy
- filed: 2026-05-22 by cloud /iterate audit
- impact: 5 (the "Reading the Trends Tracker" explainer at /article/trends-tracker-preview is linked from /about and is the canonical reference for how the tracker works; both the lede and the body claim Friday updates, but Phase 31's Monday-gate writes each snapshot on Monday and all three existing snapshots have Monday publishedAt timestamps — a reader checking the tracker expecting Friday updates will be confused when new data appears Monday instead; the closing sentence also promises "Watch 2026-W20 for the first annotated rows" — W20 and W21 have notes on every row, so the forward-looking promise is stale)
- ease: 9 (two word substitutions + one closing-sentence rewrite + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- action: (1) lede: "updated every Friday" → "updated each Monday"; (2) line 19: "updates each Friday at 08:00 UTC" → "updates each Monday morning"; (3) line 67: replace "Watch 2026-W20 for the first annotated rows" with a current-state note that per-row editorial notes are now live across all snapshots; (4) bump updatedAt to 2026-05-22
- issue: #175
> **Resolved (2026-05-22):** Lede "updated every Friday" → "updated each Monday". Body sentence "updates each Friday at 08:00 UTC" → "updates each Monday morning". Closing paragraph replaced: stale "Watch 2026-W20 for the first annotated rows" promise → "Every row now carries an editorial note explaining why it moved." updatedAt bumped to 2026-05-22. 664 e2e green. `0975c4b`

### [x] [ux] [4.0] /parts landing has no home-page or nav entry point — addressed in f097dba, closes #174
- category: ux
- filed: 2026-05-22 by cloud /iterate audit
- impact: 5 (/parts catalogs 48 parts across 3 kinds; shipped in phase 35 but had zero home-page or global-nav visibility — only reachable via quiz results or /part/[kind] back-links)
- ease: 8 (extend existing "Switch recommender CTA" paragraph on home page to also link /parts; add 1 e2e guard)
- score: 4.0 (impact × ease / 10)
- issue: #174
> **Resolved (2026-05-22):** Extended the home-page "Switch recommender CTA" paragraph (`page.tsx`) to include a "browse the parts catalog" link pointing to `/parts`, giving the phase-35 surface a direct home-page entry point. Added `data-testid="home-cta-strip"` on the container; new e2e assertion in `home.spec.ts` verifies the `/parts` link is visible and href-correct. 664 e2e green (+1). `f097dba`

### [x] [a11y] [4.0] /parts missing from axe desktop suite — addressed in 00da541, closes #169
- category: a11y
- filed: 2026-05-21 by cloud /iterate audit
- impact: 5 (/parts is the only Phase 28–35 route with zero axe coverage under the WCAG 2.1 AA hard gate)
- ease: 8 (add one runAxe test case to the Phase 32 desktop suite — copy-paste pattern)
- score: 4.0 (impact × ease / 10)
- issue: #169
> **Resolved (2026-05-21):** Added `runAxe(page, '/parts')` to the Phase 32 desktop a11y suite in `apps/e2e/tests/a11y.spec.ts`. Desktop suite now covers 8 canonical pages. 661 e2e green. `00da541`

### [x] [copy] [3.6] mode-sonnet-r2 article callout promises /group-buys entry that doesn't exist — addressed in adc0bf5
- category: copy
- filed: 2026-05-21 by cloud /iterate audit
- impact: 4 (readers following the update callout to /group-buys won't find the Mode Sonnet R2 entry; the callout directed readers to "the live entry on /group-buys for the current window" but the fictional cannonkeys-mode-sonnet-r2 record was deleted in Phase 18 and never re-added as a real record)
- ease: 9 (one sentence removal in the callout on line 21 of mode-sonnet-r2-group-buy-coverage.mdx)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-21T00:00:00Z]
> **Resolved (2026-05-21):** Removed "See the live entry on /group-buys for the current window." from the update callout. The callout still states the updated window dates (2026-06-01 through 2026-07-15) and notes the body is preserved as the published 2026-05-06 record — readers have the information without a broken /group-buys promise. 611 e2e green. `adc0bf5`

### [x] [seo] [3.5] sitemap lists 7 orphaned tags with no articles (thin-content pages indexed by crawlers) — addressed in e3a2fcb (closes #153)
- category: seo
- filed: 2026-05-19 by cloud /iterate audit
- impact: 5 (7 tags — `60`, `full`, `novelkeys`, `ortho`, `sa`, `tkl`, `wuque` — listed in sitemap with priority 0.5; crawlers discover and index these empty /tag/<slug> pages; the /tags browse surface was already filtered in 34924c8 but the sitemap was not; thin-content dilutes site quality signal)
- ease: 7 (sitemap.ts: 2-line change adding getArticlesByTag filter; canonical-urls.ts: helper to derive article-covered tag slugs from frontmatter scan; sitemap.test.ts: split test to cover both positive and negative cases)
- score: 3.5 (impact × ease / 10)
- issue: #153
> **Resolved (2026-05-19):** `sitemap.ts` now filters `getAllTags()` by `getArticlesByTag(t.slug).length > 0` — 61 tag entries instead of 68. `canonical-urls.ts` `listTagSlugs()` gains a `getTagSlugsUsedInArticles()` helper that scans article MDX frontmatter for used tags, filtering out orphaned slugs from the smoke walker and `meta.spec.ts` sitemap test. `sitemap.test.ts` split into two assertions: covered tags must be present; orphaned tags must be absent. 482 unit tests, 608 e2e green. `e3a2fcb`

### [x] [test] [4.0] validateAll() in @thock/data/validate has no unit tests — addressed in 352f365 (closes #142)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 5 (validateAll() is the integration layer combining walkAll() + checkCrossRefs() into the ValidationResult used by `pnpm data:validate`; the synthetic-input path exists specifically for testing but was untested; counts aggregation and ok-flag computation were uncovered)
- ease: 8 (synthetic-input path already wired; fixtures reusable from crossrefs.test.ts)
- score: 4.0 (impact × ease / 10)
- issue: #142

### [x] [data] [5.4] W21 tracker — Hall Effect / Rapid Trigger and HMX Cloud V2 lack articleSlug linkage; W20 DCS Olivetti unlinked despite companion article shipping — addressed in ba14cc7
- category: data
- filed: 2026-05-17 by cloud /iterate audit
- impact: 6 (W21's top-2 highest-scoring non-flat rows unlinked: Hall Effect / Rapid Trigger score=55 and HMX Cloud V2 score=44; tracker is the site's signature feature; Rule 2 14-day window opens 2026-05-18 for W21; W20 DCS Olivetti can also be linked to dcs-olivetti-comeback shipped 2026-05-17)
- ease: 9 (3 JSON field updates across 2 tracker files; manifest rebuilds via pnpm verify)
- score: 5.4 (impact × ease / 10)
- matches: Hall Effect / Rapid Trigger (W21) → `hall-effect-mainstream`; HMX Cloud V2 (W21) → `hmx-cloud-deep-dive`; DCS Olivetti (W20) → `dcs-olivetti-comeback`
- issue: [mirror-failed: 2026-05-17T00:00:00Z]

### [x] [data] [3.6] GSK Sweet Nightmare GB `status: "live"` stale (endDate 3 days past) — addressed in 3443fe9 (closes #89)
- category: data
- filed: 2026-05-14 by cloud /iterate audit (this tick)
- impact: 4 (source-of-truth field wrong; renderer-side guarded ternary at `GroupBuyRow.tsx:76` (shipped `478c952` as the pass-11 Ishtar R2 fix) absorbs the user-visible label leak — but `/group-buys/past` archive selection (Phase 29), RSS, JSON-LD, and any downstream consumer all see the stale field)
- ease: 9 (one JSON field flip; schema enum already allows `"closed"`)
- score: 3.6 (impact × ease / 10)
- root cause: no automation refreshes group-buy `status` as `endDate` passes. Same drift pattern critique pass 11 caught on Ishtar R2 (`478c952` shipped the renderer-side guard; source data was later corrected on Ishtar R2). Sweet Nightmare was the remaining stale record from the same vintage of buys.
> **Resolved (2026-05-14):** Flipped `status` from `"live"` to `"closed"` and bumped `updatedAt` to 2026-05-14T05:30Z on `data/group-buys/kbdfans-gsk-sweet-nightmare.json`. Generated manifest + search index refreshed by the verify gate's `data:validate` step. The renderer-side guard already protected `/group-buys` from leaking "LIVE" labels on the closed-band card; this fix aligns the source-of-truth data with the buy's actual state so `/group-buys/past` archive selection, RSS, JSON-LD, and any downstream consumer all see the correct field. Broader systemic-drift fix (status-refresher script or schema-time computation) deferred — this tick is the one-record correction. `3443fe9`

### [x] [MED] /404 soft fallback for unknown article + tag slugs (deferred from phase 16) — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick)
- issue: #18
> Filed 2026-05-09 by phase 16 brief. The global `app/not-found.tsx` ships in phase 16 with a search input + pillar nav. Article and tag routes have their own `not-found.tsx` (phases 5 + 12) but they don't suggest "Did you mean…?" matches. Spec from `plan/steps/01_build_plan.md` § Phase 16 calls for MiniSearch-powered suggestions on `/article/<unknown-slug>` and `/tag/<unknown-slug>`. Cheap once the search index already ships (phase 14): the not-found page can call `searchIndex.search(slug)` and surface the top 3 hits.
>
> **Action:** update `apps/web/src/app/article/[slug]/not-found.tsx` and `apps/web/src/app/tag/[slug]/not-found.tsx` to call into the search index built by phase 14 and render up to 3 matches. New e2e in `apps/e2e/tests/polish.spec.ts` covers the suggestion path.
>
> Score: **6.0** (small surface, real reader UX win once article catalog grows).
>
> **Resolved (2026-05-10):** Shipped a `<SuggestedArticles>` Server Component at `apps/web/src/components/not-found/SuggestedArticles.tsx` that takes a slug, calls `searchArticles(slugAsQuery, 3)` from the phase-14 runtime, and renders 0–3 hits with pillar eyebrow + title + publishedAt. New `apps/web/src/middleware.ts` forwards `request.nextUrl.pathname` into an `x-pathname` header so Server Components can recover the slug (Next 15 doesn't pass route params to `not-found.tsx`). Both per-route not-found pages now read the header, derive the slug via a `pathnameToSlug` helper, and render the suggestions rail (article variant uses "did you mean", tag variant uses "articles touching that topic"). The slug-to-query transform replaces hyphens/underscores with spaces; empty slugs short-circuit to `null` so the 404 stays clean when no overlap exists. New e2e in `apps/e2e/tests/polish.spec.ts` covers the catalog-overlap + no-overlap + tag-fallback cases. Unit test for `pathnameToSlug` covers the `null` / root / trailing-slash edge cases. 324 e2e green on first parallel attempt — clean run, no #418 hydration flake.

### [x] [MED] Accessibility audit pass — phase 16 follow-up — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick)
> Filed 2026-05-09 by phase 16 brief. Phase 16's polish scope listed an a11y pass: contrast against the OKLCH tokens, focus rings on every interactive, alt text on every `<img>`, heading order, keyboard nav. Deferred from the page-shipping tick because the audit itself wants its own structured pass with a checklist + per-finding fixes.
>
> **Action:** new audit pass that walks every canonical URL, runs axe-core (or a hand checklist) at desktop + mobile, files individual `[a11y]` rows here for each violation. Drain on subsequent /iterate ticks.
>
> Score: **5.5** (aggregate of many small issues; each fix is cheap but the discovery is the work).
>
> **Resolved (2026-05-10):** Hand-audit pass walked 8 canonical URLs (/, /article/gateron-oil-king-deep-dive, /trends/tracker, /group-buys, /search, /about, /sources, /tag/gateron) by curling rendered HTML and grepping for the 9-pattern checklist below. The site is in remarkably good a11y shape — only **2 findings** filed:
>
> - **[MED] /trends/tracker — heading level skipped (h1 → h3)** filed below
> - **[LOW] all pages — no skip-to-main-content link** filed below
>
> What was checked clean across all 8 URLs (audit-trail for the next pass): (1) `<img alt>` — 13 images, 100% have descriptive alt text. (2) `<button>` accessible names — zero empty/unlabeled. (3) `<a>` accessible names — zero empty/unlabeled, zero `href="#"` placeholders. (4) `<input>` labels — only the footer newsletter input renders SSR (has matching `<label for>`); /search input is client-rendered → flagged for a separate browser-based pass once a real-browser tooling decision lands. (5) `<svg>` decorative gating — 66 SVGs total (40 on /trends/tracker sparklines), 100% have `aria-hidden="true"`, `role="img"`, `aria-label`, or `<title>`. (6) heading order — 7 of 8 pages clean, single h1 each; only /trends/tracker has the skip noted above. (7) `tabindex` — zero across all 8 pages, no focus-trap smells. (8) `role="button"` on non-`<button>` — zero. (9) `<html lang="en">` — present on every page.
>
> Color-contrast was not checked per the brief (can't be hand-checked from HTML alone — needs a real-browser pass with the OKLCH-token computed values). Filed as a known limitation, not as a finding. /search's client-rendered shell is the same: needs browser pass for input/listbox/aria-live coverage. Both deferred to a future axe-core / playwright-axe wiring decision (which the loop should propose via `/expand` if the next two iterate ticks find more pattern-class limits to the hand checklist).
>
> The 2 filed findings drain in subsequent /iterate ticks. The [MED] heading-skip is the cheapest concrete win; the [LOW] skip-link is a one-time root-layout edit that touches every route.

### [x] [LOW] /sources per-citation index — phase 16 follow-up — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick)
- issue: #19
> Filed 2026-05-09 by phase 16 brief. The /sources page currently surfaces the per-article aggregate count of `<Source>` tags. The full per-citation index (article → quote → URL) requires an MDX walker that parses every body, extracts each `<Source href= text= />` tuple, dedupes by href, and surfaces (article, quote, source) rows. Worth shipping but not phase-16 scope.
>
> **Action:** new helper `extractSourceCitations(body: string): Array<{ href, text, position }>` in `@thock/content/util/`; new section on `/sources` rendering the deduped citation list. Probably wants its own ship-data flow if the citation count grows large.
>
> Score: **3.5** (real but cosmetic with the current article count of 6).
>
> **Resolved (2026-05-10):** Shipped exactly the row's recommended action. Added `extractSourceCitations(body): SourceCitation[]` next to `countSourceTags` in `packages/content/src/util/sources.ts` — single regex matches both `<Source href="..." />` (self-closing) and `<Source href="...">text</Source>` (paired) forms, captures href + inner text + character offset; whitespace-collapses and trims the text content; skips tags missing an href attribute. Exported via `packages/content/src/index.ts`. Built `<CitationIndex>` + `buildCitationIndex` helper at `apps/web/src/components/sources/CitationIndex.tsx` that takes `(article, citation)` pairs, dedupes by href, sorts citing articles by publishedAt-desc per row, and sorts the final index by most-recent-citing-article. `/sources` page now renders the per-article tally first, then a "Citation index" section with the deduped per-citation list. Each row links to the external URL (with `rel="noopener" target="_blank"`), shows the host+path, and lists the citing articles. Mobile-safe: `break-all` on the host span and `break-words` on title links handle long URLs without horizontal overflow at 375px. New e2e in `apps/e2e/tests/polish.spec.ts` asserts the index renders with at least one row pointing at a real https URL. New unit tests in `packages/content/src/__tests__/util/sources.test.ts` cover the extractor's empty / paired / self-closing / order / whitespace-collapse / multi-line-attrs / missing-href edge cases. Article count is now 12 (not the 6 the audit row's score basis assumed); the catalog has 15 total citations across 12 articles, so the index is non-trivial. 325 e2e green serially; first parallel attempt hit two #418 flakes on / and /news (same root cause as expand pass-2 candidate).

### [x] [a11y] [3.5] article byline + tracker rank — text-text-3 fails WCAG AA contrast in light mode — addressed in d486ad5 (closes #91)
- issue: #91
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase A axe scan)
- impact: 5 (affects home, all 60 tag pages, all 40 article pages; narrow a11y audience but widespread surface)
- ease: 7 (class substitutions in 4 components)
- score: 3.5 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text <18px, 3:1 for large text ≥18pt
- axe impact: serious
- pages: /, /tag/[slug], /article/[slug], /trends/tracker
- elements: article byline `<time>` + `<span>N min read</span>` (14px, inherit container text-text-3); ArticleCard + RelatedArticleCard meta container children (author/date/read-time, 14px); TrackerRow rank span (font-mono text-h3 text-text-3, 28px)
- root cause: text-text-3 in light mode = oklch(0.55 0.006 250) — medium-dark blue-grey against #ffffff (white surface) — estimated contrast ≈ 3.5–4:1, below 4.5:1 for normal text at 14px. Axe Phase A flagged four canonical pages with serious violations on these elements.
> **Resolved (2026-05-14):** Swapped text-text-3 → text-text-2 on four targeted element contexts: `ArticleByline.tsx:31` (container class — author span's text-text-2 override unchanged), `ArticleCard.tsx` (meta container + data-testid="article-card-meta" added for regression guards), `RelatedArticleCard.tsx:37` (meta container), `TrackerRow.tsx:55` (rank span). Same approach as the previous text-text-3 drain (tracker-week-block + tag back-link). Three new regression guards in `apps/e2e/tests/a11y.spec.ts`: AxeBuilder.include() scoped to [data-testid="article-byline"], [data-testid="article-card-meta"], and [data-testid="tracker-row"] on representative pages, each asserting zero color-contrast violations. 572 e2e green (+3 from new guards). Remaining text-text-3 usages in footer + newsletter label contexts (font-mono text-micro) are additional Phase B candidates — deferred.

### [x] [a11y] [4.9] footer tagline, copyright, newsletter label — text-text-3 at small text (all pages) — addressed in 9998ae5 (closes #92)
- issue: #92
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain)
- impact: 7 (shared footer renders on every canonical URL; violations on /, /about, /tag/*, /search, /newsletter, all article pages — widest-surface a11y row to date)
- ease: 7 (class substitution in 2 components + data-testid additions for regression guards)
- score: 4.9 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 14px/12px
- axe impact: serious
- pages: all pages with shared footer (every canonical URL)
- elements: `<p class="text-small text-text-3">editorial content hub...` (footer tagline); `<span class="font-mono text-micro text-text-3">© 2026 thock</span>` (copyright); `<label class="font-mono text-micro text-text-3">Enter your email</label>` (ButtondownForm footer + full variants)
- root cause: text-text-3 fails WCAG AA contrast at 12px/14px in light mode; same root cause as the previous series of text-text-3 drains (byline, tracker metadata, about links). Footer/newsletter label contexts were explicitly noted as "Phase B candidates — deferred" in the d486ad5 commit that shipped the byline fix.
> **Resolved (2026-05-14):** Swapped text-text-3 → text-text-2 on three footer elements: `Footer.tsx:20` (tagline, text-small + data-testid="footer-tagline"), `Footer.tsx:29` (copyright, text-micro + data-testid="footer-copyright"), `ButtondownForm.tsx:53` (both footer text-micro and full text-small label variants + data-testid="newsletter-form-label"). Three regression guards in `apps/e2e/tests/a11y.spec.ts` scope AxeBuilder.include() to the three new testids on /, /, and /newsletter respectively. 575 e2e green (+3 guards). Remaining Phase B candidates: "Powered by Buttondown" link (text-text-4 base — separate tick), home TrendingTile kind labels (text-micro text-text-3), article figcaptions (text-small text-text-3), tracker "latest" badge.

### [x] [a11y] [7.2] newsletter attribution link — text-text-4 at 12px fails WCAG AA contrast on all pages — addressed in 5753b7a (closes #93)
- issue: #93
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain)
- impact: 8 (ButtondownForm renders in the shared footer on every canonical URL and as the full variant on /newsletter; widest possible blast radius for a single-component fix)
- ease: 9 (one class substitution on <p> wrapper + ternary collapse + hover direction fix)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: all pages (shared footer) + /newsletter (full variant)
- elements: `<p>` wrapper of "Powered by Buttondown." attribution `<a>` in `ButtondownForm.tsx:89-104` — text-text-4 at text-micro (12px), far below the 4.5:1 threshold. Hover state hover:text-text-3 further retreated contrast on interaction.
- root cause: text-text-4 = oklch(0.40 0.004 250) — even lower luminance than text-text-3 (oklch(0.55 0.006 250)) which was already failing WCAG AA. Attribution <p> used an identical two-branch ternary with the same low-contrast class for both footer and full variants.
> **Resolved (2026-05-14):** Swapped text-text-4 → text-text-2 on the attribution `<p>` wrapper in `ButtondownForm.tsx`. Collapsed the identical two-branch ternary to a single class string. Adjusted hover from `hover:text-text-3` (contrast retreat) to `hover:text-text` (contrast increase). Added `data-testid="newsletter-form-attribution"` on the `<p>` for targeted regression guards. Two regression guards in `apps/e2e/tests/a11y.spec.ts` scope AxeBuilder.include() to [data-testid="newsletter-form-attribution"] on / (footer variant) and /newsletter (full variant), each asserting zero color-contrast violations. 577 e2e green (+2 guards). Remaining Phase B candidates: home TrendingTile kind labels (text-micro text-text-3), MentionedPartsRail + RelatedArticlesRail section headings (text-micro text-text-3), article figcaptions (text-small text-text-3), TrackerTable column headers + TrackerArchiveStrip labels. `5753b7a`

### [x] [a11y] [7.2] home TrendingTile kind label — text-text-3 at 12px fails WCAG AA contrast (all home-page visits) — addressed in dc99bef (closes #94)
- issue: #94
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain)
- impact: 8 (home page Trending strip renders on every visit; widest possible blast radius for a single-component fix)
- ease: 9 (one class substitution + data-testid addition)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: / (home page)
- elements: `<span className="font-mono uppercase tracking-[0.08em] text-micro text-text-3">{category}</span>` in `TrendingTile.tsx:74` — renders the category label (switch, keycap, layout, vendor, brand) at 12px with text-text-3 which fails 4.5:1 AA threshold
- root cause: text-text-3 (`oklch(0.55 0.006 250)`) against `--thock-bg` (`oklch(0.175 0.006 250)`) fails WCAG AA at 12px. Same root cause as the recently-drained series (footer tagline, byline metadata, attribution link).

### [x] [a11y] [7.2] article page rail section headings — text-micro text-text-3 fails WCAG AA contrast (all article pages) — addressed in 9f857d5 (closes #95)
- issue: #95
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain)
- impact: 8 (RelatedArticlesRail "Keep reading" h2 renders on every article page with related articles — all 40 articles; MentionedPartsRail "Build sheet" h2 renders on article pages with mentionedParts frontmatter)
- ease: 9 (two class substitutions + data-testid additions + 2 regression guards)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /article/* (all article pages)
- elements: `<h2 className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">Keep reading</h2>` in `RelatedArticlesRail.tsx:23`; `<h2 className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">Build sheet</h2>` in `MentionedPartsRail.tsx:43`
- root cause: text-text-3 (`oklch(0.55 0.006 250)`) fails WCAG AA 4.5:1 at 12px against `--thock-bg`. Same root cause as the previously-drained series (footer tagline, byline metadata, TrendingTile category label).
> **Resolved (2026-05-14):** Swapped text-text-3 → text-text-2 on both h2 elements. Added data-testid="related-articles-heading" and data-testid="mentioned-parts-heading" for targeted regression guards. Two new guards in apps/e2e/tests/a11y.spec.ts assert zero color-contrast violations on both heading selectors on /article/gateron-oil-king-deep-dive. 580 e2e green (+2 from new guards). Remaining Phase B candidates noted in a11y Phase A warnings: figcaptions (text-small text-text-3), search label (text-micro text-text-3), GroupBuysWidget section label, TrackerArchiveStrip "latest" + flat count — deferred to subsequent ticks. `9f857d5`

### [x] [a11y] [7.2] Trends Tracker column headers + archive strip — text-micro text-text-3 fails WCAG AA contrast (all tracker visits) — addressed in 72119d8 (closes #97)
- issue: #97
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain)
- impact: 8 (TrackerTable column headers render on every /trends/tracker AND /trends/tracker/[week] visit across 5 category tables; TrackerArchiveStrip "latest" label + flat count render on /trends/tracker — the signature feature)
- ease: 9 (class substitutions + data-testid additions + 2 regression guards)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /trends/tracker (all visits), /trends/tracker/[week] (for table headers)
- elements: `TrackerTable.tsx:28` — column header div (Rank / Name / Score / 8-wk / Editor's note) at text-micro text-text-3; `TrackerArchiveStrip.tsx:68` — "latest" label at text-micro text-text-3; `TrackerArchiveStrip.tsx:75` — flat count span `{N}~` at text-text-3
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12px. Same root cause as the recently-drained series (#91–#96).

### [x] [a11y] [7.2] home GroupBuysWidget kicker — text-micro text-text-3 fails WCAG AA contrast (all home-page visits) — addressed in 9cc6048 (closes #96)
- issue: #96
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain)
- impact: 8 (home page GroupBuysWidget kicker renders on every `/` visit when active group buys exist; widest home-page surface outside hero and trending strip — both already drained in the current Phase B series)
- ease: 9 (one class substitution + data-testid addition + 1 regression guard)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: / (home page)
- elements: `<span className="font-mono uppercase tracking-[0.1em] text-micro text-text-3">{kicker}</span>` in `GroupBuysWidget.tsx:79` — kicker = "group buys · ending soon" (urgent mode) or "group buys · open now" (normal mode)
- root cause: text-text-3 (`oklch(0.55 0.006 250)`) against `--thock-bg` fails WCAG AA 4.5:1 at 12px. Same root cause as the recently-drained series (#91–#95: footer tagline, byline metadata, attribution link, TrendingTile category label, rail section headings).
> **Resolved (2026-05-14):** Swapped text-text-3 → text-text-2 on `GroupBuysWidget.tsx:79`. Added `data-testid="widget-kicker"` for targeted regression guard. New regression guard in `apps/e2e/tests/a11y.spec.ts` scopes `AxeBuilder.include('[data-testid="widget-kicker"]')` on `/` and asserts zero `color-contrast` violations. 581 e2e green (+1 guard). Remaining Phase B candidates: figcaptions (`text-small text-text-3`), search label (`text-micro text-text-3`), GroupBuyRow/group-buys-page metadata, TrackerTable column headers, TrackerArchiveStrip "latest" + flat count — deferred to subsequent ticks. `9cc6048`

### [x] [a11y] [7.2] article figcaptions — text-small text-text-3 fails WCAG AA contrast on all article pages with diagrams — addressed in 531937e (closes #98)
- issue: #98
- category: a11y
- filed: 2026-05-14 by cloud /iterate audit (Phase B drain — axe scan confirmed during verify gate run)
- impact: 8 (InlineViz was retrofitted to all 40 articles; every article page with a diagram caption is affected; widest article-surface a11y row to date)
- ease: 9 (two class substitutions in InlineViz.tsx + KeyboardImage.tsx + data-testid additions + 1 regression guard)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 14px (text-small)
- axe impact: serious
- pages: /article/* (all article pages with InlineViz or KeyboardImage components with captions)
- elements: `<figcaption class="mt-2 font-serif italic text-small text-text-3">` in both InlineViz.tsx:190 and KeyboardImage.tsx:35
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 14px (text-small). Same root cause as the recently-drained series (#91–#97). Axe surfaced this during the verify gate run for the Lighthouse CI attempt.
> **Resolved (2026-05-14):** Swapped text-text-3 → text-text-2 on both figcaption elements (InlineViz.tsx:190 and KeyboardImage.tsx:35). Added data-testid="article-figcaption" to both for regression guard scoping. Regression guard in apps/e2e/tests/a11y.spec.ts asserts zero color-contrast violations on [data-testid="article-figcaption"] on /article/gateron-oil-king-deep-dive. 584 e2e green (+1 guard). Remaining Phase B candidates: search label (text-micro text-text-3 on /search), GroupBuyRow kind/region/metadata (text-micro text-text-3 on /group-buys + /group-buys/past), text-down on tracker sparklines, TagChip category opacity context. `531937e`

### [x] [MED] Lighthouse CI — phase 17 follow-up — addressed in 5926ac7 (closes #84, #85)
- issue: #85
> Filed 2026-05-09 by phase 17 brief. Blocked on `workflows: write` permission for cloud /march ticks through 2026-05-13. User granted the permission out-of-band (ACTIONS_PAT scope updated). Shipped at `5926ac7` with `.lighthouserc.json` (perf warn ≥0.90; a11y / best-practices / SEO hard errors ≥0.95; numberOfRuns: 3 median-of-3) and `.github/workflows/lighthouse.yml` (triggered on `deployment_status` filtered to Vercel Preview successes). Walks `/`, `/article/gateron-oil-king-deep-dive`, `/trends/tracker`, `/group-buys`. CLOUD_LOOP.md updated with `Workflows: read+write` PAT scope note at `047d2f2`. Row marked [x] in expand pass 10 commit.

### [x] [LOW] Tighten homepage bundle-size budget from 250 KB → 200 KB — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick)
> Filed 2026-05-09 by phase 17 brief. The bearings target is 200 KB gzipped for the homepage; phase 17 set the gate at 250 KB to leave one or two iterate ticks of headroom. After the loop drains any obvious chunk waste (lucide-react, large MDX shims, unused tag taxonomies), tighten the budget to 200 KB to match the bearings.
>
> **Action:** edit `apps/web/scripts/measure-bundle.mts` `DEFAULT_MAX_KB` to 200, or pass `--max=200` via the verify wiring in root `package.json`.
>
> Score: **2.5** (cosmetic until the chunk audit runs; chunk audit is the real work).
>
> **Resolved (2026-05-10):** No chunk-audit needed — current homepage bundle measures 108.7 KB gzipped (per `pnpm --filter @thock/web run size`), well under both the 250 KB phase-17 budget and the 200 KB bearings target. The corpus growth + iterate ticks since phase 17 added no meaningful bundle weight (article body weight is build-time-rendered MDX, not client JS). Bumped `DEFAULT_MAX_KB` from 250 → 200 in `apps/web/scripts/measure-bundle.mts:31` to match bearings; updated the script docblock to reflect the rationale + current baseline. The verify gate now enforces the bearings target directly. No remaining headroom needs a chunk-audit; that work fires only if a future phase pushes bundle weight back toward the 200 KB ceiling. 330 e2e green first parallel attempt.

### [x] [MED] [a11y] /trends/tracker — heading level skipped (h1 → h3 with no h2) — addressed in f70b1f3 (closes #33)
> Filed 2026-05-10 by /iterate audit pass (resolves the [MED] Accessibility audit pass row above).
>
> **Observation:** /trends/tracker's heading sequence is `h1 h3 h3 h3 h3 h2 h2 h2 h2 h2`. The h1 "What's actually rising this week" (offset 10804 in rendered HTML) is followed directly by four h3 cards ("Gateron Oil King", "Cherry MX2A revisions", "HMX Cloud", "Wuque Studio") at offsets 11947–15171, then later switch/keycap/layout/vendor/brand "movers" h2 sections. The h3-after-h1-without-h2 is a heading-level skip — screen-reader users navigating by heading jumps will perceive the rising cards as belonging to a missing or implied h2 section.
>
> **WCAG:** 1.3.1 Info and Relationships (AA).
>
> **Action:** likely the cleanest fix is to wrap the four "rising this week" card titles under a real h2 sub-section heading (e.g. an h2 "Top movers this week" right after the h1) so the structure becomes `h1 → h2 → h3*4 → h2*5`. Alternative: promote the four card titles from h3 to h2, joining the existing five movers h2 sections — but that loses the visual subordination of "preview cards" vs "category tables." Probably the wrap-with-h2 path is right; component is `apps/web/src/components/tracker/<RisingThisWeek?>` (search the codebase to find the actual file).
>
> Score: **4.0** (impact 5 — single page, real but narrow audience of heading-nav screen-reader users; ease 8 — one component edit + one e2e to lock the order).
>
> **Resolved (2026-05-10):** wrapped `<TrackerSummaryGrid>` in `apps/web/src/app/trends/tracker/page.tsx` with a visible h2 "This week at a glance" right after the TrackerHeader's h1. Sequence is now `h1 → h2 → h3*4 → h2*5` (no skip). Wording chosen over the audit's suggested "Top movers this week" because the four cards include Sleeper (which is flat by design — see also pending [MED] critique #8) — "movers" framing dilutes the Sleeper kind. New e2e regression guard at `apps/e2e/tests/trends.spec.ts` walks every heading in document order and asserts no level jump > 1 going down — catches future skips automatically. Verify: 409 e2e green parallel (no #418 flake this run).

### [x] [MED] / — production GA `/g/collect` beacons returning HTTP 503 — resolved via /oversight 2026-05-21 (user verified GA admin)
- pass: critique 8 (commit `d34580c`) → mirrored to AUDIT via /oversight 2026-05-11
- evidence: reader sub-agent's `read_network_requests` on / captured `POST https://www.google-analytics.com/g/collect?...&en=scroll` → 503 and `POST .../g/collect?...&en=page_view` → 503, both fired right after page hydration. GA4 measurement ID `G-5R4DKQ02GV` (downstream of GTM container `GTM-58T839ZD`).
- impact: if persistent (not just reader's session), the editorial team is silently losing the analytics signal trends decisions ride on.
- needs-user-call: GA admin + GTM tag config sit outside the repo; the loop can't autonomously verify or reconfigure them. User confirmed at /oversight 2026-05-11 they will verify GA admin (property active state, sample rate, hostname allowlist) out-of-band and report back. The loop must NOT attempt to drain this row — it is informational until the user reports back.
- on-resolution: if persistent + Google-side, the candidate path is swapping to a self-hosted runner (Plausible/Umami) — the `<GoogleTagManager>` Server Component scaffolding already has the env-gate to host a second runner alongside. File as new phase candidate via `/expand` if that path is chosen.
> **Resolved (2026-05-21 via /oversight):** User verified GA admin out-of-band and confirmed the analytics property is healthy — the 503s in the critique-8 reader session were transient / session-scoped, not a persistent Google-side outage. No self-hosted-runner phase candidate needed. Row closed; the loop no longer treats GA telemetry as an open question.

### [x] [LOW] [a11y] all pages — no "skip to main content" link — addressed in 7899462 (phase 26)
> Filed 2026-05-10 by /iterate audit pass.
>
> **Resolved (2026-05-11):** `apps/web/src/app/layout.tsx` now has a `.skip-link` as the first `<body>` child targeting `#main`. CSS in `globals.css` hides it at rest and reveals it on keyboard focus with an accent-bordered panel. All 43 route `<main>` elements received `id="main"` (16 page.tsx + 12 loading.tsx + 5 not-found.tsx + 10 error.tsx). Regression guard added to `apps/e2e/tests/a11y.spec.ts` (skip-link present, target resolves, link becomes visible on focus). `7899462`

### [x] [a11y] [3.5] color-contrast — text-accent-mu at small text sizes (pillar eyebrows) — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick — cloud /iterate drain)
- issue: #79
- filed: 2026-05-11 by Phase 26 axe discovery pass
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for text <18px / <14px bold
- axe impact: serious
- pages: all pages that render pillar eyebrows or tag chips (/, /article/*, /tag/*, /group-buys, etc.)
- elements: `<span class="... text-micro text-accent-mu">News</span>` (pillar eyebrow); `<span data-testid="tag-chip-name">ZMK</span>` (tag chip on dark background)
- root cause: `text-accent-mu` (`oklch(0.50 0.07 75)`) is the "muted accent" — intentionally low-contrast to feel decorative rather than informational. At `text-micro` (12px), WCAG AA 4.5:1 is not met against `--thock-bg` (`oklch(0.175 0.006 250)`).
- action: option (a) use `text-accent` (`oklch(0.80 0.135 75)`) for pillar eyebrows — lighter, still on-brand; option (b) bump eyebrow text to `text-small` (14px) which reduces the ratio requirement to 3:1 for normal text. Tag chip: check whether the chip's background color is the page background or a surface color — if on a surface, re-measure against that L.
- note: design-level decision. Changing `text-accent-mu` across the site has cascade effects. Recommend /oversight review before touching the token; the iterate drain here is "use `text-accent` for eyebrow contexts where 12px muted text is decorative."
- score: 3.5 (impact 5 — affects sighted users with color perception issues or low-contrast screens; ease 5 — one class substitution per component but design sign-off needed)
- once fixed: add `expect(results.violations.filter(v => v.id === 'color-contrast')).toHaveLength(0)` assertion to a11y.spec.ts for the affected pages
> **Resolved (2026-05-13):** Took option (a) — swapped `text-accent-mu` → `text-accent` at all 16 12-px decorative eyebrow call sites under `apps/web/src/` (Article/Home/Related article cards, MentionedPartsRail, PartHero, PageStub, RootNotFound + SuggestedArticles, newsletter/sources/about pages, all four `not-found.tsx` eyebrows, and `/part/[kind]/page.tsx`). The `text-accent-mu` token itself stays untouched — only the eyebrow contexts that need the contrast lift get swapped. Tag-chip contrast is out of scope for this row: chips use categorical `text-tag-*` tints via `TINT_BY_CATEGORY` in `packages/ui/src/TagChip.tsx`, not `text-accent-mu`. A separate future audit pass can score the tag-chip contrast question on its own. Regression guard added to `apps/e2e/tests/a11y.spec.ts`: scoped `AxeBuilder.include('[data-testid="article-hero-eyebrow"]')` on `/article/gateron-oil-king-deep-dive` asserts zero `color-contrast` violations on the representative eyebrow context. Phase A docstring + inline comments updated to reflect that both Phase-26-filed serious color-contrast rows (text-text-3 + text-accent-mu) have targeted regression guards now. 567 e2e green on first attempt.

### [x] [a11y] [3.0] color-contrast — text-text-3 at small text (tracker header metadata, back links) — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick — cloud /iterate drain)
- issue: #77
- filed: 2026-05-11 by Phase 26 axe discovery pass
- wcag: 1.4.3 Contrast (Minimum) AA
- axe impact: serious
- pages: /trends/tracker (year label, "of 52"), /tag/[slug] (back link "← all tags")
- elements: `<span class="... text-micro text-text-3">2026 · week</span>`, `<span class="... text-micro text-text-3">of 52</span>`, `<a class="... text-text-3 ...">← all tags</a>`
- root cause: `text-text-3` (`oklch(0.58 0.006 90)`) against `--thock-bg` fails 4.5:1 at 12px. It passes for larger text but not micro.
- action: for tracker header metadata, replace `text-text-3` with `text-text-2` (`oklch(0.78 0.005 90)`) — still clearly tertiary but passes at 12px. For the back link, same substitution plus keep `hover:text-text`. These are isolated elements; substitution won't break overall visual design.
- score: 3.0 (impact 4 — narrow audience for the tracker header metadata; ease 7 — two class substitutions)
- once fixed: add targeted contrast assertion to a11y.spec.ts
> **Resolved (2026-05-13):** Swapped `text-text-3` → `text-text-2` on the three specific elements the discovery pass identified: `apps/web/src/components/tracker/TrackerHeader.tsx:43` ("YYYY · week") and `:49` ("of 52") in the tracker week-block; `apps/web/src/app/tag/[slug]/page.tsx:127` ("← all tags" back link, `hover:text-text` preserved). The 25+ other `text-text-3 + text-micro` occurrences across the codebase were NOT in this row's scope — the discovery pass didn't flag them and any wider treatment is a separate audit-time decision. Two new regression-guard `test()`s in `apps/e2e/tests/a11y.spec.ts` run `AxeBuilder.include()` scoped to `[data-testid="tracker-week-block"]` and `[data-testid="tag-page-back-link"]` and assert zero `color-contrast` violations on each — locks the substitution in. Cloud /iterate drain.

### [x] [a11y] [2.5] link-in-text-block — /about body links use color only (no underline or other non-color indicator) — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick — cloud /iterate drain)
- issue: #88
- filed: 2026-05-11 by Phase 26 axe discovery pass
- wcag: 1.4.1 Use of Color (A) — links must not be distinguished from surrounding text by color alone
- axe impact: serious
- pages: /about
- elements: inline links to /news, /trends, /ideas, /deep-dives, /guides within body prose
- root cause: the global `a { text-decoration: none; color: inherit; }` rule in `globals.css` removes underlines from ALL links. For links that are inline within body-copy paragraphs, this is a Level A violation. The `/about` page body prose includes navigation links that readers may not recognize as interactive without non-color cues.
- action: scoped fix — in `/about`'s body component, apply `underline` to inline prose links, OR add a `prose-a:underline` helper class on the prose wrapper. Do NOT remove `text-decoration: none` globally (other link contexts like nav, card titles, etc. rely on it). Targeted scope: `apps/web/src/components/about/AboutBody.tsx`.
- score: 2.5 (impact 4 — users who rely on non-color cues to identify links; ease 7 — one component class addition)
- once fixed: add link-in-text-block assertion to a11y.spec.ts for /about
> **Resolved (2026-05-14):** Added `underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent` to the 9 inline `<Link>` className strings in `apps/web/src/components/about/AboutBody.tsx` (single `replace_all` on the shared className pattern). The Tailwind utility overrides the global `a { text-decoration: none }` baseline. Subtle accent underline at 40% opacity + bumps to full accent on hover keeps the editorial restraint while restoring the non-color affordance. Two surfaces left untouched on purpose: nav, card titles, and other top-level link contexts that rely on the no-underline baseline. New regression guard in `apps/e2e/tests/a11y.spec.ts` scopes `AxeBuilder.include('[data-testid="about-body"]')` on `/about` and asserts zero `link-in-text-block` violations. 569 e2e green serially. Cloud /iterate drain.

### [x] [5.25] ideas pillar — 3 of 8 article quota (needs 5 more) — addressed in 1c08aa9 (closes #53)
- category: content-gaps
- impact: 7 (Ideas & Builds is the third-most-prominent pillar; 3/8 articles leaves the landing page sparse)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 5 articles (current 3, quota 8) → now 4 of 8 (1 shipped)
- next: /ship-content → ideas pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-11 by phase 25 (content queue prime). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when ideas reaches 8 articles.
> **Resolved (2026-05-11):** shipped "The PE foam mod: the two-dollar upgrade that actually works" at `/article/pe-foam-mod`, publishedAt 2026-04-24 (gap-fill). `1c08aa9`

### [x] [5.25] ideas pillar — 4 of 8 article quota (needs 4 more) — addressed in d1dec8b (closes #54)
- category: content-gaps
- impact: 7 (Ideas & Builds is the third-most-prominent pillar; 4/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 4 articles (current 4, quota 8)
- next: /ship-content → ideas pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the ideas-pillar queue after the first /ship-content tick. Bias multiplier 1.5× applies → effective score 5.25. Drains one row per tick; retire when ideas reaches 8 articles.
> **Resolved (2026-05-11):** shipped "Switch films: do they actually do anything?" at `/article/switch-films-worth-it`, publishedAt 2026-04-13 (gap-fill). `d1dec8b`

### [x] [5.25] ideas pillar — 5 of 8 article quota (needs 3 more) — addressed in 69c4307 (closes #55)
- category: content-gaps
- impact: 7 (Ideas & Builds is the third-most-prominent pillar; 5/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 3 articles (current 5, quota 8)
- next: /ship-content → ideas pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the ideas-pillar queue. Bias multiplier 1.5× applies → effective score 5.25. Drains one row per tick; retire when ideas reaches 8 articles.
> **Resolved (2026-05-11):** shipped "The tape mod: what one strip of Kapton actually does" at `/article/tape-mod`, publishedAt 2026-05-02 (gap-fill). `69c4307`

### [x] [5.25] ideas pillar — 6 of 8 article quota (needs 2 more) — addressed in 3d1d7af (closes #56)
- category: content-gaps
- impact: 7 (Ideas & Builds is the third-most-prominent pillar; 6/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 2 articles (current 6, quota 8)
- next: /ship-content → ideas pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the ideas-pillar queue. Bias multiplier 1.5× applies → effective score 5.25. Drains one row per tick; retire when ideas reaches 8 articles.
> **Resolved (2026-05-11):** shipped "Stabilizer servicing: the one step most builders skip" at `/article/stabilizer-servicing-guide`, publishedAt 2026-04-20 (gap-fill). `3d1d7af`

### [x] [5.25] ideas pillar — 7 of 8 article quota (needs 1 more) — addressed in 012f600 (closes #62)
- category: content-gaps
- impact: 7 (Ideas & Builds is the third-most-prominent pillar; 7/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 1 article (current 7, quota 8)
- next: /ship-content → ideas pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the ideas-pillar queue. Bias multiplier 1.5× applies → effective score 5.25. Drains one row per tick; retire when ideas reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Spring swaps: what swapping the spring actually changes" (`apps/web/src/content/articles/spring-swaps-explained.mdx`, ~1490 words, publishedAt 2026-05-11 via gap-fill). Ideas pillar now at **8 of 8 — quota met.** This row retires the ideas-pillar queue; deep-dives (3/8) and guides (2/8) remain in the content-gap queue.

### [x] [5.25] deep-dives pillar — 3 of 8 article quota (needs 5 more) — addressed in 3813c4d (closes #63)
- category: content-gaps
- impact: 7 (Deep Dives is the fourth-most-prominent pillar; long-form inventory at 3/8 is thin)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 5 articles (current 3, quota 8) → now 4 of 8 (1 shipped)
- next: /ship-content → deep-dives pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-11 by phase 25 (content queue prime). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when deep-dives reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Plate materials, explained: what brass, FR4, POM, and aluminium actually change" at `/article/plate-materials-explained`, publishedAt 2026-05-09 (gap-fill midpoint closest to today). Deep-dives pillar now at **4 of 8**. `3813c4d`

### [x] [4.5] guides pillar — 2 of 8 article quota (needs 6 more) — addressed in 34e6216 (closes #64)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 2/8 is the most severe absolute shortfall)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 6 articles (current 2, quota 8) → now 3 of 8 (1 shipped)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-11 by phase 25 (content queue prime). Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Keycap profiles, compared: Cherry, OEM, SA, and MT3" at `/article/keycap-profiles-compared`, publishedAt 2026-05-03 (gap-fill midpoint of the largest 2-day gap closest to today). Fills the **keycaps** guideSection (third sub-section, joining `switches` + `modding`). Guides pillar now at **3 of 8**. `34e6216`

### [x] [4.5] guides pillar — 3 of 8 article quota (needs 5 more) — addressed in 879bc51 (closes #65)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 3/8 still well below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 5 articles (current 3, quota 8) → now 4 of 8 (1 shipped)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the guides-pillar queue. Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Keyboard firmware, compared: QMK, VIA, and VIAL" at `/article/keyboard-firmware-compared`, publishedAt 2026-04-29 (gap-fill midpoint of the 04-28→04-30 gap, closest 2-day gap to today). Fills the **firmware** guideSection — the third (and previously empty) enum value, joining `switches` + `keycaps`. Guides pillar now at **4 of 8**. `879bc51`

### [x] [4.5] guides pillar — 4 of 8 article quota (needs 4 more) — addressed in ace19be (closes #66)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 4/8 still half of quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 4 articles (current 4, quota 8) → now 5 of 8 (1 shipped)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the guides-pillar queue. Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Sound dampening, compared: case foam, plate foam, PE foam, and the tape mod" at `/article/sound-dampening-compared`, publishedAt 2026-04-27 (gap-fill midpoint of the 04-26 → 04-28 gap, closest 2-day gap to today). Fills the **modding** guideSection — the fourth (and previously empty) enum value, completing the four-section coverage (switches + keycaps + firmware + modding). Guides pillar now at **5 of 8**. `ace19be`

### [x] [4.5] guides pillar — 5 of 8 article quota (needs 3 more) — addressed in 46fed09 (closes #67)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 5/8 still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 3 articles (current 5, quota 8) → now 6 of 8 (1 shipped)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the guides-pillar queue. Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Mounting styles, compared: gasket, top-mount, tray, and integrated plate" at `/article/mounting-styles-compared`, publishedAt 2026-04-25 (gap-fill midpoint of the 04-24 → 04-26 gap, closest 2-day gap to today). Fills out the **modding** guideSection (joining `sound-dampening-compared`), and complements the four existing comparison-style guides. Guides pillar now at **6 of 8**. `46fed09`

### [x] [4.5] guides pillar — 6 of 8 article quota (needs 2 more) — addressed in 14ec217 (closes #68)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 6/8 still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 2 articles (current 6, quota 8) → now 7 of 8 (1 shipped)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the guides-pillar queue. Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Keycap materials, compared: ABS, PBT, and the rest" at `/article/keycap-materials-compared`, publishedAt 2026-04-23 (gap-fill midpoint of the 04-22 → 04-24 gap, closest 2-day gap to today). Fills out the **keycaps** guideSection (joining `keycap-profiles-compared` — together they cover the two big keycap-buying axes: shape and material). Guides pillar now at **7 of 8**. `14ec217`

### [x] [4.5] guides pillar — 7 of 8 article quota (needs 1 more) — addressed in 4e62877 (closes #69)
- category: content-gaps
- impact: 6 (Guides is the fifth pillar; 7/8 just below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 1 article (current 7, quota 8) → now 8 of 8 (1 shipped)
- next: /ship-content → guides pillar article (topic from /iterate audit or gap heuristic)
> Continuation of the guides-pillar queue. Bias multiplier 1.5× applies → effective score 4.5. Drains one row per /ship-content tick; retire when guides reaches 8 articles.
>
> **Resolved (2026-05-12):** Shipped "Switch housings, compared: nylon, polycarbonate, POM, and the rest" at `/article/switch-housings-compared`, publishedAt 2026-04-21 (gap-fill midpoint of the equal-largest 2-day gap closest to today). Fills out the **switches** guideSection (joining `beginners-switch-buying-guide`), parallels `keycap-materials-compared` on the switch axis. Guides pillar now at **8 of 8 — quota met.** This row retires the guides-pillar content-gap queue; deep-dives (4/8) remains as the next pending content-gap row. `4e62877`

### [x] [5.25] deep-dives pillar — 4 of 8 article quota (needs 4 more) — addressed in d9f23ae (closes #73)
- category: content-gaps
- impact: 7 (Deep Dives is the fourth-most-prominent pillar; 4/8 articles is still half of quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 4 articles (current 4, quota 8) → now 5 of 8 (1 shipped)
- next: /ship-content → deep-dives pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-13 by cloud /march tick — fills the operational queue-refill gap expand pass 7 flagged (`a3f5653` left deep-dives at 4/8 with no Pending content-gap row, so the next /march tick fell through). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when deep-dives reaches 8 articles.
>
> **Resolved (2026-05-13):** Shipped "Why the Drop Holy Panda X feels the way it does" at `/article/drop-holy-panda-x-deep-dive`, publishedAt 2026-05-12 (gap-fill midpoint between 2026-05-11 and today sentinel; closest-to-today tiebreak among 2-day gaps). Tactile counterpart to the existing linear deep-dives (Oil King, HMX Cloud) plus the architecture piece (Plate materials); closes the tactile-coverage gap in the pillar. Deep-dives now at **5 of 8**. `d9f23ae`

### [x] [5.25] deep-dives pillar — 5 of 8 article quota (needs 3 more) — addressed in e24508d (closes #74)
- category: content-gaps
- impact: 7 (Deep Dives is the fourth-most-prominent pillar; 5/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 3 articles (current 5, quota 8) → now 6 of 8 (1 shipped)
- next: /ship-content → deep-dives pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-13 by cloud /march tick (queue auto-refill — same pattern as the 4/8 row filed earlier today). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when deep-dives reaches 8 articles.
>
> **Resolved (2026-05-13):** Shipped "Why clicky switches still have a constituency" at `/article/clicky-switches-deep-dive`, publishedAt 2026-04-18 (gap-fill midpoint of the 2026-04-17 → 2026-04-19 2-day gap; closest-to-today tiebreak among equal-largest 2-day gaps in the rolling 30-day window). Click-jacket (Cherry MX Blue lineage) vs click-bar (Kailh Box family) framed as the load-bearing distinction; closes the clicky-coverage gap in the pillar (which previously held 3 linears + 1 tactile + 1 architecture piece). Deep-dives now at **6 of 8**. `e24508d`

### [x] [5.25] deep-dives pillar — 6 of 8 article quota (needs 2 more) — addressed in 8d97d97 (closes #75)
- category: content-gaps
- impact: 7 (Deep Dives is the fourth-most-prominent pillar; 6/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 2 articles (current 6, quota 8) → now 7 of 8 (1 shipped)
- next: /ship-content → deep-dives pillar article (topic from /iterate audit or gap heuristic)
> Filed 2026-05-13 by cloud /march tick (queue auto-refill — same pattern as the 4/8 and 5/8 rows filed earlier today). Bias multiplier 1.5× applies → effective score 5.25. Drains one row per /ship-content tick; retire when deep-dives reaches 8 articles. Existing deep-dives coverage: 3 linear pieces (Oil King, HMX Cloud, Cherry MX2A), 1 tactile (Holy Panda X), 1 clicky (clicky-switches architecture), 1 mounting-architecture (plate materials) — no electrocapacitive coverage despite Topre being mentioned as a load-bearing reference point in `switch-films-worth-it`. Topre is the natural next deep-dive: a third-architecture switch (rubber dome + capacitive PCB sensing) that explains why HHKB/Realforce feel survives at premium prices.
>
> **Resolved (2026-05-13):** Shipped "How Topre's electrocapacitive switches actually work" at `/article/topre-electrocapacitive-deep-dive`, publishedAt 2026-04-16 (gap-fill midpoint of the 2026-04-15 → 2026-04-17 2-day gap; closest-to-today tiebreak among equal-largest 2-day gaps). Third-sensing-lineage piece — rubber-dome + conical-spring + capacitive PCB pad — frames Topre as parallel to MX-style contact switches and Hall-effect newcomers, not a legacy curiosity. Closes the architectural gap in the pillar (3 linears + 1 tactile + 1 clicky + 1 mounting + the architectural Topre piece). Deep-dives now at **7 of 8**. `8d97d97`

### [x] [5.25] deep-dives pillar — 7 of 8 article quota (needs 1 more) — addressed in 702b8a9 (closes #76)
- category: content-gaps
- impact: 7 (Deep Dives is the fourth-most-prominent pillar; 7/8 articles is still below quota)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — pillar quota
- shortfall: 1 article (current 7, quota 8) → now 8 of 8 (1 shipped) — quota reached
- next: retire the deep-dives Rule-1 row chain — quota met; future deep-dives content-gap rows fire only if a piece is archived or a new sub-architecture surfaces
> Filed 2026-05-13 by cloud /march tick (queue auto-refill — same pattern as the 4/8, 5/8, and 6/8 rows filed earlier in the week). Bias multiplier 1.5× applies → effective score 5.25. Existing deep-dives coverage at queue-file time: 3 linear pieces (Oil King, HMX Cloud, Cherry MX2A), 1 tactile (Holy Panda X), 1 clicky-architecture (clicky-switches), 1 mounting-architecture (plate materials), 1 capacitive-architecture (Topre). The architectural arc opened by the Topre piece (which explicitly frames Topre as "parallel to MX-style contact switches and the Hall-effect newcomers") leaves the Hall-effect / magnetic sensing lineage as the natural fourth-architecture closer — sensing-physics deep-dive, not the market-trajectory piece that already lives in Trends (`hall-effect-mainstream`).
>
> **Resolved (2026-05-13):** Shipped "How Hall-effect switches actually sense a keypress" at `/article/magnetic-switches-deep-dive`, publishedAt 2026-04-14 (gap-fill midpoint of the only 2-day gap in the rolling-30-day window, between 2026-04-13 and 2026-04-15 — sentinel-bounded). Fourth-sensing-lineage piece — stem-mounted magnet, Hall sensor on the PCB, analog voltage proportional to magnetic flux — frames magnetic switches as the lineage that closed the analog-output gap MX never had, with the tradeoffs (calibration drift, inter-switch interference, factory tolerance on magnet placement) the marketing pages don't lead with. Closes the architectural arc on the pillar (3 linears + 1 tactile + 1 clicky + 1 mounting + Topre + magnetic). Deep-dives now at **8 of 8 — quota met.** `702b8a9`

### [x] [MED] PageStub routes flake under parallel e2e load (React #418 hydration) — self-resolved via phase 16
> Filed 2026-05-09. Original prediction was "self-resolves before phase 16 ships" because phase 16's polish scope replaced every PageStub with a real route. Flake persisted briefly after `f3e5bac` shipped (one source of hydration mismatch was the formatter TZ issue, partially patched at `dfa5596`); the SECOND hydration source the TZ patch couldn't reach lived inside the PageStub itself and went away when every dynamic-data route got its own real page.
>
> **Resolved (confirmed 2026-05-11 via /oversight):** not observed in 10+ consecutive parallel verify runs (all noting "433 e2e green parallel — no #418 flake this run"). Serial-fallback (`--workers=1`) is no longer the established mitigation. Closing.

### [x] [a11y] [6.3] GroupBuyRow + group-buys pages — text-micro text-text-3 fails WCAG AA contrast on /group-buys and /group-buys/past — addressed in 4dc57be (closes #100)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 7 (GroupBuyRow kind/region/metadata + page header summary render on every visit to /group-buys and /group-buys/past; GroupBuyCountdownRow vendor label renders on / for all home visitors)
- ease: 9 (class substitutions + data-testid additions + regression guards)
- score: 6.3 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /group-buys, /group-buys/past, / (home widget)
- elements: `GroupBuyRow.tsx` kind label (text-micro text-text-3), region badge (text-micro text-text-3), vendor/date metadata row (text-micro text-text-3), non-live countdown (text-text-3); `group-buys/page.tsx` header summary count + archive link; `group-buys/past/page.tsx` header count + back link; `GroupBuyCountdownRow.tsx` "via [vendor]" label
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12px. Same root cause as the recently-drained Phase B series (#91–#98).
- issue: #100
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on GroupBuyRow kind label, region badge, vendor/date metadata row, non-live countdown; group-buys/page.tsx header summary and archive link; group-buys/past/page.tsx header count and back link; GroupBuyCountdownRow.tsx vendor label. Added data-testid="group-buy-kind" and data-testid="group-buy-meta" plus data-testid="group-buys-summary" and data-testid="group-buys-past-summary" for regression guard scoping. Three regression guards in apps/e2e/tests/a11y.spec.ts assert zero color-contrast violations on the group-buy row elements and page summaries. 589 e2e green (+3 guards). Remaining Phase B candidates: search label (text-micro text-text-3 on /search), TagChip category opacity, text-down tracker sparklines. `4dc57be`

### [x] [a11y] [7.2] /search — text-micro text-text-3 fails WCAG AA contrast on search label, result eyebrow, result date — addressed in f58f97a (closes #101)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 8 (search is a primary discovery surface; label + result eyebrow + date affect every /search visit)
- ease: 9 (three class substitutions + data-testid additions + 2 regression guards)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /search
- elements: `SearchPanel.tsx` search input label "query" (text-micro text-text-3); `ArticleResult.tsx` pillar eyebrow (text-micro text-text-3) + publishedAt date (text-micro text-text-3)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12px. Same root cause as the Phase B series (#91–#100).
- issue: #101
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on all three elements. Added data-testid="search-input-label" on the label, data-testid="search-result-eyebrow" on the pillar span, data-testid="search-result-date" on the date span. Two regression guards in apps/e2e/tests/a11y.spec.ts: one static (label on /search) and one interactive (fill "gateron", wait for results, axe-scoped on eyebrow + date). 591 e2e green (+2 guards). Remaining Phase B candidates: TagChip category opacity (text-down tracker sparklines addressed alongside TrackerArchiveStrip #97; tag-chip `opacity-70` category label noted in Phase A axe scan warn).

### [x] [a11y] [7.2] MDX article prose components — Callout title text-micro text-text-3 fails WCAG AA on 31 articles; Caption + PullQuote attribution pre-emptive — addressed in 067dbde (closes #102)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 8 (Callout component used in 31 articles with 41 titled instances; Caption and PullQuote attribution are pre-emptive fixes for components not yet used in articles)
- ease: 9 (class substitutions in 3 MDX component files + data-testid additions + 1 regression guard)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px/14px
- axe impact: serious
- pages: /article/* (all articles using <Callout title="...">: 31 articles, 41 instances)
- elements: `<h2 className="... text-micro text-text-3">` in Callout.tsx:36 (on bg-surface, oklch 0.235); `<p className="... text-small text-text-3">` in Caption.tsx:9 (on --thock-bg, pre-emptive); `<footer className="... text-small text-text-3">` in PullQuote.tsx:16 (on --thock-bg, pre-emptive — no articles currently use the attribution prop)
- root cause: text-text-3 against bg-surface (oklch 0.235 in dark mode) and --thock-bg (oklch 0.175) both fail WCAG AA 4.5:1 at 12–14px. Same root cause as the Phase B drain series (#91–#101).
- issue: #102

### [x] [a11y] [7.2] pillar-hero RSS pill sublabel — text-micro text-text-3 fails WCAG AA on all pillar pages — addressed in 28944f3 (closes #103)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 8 (PillarHero renders on /news, /trends, /ideas, /deep-dives, /guides — all 5 pillar landings; widest single-component a11y surface in the Phase B drain series)
- ease: 9 (one class substitution + data-testid addition + 1 regression guard)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /news, /trends, /ideas, /deep-dives, /guides (all pillar landings)
- elements: `<span className="font-mono uppercase tracking-[0.1em] text-micro text-text-3">` at PillarHero.tsx:110 — the pill sublabel ("subscribe") rendered in the RSS pill on every pillar landing page
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12px. Same root cause as the Phase B drain series (#91–#102).
- issue: #103
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on the pill sublabel span in `apps/web/src/components/pillar/PillarHero.tsx:110`. Added `data-testid="pillar-hero-pill-sublabel"` for regression guard scoping. Regression guard in `apps/e2e/tests/a11y.spec.ts` scopes `AxeBuilder.include('[data-testid="pillar-hero-pill-sublabel"]')` on `/news` and asserts zero `color-contrast` violations. 593 e2e green (+1 guard). Remaining Phase B candidates: TagChip opacity-70 category prefix, text-down tracker sparklines, empty-state kicker spans (low real-user impact — only render when no content). `28944f3`

### [x] [a11y] [4.5] ArticleCard compact variant date — text-small text-text-3 fails WCAG AA contrast (future-guard for when compact variant is called) — addressed in 2b3c3cd (closes #104)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 5 (compact variant date has the class issue; the variant exists in ArticleCard.tsx but has no current caller in any canonical URL — all pillar archive lists use `variant="row"`. Impact rated for when a caller ships.)
- ease: 9 (one class substitution + data-testid addition, unit test guards it)
- score: 4.5 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 14px (text-small)
- axe impact: serious
- pages: any future surface using `<ArticleCard variant="compact">`
- elements: `<time dateTime={fm.publishedAt} className="text-small text-text-3">` in `apps/web/src/components/home/ArticleCard.tsx:212` (compact variant)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 14px. Same root cause as the Phase B drain series (#91–#103). Compact variant code path is correct now so it doesn't regress when called.
- issue: #104
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on the compact `<time>` element in `apps/web/src/components/home/ArticleCard.tsx:212`. Added `data-testid="article-card-compact-date"` for regression guard scoping. Unit test in `ArticleCard.test.tsx` asserts className contains `text-text-2` and NOT `text-text-3`; no e2e guard added because compact variant has no canonical-URL caller (all pillar archives use `variant="row"`). The code path is now future-safe for when a caller ships. 593 e2e green. Remaining Phase B candidates: TagChip opacity-70 category prefix (uses `opacity-70` mechanism, distinct from text-text-3 but same WCAG 1.4.3 failure class), text-down tracker sparklines, PartHero/PartSpec/MentionedInArticles part-page elements, /tags category headings, /sources citation elements, MDX table `<th>` headers. `2b3c3cd`

### [x] [a11y] [5.6] part pages — text-text-3 at small text fails WCAG AA contrast (PartHero, PartSpec, MentionedInArticles) — addressed in 66d6027 (closes #105)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 7 (all 18 /part/[kind]/[slug] pages across switch/keycap-set/board catalogs; PartHero vendor metadata + status, PartSpec heading + label rows, MentionedInArticles heading)
- ease: 8 (5 class substitutions across 3 files + data-testid additions + 2 regression guards)
- score: 5.6 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px (text-micro) and 14px (text-small)
- axe impact: serious
- pages: /part/switch/*, /part/keycap-set/*, /part/board/* (all 18 part pages)
- elements: `PartHero.tsx:50` vendor metadata div (text-small text-text-3); `statusTint()` fallback returning text-text-3 for sold-out/discontinued; `PartSpec.tsx:69` "Spec sheet" h2 (text-micro text-text-3); `PartSpec.tsx:82` spec label dt (text-micro text-text-3); `MentionedInArticles.tsx:28` empty-state span (text-micro text-text-3); `MentionedInArticles.tsx:46` "Mentioned in N articles" h2 (text-micro text-text-3)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12–14px. Same root cause as the Phase B drain series (#91–#104).
- issue: #105
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on all five part-page element contexts. PartHero.tsx: vendor metadata div text-text-3 → text-text-2; statusTint() fallback collapsed to text-text-2 (group-buy + limited + sold-out + discontinued all pass at text-small). data-testid="part-hero-meta" added. PartSpec.tsx: "Spec sheet" h2 text-text-3 → text-text-2 (data-testid="part-spec-heading"); spec label dt text-text-3 → text-text-2 (data-testid="part-spec-label"). MentionedInArticles.tsx: empty-state span text-text-3 → text-text-2 (data-testid="part-mentioned-kicker"); "Mentioned in N articles" h2 text-text-3 → text-text-2 (data-testid="part-mentioned-heading"). Two regression guards in apps/e2e/tests/a11y.spec.ts: part-hero-meta + part-spec-heading/part-spec-label scoped AxeBuilder.include() on /part/switch/gateron-oil-king asserting zero color-contrast violations. 595 e2e green (+2 guards). Remaining Phase B candidates: tags-page eyebrow, /sources SourceCounts + CitationIndex, MDX table th, empty-state kickers. `66d6027`

### [x] [a11y] [7.2] navigation back-links — text-small text-text-3 fails WCAG AA contrast on tracker archive and part pages — addressed in 67f377a (closes #106)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 8 (navigation elements on tracker archive pages and part kind/detail pages — three distinct page families; readers with low-contrast screens cannot reliably perceive or activate these back-nav affordances)
- ease: 9 (three identical class substitutions + data-testid additions + 2 regression guards)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 14px (text-small)
- axe impact: serious
- pages: /trends/tracker/[week] (all archive week pages), /part/[kind] (3 kind index pages), /part/[kind]/[slug] (18 part detail pages)
- elements: `apps/web/src/app/trends/tracker/[week]/page.tsx:133` "← Back to latest" Link (text-small text-text-3 hover:text-text); `apps/web/src/app/part/[kind]/page.tsx:157` "← home" Link (text-small text-text-3 hover:text-text); `apps/web/src/app/part/[kind]/[slug]/page.tsx:139` "← all {kind}s" Link (text-small text-text-3 hover:text-text, data-testid="part-detail-back-link")
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 14px. Same root cause as the Phase B drain series (#91–#105). Notably, the prev/next week nav links in the same tracker archive page already use text-text-2 correctly (lines 182, 197) — only the "Back to latest" header link was missed.
- issue: #106
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on all three navigation back-link elements. trends/tracker/[week]/page.tsx: "← Back to latest" + data-testid="tracker-back-link". part/[kind]/page.tsx: "← home" + data-testid="part-kind-back-link". part/[kind]/[slug]/page.tsx: "← all {kind}s" (data-testid="part-detail-back-link" was already present). Two regression guards in a11y.spec.ts: tracker-back-link on /trends/tracker/2026-W19 and part-detail-back-link on /part/switch/gateron-oil-king asserting zero color-contrast violations. 596 e2e green (+2 guards). Remaining Phase B candidates: tags-page eyebrow, /sources SourceCounts + CitationIndex, MDX table th, empty-state kickers, TagChip opacity-70. `67f377a`

### [x] [a11y] [5.6] /tags eyebrow + MDX table th + /sources — text-text-3 at small text fails WCAG AA — addressed in 38dc757 (closes #107)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 7 (MDX table th affects /article/* pages with GFM comparison tables — core content surface; /tags is a primary discovery page linked from every tag page back-link; /sources is accessible from footer nav — all three are regularly visited surfaces)
- ease: 8 (6 class substitutions across 4 files + data-testid additions + 3 regression guards)
- score: 5.6 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px, 14px, 16px
- axe impact: serious
- pages: /tags, /article/* (pages with GFM tables), /sources
- elements: `tags/page.tsx:54` "browse · all tags" eyebrow (text-micro text-text-3); `mdx/components.tsx:85` MdxTh <th> (text-micro text-text-3); `SourceCounts.tsx:85` pillar h2 (text-micro text-text-3); `SourceCounts.tsx:104` source-count badge (text-small text-text-3); `CitationIndex.tsx:128` citation host URL (text-micro text-text-3); `CitationIndex.tsx:133` citing-articles list (text-small text-text-3); plus two empty-state paragraphs (text-body text-text-3)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12–16px. Same root cause as the Phase B drain series (#91–#106).
- issue: #107
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on all six elements plus two empty-state paragraphs across four files. Added data-testid="mdx-table-th" on MdxTh and data-testid="source-counts-heading" on SourceCounts pillar h2. Three regression guards in apps/e2e/tests/a11y.spec.ts: tags-eyebrow on /tags, mdx-table-th on /article/switch-films-worth-it, source-counts-heading + citation-index-host on /sources. 599 e2e green (+3 guards). Remaining Phase B candidates: TagChip opacity-70 category prefix (axe non-critical scan confirms failing), text-down tracker sparklines (axe non-critical scan confirms failing), empty-state kicker spans (low real-user impact — only render when no content). `38dc757`

### [x] [a11y] [7.2] misc-category tag chips + /tags Misc heading + /tag/[misc-slug] eyebrow — text-text-3 fails WCAG AA across all pages with misc tags — addressed in 693110d (closes #108)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 8 (TagChip misc renders on home page, all article pages, search results, /tags, /tag/[slug] — every surface with misc-tagged articles; /tags Misc heading always visible; /tag/[misc-slug] eyebrow on 21 misc-category tag pages)
- ease: 9 (3 class substitutions across 3 files + unit test update + 1 regression guard with 2 assertions)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px (text-micro)
- axe impact: serious
- pages: all pages rendering misc-tagged article chips (/, /article/*, /search, /tags, /tag/*), /tags (Misc section heading), /tag/[misc-slug] (eyebrow "tag · topic")
- elements: `packages/ui/src/TagChip.tsx` TINT_BY_CATEGORY.misc (text-text-3 → text-text-2 for chip text color); `apps/web/src/components/tags/TagGroup.tsx:11` CATEGORY_TINT.misc (text-text-3 → text-text-2 for Misc h2 heading); `apps/web/src/app/tag/[slug]/page.tsx:28` CATEGORY_TINT.misc (text-text-3 → text-text-2 for eyebrow tint)
- root cause: misc category consistently mapped to text-text-3 as a neutral-but-decorative color across all three surfaces. text-text-3 (oklch(0.55 0.006 250)) against --thock-bg (oklch(0.175 0.006 250)) fails WCAG AA 4.5:1 at 12px. Same root cause as the Phase B drain series (#91–#107).
- issue: #108
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on all three misc-category surfaces: TINT_BY_CATEGORY.misc in TagChip.tsx (chip text color on home, article pages, search, /tags, /tag/*), CATEGORY_TINT.misc in TagGroup.tsx (/tags Misc h2 heading), CATEGORY_TINT.misc in tag/[slug]/page.tsx (tag-page-eyebrow on all 21 /tag/[misc-slug] pages). Unit tests updated in TagChip.test.tsx and ArticleTagRail.test.tsx. Regression guard in a11y.spec.ts: /tags misc group scoped AxeBuilder + /tag/group-buy eyebrow scoped AxeBuilder, both asserting zero color-contrast violations. 600 e2e green (+1 test block, 2 assertions). Remaining Phase B candidates: tag-chip-category opacity-70 prefix (axe non-critical scan logs this on article pages with material/other category chips), text-down tracker sparklines, empty-state kicker spans. `693110d`

### [x] [a11y] [5.6] TagChip category prefix — opacity-70 reduces contrast below WCAG AA on all non-misc tag chips — addressed in 9646f2a (closes #109)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 7 (tag chips render on home, all article pages, /tags, /search — every surface with non-misc tagged content; the prefix is the category-decoding affordance)
- ease: 8 (one class removal in TagChip.tsx + unit test + e2e guard)
- score: 5.6 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: moderate (confirmed failing by axe scan at expand pass 11)
- pages: all pages with non-misc tag chips (/, /article/*, /tags, /search, /tag/*)
- elements: `<span data-testid="tag-chip-category" className="opacity-70">` in `packages/ui/src/TagChip.tsx:77` — the category prefix ("switch", "layout", "brand", "material", "profile") rendered at 70% opacity at 12px (text-micro). The opacity composites the tag-specific color against --thock-bg, reducing effective contrast below WCAG AA 4.5:1.
- root cause: opacity-70 was chosen to visually subordinate the prefix so "SWITCH · GATERON OIL KING" reads with emphasis on the name; visual hierarchy is correct but WCAG requires absolute contrast on text elements regardless of emphasis intent. Same mechanism flagged across the Phase B drain series.
- issue: #109
> **Resolved (2026-05-15):** Removed opacity-70 from `<span data-testid="tag-chip-category">` in `packages/ui/src/TagChip.tsx:77`. Category prefix now renders at full chip contrast; visual hierarchy (prefix reads secondary to name) is preserved via the category-specific tint colors (tag-switch amber, tag-layout steel-blue, etc.) and the `·` separator (aria-hidden, no contrast requirement). Unit test in TagChip.test.tsx asserts prefix span has no opacity-* class. Regression guard in a11y.spec.ts: AxeBuilder.include('[data-testid="tag-chip-category"]') on /article/gateron-oil-king-deep-dive asserts zero color-contrast violations. 601 e2e green (+1 guard). Remaining Phase B candidates: text-down on TrackerArchiveStrip direction counts (axe serious — confirmed), empty-state kicker spans (low real-user impact). `9646f2a`

### [x] [a11y] [5.6] TrackerArchiveStrip down-count text — bg-surface-2 invalid class causes text-down to fail WCAG AA contrast — addressed in ce3c537 (closes #110)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit (Phase B drain)
- impact: 7 (TrackerArchiveStrip renders on /trends/tracker latest view and all /trends/tracker/[week] archive pages — the site's signature feature; down-count span renders on every archive card that has any down-trending items in its snapshot)
- ease: 8 (background class correction + data-testid additions + regression guard)
- score: 5.6 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious (confirmed by Phase B scan noted in expand pass 11)
- pages: /trends/tracker, /trends/tracker/[week] (all archive week pages)
- elements: `<span className="text-down">-{counts.down}</span>` in `apps/web/src/components/tracker/TrackerArchiveStrip.tsx:78` — direction count at font-mono text-micro (12px)
- root cause: `bg-surface-2` on the inner cell div (line 59) is an invalid Tailwind class — no `surface-2` color defined in `tailwind.config.ts`. Cells rendered on the outer grid's `bg-border` background (oklch 0.305 0.007 250). `text-down` (oklch 0.68 0.135 25) at 12px on `bg-border` gives ~4.1:1 — fails WCAG AA 4.5:1.
- issue: #110
> **Resolved (2026-05-15):** Changed `bg-surface-2` → `bg-surface group-hover:bg-surface-hi transition-colors` on the inner cell div. `text-down` on `bg-surface` (oklch 0.235 0.006 250) gives ~5.1:1 — passes WCAG AA. Hover feedback restored: inner div gains `group-hover:bg-surface-hi`; Link wrapper changed from `hover:bg-surface` → `group` so Tailwind propagates hover state to the inner div (previous hover was relying on the transparent inner div showing the Link's bg-surface through). Added `data-testid="tracker-archive-down-count"` and `data-testid="tracker-archive-up-count"` to direction count spans. Regression guard in `apps/e2e/tests/a11y.spec.ts` scopes `AxeBuilder.include('[data-testid="tracker-archive-down-count"]')` on `/trends/tracker` and asserts zero `color-contrast` violations. 602 e2e green (+1 guard). Remaining Phase B candidates: empty-state kicker spans (low real-user impact — only render when no content). `ce3c537`

### [x] [a11y] [6.3] /sources — "Citation index" h2 heading text-text-3 fails WCAG AA contrast — addressed in dc5be05 (closes #111)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 7 (always visible on /sources, accessible from footer nav on every page)
- ease: 9 (one class substitution + data-testid + regression guard)
- score: 6.3 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /sources
- elements: `apps/web/src/app/sources/page.tsx:90` — `<h2 className="font-mono text-micro uppercase tracking-[0.12em] text-text-3">Citation index</h2>` (always visible when visiting /sources)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg (oklch(0.175 0.006 250)) fails WCAG AA 4.5:1 at 12px. Missed in row #107 which addressed SourceCounts.tsx + CitationIndex.tsx elements but not the direct page-level heading. Same root cause as the Phase B drain series (#91–#110).
- issue: #111
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on the "Citation index" h2 in `apps/web/src/app/sources/page.tsx:90`. Added `data-testid="sources-citation-index-heading"`. Extended the existing `/sources` regression guard in `apps/e2e/tests/a11y.spec.ts` to include `sources-citation-index-heading` in the `AxeBuilder.include()` loop. 602 e2e green (+1 assertion). Remaining Phase B candidates: SuggestedArticles.tsx eyebrow + date on 404 pages; newsletter archive issue-number span; various empty-state kicker spans (low real-user impact). `dc5be05`

### [x] [a11y] [6.3] SuggestedArticles 404 — h2 eyebrow + date span fail WCAG AA contrast on /article/[bad-slug] and /tag/[bad-slug] — addressed in be1221c (closes #112)
- category: a11y
- filed: 2026-05-15 by cloud /iterate audit
- impact: 7 (renders on /article/[slug] and /tag/[slug] not-found pages whenever a reader hits an unknown URL; the "did you mean?" eyebrow h2 and per-suggestion date span both use text-text-3 at small text sizes)
- ease: 9 (two class substitutions + data-testid additions + regression guards)
- score: 6.3 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px and 14px
- axe impact: serious
- pages: /article/[any-bad-slug] (article not-found), /tag/[any-bad-slug] (tag not-found)
- elements: `SuggestedArticles.tsx:52` — `<h2 className="... text-micro text-text-3">` (12px); `SuggestedArticles.tsx:70` — `<span className="text-small text-text-3">` (14px)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg (oklch(0.175 0.006 250)) fails WCAG AA 4.5:1 at 12–14px. Same root cause as the Phase B drain series (#91–#111).
- issue: #112
> **Resolved (2026-05-15):** Swapped text-text-3 → text-text-2 on both elements in `apps/web/src/components/not-found/SuggestedArticles.tsx`. Added `data-testid="not-found-suggestion-eyebrow"` on the h2 and `data-testid="not-found-suggestion-date"` on the date span. Regression guard in `apps/e2e/tests/a11y.spec.ts` navigates to `/article/gateron-switch` (non-existent slug whose "gateron switch" query yields Oil King hits), scopes `AxeBuilder.include()` to both testids, and asserts zero `color-contrast` violations; short-circuits safely if no suggestions render. 603 e2e green (+1 guard). Remaining Phase B candidates: NewsletterArchive empty-state + issue-number span, PartIndexCard statusTint fallback (sold-out/discontinued), various pillar-page empty-state kickers (low real-user impact). `be1221c`

### [x] [a11y] [5.6] remaining text-text-3 at text-micro — 16 instances across 13 routes — addressed in 2e4d25c (closes #113)
- category: a11y
- filed: 2026-05-16 by cloud /iterate audit
- impact: 8 (section-kicker spans render on every major route — /, /news, /trends, /guides, /ideas, /deep-dives, /group-buys, /group-buys/past, /tag/[slug], tracker — plus ArticleCard placeholder and NewsletterArchive issue-number label)
- ease: 7 (systematic class substitution, same pattern as the 12 previously drained audit rows)
- score: 5.6 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- elements: `<span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">` (13 identical route-level kicker spans), NewsletterArchive.tsx issue-number label (text-micro text-text-3), ArticleCard.tsx placeholder div (text-micro text-text-3), PageStub.tsx deferredTo span (dead code)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg fails WCAG AA 4.5:1 at 12px. Same root cause as audit rows #100–#112.
- issue: #113
> **Resolved (2026-05-16):** Swapped text-text-3 → text-text-2 + added data-testid="page-section-kicker" on all 13 route-level kicker spans and the tracker/[week]/not-found.tsx kicker. Fixed text-text-3 → text-text-2 in NewsletterArchive.tsx issue-number label, ArticleCard.tsx placeholder div, and PageStub.tsx deferredTo span (dead code, fixed for parity). All 16 instances cleared; grep returns 0 results. Regression guard: assertKickerContrast() helper + one test sampling /, /news, /trends, /guides, /ideas, /deep-dives, /group-buys; soft-skip when kicker is absent. 604 e2e green (+1 guard). `2e4d25c`

### [x] [a11y] [6.3] PartIndexCard sold-out/discontinued status badge — text-text-3 fails WCAG AA contrast on /part/keycap-set and /part/board — addressed in 61c65c2 (closes #114)
- issue: #114
- category: a11y
- filed: 2026-05-16 by cloud /iterate audit
- impact: 7 (PartIndexCard renders on /part/keycap-set and /part/board index pages; 4 real catalog entries carry sold-out or discontinued status: gmk-bento-r2, gmk-olivia, kat-drifter, class80)
- ease: 9 (one-line change in statusTint() fallback + data-testid addition + 1 regression guard)
- score: 6.3 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- axe impact: serious
- pages: /part/keycap-set, /part/board
- elements: `<span className="... text-micro {statusTint(status)}">` in `PartIndexCard.tsx:45` — the status badge for sold-out and discontinued parts. PartHero.tsx received the same fix in row #105 (66d6027); PartIndexCard.tsx was missed in that drain pass.
- root cause: statusTint() fallback (`return 'text-text-3'`) fires for sold-out and discontinued statuses. text-text-3 (oklch(0.55 0.006 250)) against --thock-bg (oklch(0.175 0.006 250)) gives ~4.4:1 — just below WCAG AA 4.5:1 at 12px. Same root cause as Phase B drain series (#91–#113).
> **Resolved (2026-05-16):** Changed fallback in statusTint() from `return 'text-text-3'` to `return 'text-text-2'` in `apps/web/src/components/part/PartIndexCard.tsx:18`. Added `data-testid="part-index-status"` to the status badge span. Regression guard in `apps/e2e/tests/a11y.spec.ts` navigates to `/part/keycap-set`, scopes `AxeBuilder.include('[data-testid="part-index-status"]')`, asserts zero `color-contrast` violations. 605 e2e green (+1 guard). `61c65c2`

### [x] [a11y] [4.5] newsletter empty-state body — text-body text-text-3 fails WCAG AA contrast on /newsletter — addressed in aba950b (closes #115)
- issue: #115
- category: a11y
- filed: 2026-05-16 by cloud /iterate audit
- impact: 5 (empty state always renders on /newsletter since no newsletters have been published; visible to every visitor)
- ease: 9 (one class substitution + data-testid addition + regression guard)
- score: 4.5 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 16px (text-body)
- axe impact: serious
- pages: /newsletter
- elements: `<p className="mt-3 text-body text-text-3">` in `apps/web/src/components/newsletter/NewsletterArchive.tsx:28` — empty-state description on bg-surface (oklch(0.235 0.006 250))
- root cause: text-text-3 (oklch(0.55 0.006 250)) against bg-surface gives ~3.1:1 — fails WCAG AA 4.5:1 at 16px. Same root cause as Phase B drain series (#91–#114). Last remaining text-text-3 instance on a currently-rendering text element in the source tree.
> **Resolved (2026-05-16):** Swapped text-text-3 → text-text-2 on the empty-state `<p>` in `apps/web/src/components/newsletter/NewsletterArchive.tsx:28`. Added `data-testid="newsletter-empty-body"` for regression guard scoping. Regression guard in `apps/e2e/tests/a11y.spec.ts` scopes `AxeBuilder.include('[data-testid="newsletter-empty-body"]')` on `/newsletter` and asserts zero `color-contrast` violations. 606 e2e green (+1 guard). The a11y Phase B text-text-3 drain series is now complete — grep across the source tree returns 2 remaining instances: `Header.tsx:31` (search icon SVG, non-text element at 3:1 threshold — passes WCAG 1.4.11) and `NewsletterArchive.tsx:55` (archive date text-text-4 at text-micro — pre-emptive concern for when newsletters ship, not currently rendering). `aba950b`

### [x] [MED] [5.4] lubing-101 missing guideSection — appears in "Other guides" instead of Modding — addressed in ae5c111 (closes #116)
- issue: #116
- category: content
- filed: 2026-05-16 by cloud /iterate audit
- impact: 6 (lubing-101 is the flagship 1700-word modding guide; without guideSection it renders in the "Other guides" catch-all bucket at the bottom of /guides, buried below Firmware / Modding / Switches / Keycaps sections — misses its rightful place in the Modding section alongside mounting-styles-compared and sound-dampening-compared)
- ease: 9 (one-line frontmatter addition)
- score: 5.4 (impact × ease / 10)
- pages: /guides
- root cause: `lubing-101.mdx` had no `guideSection` field; schema defaults to `null`; `groupGuidesBySection()` in `apps/web/src/app/guides/helpers.ts` routes null-section articles to `'other'` bucket labeled "Other guides", rendered last.
> **Resolved (2026-05-16):** Added `guideSection: modding` to `apps/web/src/content/articles/lubing-101.mdx` frontmatter. The article now appears in the Modding section alongside `mounting-styles-compared` and `sound-dampening-compared`. No test changes needed — the existing guides e2e covers section rendering. 606 e2e green. `ae5c111`

### [x] [test] [4.0] TrackerSummaryGrid + TrackerCategorySection — no unit tests for signature /trends/tracker components — addressed in 3edaf73 (closes #117)
- issue: #117
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 5 (both components power the /trends/tracker signature feature; every other sibling in tracker/__tests__/ was covered)
- ease: 8 (simple wrapper components, clear rendering behavior)
- score: 4.0 (impact × ease / 10)
- elements: `TrackerSummaryGrid.tsx` (null-return guard + slot count + name propagation), `TrackerCategorySection.tsx` (null-return + data-category attribute + row order + category label)
> **Resolved (2026-05-16):** Added `TrackerSummaryGrid.test.tsx` and `TrackerCategorySection.test.tsx` in `apps/web/src/components/tracker/__tests__/`. TrackerSummaryGrid tests: null on empty snapshot, grid renders on slot fill, card count matches slot count, name content propagates. TrackerCategorySection tests: null on empty rows, testid present + data-category attribute wired, all tracker-row items render in order, category heading label ("vendor movers") renders. 606 e2e green. `3edaf73`

### [x] [content] [3.0] mode-sonnet-r2-group-buy-coverage — 479 words, below 600-word quality threshold — addressed in f9d8bc5 (closes #119)
- issue: #119
- category: content
- filed: 2026-05-16 by cloud /iterate audit
- impact: 5 (live group-buy companion article shown in /group-buys feed and /news pillar; thin article undersells the board for R1-unfamiliar R2 buyers)
- ease: 6 (content-curator expansion of existing article)
- score: 3.0 (impact × ease / 10)
- pages: /article/mode-sonnet-r2-group-buy-coverage
- root cause: article was shipped as a concise news-style announcement; body covered timeline shift and accent-weight palette (479 words) but lacked any contextual section on the Sonnet chassis for first-time buyers.
> **Resolved (2026-05-16):** Added "The Sonnet, briefly" section (~200 words) covering gasket mount, PC plate default + brass/FR4 upgrade options, acoustic character (gasket + PC = cushioned, medium-thocky), and a callout on the 9-degree angle and no adjustable feet. Updated updatedAt to 2026-05-16. Article now at 764 words. 620 e2e green. `f9d8bc5`

### [x] [test] [4.2] SwitchQuiz orchestrator missing unit tests — addressed in ffe392e (closes #120)
- issue: #120
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 6 (SwitchQuiz.tsx is the 127-line phase-33 quiz orchestrator; sub-components QuizStep/QuizProgress/ResultCard all had tests but the orchestrator managing step state, answer accumulation, setTimeout auto-advance, results surface, and reset flow had none)
- ease: 7 (straightforward testing-library + fake-timers pattern, no mocks of non-trivial dependencies)
- score: 4.2 (impact × ease / 10)
- elements: `apps/web/src/components/quiz/SwitchQuiz.tsx`
> **Resolved (2026-05-16):** Added `apps/web/src/components/quiz/__tests__/SwitchQuiz.test.tsx` with 5 unit tests: initial render (Q1 + progress), option click advances step after 150ms setTimeout, completing all 4 questions shows quiz-results testid, result links route to /part/switch/*, "Start over" resets to step 0. Uses `vi.useFakeTimers()` + `act(() => vi.advanceTimersByTime(200))` to handle the auto-advance delay; mocks `scrollIntoView` for jsdom. 620 e2e green. `ffe392e`

### [x] [a11y] [7.2] quiz components — text-text-3 at 14px fails WCAG AA contrast on /quiz/switch — addressed in ae1e86a (closes #121)
- issue: #121
- category: a11y
- filed: 2026-05-16 by cloud /iterate audit
- impact: 8 (quiz is the phase-33 feature with a prominent home-page CTA; option descriptions affect every question step, progress label renders on all 4 steps, "% match" renders on every result card)
- ease: 9 (3 class substitutions + data-testid additions + regression guards)
- score: 7.2 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 14px
- axe impact: serious
- pages: /quiz/switch
- elements: `QuizStep.tsx:36` option description (text-sm text-text-3); `QuizProgress.tsx:10` progress label (text-text-3 text-sm); `ResultCard.tsx:62` match % (text-small font-mono text-text-3)
- root cause: text-text-3 (oklch(0.55 0.006 250)) against --thock-bg (oklch(0.175)) and bg-surface (oklch(0.235)) fails WCAG AA 4.5:1 at 14px. Same root cause as Phase B drain series (#100–#115). Phase 33 components shipped after the systematic Phase B sweep.
> **Resolved (2026-05-16):** Swapped text-text-3 → text-text-2 on all three elements. Added data-testid="quiz-option-description" (QuizStep), data-testid="quiz-progress-label" (QuizProgress), data-testid="result-card-pct" (ResultCard). Unit tests in QuizStep.test.tsx, QuizProgress.test.tsx, ResultCard.test.tsx assert text-text-2 present and text-text-3 absent. Two regression guards in a11y.spec.ts: static check on /quiz/switch for progress label + option description; interactive check clicking through 4 questions and asserting zero color-contrast on result-card-pct. 622 e2e green (+2 guards). `ae1e86a`

### [x] [test] [4.8] RelatedArticleCard — no colocated unit test (all article pages)
- issue: #122
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 6 (RelatedArticleCard is the "row" variant article card rendered in the related-articles rail on every /article/* page; the component has real testable logic: pillarLabel() eyebrow, Intl.DateTimeFormat date formatting, lede paragraph, link href construction)
- ease: 8 (plain functional component, no RSC, no async, no MDX — straightforward testing-library)
- score: 4.8 (impact × ease / 10)
- pages: /article/* (all 40+ article pages via RelatedArticlesRail)
- elements: `apps/web/src/components/article/RelatedArticleCard.tsx` — no `__tests__/RelatedArticleCard.test.tsx` exists; sibling `RelatedArticlesRail.test.tsx` tests the rail container but does not import or exercise the card
- root cause: component shipped as part of the article page phase but colocated test was never added; the rail-level test covers count/null-render, not the card's rendering logic
> **Resolved (2026-05-16):** Added 9-test suite: testid, link href, pillarLabel() eyebrow, h3 title, lede, `<time dateTime>` attribute, formatted date, author, read time. 622 e2e green. `b922976`

### [x] [test] [5.6] ArticleResult — no unit tests for /search result card — addressed in 768abe7 (closes #123)
- issue: #123
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 7 (ArticleResult powers the /search results list — primary discovery surface; the component has real testable rendering logic: pillarLabel() eyebrow, ISO-date slicing, data-slug/data-score attributes, tag-chip rail capped at 6, conditional tag section)
- ease: 8 (plain functional component, no RSC, no async — straightforward testing-library)
- score: 5.6 (impact × ease / 10)
- pages: /search (all search visits)
- elements: `apps/web/src/components/search/ArticleResult.tsx` — no `search/__tests__/` directory existed; component shipped as part of phase 14 (Search) with no colocated test
- root cause: search/__tests__/ directory was never created; every other component family with rendering logic has colocated tests
> **Resolved (2026-05-16):** Created `apps/web/src/components/search/__tests__/ArticleResult.test.tsx` with 9-test suite: testid present, data-slug attribute, data-score toFixed(3), pillarLabel() eyebrow, date slice to 10 chars, title h2 links to /article/[slug], lede paragraph, tag chips for each tag, no chips when tags empty, cap at 6. 622 e2e green. `768abe7`

### [x] [test] [4.5] TagGroup — no colocated unit tests for category heading/tint logic — addressed in 42c9796 (closes #127)
- issue: #127
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 5 (renders on /tags discovery page; CATEGORY_TINT has a misc special-case (text-text-2 vs text-tag-*) that could silently regress without tests; CATEGORY_LABEL mapping + chip count logic also untested)
- ease: 9 (plain functional component, no RSC, no async)
- score: 4.5 (impact × ease / 10)
- elements: `apps/web/src/components/tags/TagGroup.tsx` — no `__tests__/TagGroup.test.tsx` existed; sibling `TagsIndex.test.tsx` covers the grouping helper but not the component rendering
> **Resolved (2026-05-17):** Added `apps/web/src/components/tags/__tests__/TagGroup.test.tsx` with 8 tests: section data-testid per category, heading label for switch, heading label for misc, tint class for switch (text-tag-switch), misc special-case class (text-text-2, no text-tag-*), chip count matches tags array, chip link hrefs (/tag/<slug>), empty-tags renders no chips. 622 e2e green. `42c9796`

### [x] [test] [4.5] deep-dives helpers — sortDeepDivesByLength() has no unit tests — addressed in 0f2904b
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 5 (sortDeepDivesByLength powers the /deep-dives pillar sort order — longest reads first — across all 8 deep-dives articles; same pattern as recently-tested guides/helpers and ideas/helpers)
- ease: 9 (pure function, no RSC, no async, no external deps — identical pattern to groupGuidesBySection and pickBuildOfTheWeek)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-17T00:00:00Z]
- elements: `apps/web/src/app/deep-dives/helpers.ts` — sortDeepDivesByLength() (readTime desc, publishedAt desc tie-break, slug asc build-stability tie-break) — no `__tests__/` directory existed
> **Resolved (2026-05-17):** Added `apps/web/src/app/deep-dives/__tests__/helpers.test.ts` with 7 tests: empty array, single article, readTime desc sort order, publishedAt desc tie-break, slug asc build-stability tie-break, all three keys in cascade, and input array immutability. 628 e2e green. `0f2904b`

### [x] [content] [3.5] GMK CYL Ramune — no group-buy record and no companion article despite being the highest-scoring non-flat W21 tracker row — addressed in `8edcd45`
- category: content
- filed: 2026-05-17 by cloud /iterate audit
- impact: 7 (GMK CYL Ramune score=38 direction=up in W21 — highest non-flat keycap row; GB opened 2026-05-15 across 10 global vendors; no data record or companion article; Rule 3 gap created and immediately resolved in same tick)
- ease: 5 (new data record + content-curator article + hero SVG + tracker linkage)
- score: 3.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-17T00:00:00Z]
- pages: /group-buys, /news, /trends/tracker/2026-W21
- elements: `data/group-buys/kbdfans-gmk-cyl-ramune.json` (new), `apps/web/src/content/articles/gmk-cyl-ramune-group-buy.mdx` (new), `data/trends/2026-W21.json` GMK CYL Ramune articleSlug field + Wuque Studio articleSlug field

### [x] [test] [4.5] board + keycap-set schemas — no unit tests — addressed in 3bcab05 (closes #133)
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 5 (board and keycap-set schemas drive /part/board/* and /part/keycap-set/* pages; enum constraints layout/caseMaterial/mountStyle + profile/material/legendType/designer had no regression guard; the other 4 of 6 schemas all had __tests__/schemas/ coverage)
- ease: 9 (direct port of vendor.test.ts / switch.test.ts pattern — VALID fixture from real seed record, safeParse assertions)
- score: 4.5 (impact × ease / 10)
- issue: #133
- elements: `packages/data/src/schemas/board.ts`, `packages/data/src/schemas/keycap-set.ts` — no `__tests__/schemas/board.test.ts` or `keycap-set.test.ts` existed; `ls packages/data/src/__tests__/schemas/` returned only group-buy / switch / trend / vendor
> **Resolved (2026-05-17):** Added `packages/data/src/__tests__/schemas/board.test.ts` (5 tests: valid acceptance, unknown layout rejection, unknown mountStyle rejection, unknown caseMaterial rejection, null releasedAt acceptance) and `packages/data/src/__tests__/schemas/keycap-set.test.ts` (5 tests: valid acceptance, unknown profile rejection, unknown material rejection, unknown legendType rejection, null designer acceptance). Pattern identical to vendor.test.ts / switch.test.ts. 631 e2e green. `3bcab05`

### [x] [data] [3.6] cannonkeys-nyawice: status "live" but endDate 2026-05-17 (closed yesterday) — addressed in 1d34cd8 (closes #139)
- category: data
- filed: 2026-05-18 by cloud /iterate audit
- impact: 4 (source-of-truth field wrong; renderer-side guard in GroupBuyRow.tsx absorbs user-visible "LIVE" label leak on /group-buys; but /group-buys/past archive selection, RSS, JSON-LD, and downstream consumers see the stale status)
- ease: 9 (one JSON field flip; schema enum already allows "closed")
- score: 3.6 (impact × ease / 10)
- root cause: no automation refreshes group-buy status as endDate passes. Same drift pattern as GSK Sweet Nightmare (fixed 3443fe9, closes #89) and Ishtar R2 (renderer-side guard 478c952).
- issue: #139
> **Resolved (2026-05-18):** Flipped status "live" → "closed", bumped updatedAt to 2026-05-18T00:00:00.000Z on data/group-buys/cannonkeys-nyawice.json. Updated group-buys.test.ts "includes live buys" assertion from Nyawice (now closed) to kbdfans-gmk-cyl-greg-2 (also live on the test's reference date 2026-05-10). 631 e2e green. `1d34cd8`

### [x] [test] [3.6] ArticleBody — no unit test (sole untested article component) — addressed in 40ac380 (closes #140)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 6 (ArticleBody.tsx wraps MDXRemote and binds resolved parts to PartReference for all 42 article pages; every sibling component in the article family has colocated tests)
- ease: 6 (mock next-mdx-remote/rsc + @thock/content/mdx; straightforward testing-library tests)
- score: 3.6 (impact × ease / 10)
- issue: #140
- elements: `apps/web/src/components/article/ArticleBody.tsx` — no `__tests__/ArticleBody.test.tsx` existed; sole untested component in the article family
> **Resolved (2026-05-18):** Added `apps/web/src/components/article/__tests__/ArticleBody.test.tsx` with 4 tests: (1) data-testid="article-body" wrapper present; (2) body source passed to MDXRemote; (3) no-error render when parts omitted (defaults to []); (4) no-error render when parts array provided. Mocks next-mdx-remote/rsc (async RSC) and @thock/content/mdx (full remark pipeline). 431 unit tests, 631 e2e green. `40ac380`

### [x] [test] [4.5] data-runtime part-catalog adapters — 7 untested functions (getAllSwitches, getSwitchBySlug, getAllKeycapSets, getKeycapSetBySlug, getAllBoards, getBoardBySlug, getGroupBuyBySlug) — addressed in 7889df4 (closes #141)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 5 (these functions power /part/switch/*, /part/keycap-set/*, /part/board/*, and the quiz getAllSwitches call; bugs would silently break part-catalog pages without any test regression guard)
- ease: 9 (direct port of the existing vendor/trend/newsletter test pattern in loaders.test.ts)
- score: 4.5 (impact × ease / 10)
- issue: #141
- elements: `apps/web/src/lib/data-runtime/index.ts` — getAllSwitches, getSwitchBySlug, getAllKeycapSets, getKeycapSetBySlug, getAllBoards, getBoardBySlug, getGroupBuyBySlug — none imported or tested in loaders.test.ts; the 82b53c6 pass covered 7 other untested loaders (vendors, trends, newsletters, getArticlesMentioningPart) but missed the part-catalog adapters
> **Resolved (2026-05-18):** Added 11 tests to `apps/web/src/lib/data-runtime/__tests__/loaders.test.ts`: getAllSwitches (length + type validation), getSwitchBySlug (slug round-trip + null on unknown), getAllKeycapSets (length), getKeycapSetBySlug (gmk-olivia round-trip + null on unknown), getAllBoards (length), getBoardBySlug (mode-sonnet round-trip + null on unknown), getGroupBuyBySlug (kbdfans-gmk-cyl-greg-2 round-trip + null on unknown). 442 unit tests, 631 e2e green. `7889df4`

### [x] [data] [5.6] kbdfans-gmk-cyl-prussian-alert — live GB opened 2026-05-15, missing group-buy data record — addressed in this commit
- category: data
- filed: 2026-05-18 by cloud /iterate audit
- impact: 8 (live group buy since May 15; companion article at /article/gmk-cyl-prussian-alert promises "live entry will land on the /group-buys board" — 3 days post-open the record was absent; W21 tracker has the set at score=54 direction=up; /group-buys board was missing the highest-scoring non-flat keycap row)
- ease: 7 (one JSON data record + hero SVG via brander; all details available from article + W21 tracker)
- score: 5.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-18T00:00:00Z]
> **Resolved (2026-05-18):** Added `data/group-buys/kbdfans-gmk-cyl-prussian-alert.json` (status=live, startDate=2026-05-15, endDate=2026-06-12, productKind=keycap-set, vendorSlug=kbdfans, region=global). Hero SVG at `apps/web/public/group-buy-art/kbdfans-gmk-cyl-prussian-alert.svg` rendered by brander (Cherry-profile cluster, Prussian-red splash `oklch(0.45 0.14 25)`, cream alphas, bronze theme dot). 34 data records, 8 group-buys, all valid. 442 unit tests, 631 e2e green.

### [x] [test] [4.5] shared.ts — foundational Zod building-block schemas have no direct unit tests — addressed in this commit (closes #143)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 5 (SlugSchema, IsoDateSchema, DateOnlySchema, UrlSchema, CountryCodeSchema, IsoWeekSchema, HousingMaterialSchema, StemMaterialSchema are used by all 6 entity schemas; a regex change here would silently break all schema validation with no direct regression guard catching it first)
- ease: 9 (trivial safeParse tests, same pattern as existing entity schema tests)
- score: 4.5 (impact × ease / 10)
- issue: #143

### [x] [test] [6.3] Source.tsx — no unit test for external-link guard logic (26 of 42 articles) — addressed in 6e851b9 (closes #145)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 7 (Source renders in 26 of 42 articles — 62% of the corpus; the isExternal check adds rel="noopener" target="_blank" for https?:// URLs and must not silently regress; data-source="true" is the extraction marker used by /sources)
- ease: 9 (simple functional component, one conditional branch)
- score: 6.3 (impact × ease / 10)
- issue: #145

---

(Older findings drained as they ship. Empty until other audit
passes accumulate signals.)

### [x] [test] [5.6] group-buys helpers.ts — no unit tests for partitionGroupBuys / splitLiveByUrgency — addressed in b279ab8 (closes #126)
- issue: #126
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 7 (partitionGroupBuys powers /group-buys live/announced/ended bucket assignment; bugs here would silently mis-route buys — no component test would catch a partition-level regression)
- ease: 8 (pure functions with injected `now: Date` parameter — designed for testability but tests were never written)
- score: 5.6 (impact × ease / 10)
- elements: `apps/web/src/app/group-buys/helpers.ts` — `partitionGroupBuys()` (live/announced/ended routing, sort orders, ENDED_CAP=6) and `splitLiveByUrgency()` (≤3 days → closingSoon, else liveOpen)
> **Resolved (2026-05-16):** Added `apps/web/src/app/group-buys/__tests__/helpers.test.ts` with 12 tests covering both functions: live/announced/ended/shipped/expired-live routing, ENDED_CAP=6 enforcement, live endDate-asc sort, ended endDate-desc sort, splitLiveByUrgency 0-day/3-day → closingSoon, 4-day → liveOpen, mixed list. 622 e2e green. `b279ab8`

### [x] [test] [4.5] HomeSectionHeading — no colocated unit tests — addressed in e18e10b4b5c2476f6f020301297bb6f8fe3389e7 (this tick)
- issue: #125
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 5 (used on /, /group-buys, /ideas, /newsletter, tracker category sections — multiple high-traffic surfaces; four independent variants unguarded)
- ease: 9 (plain functional component, no RSC, no async)
- score: 4.5 (impact × ease / 10)
- elements: `apps/web/src/components/home/HomeSectionHeading.tsx` — optional kicker span, dynamic h2/h3 level, optional "more →" link, title content
> **Resolved (2026-05-16):** Added `apps/web/src/components/home/__tests__/HomeSectionHeading.test.tsx` with 8 tests: data-testid wrapper, default h2 rendering, h3 when level=3, kicker span rendered when provided, no kicker when omitted, "more →" link with correct href, no link when omitted, title text. 622 e2e green. `5f9c191`

### [x] [test] [4.8] CitationIndex — no unit tests for buildCitationIndex() or component — addressed in 36da3f3 (closes #124)
- issue: #124
- category: test
- filed: 2026-05-16 by cloud /iterate audit
- impact: 6 (CitationIndex renders on /sources, accessible from footer nav on every page; buildCitationIndex() has dedup/sort logic worth regression-guarding)
- ease: 8 (pure helper + straightforward component rendering)
- score: 4.8 (impact × ease / 10)
- elements: `apps/web/src/components/sources/CitationIndex.tsx` — buildCitationIndex() (dedup by href, first-non-null text, per-entry article sort by publishedAt desc, output sort by most-recent-article desc) + CitationIndex component (empty state vs populated list)
> **Resolved (2026-05-16):** Added `apps/web/src/components/sources/__tests__/CitationIndex.test.tsx` with 11 tests: 6 for buildCitationIndex() (empty input, single pair, same-article dedup, multi-article publishedAt-desc sort, first-non-null text wins, output sort) and 5 for CitationIndex component (empty state, row count, data-href attribute, host span, article link href). 622 e2e green. `36da3f3`

### [x] [test] [4.5] guides helpers — groupGuidesBySection() has no unit tests — addressed in 9ea52ef (closes #129)
- issue: #129
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 5 (groupGuidesBySection powers /guides pillar section layout; the lubing-101 fix #116 demonstrated the null→other routing is real and exercised in production — no regression guard exists)
- ease: 9 (pure function, no RSC, no async, no external deps)
- score: 4.5 (impact × ease / 10)
- elements: `apps/web/src/app/guides/helpers.ts` — groupGuidesBySection() (section grouping, canonical SECTION_ORDER, updatedAt/publishedAt freshness sort, null→other bucket, empty-section dropping) + private sortByFreshness() exercised through it
> **Resolved (2026-05-17):** Added `apps/web/src/app/guides/__tests__/helpers.test.ts` with 9 tests: empty input, firmware placement, null→other bucket, canonical section order (firmware/modding/switches/keycaps/other), empty-section dropping, updatedAt desc sort, publishedAt fallback when updatedAt is null, publishedAt tie-break, slug asc tie-break for build stability, and input-array immutability. 622 e2e green. `9ea52ef`

### [x] [test] [4.8] ideas helpers — pickBuildOfTheWeek + isoWeekNumber lack unit tests — addressed in 5ccb872 (closes #128)
- issue: #128
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 6 (pickBuildOfTheWeek selects the ideas pillar's featured Build-of-the-Week slot; isoWeekNumber drives the "Week N" kicker display — both surfaces on the ideas homepage with zero prior coverage for isoWeekNumber)
- ease: 8 (two pure functions with no async, no RSC, no external deps)
- score: 4.8 (impact × ease / 10)
- elements: `apps/web/src/app/ideas/helpers.ts` — pickBuildOfTheWeek() (filter by tag, sort by publishedAt desc) + isoWeekNumber() (ISO 8601 week calculation with year-boundary edge cases)
> **Resolved (2026-05-17):** Added `apps/web/src/app/ideas/__tests__/helpers.test.ts` with 11 tests: 5 for pickBuildOfTheWeek (empty input, no tagged articles, single tagged article, newest publishedAt wins, no mutation) and 6 for isoWeekNumber (invalid → 0, W20 Monday boundary, W20 Sunday, W21 Monday, year-boundary 2025-12-29 → W01 of 2026, Jan 1 Thu → W01). 622 e2e green. `5ccb872`

### [x] [3.0] trends tracker — DCS Olivetti (W19, +18) lacks Rule 2 articleSlug linkage — addressed in 4d61b74 (closes #130)
- issue: #130
- category: content-gaps
- filed: 2026-05-17 by cloud /iterate audit (Rule 2 scan)
- impact: 6 (W19 non-flat tracker row without editorial coverage; 14d threshold breaches 2026-05-18)
- ease: 5 (one new article + hero SVG + data/trends W19 update)
- score: 3.0 (impact × ease / 10)
- rule: bearings.md Rule 2 — tracker linkage within 14d of ISO week start
- data: data/trends/2026-W19.json row "DCS Olivetti" direction=up score=18, articleSlug was null
> **Resolved (2026-05-17):** Shipped `apps/web/src/content/articles/dcs-olivetti-comeback.mdx` (~1,050 words, trends pillar, publishedAt 2026-05-14T00:00:00.000Z). Hero SVG at `/hero-art/dcs-olivetti-comeback.svg`. 3 InlineViz SVGs (spark trajectory, DCS vs Cherry profile comparison, profile era map). New tag `dcs` (profile) added to tags.json. `data/trends/2026-W19.json` DCS Olivetti `articleSlug` set to `dcs-olivetti-comeback`. 628 e2e green. `4d61b74`

### [x] [test] [5.4] boards + keycap-sets loaders — no unit tests — addressed in 37a81d5
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 6 (both loaders drive /part/board/* and /part/keycap-set/* pages plus getReferencedParts() in MentionedPartsRail on all 40+ article pages; same behavioral surface as switches.test.ts which has been in place since phase 2)
- ease: 9 (direct port of switches.test.ts pattern — 4 tests per loader, memo reset afterEach, known seed slugs: mode-sonnet / gmk-olivia)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-17T00:00:00Z]
- elements: `packages/data/src/loaders/boards.ts` (getAllBoards, getBoardBySlug) + `packages/data/src/loaders/keycap-sets.ts` (getAllKeycapSets, getKeycapSetBySlug)
> **Resolved (2026-05-17):** Added `packages/data/src/__tests__/loaders/boards.test.ts` (4 tests: seed present → mode-sonnet, sorted-by-slug, known slug resolves to Mode Sonnet, unknown slug → null) and `packages/data/src/__tests__/loaders/keycap-sets.test.ts` (4 tests: seed present → gmk-olivia, sorted-by-slug, known slug resolves to GMK Olivia, unknown slug → null). Pattern identical to switches.test.ts. 631 e2e green. `37a81d5`

### [x] [test] [4.8] getReferencedParts() — no unit tests for parts loader — addressed in 220cddc (closes #131)
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 6 (getReferencedParts() powers MentionedPartsRail on all 40+ article pages; dispatch logic has 3 kind branches + null-drop guard + order preservation — no regression guard existed)
- ease: 8 (pure function, real seed slugs usable directly, no mocking needed)
- score: 4.8 (impact × ease / 10)
- issue: #131
- elements: `packages/content/src/loaders/parts.ts` — getReferencedParts() (switch/keycap-set/board dispatch, null-drop, frontmatter-order preservation)
> **Resolved (2026-05-17):** Added `packages/content/src/__tests__/loaders/parts.test.ts` with 6 tests: empty mentionedParts → []; switch ref (gateron-oil-king) resolves with correct id/kind/slug/record; keycap-set ref (gmk-olivia) resolves; board ref (mode-sonnet) resolves; unknown slug dropped → []; mixed list with unresolvable entry preserves frontmatter order for the resolved entries. 631 e2e green. `220cddc`

### [x] [test] [5.6] svg-validity gate misses article-viz/ (84 uncovered SVGs) — addressed in 1c7b470 (closes #132)
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 7 (84 InlineViz SVGs across 41 article subdirs unguarded; XML double-hyphen bug reproduced on prussian-alert + 3 group-buy heroes in phase 23; InlineViz is highest-volume brander output)
- ease: 8 (recursive walker + add 'article-viz' to SVG_DIRS)
- score: 5.6 (impact × ease / 10)
- issue: #132
- elements: `apps/web/src/__tests__/svg-validity.test.ts` — SVG_DIRS missing 'article-viz'; listSvgFiles not recursive
> **Resolved (2026-05-17):** Introduced `walkSvgs()` recursive helper replacing the flat `readdirSync` loop; added `'article-viz'` to `SVG_DIRS`. Walker now covers all 3 brander output trees (hero-art/: 42 SVGs, group-buy-art/: 6, article-viz/: 84) and handles any future multi-level destination without per-dir special casing. 631 e2e green. `1c7b470`

### [x] [test] [3.5] meta.spec.ts JSON-LD shape audit gaps for 8 route families (phases 21–33) — addressed in 0f23cf2 (closes #134)
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 5 (8 route families shipped in phases 21–33 fell through to [] in expectedTypesFor — JSON-LD parse checked but @type not asserted; regression in type on quiz, tags, group-buys/past, part/[kind], part/[kind]/[slug], tracker/[week] would be invisible to the e2e gate)
- ease: 7 (add 8 pattern-match cases to expectedTypesFor; each 1–2 lines)
- score: 3.5 (impact × ease / 10)
- issue: #134
- elements: `apps/e2e/tests/meta.spec.ts` — expectedTypesFor() missing cases for post-phase-17 routes
> **Resolved (2026-05-17):** Added 8 cases to expectedTypesFor: /quiz/switch → WebApplication; /tags → CollectionPage+BreadcrumbList+ItemList; /group-buys/past → same; /part/[kind] index → same; /part/board/[slug] → Thing+BreadcrumbList; /part/(switch|keycap-set)/[slug] → Product+BreadcrumbList; /trends/tracker/YYYY-WNN → CollectionPage+BreadcrumbList+Dataset. 631 e2e green. `0f23cf2`

### [x] [test] [4.5] @thock/content memo.ts — caching contract has no direct unit tests — addressed in 66c5ca8 (closes #144)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 5 (@thock/content memo() is the foundational caching layer for all content loaders; 4 test files import __resetForTests but the caching contract itself was uncovered)
- ease: 9 (pure module, no async, no fs; direct port of the 5-test data/memo.test.ts pattern shipped at be85a0a)
- score: 4.5 (impact × ease / 10)
- issue: #144
- elements: `packages/content/src/loaders/memo.ts` — caching contract (fn called exactly once, same reference returned, __resetForTests clears all entries, independent keys don't share cache)
> **Resolved (2026-05-18):** Added `packages/content/src/__tests__/loaders/memo.test.ts` with 5 tests mirroring the data package's memo.test.ts: loader called exactly once across 3 invocations; same (identical) object reference returned; __resetForTests causes re-invocation; independent keys don't share values; __resetForTests clears all keys simultaneously. 636 unit tests, 631 e2e green. `66c5ca8`

### [x] [test] [4.5] packages/data memo.ts — no direct unit tests for caching contract — addressed in be85a0a
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 5 (memo() is the foundational caching layer used by all 6 data loaders; a broken cache contract would silently corrupt data across loader calls)
- ease: 9 (pure module, no async, no fs, injected vi.fn() stubs)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-18T00:00:00Z]
- elements: `packages/data/src/loaders/memo.ts` — caching contract (fn called exactly once), __resetForTests() clears all entries, independent keys don't share cache, same reference returned on subsequent calls

### [x] [test] [4.5] data-runtime: 7 exported functions lack direct unit tests — addressed in 82b53c6 (closes #138)
- category: test
- filed: 2026-05-17 by cloud /iterate audit
- impact: 5 (getAllVendors/getVendorBySlug power vendor lookup on part pages; getAllTrendSnapshots/getTrendSnapshot drive tracker archive generateStaticParams; getAllNewsletters/getNewsletterBySlug used by /newsletter; getArticlesMentioningPart has filtering+sorting logic and powers all 18 /part/[kind]/[slug] "mentioned in" rails)
- ease: 9 (pure functions with no async or RSC; all add to the existing loaders.test.ts)
- score: 4.5 (impact × ease / 10)
- issue: #138
- elements: `apps/web/src/lib/data-runtime/__tests__/loaders.test.ts` — missing getAllVendors, getVendorBySlug, getAllTrendSnapshots, getTrendSnapshot, getAllNewsletters, getNewsletterBySlug, getArticlesMentioningPart
> **Resolved (2026-05-17):** Added 8 tests to `apps/web/src/lib/data-runtime/__tests__/loaders.test.ts`: vendor sort + slug lookup + unknown-null; trend snapshot list + week lookup + unknown-null; newsletter empty-list + unknown-null; getArticlesMentioningPart filter (gateron-oil-king → ≥1 article, publishedAt-desc order) + empty-on-unknown-slug. 427 unit tests, 631 e2e green. `82b53c6`

### [x] [test] [4.0] @thock/data and @thock/content paths.ts — path utility functions lack direct unit tests — addressed in 1741175
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 5 (both paths.ts modules are the foundational filesystem layer for all loaders in their respective packages; fileBaseName(), listEntityFiles(), articlesDir(), etc. called on every getAll* invocation with no regression guard)
- ease: 8 (fileBaseName is pure; setRepoRootForTests exists in @thock/data for injection; listArticleFiles/listEntityFiles can exercise the real seed data)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-18T00:00:00Z]
- elements: `packages/data/src/loaders/paths.ts` (fileBaseName, listEntityFiles, dataDir, entityDir); `packages/content/src/loaders/paths.ts` (fileBaseName, listArticleFiles, listNewsletterFiles, articlesDir, tagsFile)
> **Resolved (2026-05-18):** Added `packages/data/src/__tests__/loaders/paths.test.ts` (8 tests: fileBaseName 4 edge cases, dataDir + entityDir via setRepoRootForTests, listEntityFiles sorted + empty-on-unknown) and `packages/content/src/__tests__/loaders/paths.test.ts` (9 tests: fileBaseName 4 edge cases, listArticleFiles sorted + seed-slug presence, listNewsletterFiles returns array, articlesDir + tagsFile path suffix assertions). 631 e2e green. `1741175`

### [x] [test] [3.6] SearchPanel.tsx — no unit test for /search primary UI component — addressed in bce4ec4 (closes #146)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 6 (SearchPanel is the primary /search surface; owns debounce, URL param hydration, and three distinct render states — no regression guard existed despite all sibling components being tested)
- ease: 6 (client component with hooks; vi.mock() for next/navigation + @/lib/search/runtime; vi.useFakeTimers() for debounce)
- score: 3.6 (impact × ease / 10)
- issue: #146
> **Resolved (2026-05-18):** Added `apps/web/src/app/search/__tests__/SearchPanel.test.tsx` with 4 tests: (1) empty-query hint renders search-empty-query testid; (2) debounced query with hits renders search-results testid; (3) non-matching query renders "no matches" text + all 5 pillar fallback links; (4) ?q= URL param pre-populates input + triggers search on mount. Mocks next/navigation useSearchParams and @/lib/search/runtime searchArticles; vi.useFakeTimers() handles 120ms debounce. 446 unit tests (+4), 631 e2e green. `bce4ec4`

### [x] [test] [4.8] tracker/index.ts — 5 pure helpers driving Trends Tracker have no unit tests — addressed in 76c4e90
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 6 (pickSummarySlots/groupByCategory/weekKicker/formatDelta/presentCategories drive the signature Trends Tracker dashboard — TrackerSummaryGrid, TrackerCategorySection, and the tracker page route; pickSummarySlots has non-trivial dedup + slot-selection logic amended in critique pass 9 with no regression guard)
- ease: 8 (pure functions, no async, no RSC, no mocking needed)
- score: 4.8 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-18T00:00:00Z]
- elements: `apps/web/src/lib/tracker/index.ts` — pickSummarySlots, groupByCategory, weekKicker, formatDelta, presentCategories
> **Resolved (2026-05-18):** Added `apps/web/src/lib/tracker/__tests__/index.test.ts` with 23 tests across all 5 functions. pickSummarySlots: 6 tests (empty input, all-4-slots, no-reuse, breakout-by-spark-slope, faller-fallback, sleeper-drops). groupByCategory: 4 tests (bucket init, score-desc, name-asc tie-break, routing). weekKicker: 4 tests (valid parse, empty string, missing padding, W01). formatDelta: 6 tests (null, flat, zero, positive, negative, rounding). presentCategories: 3 tests (filters empty, canonical order, single). 469 unit tests total. 631 e2e green. `76c4e90`

### [x] [test] [4.8] PartReference.tsx — sole untested MDX component with branching rendering logic — addressed in 309b79a
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 6 (PartReference is the only MDX component in packages/content/src/mdx/ without a test; it drives part-link rendering in ArticleBody for all 42 article pages — switch/keycap-set/board branching, conditional anchor with rel="sponsored noopener", and fallback text had no regression guard despite all sibling MDX components being tested)
- ease: 8 (pure React component, no async, no RSC, no router — simple render + querySelector assertions; mock pattern established by MentionedPartsRail.test.tsx)
- score: 4.8 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-18T00:00:00Z]
- elements: `packages/content/src/mdx/PartReference.tsx` — switch/keycap-set/board kind branches, vendorHref null guard, fallback prop, sponsored link rel
> **Resolved (2026-05-18):** Added `packages/content/src/__tests__/mdx/PartReference.test.tsx` with 6 tests: (1) default fallback `[unknown part:id]` when parts array is empty; (2) custom fallback prop; (3) switch kind → Mono with no anchor; (4) keycap-set with imageUrl → anchor with rel="sponsored noopener"; (5) keycap-set with imageUrl null → Mono only; (6) board with imageUrl → anchor + Mono. 475 unit tests total. 631 e2e green. `309b79a`

### [x] [test] [4.2] walkAll() in validate/walk.ts — no direct unit tests for production filesystem validation path — addressed in 49d4ba7
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 7 (walkAll() is the production filesystem walk + schema validation path invoked by pnpm data:validate via validateAll() without synthetic input; JSON-parse error capture, schema-validation failure capture, and the full 34-record real-data walk were uncovered — all validate/index.test.ts cases use synthetic { records: ... } input)
- ease: 6 (needs setRepoRootForTests injection for isolation tests; uses mkdtempSync + temp dir for the error-path tests; pattern established by paths.test.ts)
- score: 4.2 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-18T22:31:00Z]
- elements: `packages/data/src/validate/walk.ts` — walkAll() real filesystem walk, JSON parse error capture, schema validation failure capture, ParsedRecord shape
> **Resolved (2026-05-18):** Added `packages/data/src/__tests__/validate/walk.test.ts` with 5 tests: (1) real data directory produces no failures — regression guard for all 34 live records; (2) parsed records cover all 6 entity kinds; (3) each ParsedRecord has correct kind/file/baseName/data shape; (4) invalid JSON file captured as ParseFailure with "failed to parse JSON" message; (5) schema-invalid JSON captured as ParseFailure for the correct kind. Tests 4–5 use mkdtempSync + setRepoRootForTests injection (pattern from paths.test.ts). 113 data tests total (+5). 631 e2e green. `49d4ba7`

### [x] [test] [4.8] Callout / Caption / PullQuote — 3 MDX prose components have no unit tests — addressed in d06a8fa (closes #147)
- category: test
- filed: 2026-05-18 by cloud /iterate audit
- impact: 6 (Callout renders in 31 of 42 articles; has TONE map (note/warn/info), conditional title h2 with data-testid="callout-title", and text-text-2 a11y fix from #102 — all unguarded. Caption and PullQuote each have data-testid attributes added during Phase B a11y drain with no regression guard)
- ease: 8 (functional components, no RSC, no async, no router — same test pattern as Source.tsx and PartReference.tsx)
- score: 4.8 (impact × ease / 10)
- issue: #147
> **Resolved (2026-05-18):** Added `Callout.test.tsx` (7 tests: role="note", TONE map for note/warn/info, conditional title h2 with data-testid="callout-title" + text-text-2 class regression guard for #102 a11y fix, no-h2 when omitted, children), `Caption.test.tsx` (3 tests: p element, data-testid="article-caption", children), `PullQuote.test.tsx` (5 tests: blockquote, no footer without attribution, footer with data-testid="pullquote-attribution", em-dash prefix, children). 490 unit tests total (+15). 631 e2e green. `d06a8fa`

### [x] [seo] [3.0] /search returns 0 results for part names — 18 entity records invisible to the search index — addressed in this commit (closes #149)
- category: seo
- filed: 2026-05-19 by cloud /iterate audit
- impact: 6 (18 part detail pages at /part/[kind]/[slug] unreachable via search; Phase 33 quiz routes home-page users to /part/switch/[slug] making parts catalog a first-class surface; readers searching "Gateron Oil King", "GMK Olivia", or "Mode Sonnet" got 0 results)
- ease: 5 (multi-file: extend generate-search-index.mts + runtime.ts + new PartResult component + SearchPanel update + e2e assertion)
- score: 3.0 (impact × ease / 10)
- issue: #149
> **Resolved (2026-05-19):** Extended `generate-search-index.mts` to call `getAllSwitches()`, `getAllKeycapSets()`, `getAllBoards()` from `@thock/data` and embed a `parts: PartDoc[]` catalog in the payload JSON (18 records: 8 switches + 5 keycap-sets + 5 boards). Added `PartSearchDocument` + `PartSearchHit` types and `searchParts()` (simple substring match on name + kind) to `runtime.ts`. New `PartResult.tsx` component renders kind chip + name + link to `/part/[kind]/[slug]`. `SearchPanel.tsx` calls `searchParts()` alongside `searchArticles()` and renders part hits below article results. `SearchPanel.test.tsx` mock updated; 6-test `PartResult.test.tsx` added. E2e guard in `search.spec.ts` asserts searching "Gateron" surfaces a part result linking to `/part/switch/gateron-*`. 475 unit tests (+6), 632 e2e green (+1). `index.generated.json` regenerated with parts catalog.

### [x] [test] [3.6] scripts/iso-week.mjs — no unit tests for year-boundary ISO week calculation — addressed in 75831bd (closes #148)
- category: test
- filed: 2026-05-19 by cloud /iterate audit
- impact: 4 (isoWeekString() drives the march.md Step 0.5 weekly snapshot gate; Dec 29–31 year-boundary edge case silently wrong would skip or double-shoot Monday snapshots across the year turn; script had no test coverage despite non-trivial Thursday-anchored logic)
- ease: 9 (pure function with no I/O, no deps — node:test runner, no devDeps; __test export pattern already established by content-gap-survey.mjs)
- score: 3.6 (impact × ease / 10)
- issue: #148
> **Resolved (2026-05-19):** Extracted `isoWeekString(date = new Date())` from cli entrypoint body, added `export const __test = { isoWeekString }` following the content-gap-survey.mjs pattern. CLI behaviour (`console.log(isoWeekString())`) unchanged. Added `scripts/__tests__/iso-week.test.mjs` with 5 node:test cases: known Monday W21, known Sunday W21, week rollover to W22, year-boundary Dec 29 2025 → 2026-W01 (Thursday is Jan 1), year-boundary Jan 1 2026 → 2026-W01. 21 script tests total (+5). 631 e2e green. `75831bd`

### [x] [test] [3.6] searchParts() — no unit tests for parts catalog search function — addressed in 4e7c4f1
- category: test
- filed: 2026-05-19 by cloud /iterate audit
- impact: 4 (searchParts() was added in 99f0e5e to surface 18 part entity records via /search; the function's empty-query guard, case-insensitive substring match, limit cap, and score attachment were uncovered despite being the backend for SearchPanel part results and the new e2e parts-search guard)
- ease: 9 (pure function, no I/O, no async — trivial to test by importing from runtime.ts)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-19T09:22:00Z]
> **Resolved (2026-05-19):** Added `describe('searchParts', ...)` block to `apps/web/src/lib/search/__tests__/runtime.test.ts` with 6 tests: empty query returns []; whitespace-only query returns []; name substring match (case-insensitive, "gateron oil king"); kind substring match ("switch" → all switch hits); limit cap; score 1.0 on every hit. 481 unit tests (+6), 632 e2e green. `4e7c4f1`

### [x] [test] [3.6] InlineViz.resolveAccent — no unit tests for accent alias resolution (80 article-viz connectors) — addressed in 038c143 (closes #150)
- category: test
- filed: 2026-05-19 by cloud /iterate audit
- impact: 4 (resolveAccent() drives the desktop connector-arm accent color for every <InlineViz> component — 80 total across 40 articles; OKLCH alias values are specific and a future typo would silently degrade all connector rendering with no test to catch it; bearings.md describes the connector as a load-bearing visual identity element)
- ease: 9 (pure function with no I/O, no side effects; exported with a single keyword change)
- score: 3.6 (impact × ease / 10)
- issue: #150
> **Resolved (2026-05-19):** Exported resolveAccent() from InlineViz.tsx (no behavior change). Added packages/content/src/__tests__/mdx/InlineViz.test.ts with 8 unit tests: coral/amber/bronze/bordeaux aliases, default alias, undefined fallback, raw oklch passthrough, CSS var passthrough. @thock/content: 21 test files, 125 tests (+1/+8). 632 e2e green. `038c143`

### [x] [seo] [4.0] /tags — 7 orphaned tags with no articles surfaced as browse chips (closes #151)
- category: seo
- filed: 2026-05-19 by cloud /iterate audit
- impact: 5 (7 tags in tags.json — `60`, `full`, `novelkeys`, `ortho`, `sa`, `tkl`, `wuque` — had no articles; all 7 appeared as clickable chips on /tags, linking to empty /tag/<slug> pages; `tkl`, `60%`, `SA`, `Ortho` are high-signal keyboard terms that attract browsing readers who land on "No articles yet" dead-ends; creates thin-content pages crawlers index from the tags browse surface)
- ease: 8 (one-line filter in apps/web/src/app/tags/page.tsx — `getAllTags().filter(t => getArticlesByTag(t.slug).length > 0)`)
- score: 4.0 (impact × ease / 10)
- issue: #151
> **Resolved (2026-05-19):** Added `getArticlesByTag` import to `apps/web/src/app/tags/page.tsx` and filtered the tags list to exclude tags with 0 articles: `getAllTags().filter(t => getArticlesByTag(t.slug).length > 0)`. Tags with articles: 61 (down from 68). The 7 orphaned tags (`60`, `full`, `novelkeys`, `ortho`, `sa`, `tkl`, `wuque`) remain in tags.json for future articles to use but no longer appear on the browse surface or in the JSON-LD ItemList. All 481 unit tests + 632 e2e green.

### [x] [test] [4.8] AutoLink — MDX anchor replacement has no unit tests (all article hyperlinks) — addressed in 788cf96 (closes #152)
- category: test
- filed: 2026-05-19 by cloud /iterate audit
- impact: 6 (AutoLink is the `a:` replacement in mdxComponents, applied to every hyperlink in every MDX article; the isExternal check controls security-relevant `rel="noopener" target="_blank"` for external URLs — same rationale as Source.tsx which got 6 tests at 6e851b9; every article with a link passes through AutoLink)
- ease: 8 (functional component, no RSC, no async, no router; same pattern as Source.test.tsx)
- score: 4.8 (impact × ease / 10)
- issue: #152
- elements: `packages/content/src/mdx/components.tsx` — AutoLink (a: mapping, isExternal check, rel/target branch, className)
> **Resolved (2026-05-19):** Added `packages/content/src/__tests__/mdx/AutoLink.test.tsx` with 6 tests: children render; href passthrough; internal path (no rel/target); external https:// (rel="noopener" target="_blank"); external http:// (rel+target); undefined href (no rel/target). Mirrors the Source.test.tsx pattern (same external-link security rationale). @thock/content: 22 test files, 131 tests (+1/+6). 632 e2e green. `788cf96`

### [x] [test] [3.6] slugFromFile() — no direct unit tests for content slug utility — addressed in d0c788a (closes #154)
- category: test
- filed: 2026-05-19 by cloud /iterate audit
- impact: 4 (slugFromFile() in packages/content/src/util/slug.ts powers all 42 article slug computations; edge cases for Windows backslash paths and non-.mdx extensions were untested; the function computes the slug used in all article URLs)
- ease: 9 (pure function, no side effects, no imports — trivial to test directly)
- score: 3.6 (impact × ease / 10)
- issue: #154
- elements: `packages/content/src/util/slug.ts` — slugFromFile()
> **Resolved (2026-05-19):** Added `packages/content/src/__tests__/util/slug.test.ts` with 6 tests: bare filename, forward-slash path, backslash path (Windows), mixed-separator path, non-.mdx extension passthrough, no-extension passthrough. @thock/content: 23 test files, 137 tests (+1/+6). 608 e2e green. `d0c788a`

### [x] [data] [4.5] W19+W20 HMX Cloud tracker rows link to wrong article — beginners-switch-buying-guide has no HMX content — addressed in 8aceeee
- category: data
- filed: 2026-05-19 by cloud /iterate audit
- impact: 5 (W19 and W20 tracker archive pages each show a "Read more" link for the HMX Cloud row that navigates to the beginners-switch-buying-guide article, which does not mention HMX Cloud — a wrong cross-reference that misdirects readers on two historical tracker views)
- ease: 9 (two-field JSON edit across two snapshot files; W21 already has the correct hmx-cloud-deep-dive link)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-19T00:00:00Z]
- elements: `data/trends/2026-W19.json` and `data/trends/2026-W20.json` — "HMX Cloud" row `articleSlug` set to `"beginners-switch-buying-guide"` in both; `hmx-cloud-deep-dive` is the correct slug (lede: "Today the Cloud sits second on our W19 tracker…")
> **Resolved (2026-05-19):** Changed `articleSlug` from `"beginners-switch-buying-guide"` to `"hmx-cloud-deep-dive"` in both `data/trends/2026-W19.json` and `data/trends/2026-W20.json`. The beginners guide has zero mentions of HMX Cloud; the deep-dive is a 1100-word dedicated piece whose own lede references W19 tracker position. W21 already carried the correct slug. 608 e2e green. `8aceeee`

### [x] [a11y] [3.0] PartResult search-part-kind chip lacks color-contrast regression guard — addressed in this commit
- category: accessibility
- filed: 2026-05-19 by cloud /iterate audit
- impact: 3 (PartResult is a new component shipped with correct text-text-2 at text-micro/12px; without a guard, a silent regression to text-text-3 would fail WCAG AA 4.5:1 and go undetected until a user report — consistent risk level with the other 39 regression guards filed across Phase B)
- ease: 10 (one test block following the verbatim pattern already present for search-result-eyebrow; no production code change needed)
- score: 3.0 (impact × ease / 10)
- issue: n/a (pre-emptive guard — no current violation)
- elements: `apps/e2e/tests/a11y.spec.ts` — add `'color-contrast — search part-kind chip (regression guard)'` test; queries `/search?q=gateron`, waits for `[data-testid="search-part-kind"]`, runs axe color-contrast scope

### [x] [test] [3.6] printReport() — no unit tests for validation CLI formatter — addressed in 66106da (closes #155)
- category: test
- filed: 2026-05-20 by cloud /iterate audit
- impact: 4 (printReport() renders all validation output to the developer and CI; has two paths — ok (success message, no error calls) and error (error count + per-error details with file/slug/field formatting); these branches are uncovered; validateAll/walkAll/crossrefs all have direct unit tests but report does not)
- ease: 9 (mock console.log/console.error with vi.spyOn; 5 test cases covering both paths and the 3 formatting branches)
- score: 3.6 (impact × ease / 10)
- issue: #155
> **Resolved (2026-05-20):** Added `packages/data/src/__tests__/validate/report.test.ts` with 5 unit tests using vi.spyOn to mock console.log/error: (1) ok path — prints total count, per-kind breakdown, success line, no error calls; (2) error path — prints error count + details, no success line; (3) uses err.file as location prefix; (4) falls back to kind/slug when file absent; (5) includes [field] in brackets. 609 e2e green. `66106da`

### [x] [test] [3.5] getAdjacentWeeks() — inline tracker archive navigation helper had no unit tests — addressed in a17c7cd (closes #156)
- category: test
- filed: 2026-05-20 by cloud /iterate audit
- impact: 5 (tracker archive prev/next navigation on all 3 week pages; first/last edge cases non-obvious; e2e only validated W19→W20 link, not boundary null cases)
- ease: 7 (extract to helpers.ts + 5 unit tests)
- score: 3.5 (impact × ease / 10)
- issue: #156
> **Resolved (2026-05-20):** Extracted `getAdjacentWeeks` from `apps/web/src/app/trends/tracker/[week]/page.tsx` (line 73) to `apps/web/src/app/trends/tracker/[week]/helpers.ts` and exported it. Updated page.tsx import accordingly. Added `apps/web/src/app/trends/tracker/[week]/__tests__/helpers.test.ts` with 5 tests: empty list → both null; single snapshot → both null; first week (W19) → prev=null, next=W20; last week (W21) → prev=W20, next=null; middle week (W20) → prev=W19, next=W21. 487 unit tests (+5), 609 e2e green. `a17c7cd`

### [x] [content] [3.6] cannonkeys-nyawice-group-buy — stale present-tense "is open" language for closed group buy — addressed in 38629af (closes #158)
- category: content
- filed: 2026-05-20 by cloud /iterate audit
- impact: 4 (readers visiting after 2026-05-17 see "is open at CannonKeys through 2026-05-17" in both the lede and body; the absolute date is present which limits confusion but the verb tense actively contradicts it)
- ease: 9 (two is-open → ran rewrites in MDX, plus "opening today" and "when the window closes" cleanup in the Buying notes section)
- score: 3.6 (impact × ease / 10)
- issue: #158
> **Resolved (2026-05-20):** Rewrote four stale present-tense phrases in `cannonkeys-nyawice-group-buy.mdx`: lede and body "is open … through 2026-05-17" → "ran … through 2026-05-17"; Buying notes "opening today" removed; closing "when the window closes" → "when builds begin shipping". Updated `updatedAt` frontmatter. 609 e2e green. `38629af`

### [x] [seo] [3.2] /quiz/switch missing BreadcrumbList JSON-LD — addressed in 36a7e33 (closes #157)
- category: seo
- filed: 2026-05-20 by cloud /iterate audit
- impact: 4 (/quiz/switch was the only page in the URL contract shipping a JSON-LD type without an accompanying BreadcrumbList; every other comparable standalone page ships both)
- ease: 8 (3-line addition to quiz/switch/page.tsx + meta.spec.ts fixture update + quiz.spec.ts assertion)
- score: 3.2 (impact × ease / 10)
- issue: #157
> **Resolved (2026-05-20):** Added `buildBreadcrumbListJsonLd([Home, Find your switch])` to the `JsonLd graph` array alongside `WEB_APP_JSON_LD` in `apps/web/src/app/quiz/switch/page.tsx`. Updated `meta.spec.ts` fixture from `['WebApplication']` to `['WebApplication', 'BreadcrumbList']`. Extended `quiz.spec.ts` JSON-LD test to also assert BreadcrumbList presence and crumb name. 609 e2e green. `36a7e33`

### [x] [fix] [4.0] /part/[kind] count — "switchs" instead of "switches" — addressed in feebc00 (closes #161)
- category: bug
- filed: 2026-05-20 by cloud /iterate audit
- impact: 5 (grammar error visible to all /part/switch visitors: "8 switchs in the catalog.")
- ease: 8 (add KIND_PLURAL lookup map, one file)
- score: 4.0 (impact × ease / 10)
- issue: #161
- pages: /part/switch
- elements: count label line 173 in `apps/web/src/app/part/[kind]/page.tsx`
- root cause: count label used `${kind}s` template which produces "switchs" for kind="switch"; correct English plural is "switches"
> **Resolved (2026-05-20):** Added `KIND_PLURAL` record map with correct plurals (switch→switches, keycap-set→keycap-sets, board→boards); count label now uses `KIND_PLURAL[kind]`. pnpm verify green. `feebc00`

### [x] [nav] [6.3] /quiz/switch results — no path to browse the full switch catalog after seeing 3 matches — addressed in 4f804f8 (closes #160)
- category: affordance
- filed: 2026-05-20 by cloud /iterate audit
- impact: 7 (quiz has a prominent home-page CTA; all users completing the quiz hit a dead-end — only "Start over" or browser back to leave the results screen)
- ease: 9 (one JSX addition in SwitchQuiz.tsx + Link import + unit test + e2e assertion)
- score: 6.3 (impact × ease / 10)
- issue: #160
- pages: /quiz/switch (results view)
- elements: `SwitchQuiz.tsx` results section — no forward navigation; `<button>Start over</button>` is the only action beside clicking a ResultCard
- root cause: SwitchQuiz was shipped in Phase 33 with result cards linking to individual `/part/switch/[slug]` pages, but no link to `/part/switch` (the kind-index page listing all 8 switches). The `/parts` landing page (Phase Candidates) would eventually add this, but `/part/switch` already exists and needs only a one-line addition to close the gap now.
> **Resolved (2026-05-20):** Added `<Link href="/part/switch" data-testid="quiz-browse-all-link">Browse all switches →</Link>` to the SwitchQuiz results section alongside the Start over button. Unit test added to `SwitchQuiz.test.tsx` (browse-all-link present, href=/part/switch, text correct); e2e assertion added to `quiz.spec.ts` (results view shows browse-all link with correct href). 492 unit tests, 609 e2e green. `4f804f8`

### [x] [test] [3.6] sitemap.test.ts missing assertions for routes added in phases 21-33 — addressed in 904d5c8 (closes #159)
- category: test
- filed: 2026-05-20 by cloud /iterate audit
- impact: 4 (sitemap.test.ts frozen at Phase 17 baseline; routes added in Phases 21, 27, 28, 29, 33 — /tags, /quiz/switch, /group-buys/past, /trends/tracker/<week>, /part/[kind] index + detail pages — unchecked by unit tests; only the slower e2e meta.spec.ts caught regressions; future developer could drop a route from sitemap.ts with no unit-test signal)
- ease: 9 (add 4 it() blocks importing getAllTrendSnapshots + getAllSwitches + getAllKeycapSets + getAllBoards)
- score: 3.6 (impact × ease / 10)
- issue: #159
> **Resolved (2026-05-20):** Added 4 `it()` blocks to `apps/web/src/app/__tests__/sitemap.test.ts`: (1) /tags, /quiz/switch, /group-buys/past all included (phases 28, 33, 29); (2) every tracker archive week included via `getAllTrendSnapshots()` (phase 27); (3) all /part/[kind] index pages included (phase 21); (4) every part detail slug included via getAllSwitches/getAllKeycapSets/getAllBoards (phase 21). 609 e2e green. `904d5c8`

### [x] [a11y] [4.8] text-text-4 at small text fails WCAG AA — part catalog count, MentionedInArticles footer, tracker archive nav, newsletter archive date — addressed in 00a668a
- category: a11y
- filed: 2026-05-20 by cloud /iterate audit
- impact: 6 (affects /part/switch, /part/keycap-set, /part/board count sentence; all part detail pages with companion articles; tracker/2026-W19 "No earlier weeks" label; newsletter archive when populated)
- ease: 8 (4 class substitutions across 4 files + data-testid additions + 2 regression guards)
- score: 4.8 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px/14px
- axe impact: serious
- pages: /part/switch, /part/keycap-set, /part/board, /part/[kind]/[slug] (all with companion articles), /trends/tracker/2026-W19, /newsletter (when archive populated)
- elements: `text-micro text-text-4` on (1) part kind-index count sentence; (2) MentionedInArticles footer note; (3) tracker "← No earlier weeks" disabled nav label at text-small; (4) newsletter archive issue date
- root cause: text-text-4 (oklch(0.40 0.004 250)) has even lower luminance than text-text-3 (oklch(0.55 0.006 250)) which was systematically fixed across the Phase B drain (issues #91–#113). These four real-content instances were not covered by that sweep.
- issue: [mirror-failed: 2026-05-20T00:00:00Z]
> **Resolved (2026-05-20):** Swapped text-text-4 → text-text-2 on all four elements. Added data-testid="part-index-count" on the count paragraph in part/[kind]/page.tsx; data-testid="mentioned-in-footer" on the MentionedInArticles footer note; data-testid="tracker-no-earlier-weeks" on the tracker disabled nav label. Two new regression guards in apps/e2e/tests/a11y.spec.ts: AxeBuilder.include() scoped to [data-testid="part-index-count"] on /part/switch and [data-testid="tracker-no-earlier-weeks"] on /trends/tracker/2026-W19, each asserting zero color-contrast violations. Newsletter archive date requires no extra guard — the archive is empty in CI (no newsletters shipped yet). 611 e2e green (+2 guards). `00a668a`

### [x] [test] [3.6] KeyboardImage.tsx — MDX image wrapper has no unit tests (last untested MDX component) — addressed in 4d2a603 (closes #162)
- category: test
- filed: 2026-05-20 by cloud /iterate audit
- impact: 4 (KeyboardImage renders in articles with the <KeyboardImage> MDX component; has conditional figcaption logic, width/height forwarding, and data-testid="article-figcaption" load-bearing for the axe regression guard in a11y.spec.ts; all 8 sibling MDX components had colocated tests)
- ease: 9 (pure React component, no async, no RSC, no router; same pattern as Caption.test.tsx)
- score: 3.6 (impact × ease / 10)
- issue: #162
> **Resolved (2026-05-20):** Added `packages/content/src/__tests__/mdx/KeyboardImage.test.tsx` with 5 tests: img src+alt passthrough; figcaption with data-testid="article-figcaption" when caption provided; no figcaption when caption omitted; width+height forwarded to img when provided; no width+height attributes when not provided. @thock/content: 24 test files, 142 tests (+1/+5). 609 e2e green. `4d2a603`
> **Resolved (2026-05-20):** Extended `apps/web/src/app/__tests__/sitemap.test.ts` with 4 new it() blocks: (1) /tags + /quiz/switch + /group-buys/past; (2) every tracker archive week entry; (3) all /part/[kind] index pages; (4) every part detail slug for switches, keycap-sets, and boards. Imports extended to include getAllTrendSnapshots, getAllSwitches, getAllKeycapSets, getAllBoards. 491 unit tests (+4), 609 e2e green. `904d5c8`

### [x] [a11y] [4.0] loading skeleton kickers — text-text-4 at 12px fails WCAG AA on 13 routes — addressed in 9b57082 (closes #163)
- category: a11y
- filed: 2026-05-20 by cloud /iterate audit
- impact: 5 (loading state kicker visible during SSR streaming on every page load for users with cold cache or slow connections; WCAG 1.4.3 AA violation in light mode — same root cause as Phase B drain series)
- ease: 8 (swap inline span for PageSectionKicker across 13 loading.tsx files; same pattern as Phase 32)
- score: 4.0 (impact × ease / 10)
- wcag: 1.4.3 Contrast (Minimum) AA — 4.5:1 for normal text at 12px
- pages: /, /article/[slug], /deep-dives, /group-buys, /guides, /ideas, /news, /trends, /trends/tracker, /trends/tracker/[week], /tag/[slug], /part/[kind], /part/[kind]/[slug]
- elements: `<span className="font-mono uppercase tracking-[0.12em] text-micro text-text-4">loading · ...</span>` in all 13 loading.tsx files
- root cause: text-text-4 (oklch(0.40 0.004 250)) at text-micro (12px) fails WCAG AA contrast in light mode. Phase 32's PageSectionKicker drain covered page.tsx files; loading.tsx files were out of scope.
- issue: #163
> **Resolved (2026-05-20):** Replaced inline span with PageSectionKicker (text-text-2) in all 13 loading.tsx files: home, article/[slug], deep-dives, group-buys, guides, ideas, news, trends, trends/tracker, trends/tracker/[week], tag/[slug], part/[kind], part/[kind]/[slug]. PageSectionKicker always renders text-text-2 (WCAG AA compliant); regression prevented by component contract. 611 e2e green. `9b57082`

### [x] [content] [4.0] gmk-cyl-prussian-alert — 7 stale pre-opening phrases after May 15 buy open — addressed in 54096b4
- category: content
- filed: 2026-05-21 by cloud /iterate audit
- impact: 5 (companion article published 2026-05-10, 5 days before the buy opened 2026-05-15; buy runs through 2026-06-12; readers arriving during the active window saw stale "is set to open", "will mirror", and "will land" language; pre-open uncertainty callout told readers to treat all details as unconfirmed even though the product page was already live)
- ease: 8 (7 targeted phrase replacements + callout removal in gmk-cyl-prussian-alert.mdx; no new data records or components needed)
- score: 4.0 (impact × ease / 10)
- pages: /article/gmk-cyl-prussian-alert
- elements: title, lede, body (lines 20, 22-24, 30, 34, 36 before edit)
- issue: [mirror-failed: 2026-05-21T00:00:00Z]
> **Resolved (2026-05-21):** Updated title/lede to reflect live-buy state ("opens at KBDfans on May 15" → "is live at KBDfans through June 12"). Converted 7 stale phrases: "is set to open" → "opened … and runs through 2026-06-12"; "will mirror onto the KBDfans product page when the buy opens" → "are on the KBDfans product page"; "The buy opens 2026-05-15" → "The buy opened 2026-05-15 and runs through 2026-06-12"; "The live entry will land on the /group-buys board when the product page goes up." → "The live entry is on the /group-buys board.". Removed pre-open uncertainty callout ("treat any number outside the GB date itself as unconfirmed until the product page goes live"). Set updatedAt to 2026-05-21. 611 e2e green. `54096b4`

### [x] [content] [3.6] gmk-cyl-king-of-the-seas — stale "Prussian Alert is set to open mid-month" language — addressed in af5bc02 (closes #164)
- category: content
- filed: 2026-05-21 by cloud /iterate audit
- impact: 4 (readers visiting /article/gmk-cyl-king-of-the-seas-group-buy see a factually wrong claim about Prussian Alert's open status; article published 2026-04-28 before PA opened; PA has been live for 6 days as of the fix date)
- ease: 9 (one phrase change in line 38 of the article body)
- score: 3.6 (impact × ease / 10)
- pages: /article/gmk-cyl-king-of-the-seas-group-buy
- elements: line 38 — "[GMK CYL Prussian Alert] is set to open mid-month"
- issue: #164
> **Resolved (2026-05-21):** Changed "is set to open mid-month" → "opened on 2026-05-15" in the CYL ecosystem section. Updated updatedAt frontmatter to 2026-05-21T00:00:00.000Z. 611 e2e green. `af5bc02`

### [x] [test] [4.5] meta.spec.ts missing /parts JSON-LD type assertion (phase 35) — addressed in 1e17cd3 (closes #167)
- category: test
- filed: 2026-05-21 by cloud /iterate audit
- impact: 5 (the /parts route is walked by meta.spec.ts but expectedTypesFor returns [] — no CollectionPage/BreadcrumbList/ItemList type assertions; a regression silently removing or mistyping the JSON-LD on /parts would pass the meta.spec.ts JSON-LD shape audit; same gap that audit row #134 closed for phases 21–33)
- ease: 9 (one if-statement addition to expectedTypesFor identical to the existing /tags and /group-buys/past cases)
- score: 4.5 (impact × ease / 10)
- issue: #167
> **Resolved (2026-05-21):** Added `if (path === '/parts') return ['CollectionPage', 'BreadcrumbList', 'ItemList']` to expectedTypesFor alongside the identical /tags and /group-buys/past cases. Updated comment label from "phases 21–33" to "phases 21–35". 660 e2e green. `1e17cd3`

### [x] [test] [3.6] sitemap.test.ts missing /parts assertion (phase 35) — addressed in 00361e6 (closes #166)
- category: test
- filed: 2026-05-21 by cloud /iterate audit
- impact: 4 (phase 35 shipped /parts and wired it into sitemap.ts at priority 0.6; a regression silently removing /parts from the sitemap would not be caught by the unit test suite — the e2e smoke walker covers /parts at the integration level but the sitemap unit layer had no guard)
- ease: 9 (one-line addition to the existing it() block at line 77 that already asserts /tags, /quiz/switch, /group-buys/past)
- score: 3.6 (impact × ease / 10)
- issue: #166
> **Resolved (2026-05-21):** Extended the it() label to include "phases 28, 33, 29, 35" and added '/parts' to the path array. 660 e2e green. `00361e6`

### [x] [ux] [4.8] tracker: 'article pending' note for null-slug rows with real scores — addressed in 41f1755 (closes #173)
- category: enhancement
- filed: 2026-05-22 by cloud /iterate audit
- impact: 6 (signature feature; all tracker page visits; every weekly snapshot begins with 12–18 rows where the em-dash misleads — current "—" implies "no data" but these rows always carry a real score/direction/sparkline)
- ease: 8 (single-component change in TrackerRow.tsx + update 1 existing test + 1 new test)
- score: 4.8 (impact × ease / 10)
- issue: #173
> **Resolved (2026-05-22):** Changed null-noteText branch in TrackerRow's editor's-note column from `<span aria-hidden="true" className="text-text-4">—</span>` to `<span data-testid="tracker-row-pending-note" className="text-text-4">article pending</span>`. Updated existing em-dash test and added one new test for the pending-note testid. 663 e2e green. `41f1755`

### [x] [test] [3.6] SwitchQuiz — quiz-browse-all-parts-link has no unit test — addressed in c9272e0 (closes #168)
- category: test
- filed: 2026-05-21 by cloud /iterate audit
- impact: 4 (phase 35 added <Link href="/parts" data-testid="quiz-browse-all-parts-link"> to SwitchQuiz results; the existing test suite was updated to filter /parts from the result-card link assertion but no positive assertion verified the link's existence, href, or text — a regression removing the link would pass all unit tests)
- ease: 9 (one it() block addition to SwitchQuiz.test.tsx; same pattern as the adjacent browse-all-link test)
- score: 3.6 (impact × ease / 10)
- issue: #168
> **Resolved (2026-05-21):** Added 1 it() block to SwitchQuiz.test.tsx: render → answerAllQuestions → getByTestId('quiz-browse-all-parts-link') → assert in-document, href=/parts, text matches /browse all parts/i. SwitchQuiz suite: 5 → 6 tests. 660 e2e green. `c9272e0`

### [x] [content] [3.2] gsk-sweet-nightmare-group-buy — three stale phrases reference an active window for a group buy closed May 11 — addressed in 84885e7 (closes #177)
- category: content
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (readers arriving now see "live window," "closes 2026-05-11; we will revisit," and "live entry alongside the open buys" language for a buy 11 days past close; the /group-buys link also points to the live board instead of the archive)
- ease: 8 (3 phrase fixes + updatedAt bump; same pattern as the prussian-alert and king-of-the-seas post-open language fixes)
- score: 3.2 (impact × ease / 10)
- pages: /article/gsk-sweet-nightmare-group-buy
- elements: (1) paragraph before closing Section heading line 57: "the live window are at KBDfans's product page"; (2) closing paragraph line 63: "The live entry alongside the rest of the open buys sits on [/group-buys](/group-buys)"; (3) closing sentence line 63: "Sweet Nightmare closes 2026-05-11; we will revisit when the variant-level sell-through is visible."
- action: (1) rewrite "the full configurator and the live window are at KBDfans's product page" → remove "live window" reference, keep the source link; (2) update /group-buys link to /group-buys/past with "closed-buy archive" framing; (3) update closing sentence from future-tense "closes...we will revisit" to past-tense "closed 2026-05-11"; (4) bump updatedAt to 2026-05-22
- issue: #177

### [x] [test] [3.6] sortParts + isValidKind in /part/[kind] have no unit tests — addressed in this commit
- category: test
- filed: 2026-05-22 by cloud /iterate audit
- impact: 4 (sortParts drives active-first ordering on /part/switch, /part/keycap-set, /part/board; the PRODUCTION_STATUSES invariant was untested — a silent regression removing a status would reorder the entire catalog without any failing test; unlike every other route with helpers, /part/[kind] had no helpers.ts extraction)
- ease: 9 (extract two functions to helpers.ts + write 8 test cases; same pattern as guides, ideas, deep-dives helpers)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-22T17:04:00Z]
> **Resolved (2026-05-22):** Extracted isValidKind, PRODUCTION_STATUSES, sortParts to apps/web/src/app/part/[kind]/helpers.ts (exported). Updated page.tsx to import from helpers. Added apps/web/src/app/part/[kind]/__tests__/helpers.test.ts: 8 cases covering isValidKind (valid/invalid/case-sensitive) and sortParts (active-first, alpha within group, all four production statuses, mutation-safety). 664 e2e green.

### [x] [data] [3.5] cannonkeys-mode-sonnet-r2 missing group-buy data record (announced 2026-06-01) — addressed in f080087 (closes #183)
- category: data
- filed: 2026-05-22 by cloud /iterate audit
- impact: 7 (Mode Sonnet R2 GB opens in ~10 days; companion article mode-sonnet-r2-group-buy-coverage already live and links /group-buys; announced section empty without this record)
- ease: 5 (one JSON data record + hero SVG via brander; also fixed getAllClosedGroupBuys() to treat lapsed-announced buys as past)
- score: 3.5 (impact × ease / 10)
- issue: #183
> **Resolved (2026-05-22):** Added data/group-buys/cannonkeys-mode-sonnet-r2.json (status=announced, startDate=2026-06-01, endDate=2026-07-15, region=global, productKind=board, vendorSlug=cannonkeys). Hero SVG rendered by brander at apps/web/public/group-buy-art/cannonkeys-mode-sonnet-r2.svg (65% silhouette, warm bronze/ochre accent per bearings group-buy hero art rule). Fixed getAllClosedGroupBuys() in data-runtime/index.ts to include announced+lapsed buys, mirroring the lapsed-live logic. Manifest and search index regenerated. 664 e2e green. `f080087`

### [x] [test] [3.6] getAllClosedGroupBuys missing announced+lapsed coverage — addressed in fe1cc59 (closes #187)
- category: test
- filed: 2026-05-23 by cloud /iterate audit
- impact: 4 (f080087 added status === 'announced' to lapsed detection; silent regression risk if announced path broken)
- ease: 9 (two targeted it() blocks + rename existing test)
- score: 3.6 (impact × ease / 10)
- issue: #187
> **Resolved (2026-05-23):** Updated test name from "lapsed-live" to "lapsed-live and lapsed-announced". Added positive case (reference date after Mode Sonnet R2 endDate → slug present) and negative case (before endDate → slug absent). 664 e2e green. `fe1cc59`

### [x] [test] [4.5] getActiveGroupBuys — no positive assertion for announced status — addressed in 404020e (closes #188)
- category: test
- filed: 2026-05-23 by cloud /iterate audit
- impact: 5 (getActiveGroupBuys powers /group-buys announced section; silent regression filtering out announced status would hide Mode Sonnet R2 from /group-buys with no failing test; symmetric gap to the getAllClosedGroupBuys coverage filed in #187)
- ease: 9 (two targeted it() blocks in loaders.test.ts — positive and negative case)
- score: 4.5 (impact × ease / 10)
- issue: #188
> **Resolved (2026-05-23):** Added positive case (cannonkeys-mode-sonnet-r2 slug present when ref date 2026-05-23, before endDate 2026-07-15) and negative case (slug absent when ref date 2026-07-16, after endDate). Symmetric with getAllClosedGroupBuys coverage from fe1cc59. 664 e2e green. `404020e`

### [x] [a11y] [4.5] tracker 'article pending' — text-text-4 on visible text fails WCAG AA contrast — addressed in a7b8fa6 (closes #189)
- category: a11y
- filed: 2026-05-23 by cloud /iterate audit
- impact: 5 (TrackerRow renders 'article pending' on desktop for any row with null noteText; text-text-4 (oklch(0.40 0.004 250)) fails WCAG 1.4.3 AA 4.5:1 against thock-bg; commit 41f1755 changed the prior aria-hidden em-dash to visible text but kept the low-contrast token; future tracker weeks starting before 14-day Rule 2 linkage window closes will show the failing text)
- ease: 9 (one class substitution)
- score: 4.5 (impact × ease / 10)
- issue: #189
> **Resolved (2026-05-23):** Changed `text-text-4` → `text-text-2` on the `tracker-row-pending-note` span in `TrackerRow.tsx:95`. Added regression guard to `TrackerRow.test.tsx`: asserts `className` matches `/\btext-text-2\b/` and not `/\btext-text-4\b/`. 664 e2e green. `a7b8fa6`

### [x] [copy] [3.6] vendor-first-customs — "Phase-19" build-plan jargon in W19 tracker references — addressed in c68223d (closes #192)
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 4 (published trends article uses build-plan notation "Phase-19" for three inline links to W19 tracker data; readers have no context for this notation; same leak pattern as the nyawice "W19 movement score" fix)
- ease: 9 (three phrase substitutions + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- pages: /article/vendor-first-customs
- elements: lines 80, 95, 136 — "Phase-19 trends row", "Phase-19 row for CannonKeys", "Phase-19 row" → "W19 tracker row"
- issue: #192

### [x] [copy] [4.8] keychron-q-ultra-zmk — three stale temporal phrases in "What we're watching" section — addressed in 0338e99 (closes #193)
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 6 (news article; "What we're watching" is action-guiding text — readers in that section decide whether to act; three stale phrases in one paragraph undermine trust: "four weeks from now" decays after 2026-06-07, "currently up at +30" is W19/20 data now two weeks old, "Reviews are landing this month" reads as May 2026 only)
- ease: 8 (one paragraph, three phrase substitutions; same pattern as nyawice / vendor-first-customs / building-mode-sonnet copy fixes)
- score: 4.8 (impact × ease / 10)
- pages: /article/keychron-q-ultra-zmk
- elements: `apps/web/src/content/articles/keychron-q-ultra-zmk.mdx:51` — "board four weeks from now" → publication-relative absolute; "Keychron is currently up at +30" → past-tense absolute; "Reviews are landing this month" → "Reviews were landing in May 2026"
- issue: #193
> **Resolved (2026-05-23):** Three phrase substitutions in `keychron-q-ultra-zmk.mdx:51`: "four weeks from now" → "in the weeks following this piece"; "currently up at +30" → "was at +30 on the tracker at the time this piece filed"; "this month" → "in May 2026". updatedAt bumped. 664 e2e green. `0338e99`
> **Resolved (2026-05-23):** Replaced three "Phase-19 [trends row|row|row]" references with "W19 tracker row" / "W19 tracker row for CannonKeys" / "W19 tracker row for Prototypist". updatedAt bumped to 2026-05-23. 664 e2e green. `c68223d`

### [x] [copy] [3.6] gmk-cyl-ramune-group-buy — 1 temporal anti-pattern violation detected by article-language-check.mjs — addressed in c5c0e14, closes #196
- category: copy
- filed: 2026-05-23 by article-language-check.mjs corpus scan
- impact: 4 (static MDX temporal phrase decays on every reader visit after publication)
- ease: 9 (phrase rewrite — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- patterns: stale-buy-live
- file: apps/web/src/content/articles/gmk-cyl-ramune-group-buy.mdx
- violations:
  - line 78: `The buy is live` (stale-buy-live)
- action: rewrite each flagged phrase using absolute dates or past-tense phrasing; see pattern descriptions in scripts/article-language-patterns.json
> **Resolved (2026-05-23):** "The buy is live as of 2026-05-15." → "The buy opened on 2026-05-15 and runs through 2026-06-20." Absolute-date form is durable after the buy window closes. updatedAt bumped to 2026-05-23. 667 e2e green. `c5c0e14`

### [x] [copy] [3.6] mode-sonnet-r2-group-buy-coverage — 1 temporal anti-pattern violation detected by article-language-check.mjs — addressed in c5c0e14, closes #197
- category: copy
- filed: 2026-05-23 by article-language-check.mjs corpus scan
- impact: 4 (static MDX temporal phrase decays on every reader visit after publication)
- ease: 9 (phrase rewrite — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- patterns: approximate-date-quarter
- file: apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx
- violations:
  - line 45: `approximately Q4` (approximate-date-quarter)
- action: rewrite each flagged phrase using absolute dates or past-tense phrasing; see pattern descriptions in scripts/article-language-patterns.json
> **Resolved (2026-05-23):** "Lead time is listed as approximately Q4 2026" → "Lead time is listed as Q4 2026". Removed "approximately" — Q4 already communicates the 3-month range; the hedging word adds no informational value. updatedAt bumped to 2026-05-23. 667 e2e green. `c5c0e14`

### [x] [test] [3.6] buildItemListJsonLd — sameAs extension (phase 37) has no unit tests — addressed in 4200d7d, closes #198
- category: test
- filed: 2026-05-23 by cloud /iterate audit
- issue: #198
- impact: 4 (sameAs carries relatedArticle cross-links in JSON-LD for group-buy ItemLists on /group-buys and /group-buys/past; Phase 37's key JSON-LD deliverable has e2e coverage via group-buys.spec.ts but no unit-level regression guard — a change to the conditional at buildJsonLd.ts:123 would be invisible to the unit test suite)
- ease: 9 (2 it() blocks in buildJsonLd.test.ts; pure function, no RSC, no async; mirrors the existing "emits a numbered ListItem" and "omits name" tests)
- score: 3.6 (impact × ease / 10)
- elements: `packages/seo/src/buildJsonLd.ts:123` — `...(entry.sameAs ? { sameAs: entry.sameAs } : {})` — the sameAs conditional in buildItemListJsonLd's itemListElement mapper
> **Resolved (2026-05-23):** Added 2 unit tests to buildJsonLd.test.ts: "includes sameAs in ListItem when entry carries it" and "omits sameAs from ListItem when entry does not carry it". 667 e2e green. `4200d7d`

### [x] [copy] [5.4] "this week's tracker" stale relative ref — alice-layout-decline + cannonkeys-nyawice + language gate gap — addressed in 2b88aa1 (closes #199)
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 6 (two articles use the same decaying phrase; gate gap lets future articles repeat it)
- ease: 9 (two phrase substitutions + JSON config + unit test)
- score: 5.4 (impact × ease / 10)
- issue: #199
- pages: /article/alice-layout-decline, /article/cannonkeys-nyawice-group-buy
- elements:
  - `apps/web/src/content/articles/alice-layout-decline.mdx:38` — "this week's tracker" (should be "the W19 tracker")
  - `apps/web/src/content/articles/cannonkeys-nyawice-group-buy.mdx:40` — same phrase quoting the alice article
  - `scripts/article-language-patterns.json` — "this week's tracker" not in pattern list
> **Resolved (2026-05-23):** Replaced "this week's tracker" with "the W19 tracker" in both articles; updatedAt bumped. Added `relative-tracker-this-week` pattern to article-language-patterns.json; 2 unit tests (positive + negative) added to article-language-check.test.mjs. 667 e2e green. `2b88aa1`

### [x] [copy] [3.6] zmk-mainstream-shift — 'this week' stale relative cross-reference — addressed in af4dee2, closes #200
- category: copy
- filed: 2026-05-23 by cloud /iterate audit
- impact: 4 (article published 2026-04-15, 38 days ago; line 57 reads "this week called the mid-premium tier" — implies the linked hall-effect-mainstream piece appeared the same week as zmk-mainstream-shift, which decays as soon as a reader arrives post-publication-week; relative temporal cross-references are the same pattern class as "this week's tracker" fixed in #199)
- ease: 9 (2-word deletion — 'this week ' removed from one sentence; bump updatedAt)
- score: 3.6 (impact × ease / 10)
- action: remove 'this week ' from line 57 of zmk-mainstream-shift.mdx; bump updatedAt to 2026-05-23
- issue: #200
> **Resolved (2026-05-23):** Removed "this week " from line 57 — sentence now reads "called the mid-premium tier the slot HE has settled into". updatedAt bumped to 2026-05-23. 667 e2e green. `af4dee2`

### [x] [copy] [4.5] hmx-cloud-deep-dive — "pass-5 Trends Tracker currently has" build-plan jargon + stale W19 live-tracker citation
- category: copy
- filed: 2026-05-24 by /iterate audit
- impact: 5 (build-plan jargon "pass-5" is meaningless to readers; "currently has" presents W19 historical data as present-tense fact; link targets live /trends/tracker showing W21+44 not W19+36)
- ease: 9 (1-line rewrite — change to past-tense W19 snapshot link; bump updatedAt)
- score: 4.5 (impact × ease / 10)
- file: apps/web/src/content/articles/hmx-cloud-deep-dive.mdx
- line: 26
- issue: [mirror-failed: 2026-05-24T00:00:00Z]
- action: rewrite line 26 — remove "pass-5", change href to /trends/tracker/2026-W19, "currently has" → "had", bump updatedAt to 2026-05-24
> **Resolved (2026-05-24):** Line 26 now reads "The [W19 Trends Tracker snapshot](/trends/tracker/2026-W19) had <PartReference id="hmx-cloud" /> at +36 — second only to…". Build-plan jargon removed, past-tense anchored to W19 snapshot. updatedAt bumped to 2026-05-24. Also added live-tracker-stale pattern to article-language-patterns.json + 3 tests in article-language-check.test.mjs.

### [x] [copy] [3.6] hall-effect-mainstream — 1 temporal anti-pattern violation detected by article-language-check.mjs — addressed in 80b2877
- category: copy
- filed: 2026-05-24 by article-language-check.mjs corpus scan
- impact: 4 (static MDX temporal phrase decays on every reader visit after publication)
- ease: 9 (phrase rewrite — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- patterns: live-tracker-stale
- file: apps/web/src/content/articles/hall-effect-mainstream.mdx
- violations:
  - line 65: `live [Trends Tracker` (live-tracker-stale)
- action: rewrite each flagged phrase using absolute dates or past-tense phrasing; see pattern descriptions in scripts/article-language-patterns.json
- issue: [mirror-failed: 2026-05-24T00:00:00Z]
> **Resolved (2026-05-24):** Rewrote the closing paragraph's tracker reference from "The live [Trends Tracker] has the Hall-effect category currently sloping up..." to "At publication, the [Trends Tracker] showed the Hall-effect category on an upward slope..." and "right now, the volume is sitting" → "at publication, the volume was sitting". Past-tense publication-anchored phrasing is stable on every reader visit. article-language-check.mjs reports clean. updatedAt bumped to 2026-05-24. 667 e2e green. `80b2877`

### [x] [copy] [4.5] keychron-q-ultra-zmk — "was at +30 on the tracker at the time this piece filed" links to live tracker (W21 shows +38) — addressed in 57354e2, closes #204
- category: copy
- filed: 2026-05-24 by cloud /iterate audit
- impact: 5 (news article about a currently-reviewed product; "+30 at the time this piece filed" cites W19 data — article published 2026-05-10, end of W19 — but link resolves to live tracker showing Keychron at +38 in W21; same score-mismatch pattern as W19 anchor series)
- ease: 9 (one clause rewrite + anchor link to W19 snapshot + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- issue: #204
- action: change "where the brand sits on the live [/trends/tracker](/trends/tracker) board in the weeks following this piece. Keychron was at +30 on the tracker at the time this piece filed, and a successful Q Ultra launch is the kind of release that either consolidates that lead or exposes it." → "where the brand sits on the Trends Tracker in the months following. At publication, the [2026-W19 Trends Tracker](/trends/tracker/2026-W19) showed Keychron at +30 — a successful Q Ultra launch is the kind of release that either consolidates that lead or exposes it."; bump updatedAt to 2026-05-24
> **Resolved (2026-05-24):** Changed "the live [/trends/tracker] board in the weeks following this piece. Keychron was at +30 on the tracker at the time this piece filed" → "the Trends Tracker in the months following. At publication, the [2026-W19 Trends Tracker](/trends/tracker/2026-W19) showed Keychron at +30" so readers land on the historical W19 snapshot where Keychron at +30 is preserved. W21 shows Keychron at +38. updatedAt bumped to 2026-05-24. 667 e2e green. `57354e2`

### [x] [copy] [4.5] zmk-mainstream-shift — "The live [Trends Tracker]" stale cross-line citation; ZMK no longer in W21 tracker — addressed in 19581f0, closes #208
- category: copy
- filed: 2026-05-24 by /iterate audit
- impact: 5 (Trends article published 2026-04-15; "The live [Trends Tracker] has the ZMK row sloping up" presents W19-era data as current; W21 has no ZMK row — readers see contradicting absence; "live" adjective and present-tense verbs decay on every visit)
- ease: 9 (2–3 word edits + past-tense conversion + updatedAt bump; language checker bigram extension guards against recurrence)
- score: 4.5 (impact × ease / 10)
- issue: #208
- action: rewrite lines 210–213 to past-tense ("At publication, the [Trends Tracker] had…both were climbing…"); bump updatedAt to 2026-05-24; extend article-language-check.mjs bigram scan to catch cross-line "live [Trends Tracker" patterns + add unit test
> **Resolved (2026-05-24):** Rewrote "The live [Trends Tracker] has the ZMK row sloping up…both are climbing" → "At publication, the [Trends Tracker] had the ZMK row sloping up…both were climbing". Cross-line split ("live\n[Trends Tracker]") evaded the per-line scan; extended article-language-check.mjs with a bigram scan (consecutive line pairs, deduplicates against single-line hits). 25 script tests (+1). updatedAt bumped to 2026-05-24. 667 e2e green. `19581f0`

### [x] [copy] [3.6] dcs-olivetti-comeback — 1 temporal anti-pattern violation detected by article-language-check.mjs — addressed in this commit, closes #211
- category: copy
- filed: 2026-05-24 by article-language-check.mjs corpus scan
- impact: 4 (static MDX temporal phrase decays on every reader visit after publication)
- ease: 9 (phrase rewrite — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- patterns: tracker-will
- file: apps/web/src/content/articles/dcs-olivetti-comeback.mdx
- violations:
  - line 94: `tracker will` (tracker-will)
- action: rewrite each flagged phrase using absolute dates or past-tense phrasing; see pattern descriptions in scripts/article-language-patterns.json
> **Resolved (2026-05-24):** Removed "The tracker will keep running its own count." — the sentence was an unfulfillable forward-looking promise on a static MDX file. The following sentence ("Eight weeks of steady upward movement…") stands without it and carries the closing argument intact. article-language-check.mjs reports clean. updatedAt bumped to 2026-05-24T12:00:00.000Z. 667 e2e green.

### [x] [fix] [5.4] tracker-will gate: markdown-link form [Tracker](url) will escapes pattern — addressed in 6adbe25, closes #213
- category: fix
- filed: 2026-05-24 by cloud /iterate audit
- impact: 6 (tracker-will pattern catches literal "tracker will" but misses "[Trends Tracker](url) will" — the ] bracket breaks the substring match; future /ship-content articles could ship with unfulfillable forward-looking tracker promises that slip past the gate)
- ease: 9 (one JSON pattern entry + 2 unit tests; no code or content change)
- score: 5.4 (impact × ease / 10)
- issue: #213
> **Resolved (2026-05-24):** Added tracker-will-md-link regex pattern to scripts/article-language-patterns.json: "Tracker\]\([^)]+\)\s+will" (gi flag) catches the markdown-link form "[Trends Tracker](url) will ..." while leaving CTA links ("Follow the [Tracker](url) to see ...") unaffected. Added 2 unit tests: positive ([Trends Tracker](url) will → flagged) + negative (CTA form → clean). Test count: 31 → 33. 667 e2e green. `6adbe25`

### [x] [data] [3.6] W22 tracker: Wuque Studio missing vendor-first-customs articleSlug — addressed in cae441b (closes #214)
- category: data
- filed: 2026-05-25 by cloud /iterate audit
- impact: 4 (flat vendor row on /trends/tracker/2026-W22; missing articleSlug severs tracker → editorial navigation path for Wuque Studio coverage)
- ease: 9 (one JSON field edit in data/trends/2026-W22.json)
- score: 3.6 (impact × ease / 10)
- issue: #214
- elements: `data/trends/2026-W22.json` Wuque Studio row — articleSlug was null (dropped by Monday-gate scout); W21 correctly carried vendor-first-customs
> **Resolved (2026-05-25):** Set `articleSlug: "vendor-first-customs"` on the Wuque Studio row in data/trends/2026-W22.json. The vendor-first-customs article covers Wuque's configurator migration and dual-track strategy; it remains the canonical editorial reference for this brand even when no W22-specific piece exists. 670 e2e green. `cae441b`

### [x] [fix] [3.6] cannonkeys-nyawice-group-buy — W19 tracker body citation lacks href to archived snapshot — addressed in 168bde0, closes #218
- category: fix
- filed: 2026-05-25 by cloud /iterate audit
- impact: 4 (body cites "down 18 percent on the W19 tracker" — variant C: text present, no hyperlink; no W19 tracker link existed anywhere in this article)
- ease: 9 (one-phrase MDX change)
- score: 3.6 (impact × ease / 10)

### [x] [a11y] [4.5] placeholder:text-text-4 — WCAG AA contrast failure on /search, /newsletter, /404 inputs — addressed in 69f9d81, closes #223
- category: a11y
- filed: 2026-05-26 by cloud /iterate audit
- impact: 5 (three form inputs across three pages use placeholder:text-text-4 — oklch(0.42) against bg-surface oklch(0.235) and bg-bg oklch(0.175) — yielding ~2.0:1 contrast, far below WCAG 1.4.3's 4.5:1 minimum for normal text; placeholder hint text is unreadable for users relying on contrast in low-vision conditions)
- ease: 9 (three files, one class-name change each; no logic or schema change)
- score: 4.5 (impact × ease / 10)
- elements: apps/web/src/components/newsletter/ButtondownForm.tsx:75-76, apps/web/src/components/not-found/RootNotFound.tsx:54, apps/web/src/app/search/SearchPanel.tsx:99
- action: change placeholder:text-text-4 → placeholder:text-text-2 in all three files; text-text-2 (oklch(0.78)) yields ~8:1 contrast on bg-surface and ~9:1 on bg-bg, both passing WCAG AA
- issue: #223
> **Resolved (2026-05-26):** Changed `placeholder:text-text-4` → `placeholder:text-text-2` in ButtondownForm.tsx (both compact and standard variants), RootNotFound.tsx, and SearchPanel.tsx. text-text-2 (oklch(0.78)) yields ~8:1 contrast on bg-surface and ~9:1 on bg-bg — both pass WCAG 1.4.3 AA. axe-core 4.11.3 does not test ::placeholder pseudo-element contrast, so the e2e a11y spec was previously passing despite the violation. 670 e2e green. `69f9d81`

### [x] [copy] [4.0] mode-sonnet-r2-group-buy-coverage — "Group-buy timing" callout shows stale pre-reschedule dates — addressed in 04ed551, closes #225
- category: copy
- filed: 2026-05-26 by cloud /iterate audit
- impact: 5 (two callouts in same article contradict each other — top callout says new dates 2026-06-01 through 2026-07-15; second "Group-buy timing" callout still shows original 2026-05-01 through 2026-06-15; a reader trusting the second callout would think the buy is 25 days in and almost done — it actually doesn't open until June 1)
- ease: 8 (one-line callout body update + updatedAt bump; no logic or schema change)
- score: 4.0 (impact × ease / 10)
- file: apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx
- line: 29
- issue: #225
- action: rewrite line 29 "Round opens 2026-05-01 and closes 2026-06-15" → "Round now opens 2026-06-01 and closes 2026-07-15 (rescheduled — see update note at top)"; bump updatedAt to 2026-05-26
> **Resolved (2026-05-26):** Updated the "Group-buy timing" callout to show the rescheduled dates 2026-06-01 through 2026-07-15 with a back-reference to the top update note. The second callout no longer contradicts the first. updatedAt bumped to 2026-05-26. 670 e2e green. `04ed551`

### [x] [fix] [3.6] language gate — "at publication" + bare tracker URL anti-pattern not covered — addressed in 429089d, closes #227
- category: fix
- filed: 2026-05-27 by cloud /iterate audit (expand pass 33 callout — iterate-shaped)
- impact: 4 (preventive: catches "At publication, the [Trends Tracker](/trends/tracker) showed…" — bare-URL form of the tracker-anachronism; af530a7 fixed the one instance manually; no gate prevents future articles from repeating it)
- ease: 9 (add one JSON pattern to article-language-patterns.json + 2 unit tests)
- score: 3.6 (impact × ease / 10)
- elements: scripts/article-language-patterns.json, scripts/__tests__/article-language-check.test.mjs
- issue: #227
- action: add pattern id="at-publication-bare-tracker" matching `[Aa]t publication.*\[.*[Tt]racker.*\]\(/trends/tracker\)` with regex:true; add positive test (bare URL → triggers) and negative test (snapshot URL → does not trigger)
> **Resolved (2026-05-27):** Added `at-publication-bare-tracker` pattern to `scripts/article-language-patterns.json`. Matches "At publication, the [Trends Tracker](/trends/tracker)…" with a bare URL; does not match snapshot URLs (/trends/tracker/2026-W19) or forward-looking "Follow the tracker" CTAs. 2 unit tests added. Corpus scan: 0 violations (current articles already use snapshot anchors). 670 e2e green. `429089d`

### [x] [fix] [4.5] content-gap-survey extractFrontmatter skips double-quoted publishedAt — addressed in 0aa2636, closes #229
- category: fix
- filed: 2026-05-29 by cloud /iterate audit
- impact: 5 (correctness: dcs-olivetti-comeback.mdx silently excluded from trends pillar window count, causing false hot-pursuit or false comfortable readings)
- ease: 9 (one-line regex change + normalize frontmatter + one new test)
- score: 4.5 (impact × ease / 10)
- elements: scripts/content-gap-survey.mjs, apps/web/src/content/articles/dcs-olivetti-comeback.mdx, scripts/__tests__/content-gap-survey.test.mjs
- issue: #229
- action: widen regex from `'?([^'\n]+)'?` to `['"]?([^'"\n]+)['"]?`; normalize article publishedAt to single quotes; add extractFrontmatter double-quote test
> **Resolved (2026-05-29):** Fixed `extractFrontmatter` regex to handle both single- and double-quoted YAML values. Normalized `dcs-olivetti-comeback.mdx` to single-quoted `publishedAt` and inline tags. Added a failing test that now passes. 673 e2e green. `0aa2636`

### [x] [fix] [3.5] quiz — clicky switches unreachable: no actuationFeel option maps to type="clicky" — addressed in 77c34ae, closes #231
- category: fix
- filed: 2026-05-30 by cloud /iterate audit
- impact: 5 (kailh-box-jade and kailh-box-white score 0 on both soundProfile and actuationFeel functions; clicky enthusiasts receive only linear/tactile results from the /quiz/switch discovery surface regardless of intent)
- ease: 7 (add one QuizAnswers union member + one SwitchQuiz option + one scoring branch + one unit test)
- score: 3.5 (impact × ease / 10)
- elements: apps/web/src/lib/quiz/recommendSwitch.ts, apps/web/src/components/quiz/SwitchQuiz.tsx, apps/web/src/lib/quiz/__tests__/recommendSwitch.test.ts
- issue: #231

### [x] [HOT PURSUIT] [content-gap] [7] guides pillar — 1 of ≥2 articles in last 30d — addressed in d66c919 (closes #232)
- category: content-gaps
- impact: 5 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: guides
- window-count: 1
- window-start: 2026-05-01
- score: 7
- next: /ship-content → guides pillar article
> Filed 2026-05-31 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.

### [x] [copy] [3.6] stabilizers-explained — author field 'thock editorial' deviates from corpus standard 'thock' — addressed in 342ee16, closes #235
- category: copy
- filed: 2026-05-31 by cloud /iterate audit
- impact: 4 (byline renders across article page, article cards on home/pillar/tag pages, RSS feeds; inconsistent with all 42 other articles in corpus; implies a distinct editorial entity from the established thock byline convention)
- ease: 9 (single field change + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #235

### [x] [copy] [4.5] gmk-cyl-greg-2-group-buy — present-tense phrasing stale after May 29 close — addressed in 31d55c8, closes #238
- category: copy
- filed: 2026-05-31 by cloud /iterate audit
- impact: 5 (lede + body opener + buying-notes + closing line all say "runs through 2026-05-29" / "closes 2026-05-29" — the buy closed 2 days ago; a reader visiting now sees a live-sounding article for a closed buy)
- ease: 9 (four string replacements in one file + updatedAt bump)
- score: 4.5 (impact × ease / 10)
- elements: apps/web/src/content/articles/gmk-cyl-greg-2-group-buy.mdx lines 4, 17, 57, 71
- issue: #238
> **Resolved (2026-05-31):** Changed `author: thock editorial` → `author: thock` in stabilizers-explained.mdx. Bumped updatedAt to 2026-05-31. 682 e2e green. `342ee16`

### [x] [copy] [3.6] gmk-cyl-ishtar-r2-group-buy — title "closes" stale after May 10 close — addressed in a8461f0
- category: copy
- filed: 2026-05-31 by cloud /iterate audit
- impact: 4 (title renders in article cards on home/pillar/tag/related pages, OG title tag, RSS feed titles, search snippets — present-tense "closes" implies active closing window on a buy that closed 21 days ago)
- ease: 9 (one-word frontmatter edit)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-05-31T18:40:00Z]
- elements: apps/web/src/content/articles/gmk-cyl-ishtar-r2-group-buy.mdx line 3

### [x] [content] [3.5] divinikey-dcs-dolch — Rule 3 violation: live GB (Jun 1–Jul 1) has no companion article — addressed in 9ba52e8, closes #243
- category: content-gaps
- filed: 2026-06-01 by cloud /iterate audit
- impact: 7 (DCS Dolch opened today at Divinikey; /group-buys active view shows the buy without "Read our coverage →"; Rule 3 fires on every live buy without a companion piece; DCS Grass Valley just closed same day — vintage-keycap buyers are actively tracking the space)
- ease: 5 (one new news-pillar article via /ship-content; 900–1200 words; group-buy companion template established by Ramune, Prussian Alert, Mode Sonnet R2)
- score: 3.5 (impact × ease / 10)
- rule: Rule 3 — group-buy companion
- issue: #243
> **Resolved (2026-06-01):** Shipped "DCS Dolch opens at Divinikey — a computing-history colorway returns" at /article/divinikey-dcs-dolch-group-buy (~1080 words, publishedAt 2026-06-01 per group-buy startDate exception). Hero SVG + 3 InlineViz SVGs (dolch-palette, dcs-vs-cherry-profile, moq-price-tiers). divinikey brand tag added to tags.json. data/group-buys/divinikey-dcs-dolch.json relatedArticle set. Language gate clean after 2-violation fix. 691 e2e green. `9ba52e8`

### [x] [data] [5.4] W23 tracker: Ramune note wrong close date + Selene bad articleSlug — addressed in 87c779d, closes #241
- category: data
- filed: 2026-06-01 by cloud /iterate audit
- impact: 6 (Ramune note claimed "closed around June 5" — buy open until June 20; active buyer reading /trends/tracker/2026-W23 sees wrong close date; Selene linked to unrelated keycap-profiles-compared guide)
- ease: 9 (two field edits in one JSON file)
- score: 5.4 (impact × ease / 10)
- issue: #241
> **Resolved (2026-06-01):** Rewrote Ramune note to accurately reflect open buy status through 2026-06-20 (245 chars, within 280-char schema limit). Set GMK CYL Selene articleSlug from "keycap-profiles-compared" to null — no thock article covers Selene specifically. updatedAt bumped to 2026-06-01T14:00:00.000Z. 685 e2e green. `87c779d`

### [x] [content] [4.0] beginners-switch-buying-guide — kailh-box-white named in body but absent from mentionedParts — addressed in 97cbfc7, closes #247
- category: content
- filed: 2026-06-01 by cloud /iterate audit
- impact: 5 (body line 44 explicitly recommends "Kailh Box White" as the modern clicky alternative; kailh-box-white part record was added in Phase 34 but mentionedParts was never updated; /part/switch/kailh-box-white shows 0 "mentioned in" articles despite thock's most-read beginner guide recommending it; MentionedPartsRail on the article also omits the part)
- ease: 8 (frontmatter mentionedParts entry + PartReference inline component + updatedAt bump; no new files)
- score: 4.0 (impact × ease / 10)
- elements: apps/web/src/content/articles/beginners-switch-buying-guide.mdx frontmatter + line 44
- issue: #247

### [x] [content] [4.5] keycap-profiles-compared — missing 'sa' tag despite SA in title and 15 body mentions — addressed in dafaab4, closes #249
- category: content
- filed: 2026-06-01 by cloud /iterate audit
- impact: 5 (article titled "Keycap profiles, compared: Cherry, OEM, SA, and MT3" is the canonical SA profile reference; /tag/sa had 0 articles; sa-godspeed is in the parts database but /tag/sa showed nothing; readers browsing by profile tag couldn't find the comparison guide)
- ease: 9 (add 'sa' to tags array + updatedAt bump; no other files)
- score: 4.5 (impact × ease / 10)
- issue: #249
> **Resolved (2026-06-01):** Added `sa` to tags array between `oem-profile` and `mt3` in keycap-profiles-compared.mdx frontmatter. Bumped updatedAt to 2026-06-01. /tag/sa now shows 1 article. 697 e2e green. `dafaab4`

### [x] [content] [3.6] gmk-cyl-selene-group-buy — missing InlineViz (0 of ≥2 required by bearings) — addressed in c3c9e06
- category: content
- filed: 2026-06-02 by cloud /iterate audit
- impact: 6 (bearings rule mandates ≥2 InlineViz per article as non-optional editorial baseline; violation on a live news article reduces editorial quality and is visible to all readers of the article)
- ease: 6 (2 SVGs hand-authored + 2 InlineViz tag insertions + updatedAt bump; no schema or component change)
- score: 3.6 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-02T00:00:00Z]
- elements: apps/web/src/content/articles/gmk-cyl-selene-group-buy.mdx
> **Resolved (2026-06-02):** Added selene-kit-pricing.svg (horizontal range-bar chart — base $110–155, 3 add-on kits $55–85 each, fully-kitted $220–325 footer note; orchid #9370B8 highlight on base kit) and selene-cyl-subline.svg (4-panel GMK CYL sub-line character map: Prussian Alert/Bauhaus restraint → Ramune/pastel softness → King of the Seas/nautical depth → Selene/material-first glitter reflect). Both SVGs use orchid #9370B8 as splash; provenance JSONs include article-body citations for no-fabrication compliance. Placed after pricing paragraph and after sub-line comparison paragraph respectively. Language gate clean. updatedAt bumped to 2026-06-02. 697 e2e green. `c3c9e06`

### [x] [content] [4.5] sound-dampening-compared — mode-sonnet and ikki68-aurora missing from mentionedParts — addressed in bc5de31, closes #251
- category: content
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (sound-dampening-compared popularityScore 65, guides pillar; mode-sonnet and ikki68-aurora are named boards in body prose at line 48; both /part/board/ pages gain "mentioned in" cross-link from a high-traffic reference article; mentionedParts was completely empty despite specific product names in body)
- ease: 9 (add 2 mentionedParts entries + PartReference tags + updatedAt bump; no schema or code change)
- score: 4.5 (impact × ease / 10)
- issue: #251
> **Resolved (2026-06-02):** Added mentionedParts entries for mode-sonnet (board) and ikki68-aurora (board). Added PartReference tags inline at line 48 — "The Mode Sonnet, the Wuque IKKI68 Aurora" → "The <PartReference id="mode-sonnet" />, the <PartReference id="ikki68-aurora" />". Bumped updatedAt to 2026-06-02. Both /part/board/mode-sonnet and /part/board/ikki68-aurora now show this article in their "mentioned in" rail. 697 e2e green. `bc5de31`

### [x] [content] [5.4] hall-effect-mainstream — mentionedParts empty despite hmx-cloud, gateron-oil-king, tecsee-sapphire-v2 named in body — addressed in 5468bb6
- category: content
- filed: 2026-06-02 by cloud /iterate audit
- impact: 6 (hall-effect-mainstream is a cornerstone trends article; three named switches — HMX Cloud, Oil King, Tecsee Sapphire — are explicitly listed as the "boutique linear crowd" bench at line 57; all three have part pages; their /part/switch/ mentioned-in rails miss this high-prominence article)
- ease: 9 (frontmatter array change only — no code, no component, no schema change)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-02T00:00:00Z]
- elements: apps/web/src/content/articles/hall-effect-mainstream.mdx

### [x] [content] [4.0] gasket-mount-reality — bakeneko65 named in body but absent from mentionedParts — addressed in 3db692a, closes #256
- category: content
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (gasket-mount-reality popularityScore=28; article names "the Bakeneko" as a peer canonical reference board alongside "Mode's own lineup" at line 58; /part/board/bakeneko65 gains "mentioned in" cross-link from this moderately-trafficked ideas-pillar article; bakeneko65 currently shows 0 "mentioned in" cross-links from this article)
- ease: 8 (mentionedParts frontmatter entry + inline PartReference + updatedAt bump; no schema or code change)
- score: 4.0 (impact × ease / 10)
- issue: #256
- elements: apps/web/src/content/articles/gasket-mount-reality.mdx line 58
> **Resolved (2026-06-02):** Added bakeneko65 to mentionedParts frontmatter (id: bakeneko, kind: board, slug: bakeneko65). Added `<PartReference id="bakeneko" />` inline at line 58 replacing plain "the Bakeneko" — "the Geon Frog, the Bakeneko, and Mode's own lineup" → "the Geon Frog, the <PartReference id="bakeneko" />, and Mode's own lineup". Bumped updatedAt to 2026-06-02T00:00:00.000Z. /part/board/bakeneko65 now shows gasket-mount-reality in its "mentioned in" rail. 697 e2e green. `3db692a`

### [x] [content] [4.0] plate-materials-explained — no mentionedParts despite naming hmx-cloud and gateron-oil-king as build-recipe exemplars — addressed in 00be895, closes #257
- category: content
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (plate-materials-explained is a deep-dives guide; HMX Cloud named as the "let the switch sing" FR4 build switch; Oil King named as the "deep thock" polycarbonate gasket-mount build switch; /part/switch/hmx-cloud and /part/switch/gateron-oil-king both gain "mentioned in" cross-link from a practical build reference article)
- ease: 8 (add mentionedParts frontmatter + two PartReference inline tags + updatedAt bump; no schema or code change)
- score: 4.0 (impact × ease / 10)
- issue: #257
- elements: apps/web/src/content/articles/plate-materials-explained.mdx lines 92, 94
> **Resolved (2026-06-02):** Added mentionedParts frontmatter (id: hmx-cloud, kind: switch, slug: hmx-cloud; id: oil-king, kind: switch, slug: gateron-oil-king). Added `<PartReference id="hmx-cloud" />` at line 92 ("let the switch sing" build) and `<PartReference id="oil-king" />` at line 94 ("deep thock" default build). updatedAt bumped to 2026-06-02. Language gate clean. 697 e2e green. `00be895`

### [x] [content] [4.0] trends-tracker-preview — gateron-oil-king missing from mentionedParts despite 3 prose mentions — addressed in d0625b7
- category: content
- filed: 2026-06-02 by cloud /iterate audit
- impact: 5 (trends-tracker-preview popularityScore 30, the canonical explainer article for new readers learning the tracker; Gateron Oil King is used as the primary worked example across 3 prose mentions — line 23 "A switch family like Gateron Oil King", line 38 naming convention example, line 48 "sat at +42 with a clean ascending sparkline"; /part/switch/gateron-oil-king gains cross-link from the most-read tracker entry-point article)
- ease: 8 (add 1 mentionedParts entry + PartReference inline at line 23 + updatedAt bump; no schema or code change)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-02T00:00:00Z]
- elements: apps/web/src/content/articles/trends-tracker-preview.mdx line 23
> **Resolved (2026-06-02):** Added mentionedParts entry (id: oil-king, kind: switch, slug: gateron-oil-king). Replaced plain "Gateron Oil King" at line 23 with `<PartReference id="oil-king" />`. updatedAt bumped to 2026-06-02. Language gate clean. 697 e2e green. `d0625b7`

### [x] [HOT PURSUIT] [content-gap] [7] guides pillar — 1 of ≥2 articles in last 30d — addressed in b6c8485 (closes #258)
- category: content-gaps
- impact: 5 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: guides
- window-count: 1
- window-start: 2026-05-04
- score: 7
- next: /ship-content → guides pillar article
> Filed 2026-06-03 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
> **Resolved (2026-06-03):** Shipped "Keyboard case materials, compared: aluminium, polycarbonate, and ABS" at `/article/case-materials-compared`, publishedAt 2026-05-27 (gap-fill: largest gap 05-23 → 06-01 in 30-day window). ~1530 words, 3 InlineViz. Guides pillar now at 2 of ≥2 in last 30d — comfortable. `b6c8485`

### [x] [content] [4.0] case-materials-compared — drop-ctrl, mode-sonnet, ikki68-aurora missing from mentionedParts — addressed in 26c1a01
- category: content
- filed: 2026-06-03 by cloud /iterate audit
- impact: 5 (case-materials-compared guides pillar popularityScore 42; Drop CTRL (line 45), Mode Sonnet (lines 45, 80), and ikki68 Aurora (line 53) are explicitly named boards; all three have part pages; their "mentioned in" rails were missing this guide as a cross-link)
- ease: 8 (add 3 mentionedParts entries + 2 PartReference inline tags + updatedAt bump; no schema or code change)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-03T00:00:00Z]
- elements: apps/web/src/content/articles/case-materials-compared.mdx lines 45, 53
> **Resolved (2026-06-03):** Added mentionedParts entries for drop-ctrl, mode-sonnet, ikki68-aurora (all board kind). Added `<PartReference id="mode-sonnet" />` at line 45 (first plain-text mention replacing "the Mode Sonnet") and `<PartReference id="ikki68-aurora" />` at line 53 (wrapping "The ikki68 Aurora" before the Source). Drop CTRL Source wrapper kept for /sources citation; frontmatter entry drives its "mentioned in" rail. updatedAt bumped to 2026-06-03. Language gate clean. 700 e2e green. `26c1a01`

### [x] [content] [5.4] alice-layout-decline — gateron-oil-king missing from mentionedParts despite body mention and inline-viz reference — addressed in 765d1ef
- category: content
- filed: 2026-06-03 by cloud /iterate audit
- impact: 6 (alice-layout-decline is a trends article, popularityScore 26; Gateron Oil King is the primary comparison benchmark cited by name in the inline viz alt text and in the body prose at line 41 — "the Gateron Oil King up 42"; absent from mentionedParts breaks the bidirectional cross-reference rail on /part/switch/gateron-oil-king)
- ease: 9 (add structured mentionedParts entry + swap <Mono> tag to <PartReference id="oil-king" />)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-03T00:00:00Z]
> **Resolved (2026-06-03):** Added structured mentionedParts entry (id: oil-king, kind: switch, slug: gateron-oil-king). Swapped `<Mono>Gateron Oil King</Mono>` to `<PartReference id="oil-king" />` at line 41 so body prose links to the part page. updatedAt bumped to 2026-06-03. Language gate clean. 700 e2e green. `765d1ef`

### [x] [content] [5.4] cherry-mx2a-revision — gateron-oil-king missing from mentionedParts despite body mention — addressed in 7b94f40, closes #261
- category: content
- filed: 2026-06-03 by cloud /iterate audit
- impact: 6 (cherry-mx2a-revision is a deep-dives article; Gateron Oil King is explicitly named in the body at line 49 as the acoustic benchmark Gateron Pro 3 emulates — "the same housing pairing that the Oil King uses to sound the way it sounds" — and the article links to its deep-dive; absent from mentionedParts breaks the "mentioned in" cross-reference rail on /part/switch/gateron-oil-king)
- ease: 9 (single frontmatter array entry addition)
- score: 5.4 (impact × ease / 10)
- issue: #261
> **Resolved (2026-06-03):** Added structured mentionedParts entry (id: gateron-oil-king, kind: switch, slug: gateron-oil-king). updatedAt bumped to 2026-06-03. /part/switch/gateron-oil-king now shows cherry-mx2a-revision in its "mentioned in" rail. Language gate clean. 700 e2e green. `7b94f40`

### [x] [content] [5.4] hmx-cloud-deep-dive — tecsee-sapphire-v2 + mode-sonnet missing from mentionedParts — addressed in 8df4747, closes #262
- category: content
- filed: 2026-06-03 by cloud /iterate audit
- impact: 6 (hmx-cloud-deep-dive is a deep-dives article; Tecsee Sapphire is explicitly named at line 32 as the incumbent the HMX tactile bench fails to displace — "haven't materially threatened the Tecsee Sapphire's hold on that slot"; Mode Sonnet is named at line 26 as the canonical mid-tier build context — "what should I drop into my Mode Sonnet R2"; both absent from mentionedParts breaks "mentioned in" rails on /part/switch/tecsee-sapphire-v2 and /part/board/mode-sonnet)
- ease: 9 (two frontmatter array entry additions)
- score: 5.4 (impact × ease / 10)
- issue: #262
> **Resolved (2026-06-03):** Added tecsee-sapphire-v2 (id: sapphire, kind: switch) and mode-sonnet (id: mode-sonnet, kind: board) to mentionedParts. updatedAt bumped to 2026-06-03. /part/switch/tecsee-sapphire-v2 and /part/board/mode-sonnet now show hmx-cloud-deep-dive in their "mentioned in" rails. Language gate clean. 700 e2e green. `8df4747`

### [x] [content] [3.6] mounting-styles-compared — bakeneko65 missing from mentionedParts despite two body references — addressed in ad714db, closes #265
- category: content
- filed: 2026-06-03 by cloud /iterate audit
- impact: 4 (mounting-styles-compared guides article; "original Bakeneko design" named as origin of burger-mount style at line 81; "Bakeneko-style designs" cited as the low-cost integrated-plate tier at line 104; bakeneko65 part page gains "mentioned in" cross-link from a practical mounting-styles reference guide; existing qk75 PartReference at line 69 created asymmetry)
- ease: 9 (add 1 mentionedParts entry + swap inline "Bakeneko" to <PartReference id="bakeneko" /> at line 81 + updatedAt bump)
- score: 3.6 (impact × ease / 10)
- issue: #265
- elements: apps/web/src/content/articles/mounting-styles-compared.mdx lines 81, 104
> **Resolved (2026-06-03):** Added bakeneko65 (id: bakeneko, kind: board, slug: bakeneko65) to mentionedParts. Swapped plain "Bakeneko" at line 81 to `<PartReference id="bakeneko" />` — "original Bakeneko design" now links to the part page, parallel to the qk75 PartReference at line 69. updatedAt bumped to 2026-06-03. Language gate clean. 703 e2e green. `ad714db`

### [x] [content-gaps] [3.5] hall-effect tag has 2 articles — W23 tracker #1 trending topic needs a buyer's guide — addressed in 72d4480, closes #267
- category: content-gaps
- filed: 2026-06-05 by cloud /iterate audit
- impact: 7 (hall-effect / rapid-trigger is the W23 tracker's top-scoring entry at +66 direction up; the site has a technology deep-dive and a market-trend piece but no practical buyer's guide; readers who searched "hall-effect keyboard guide" after encountering the tracker find no purchase guidance on thock; gateron-magnetic-jade is in the catalog with no guide article linking to it)
- ease: 5 (one new guides article, delegate to content-curator + brander)
- score: 3.5 (impact × ease / 10)
- rule: tag underrepresentation (hall-effect tag at 2 articles, below the 3-article threshold for a top-trending topic)
- target: guides pillar — "Hall-effect keyboards: a buyer's guide" — slug hall-effect-keyboard-guide
- publishedAt: 2026-05-30T12:00:00.000Z (gap-fill: largest gap May 27T13:00 → Jun 1T14:00)
- issue: #267
> **Resolved (2026-06-05):** Shipped hall-effect-keyboard-guide.mdx (~1480 words, 7 sections) to the guides pillar. Tags: hall-effect, magnetic, switches, prebuilt, configurator, polling-rate. mentionedParts: gateron-magnetic-jade. Hero SVG: ochre splash, Hall-effect cross-section with annotated callouts. hall-effect tag now at 3 articles. Language gate clean. 709 e2e green. `72d4480`

### [x] [content] [4.5] hall-effect-keyboard-guide missing oil-king + hmx-cloud in mentionedParts — addressed in 69e99f6
- category: content
- filed: 2026-06-05 by cloud /iterate audit
- impact: 5 (hall-effect-keyboard-guide is the guides pillar buyer's guide just shipped 2026-06-05; Gateron Oil King and HMX Cloud are named explicitly in body prose at lines 88 and 98 as the canonical MX linear reference benchmarks the article positions HE against; both are in the data catalog; their part pages gain "mentioned in" cross-link from a high-traffic buyer's guide article)
- ease: 9 (frontmatter array additions + updatedAt bump; no body or code change)
- score: 4.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-05T00:00:00Z]
> **Resolved (2026-06-05):** Added oil-king (id: oil-king, kind: switch, slug: gateron-oil-king) and hmx-cloud (id: hmx-cloud, kind: switch, slug: hmx-cloud) to mentionedParts frontmatter. Consistent with hall-effect-mainstream.mdx treatment of the same two products (frontmatter entries without inline PartReference, since body uses them as tier descriptors). updatedAt bumped to 2026-06-05. 709 e2e green. `69e99f6`

### [x] [content] [3.6] hmx-cloud-deep-dive — gateron-pro-3-yellow missing from mentionedParts — addressed in 25a2f8782fbf2709dab25b5fdf9a9622aa222afa, closes #269
- category: content
- filed: 2026-06-05 by cloud /iterate audit
- impact: 4 (hmx-cloud-deep-dive deep-dives article names "Oil King and Pro 3.0 line" in restock-cadence comparison; gateron-pro-3-yellow in catalog; /part/switch/gateron-pro-3-yellow gains "mentioned in" cross-link from a substantive deep-dive)
- ease: 9 (frontmatter entry + PartReference inline at line 87 + updatedAt bump; no schema or code change)
- score: 3.6 (impact × ease / 10)
- issue: #269

### [x] [data] [3.5] spring-swaps-explained missing mentionedParts — c3-tangerine-r2 orphaned — addressed in 93c2e0a
- category: data
- filed: 2026-06-05 by cloud /iterate audit
- impact: 5 (ideas pillar article had empty mentionedParts: []; c3-tangerine-r2 part page had zero "mentioned in" cross-links; spring-swaps article now references the Tangerine R2 concretely in the "unusual stock weight" case where it previously used a vague placeholder example)
- ease: 7 (single sentence update in article body + frontmatter mentionedParts update; updatedAt bumped)
- score: 3.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-05T00:00:00Z]

### [x] [data] [4.5] plate-materials-explained missing mode-sonnet in mentionedParts — addressed in 598e896, closes #270
- category: data
- filed: 2026-06-05 by cloud /iterate audit
- impact: 5 (deep-dives article on plate materials names Mode Sonnet as the pioneering mid-tier board to offer configurable plate options in its "What to watch" section; mode-sonnet is in the boards catalog; /part/board/mode-sonnet "mentioned in" rail was missing this plate-materials guide cross-link; builders researching the Mode Sonnet board gain a relevant editorial reference)
- ease: 9 (single frontmatter entry; no body or code change)
- score: 4.5 (impact × ease / 10)
- issue: #270

### [x] [content] [3.5] keycap-profiles-compared — SA section has no canonical set example — addressed in ca59b41, closes #271
- category: content
- filed: 2026-06-05 by cloud /iterate audit
- impact: 5 (guides article comparing Cherry, OEM, SA, MT3 profiles; Cherry section cites gmk-bento-r2, MT3 cites mt3-dasher + mt3-devtty, KAT section cites kat-drifter; SA section describes the profile in detail but never names a specific set — the only profile section without a concrete PartReference; sa-godspeed is in the catalog as the canonical SA example, produced by Signature Plastics through Drop, described as "a gateway set for enthusiasts exploring tall-profile keycaps")
- ease: 7 (one sentence + PartReference in SA section + frontmatter slug addition)
- score: 3.5 (impact × ease / 10)
- next: add <PartReference id="sa-godspeed" /> to SA section body; add sa-godspeed to mentionedParts frontmatter
- issue: #271

### [x] [data] [4.0] beginners-switch-buying-guide — durock-t1 absent from tactile section, part page had empty "mentioned in" rail — addressed in 4d9fe89
- category: data
- filed: 2026-06-05 by cloud /iterate audit
- impact: 5 (beginners-switch-buying-guide is the guides pillar flagship article; Durock T1 is the hobby's canonical entry-level heavy tactile with 67g actuation; /part/switch/durock-t1 had 0 article cross-links across all 48 articles; tactile section listed four common starting points but omitted the T1 — the most-recommended heavy bump option)
- ease: 8 (one sentence + PartReference in existing tactile paragraph + frontmatter entry)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-05T23:30:00Z]

### [x] [data] [4.5] beginners-switch-buying-guide — gazzew-boba-u4t missing from mentionedParts — addressed in fe0780c, closes #272
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (highest-traffic switch guide, popularityScore 51; guide explicitly contrasts U4T and U4 as full-sound vs. silent siblings; U4 had PartReference but U4T lacked one despite data record existing since same tick)
- ease: 9 (frontmatter entry + PartReference wrap)
- score: 4.5 (impact × ease / 10)
- issue: #272

### [x] [data] [4.0] beginners-switch-buying-guide — gazzew-boba-lt absent from silent section, silent-linear orphan with 0 cross-links
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (beginners-switch-buying-guide is the guides pillar highest-traffic switch article, popularityScore 51; silent section already mentions Boba U4T [tactile, full-sound] and Boba U4 [tactile, silent] as a contrast pair — the Boba LT [silent-linear, 37g] completes the Boba trifecta and gives builders who want silence without tactile feedback a concrete named recommendation; /part/switch/gazzew-boba-lt has 0 article cross-links across all 49 articles)
- ease: 8 (one sentence after the U4/U4T clause + PartReference id="boba-lt" + frontmatter entry; same pattern as boba-u4t fix fe0780c)
- score: 4.0 (impact × ease / 10)
- issue: #274
> **Resolved (2026-06-06):** Added Boba LT PartReference and mentionedParts entry to beginners-switch-buying-guide.mdx. Sentence appended after U4/U4T contrast clause: "The <PartReference id="boba-lt" /> completes the family on the linear side: the same Boba housing and dampening, but a smooth stem with no tactile event and an ultralight 37g actuation — one of the lightest factory-lubed silent linears in production." /part/switch/gazzew-boba-lt gains its first "mentioned in" cross-link. Language gate clean. 712 e2e green. `914c0ab921ea1645fdb175cded97303d541538aa`

### [x] [data] [4.0] mounting-styles-compared missing kbd75v3 as 75% gasket example — orphan board — addressed in 3770bc4
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (mounting-styles-compared is the Guides pillar's primary mount-style article; kbd75v3 is the most-recommended 75% gasket entry point from KBDfans; no article cross-link despite being in-stock catalog data; part page "mentioned in" rail was empty)
- ease: 8 (one sentence addition in gasket section + PartReference + frontmatter mentionedParts entry; same pattern as prior orphan-part fixes)
- score: 4.0 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-06T00:00:00Z]

### [x] [data] [3.5] gateron-oil-king-deep-dive — gateron-ink-v2-yellow orphan switch missing from mentionedParts — addressed in 36f9117
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (Gateron Ink V2 Yellow is an in-production premium linear with zero editorial cross-links; the oil-king deep-dive already discusses all-PC housings as a direct contrast to the Oil King's mixed-resin approach — the Ink V2 Yellow is the canonical named example; /part/switch/gateron-ink-v2-yellow "mentioned in" rail was empty)
- ease: 7 (one frontmatter mentionedParts entry + one inline PartReference in existing prose)
- score: 3.5 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-06 — GH_REPO missing in CI env]

### [x] [data] [4.8] keycap-profiles-compared Cherry section missing gmk-laser — orphan keycap set — addressed in 8b0b086
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 6 (guides pillar primary keycap-selection article with popularityScore 42; GMK Laser is one of the hobby's most iconic Cherry-profile ABS sets — the 2018 synthwave/retro-futurist design that defined an entire aesthetic wave and still commands aftermarket premiums; /part/keycap-set/gmk-laser "mentioned in" rail was empty despite being catalog data)
- ease: 8 (one sentence addition to Cherry section + one frontmatter mentionedParts entry; same pattern as gmk-olivia and domikey-wob additions)
- score: 4.8 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-06]

### [x] [data] [4.0] beginners-switch-buying-guide missing akko-v3-cream-blue-pro — orphan light tactile — addressed in a151d4b77364ec0707bd2b91df7750ab32c3ee11, closes #276
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (popular beginner guide; akko-v3-cream-blue-pro is in-production budget light tactile at 45g — covers the light end of the tactile spectrum; /part/switch/akko-v3-cream-blue-pro "mentioned in" rail was empty)
- ease: 8 (one sentence + PartReference + frontmatter entry; e2e fixture updated per comment instruction)
- score: 4.0 (impact × ease / 10)
- issue: #276

### [x] [data] [4.2] gmk-cyl-ramune — missing keycap-set catalog record, companion article had empty mentionedParts — addressed in d022eb9
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 6 (live group buy closes 2026-06-20; trending in W22+W23 tracker; companion article gmk-cyl-ramune-group-buy.mdx already live but mentionedParts was []; /part/keycap-set/gmk-cyl-ramune part page was 404)
- ease: 7 (create keycap-set JSON record + update frontmatter mentionedParts; schema-compliant with gmk-cyl-selene as template; 10 keycap-set records total was 9)
- score: 4.2 (impact × ease / 10)
- issue: #278

### [x] [data] [4.2] gmk-cyl-selene-group-buy — gmk-cyl-ramune missing from mentionedParts despite explicit body mention — addressed in be32980, closes #279
- category: data
- filed: 2026-06-06 by cloud /iterate audit
- impact: 5 (gmk-cyl-selene-group-buy is a live-buy companion for a buy open through Jun 19; article names GMK CYL Ramune at line 29 and with <Mono>GMK CYL Ramune</Mono> at line 50 in the CYL sub-line comparison section; gmk-cyl-ramune keycap-set record added d022eb9 but the Selene article predated it; /part/keycap-set/gmk-cyl-ramune "mentioned in" rail now includes this article)
- ease: 9 (mentionedParts entry + Mono→PartReference swap; same pattern as prior keycap-set cross-ref fixes)
- score: 4.2 (impact × ease / 10)
- issue: #279

### [x] [content] [4.2] hall-effect-mainstream — missing cross-link to hall-effect-keyboard-guide — addressed in da938b8, closes #281
- category: content
- filed: 2026-06-06 by cloud /iterate audit
- impact: 6 (hall-effect-mainstream is the W23 tracker anchor for the #1 trending topic at +66; popularityScore 35; buyer's guide published 2026-05-30 after this article's last update 2026-05-28 — the article didn't know the guide existed)
- ease: 7 (single sentence addition at end of "What we're watching" section; updatedAt bumped)
- score: 4.2 (impact × ease / 10)
- issue: #281

### [x] [content] [4.8] keycap-profiles-compared missing cross-link to keycap-materials-compared — addressed in 2d28c9e, closes #283
- category: content
- filed: 2026-06-06 by cloud /iterate audit
- impact: 6 (popularityScore 42 guide covers profile axis; companion materials guide already links to it on line 27; readers arriving via search had no path to the other half of the keycap decision)
- ease: 8 (single sentence addition at end of Closing section; updatedAt bumped)
- score: 4.8 (impact × ease / 10)
- issue: #283

### [x] [content] [6.3] beginners-switch-buying-guide — lubing-101 bidirectional cross-link missing — addressed in 2fbfe66, closes #284
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (popularityScore 51, highest-traffic guides article; "Step three" section explicitly names lubing as the natural next activity without providing a link to /article/lubing-101; lubing-101 had 0 outgoing article links and updatedAt null)
- ease: 9 (wrap "lubing" in a markdown link in beginners guide; add one closing sentence in lubing-101 "The practical take" section linking back)
- score: 6.3 (impact × ease / 10)
- issue: #284

### [x] [content] [6.3] sound-dampening-compared — pe-foam-mod guide cross-link missing at PE foam section close — addressed in 0ee7428, closes #286
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 7 (sound-dampening-compared popularityScore 65, highest-traffic comparison guide; PE foam section described the mod's mechanism and ratio advantage without sending readers to /article/pe-foam-mod — the dedicated installation guide; tape-mod section already had an identical pattern close added in bbc42c1; PE foam is the "highest-ROI single addition" per the article's own copy)
- ease: 9 (single prose sentence addition at end of §PE foam, identical to tape-mod section close)
- score: 6.3 (impact × ease / 10)
- issue: #286

### [x] [content] [7.2] gateron-oil-king-deep-dive — plate-materials-explained cross-link missing at plate-swap recommendation
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 8 (gateron-oil-king-deep-dive popularityScore 38, 8th most popular article; explicitly recommends plate swaps as the productive next modding direction for builders but provides no navigation path to plate-materials-explained — the dedicated deep-dive on how FR4, POM, brass, and aluminium each change the acoustic profile; every reader who follows the article's own advice to experiment with plate material has no onward link)
- ease: 9 (one sentence appended to the plate-swap paragraph, identical pattern to tape-mod/pe-foam cross-link fixes)
- score: 7.2 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]
- addressed in: a074ffc

### [x] [content] [7.2] stabilizer-servicing-guide — sound-dampening-compared cross-link missing at article close
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 8 (stabilizer-servicing-guide popularityScore 72, highest-traffic guide in catalog; ends with "the difference between a stabilizer that sounds good and one that sounds finished" but provides no onward path; sound-dampening-compared [popularityScore 65] is the natural continuation covering foam mods, tape mod, and case materials for builders who have addressed stabilizers and want the rest of the acoustic chain)
- ease: 9 (one closing sentence addition at end of "What to expect" section, identical pattern to tape-mod and pe-foam-mod closing cross-links)
- score: 7.2 (impact × ease / 10)
- issue: #289
- addressed in: 43e2398

### [x] [content] [5.4] spring-swaps-explained — lubing-101 cross-link missing at lube prescription — addressed in ac4b3fc
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (ideas pillar article; "Lube the rails, or sell the switch" prescribes lubing as the correct fix for scratchy switches but gave no navigation path to /article/lubing-101; readers directed away from spring swaps toward lubing had to find the guide themselves)
- ease: 9 (one inline link on existing prose: "Lube the rails" → "[Lube the rails](/article/lubing-101)")
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]
> **Resolved (2026-06-07):** "Lube the rails" at line 93 now links to /article/lubing-101. updatedAt bumped to 2026-06-07. Language gate clean. 715 e2e green. `ac4b3fc`

### [x] [content] [5.4] plate-materials-explained — sound-dampening-compared cross-link missing at pairing close
- category: content
- filed: 2026-06-07 by cloud /iterate audit
- impact: 6 (plate-materials-explained Deep Dives article had zero internal article links; the Pairing guide section names PE foam and case foam as brass plate complements but provided no navigation path to sound-dampening-compared popularityScore 65, the hub guide covering all four acoustic mods)
- ease: 9 (one closing sentence at end of Pairing guide before "What to watch" section)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-07T00:00:00Z]
- addressed in: a29cba5

### [x] [content] [6.3] typing-tests-lie — split-ergo-cohort cross-link missing at ergo claim
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (ideas pillar article; "the ergo split crowd has been quietly correct for years" directly validates split ergonomics without linking to split-ergo-cohort; Split/Ergo is W24 tracker #2 category at +52 and rising — timely connection; 0 existing article cross-links in typing-tests-lie)
- ease: 9 (one inline markdown link addition; "ergo split" → linked text; updatedAt bump)
- score: 6.3 (impact × ease / 10)
- issue: #296
- addressed in: 621535a

### [x] [content] [5.4] switch-films-worth-it — spring-swaps-explained cross-link missing at spring-ping fix recommendation
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 6 (ideas pillar modding article; line 59 says "stem-side lubing or spring swapping is the fix" for spring ping, directly recommending spring swapping with no link to the companion article; spring-swaps-explained is a discoverability orphan with 0 incoming cross-links from any article)
- ease: 9 (one inline markdown link addition; "spring swapping" → linked text at the recommendation sentence)
- score: 5.4 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-08T00:00:00Z]
- addressed in: fd85dca

### [x] [content] [6.3] sound-dampening-compared — stabilizer-servicing-guide cross-link missing at stabilizer rattle mention
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (sound-dampening-compared popularityScore 65; line 97 names "stabilizer rattle" as a "different fix" from case acoustic mods but left readers without a navigation path to stabilizer-servicing-guide — the dedicated fix guide at popularityScore 72, the highest-traffic article on the site; stabilizer-servicing-guide had only 2 incoming article cross-links before this fix)
- ease: 9 (single inline link wrap — "stabilizer rattle" → markdown link to /article/stabilizer-servicing-guide)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-08T00:00:00Z]
- addressed in: 37d0677

### [x] [content] [6.3] cherry-mx2a-revision — hall-effect-mainstream cross-link missing at Hall-effect competitive threat
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (cherry-mx2a-revision's "What we're watching" section names "Hall-effect and optical switches" as the force displacing Cherry from the high-performance esports tier but provides no navigation path to hall-effect-mainstream — the W23 tracker #1 trending topic at +66, the dedicated article covering exactly this market displacement; readers who follow the MX2A retreat narrative have no onward link to the trend it names as the driver)
- ease: 9 (single inline markdown link — wrap "Hall-effect" in "Hall-effect and optical switches" at line 87)
- score: 6.3 (impact × ease / 10)
- issue: #299
- addressed in: 7d17ad4

### [x] [content] [6.3] keyboard-firmware-compared — stabilizer-servicing-guide cross-link missing at stabilizer mention
- category: content
- filed: 2026-06-08 by cloud /iterate audit
- impact: 7 (keyboard-firmware-compared popularityScore 47; the intro mentions "get the stabilizers quiet" without linking to stabilizer-servicing-guide — the dedicated how-to at popularityScore 72, the highest-traffic article on the site; readers arriving at the firmware guide from a build context have zero navigation path to the stabilizer fix guide)
- ease: 9 (single inline markdown link — "get the stabilizers quiet" → linked text at line 18)
- score: 6.3 (impact × ease / 10)
- issue: #300
- addressed in: 0b12525

### [x] [content] [6.3] tape-mod — case-materials-compared cross-link missing at PC case section
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (tape-mod popularityScore 67, 3rd-highest traffic on site; the "Fully polycarbonate or acrylic cases" bullet at line 77 explicitly explains that PC case material acoustics dominate the sound profile but provided no navigation path to case-materials-compared — popularityScore 42, 0 incoming article cross-links before this fix; tape-mod already links to pe-foam-mod and sound-dampening-compared, making this the clear third link in the acoustic stack chain)
- ease: 9 (single closing sentence appended to the "Fully polycarbonate or acrylic cases" bullet — identical pattern to the tape-mod → sound-dampening-compared cross-link at line 107)
- score: 6.3 (impact × ease / 10)
- issue: #301
- addressed in: 017dca5, closes #301

### [x] [content] [5.4] hmx-cloud-deep-dive — acoustic-spec-rise cross-link missing at article close
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 6 (hmx-cloud-deep-dive deep-dive article; acoustic-spec-rise already links to hmx-cloud-deep-dive as its central exhibit ("most visibly HMX, whose [Cloud deep-dive] argues that HMX's edge isn't material novelty but rather the boring industrial answer of 'do the lubing well, at volume, every time'") — but the link is one-directional; readers of the deep-dive have no path to the trends piece that frames the same factory-lube quality shift as a market-wide phenomenon; bidirectional completion)
- ease: 9 (single sentence addition at close of "What we're watching" section, after the final paragraph referencing W19 Trends Tracker)
- score: 5.4 (impact × ease / 10)
- issue: #304
- addressed in: c870a13

### [x] [content] [5.4] lubing-101 — cherry-mx2a-revision cross-link missing at MX2A redesign mention
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 6 (lubing-101 guides article; line 72 cites "the Cherry MX2A redesign" as the benchmark event for modern factory lubing — the single most important recent development in factory lube quality — but provided no navigation path to cherry-mx2a-revision, the deep-dive that explains exactly what that redesign changed; lubing-101 had only 1 outgoing article cross-link before this fix; cherry-mx2a-revision is a substantive deep-dive with the engineering detail readers need to understand why the MX2A lube benchmark matters)
- ease: 9 (single inline link replacement — <Mono>Cherry MX2A</Mono> redesign → [Cherry MX2A redesign](/article/cherry-mx2a-revision))
- score: 5.4 (impact × ease / 10)
- issue: #305
- addressed in: 247d795

### [x] [content] [6.3] stabilizer-servicing-guide — stabilizers-explained cross-link missing at intro
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (stabilizer-servicing-guide is the highest-traffic article at popularityScore 72; stabilizers-explained is its published companion covering what stabilizers are, types, and rattle mechanics — but has 0 incoming cross-links from any article; the servicing guide's intro paragraph assumes familiarity with stabilizer concepts that the companion guide provides; every reader of the most popular article gets a path to the foundational context)
- ease: 9 (one sentence addition near the intro pointing to stabilizers-explained; same pattern as dozens of recent bidirectional cross-link completions)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-09T00:00:00Z]
- addressed in: fa7d2619b86d4c67e50be97374c1534caaed4274

### [x] [content] [6.3] acoustic-spec-rise — sound-dampening-compared cross-link missing at dampening stack
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (trends pillar article "How 'thock' became an acoustic spec" — the central article for the site's acoustic theme; "The four-layer stack went standard" section describes the three-layer dampening stack in detail (silicone pad, foam tape, poron strip) without linking to sound-dampening-compared, the dedicated guide for builders who want to replicate it; acoustic-spec-rise had only 5 outgoing article cross-links before this fix; linking to the dampening guide completes the path for readers introduced to the stack concept)
- ease: 9 (single prose addition at the dampening stack description)
- score: 6.3 (impact × ease / 10)
- issue: #306
- addressed in: 25f0d68, closes #306

### [x] [content] [6.3] building-mode-sonnet — stabilizer-servicing-guide cross-link missing at stab spec
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (building-mode-sonnet-with-oil-kings popularityScore 34; Build Details callout describes stabilizer service in precise technical terms — "clipped, holee-modded, lubed with 205g0 on the wire ends and a thin coat of XHT-BDZ in the housings" — exactly what stabilizer-servicing-guide covers; stabilizer-servicing-guide is the site's most popular article at popularityScore 72; readers of the build report following the stabilizer work had no navigation path to the methodology guide)
- ease: 9 (single inline link on "clipped, holee-modded, lubed" in the Build Details callout)
- score: 6.3 (impact × ease / 10)
- issue: #307
- addressed in: ffbb6f8, closes #307

### [x] [content] [6.3] plate-materials-explained — tape-mod cross-link missing at order-of-operations recommendation
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (plate-materials-explained's "order of operations" paragraph directly recommends "tape mod or PE foam sheet" as one of the first mods a builder should apply, but provides no navigation path to the tape-mod article; tape-mod is the 3rd highest-traffic article on the site at popularityScore=67 and had only 1 incoming cross-link from the entire 48-article corpus; builders reading the build-sequence recommendation and deciding to try tape mod had no path to the dedicated guide)
- ease: 9 (single inline markdown link wrap — "tape mod" → [tape mod](/article/tape-mod) in the order-of-operations sentence)
- score: 6.3 (impact × ease / 10)
- issue: [mirror-failed: 2026-06-09T00:00:00Z]
- addressed in: e0fa916

### [x] [content] [6.3] clicky-switches-deep-dive — plate-materials-explained cross-link missing at plate prescription
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (clicky-switches-deep-dive's "Building clicky in 2026" section prescribes specific plate materials — POM and FR4 — as the correct acoustic choice for a clicky build, but provides no navigation path to plate-materials-explained, the dedicated deep-dive covering how FR4, POM, brass, and aluminium each change the acoustic profile; readers acting on the material prescription had no onward link to the comparison resource)
- ease: 9 (single closing sentence at end of "Building clicky in 2026" section, same pattern as gateron-oil-king-deep-dive → plate-materials-explained fix)
- score: 6.3 (impact × ease / 10)
- issue: #308
- addressed in: 0e0a9dc, closes #308

### [x] [content] [6.3] keycap-profiles-compared — beginners-switch-buying-guide cross-link missing at closing
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (keycap-profiles-compared popularityScore=42; closing paragraph explicitly positions "Switches set the gait of a keyboard" vs "Keycaps set the timbre" — establishing the complementary builder decision — but provided no navigation path to beginners-switch-buying-guide (popularityScore=51, 4th-highest on site); the closing already linked to keycap-materials-compared for the material axis but left the switch axis unlinked; a beginner finishing the keycap guide with their switch choice still open had no path to the companion entry-point)
- ease: 9 (single closing sentence appended after existing keycap-materials-compared link — same pattern as all prior cross-link fixes)
- score: 6.3 (impact × ease / 10)
- issue: #309
- addressed in: 4ab7f56, closes #309

### [x] [content] [6.3] topre-electrocapacitive-deep-dive — magnetic-switches-deep-dive cross-link missing at Hall-effect architecture description
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (topre article line 76 describes Hall-effect/magnetic sensing architecture "Hall-effect is magnetic — a Hall sensor on the PCB reads the field of a small magnet in the switch stem as the stem moves" — the exact architectural premise of magnetic-switches-deep-dive; magnetic article already links back to topre at lines 14+71; cross-link was unidirectional between two companion deep-dives covering adjacent sensing lineages)
- ease: 9 (single inline link wrap at named architectural description — same pattern as all prior cross-link fixes)
- score: 6.3 (impact × ease / 10)
- observation: topre-electrocapacitive-deep-dive "Where Topre fits in 2026" section links to hall-effect-mainstream (the market analysis) but not to magnetic-switches-deep-dive (the architecture deep-dive) when it describes the Hall-effect/magnetic sensing mechanism. The magnetic article opens with a link to the topre article and references it again at its taxonomy section. Reader of the topre piece learning about Hall-effect has no path to the companion architecture piece.
- evidence: apps/web/src/content/articles/topre-electrocapacitive-deep-dive.mdx:74 — hall-effect-mainstream link present; line 76 — "Hall-effect is magnetic — a Hall sensor on the PCB reads the field of a small magnet in the switch stem as the stem moves" — no link; grep for "magnetic-switches-deep-dive" in topre article returns 0 matches; magnetic-switches-deep-dive.mdx lines 14+71 already cross-link to topre.
- suggested fix: wrap the architectural description at line 76 with a link to /article/magnetic-switches-deep-dive
- issue: #311
- addressed in: df66cd5

### [x] [content] [6.3] mode-sonnet-r2-group-buy-coverage — building-mode-sonnet-with-oil-kings cross-link missing at "The Sonnet, briefly" section close
- category: content
- filed: 2026-06-09 by cloud /iterate audit
- impact: 7 (mode-sonnet-r2-group-buy-coverage popularityScore=22 in news pillar; zero article cross-links; building-mode-sonnet-with-oil-kings already links TO this article at line 72 — "R2 is announced for 2026-06-01 through 2026-07-15 at CannonKeys" — creating half of a bidirectional pair; "The Sonnet, briefly" section introduces the chassis to first-time buyers, the exact audience for the companion build guide covering the same board in a real build context; no navigation path from the announcement piece to the build piece)
- ease: 9 (single sentence appended at the close of the section — same pattern as all prior cross-link fixes)
- score: 6.3 (impact × ease / 10)
- observation: mode-sonnet-r2-group-buy-coverage's "The Sonnet, briefly" section introduces the Mode Sonnet chassis for buyers who passed on R1 or are new to the board — explaining gasket suspension, plate choices, and acoustic character — but provides no navigation path to building-mode-sonnet-with-oil-kings, the companion build guide covering this exact chassis in a real build context. The build guide already links back to this article at its conclusion, so the pair is editorially established but only half-navigable.
- evidence: apps/web/src/content/articles/mode-sonnet-r2-group-buy-coverage.mdx lines 56–60 — "The Sonnet, briefly" closes "That difference is the point." with no link to building-mode-sonnet-with-oil-kings; grep for "building-mode-sonnet" returns 0 matches in the file; building-mode-sonnet-with-oil-kings.mdx line 72 already cross-links to this article.
- suggested fix: append closing sentence → "For a first-hand account of how the default build performs in practice, see [building the Mode Sonnet with Gateron Oil Kings](/article/building-mode-sonnet-with-oil-kings)."
- issue: [mirror-failed: 2026-06-09T00:00:00Z]
- addressed in: 016709dbe657247c6254694710fca1451212b379

### [x] [HOT PURSUIT] [content-gap] [7] ideas pillar — 1 of ≥2 articles in last 30d
- category: content-gaps
- impact: 7 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ideas
- window-count: 1
- window-start: 2026-05-11
- score: 7
- next: /ship-content → ideas pillar article
> Filed 2026-06-10 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
- addressed in: 1f82d26

### [HOT PURSUIT] [content-gap] [7] deep-dives pillar — 1 of ≥2 articles in last 30d
- category: content-gaps
- impact: 6 (Rule 1 sliding window — hot-pursuit)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: deep-dives
- window-count: 1
- window-start: 2026-05-11
- score: 7
- next: /ship-content → deep-dives pillar article
> Filed 2026-06-10 by content-gap-survey.mjs (auto-refill). One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.
