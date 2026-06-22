# Data audit — 2026-06-10

## Findings (scored 0–10)

### [x] [7.5] Missing vendor: Wooting — addressed in 8083bda
- impact: 7 (referenced in 4 articles as the category-defining Hall-effect pioneer and configurator benchmark — hall-effect-mainstream, hall-effect-keyboard-guide, magnetic-switches-deep-dive, keychron-q-ultra-zmk; Wooting 60HE named by product in hall-effect-mainstream)
- ease: 8 (established brand, public specs, simple vendor record)
- next: `add vendor wooting` → shipped in this tick

### [x] [7.0] Missing board: Keychron Q1 HE — addressed in 30c8620
- impact: 7 (named by product in keychron-q-ultra-zmk article and hall-effect-mainstream; the Q1 HE 8K Marble is the headline SKU for the Q Ultra launch)
- ease: 7 (requires Keychron vendor stub first; specs well-documented)
- next: `add vendor keychron` then `add board keychron-q1-he` — follow-up ticks

### [x] [5.5] Missing vendor: Keychron — addressed in 30c8620
- impact: 6 (mentioned in 5+ articles as a major prebuilt vendor; prerequisite for Q1 HE board record)
- ease: 9 (simple vendor record with publicly available info)
- next: `add vendor keychron` — can pair with board record in same commit as cross-ref
