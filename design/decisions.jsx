// Keyboard Hub — Decisions & open questions

const Decisions = () => (
  <div style={{ padding: 'var(--kh-7) var(--kh-8)', maxWidth: 1100,
                 background: 'var(--kh-bg)', color: 'var(--kh-text)',
                 fontFamily: 'var(--kh-sans)' }}>
    <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.12+'em',
                    textTransform: 'uppercase', color: 'var(--kh-accent)' }}>SUMMARY · ROUND ONE</span>
    <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 56, fontWeight: 500, lineHeight: 1.02,
                  marginTop: 8, letterSpacing: -0.022+'em' }}>
      Decisions, and what we're <em style={{ fontStyle: 'italic' }}>still arguing about</em>
    </h1>
    <p style={{ fontSize: 17, color: 'var(--kh-text-2)', maxWidth: 70+'ch', marginTop: 14, lineHeight: 1.55 }}>
      A short read for the brief. The arguments are split into three lists: what we settled, what we'd push back on, and what we still need from you.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kh-6)', marginTop: 'var(--kh-7)' }}>
      {[
        { kicker: 'SETTLED', tone: 'var(--kh-up)', items: [
          ['Dark first, photography lifts.','Background is a warm-black <Tok>oklch(0.16 0.012 80)</Tok>; surfaces step ~+3% lightness. Light mode is a warm paper, intentionally undersaturated.'],
          ['Three families, not five.','<Tok>GT Sectra Display</Tok> for headlines (gravitas, italic ductus), <Tok>Inter</Tok> for body & UI (legibility at every weight, neutral) and <Tok>JetBrains Mono</Tok> for technical terms. Three is the ceiling.'],
          ['Mono accent for terms.','Switch names, firmware, part SKUs render in mono and pick up the accent color, e.g. <Tok>Gateron Oil King</Tok>, <Tok>QMK 0.24.x</Tok>.'],
          ['Tag color = category, not vibe.','Switch / layout / material / brand / profile each carry one fixed hue. The hues are restrained so they read as taxonomy, not decoration.'],
          ['Trends Tracker is a table, not a chart.','Editorial notes earn the row. Sparklines support, never lead. New entries are dotted, not blank.'],
          ['Group buys are time-aware, not doom-bar.','Closing dates show as days-left + a thin progress sliver. The accent color appears only in the last 72 hours.'],
        ]},
        { kicker: 'PUSHED BACK', tone: 'var(--kh-accent)', items: [
          ['"Crest/glyph" is optional, and we voted no.','We sketched a switch-cross-section glyph. It looked like every fintech logo. The wordmark with the accent dot on the H is enough to be recognizable in a tab bar.'],
          ['"Mentioned in this article" → renamed PartReference, kept in right rail.','It needed to do four jobs (recommendation, source, link, price). It earns its width.'],
          ['Switch-name density: typography, not chips.','We resisted chip-ifying every switch in body copy. <Tok>JetBrains Mono</Tok> + accent color is enough rhythm without making paragraphs look like dependency manifests. Chips are reserved for filters and tags.'],
          ['Tag explosion: faceted index + categorical color.','We don\'t flatten 400 tags into one wall. Tag pages narrow by category bar; the global tag index groups by category first. Followable as a unit.'],
          ['No comments thread design.','Out of scope, and we don\'t love them for an editorial product. Newsletter + per-author follow is the relationship loop.'],
        ]},
        { kicker: 'OPEN QUESTIONS', tone: 'var(--kh-flat)', items: [
          ['How weekly is the tracker, really?','We designed for Monday 09:00 EST. Confirm the editorial cadence before we lock the kicker copy.'],
          ['Score methodology — public or vague?','Right now we publish the 50/30/20 split. If sources demand anonymity we will need a vaguer copy block.'],
          ['Group-buy fulfilment status — who tells us?','Vendor-reported is fastest; reader-reported is honest. We sketched a "shipped/in production" pill but the source-of-truth is your call.'],
          ['Author roster?','We mocked four bylines (Mara, Anya, Jun, Karthik). If the real lineup is different the avatar/bio block needs a re-pass.'],
          ['Comments / replies layer.','Out of scope per the brief. If/when it returns, it will not live on the article page — most likely a per-tag forum surface.'],
          ['Native ad / sponsorship treatment.','Inevitable; we sketched zero. We need to know whether the answer is in-feed, in-rail, or sponsored deep-dives only.'],
        ]},
      ].map((col, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: col.tone }}/>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.12+'em',
                            textTransform: 'uppercase', color: col.tone }}>{col.kicker}</span>
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
            {col.items.map(([t, b], j) => (
              <li key={j} style={{ padding: '14px 0', borderTop: '1px solid var(--kh-border)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)' }}>{String(j+1).padStart(2,'0')}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 19, fontWeight: 500, lineHeight: 1.25 }}>{t}</div>
                    <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginTop: 6, lineHeight: 1.55 }}
                          dangerouslySetInnerHTML={{ __html: b.replace(/<Tok>(.+?)<\/Tok>/g,
                            '<span style="font-family: var(--kh-mono); color: var(--kh-accent); font-size: 12px;">$1</span>') }}/>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 'var(--kh-8)', padding: 'var(--kh-6)', border: '1px solid var(--kh-border)',
                   background: 'var(--kh-surface)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-6)' }}>
      <div>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>FIVE NON-OBVIOUS PROBLEMS · OUR ANSWERS</span>
        <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, lineHeight: 1.55, color: 'var(--kh-text-2)' }}>
          <li><b style={{color:'var(--kh-text)'}}>1. Switch-name density.</b> Mono + accent, never chipped in flow. Chips are filters; mono is content.</li>
          <li><b style={{color:'var(--kh-text)'}}>2. Group-buy urgency.</b> Day count + thin sliver. Accent color only triggers ≤ 72 hours.</li>
          <li><b style={{color:'var(--kh-text)'}}>3. Tag explosion.</b> Categorical color → category-first index → faceted narrow-by row on tag pages.</li>
          <li><b style={{color:'var(--kh-text)'}}>4. Tracker legibility.</b> Editorial notes lead, sparklines and rank-deltas support. Numbers are meta-data, not headline.</li>
          <li><b style={{color:'var(--kh-text)'}}>5. Empty-state honesty.</b> Dotted lines, "insufficient" not "—", explicit week-counts. Looks intentional, not broken.</li>
        </ol>
      </div>
      <div>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>WHAT WE'D BUILD NEXT</span>
        <ol style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, lineHeight: 1.55, color: 'var(--kh-text-2)' }}>
          <li>· Author landing pages (per-byline archive + follow).</li>
          <li>· Tag-explorer modal — every tag, faceted by category, type-ahead.</li>
          <li>· An audio-first article variant — sound tests are 30% of our content thesis.</li>
          <li>· Tracker compare-mode (pin two switches side-by-side).</li>
          <li>· Light-mode pass after we live with dark for a quarter.</li>
          <li>· Motion: only on tracker (sparkline draw-in) and tag-chip activation.</li>
        </ol>
      </div>
    </div>
  </div>
);

window.DecisionsPage = Decisions;
