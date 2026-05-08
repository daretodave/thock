// Keyboard Hub — Trends Tracker dashboard (signature)
// Pitchfork "best new" rail × Bloomberg terminal — restrained.

const TT_ROWS = {
  switches: [
    { rank: 1, lastWk: 1, name: 'Gateron Oil King', cat: 'linear', score: 94, delta: '+12', dir: 'up',   spark:[3,4,4,5,6,5,7,8,9,11], note: 'Restocked at MKBoards EU.' },
    { rank: 2, lastWk: 4, name: 'WS Heavy Tactiles', cat: 'tactile', score: 88, delta: '+24', dir: 'up',   spark:[2,2,3,3,4,5,5,7,9,11], note: '↑ thread chatter; new sound test from Mara.' },
    { rank: 3, lastWk: 2, name: 'Cherry MX2A Black', cat: 'linear', score: 81, delta: '−4',  dir: 'down', spark:[8,9,8,7,8,7,6,7,6,5], note: 'In-stock everywhere; novelty cooling.' },
    { rank: 4, lastWk: 3, name: 'Akko V3 Cream Yellow Pro', cat: 'linear', score: 77, delta: '−2', dir: 'down', spark:[7,8,7,7,6,7,6,6,5,6], note: '' },
    { rank: 5, lastWk: 8, name: 'WS Morandi', cat: 'linear', score: 71, delta: '+38', dir: 'up',   spark:[1,1,2,3,3,4,5,6,8,10], note: 'Breakout — see Mar 12 column.' },
    { rank: 6, lastWk: 5, name: 'Boba U4T X', cat: 'tactile', score: 68, delta: '−1',  dir: 'flat', spark:[6,5,6,7,5,6,6,6,5,5], note: '' },
    { rank: 7, lastWk: 7, name: 'Kailh Box Jade v2', cat: 'clicky', score: 60, delta: 'flat', dir: 'flat', spark:[5,6,5,6,5,5,6,5,6,5], note: '' },
    { rank: 8, lastWk: 6, name: 'HMX Macchiato', cat: 'linear', score: 56, delta: '−9', dir: 'down', spark:[7,8,8,7,6,5,5,4,4,4], note: '' },
  ],
};

const Bar = ({ value, max = 100, color = 'var(--kh-accent)' }) => (
  <div style={{ width: 96, height: 4, background: 'var(--kh-border)', borderRadius: 2, position: 'relative' }}>
    <div style={{ position: 'absolute', inset: 0, width: (value/max*100)+'%', background: color, borderRadius: 2 }}/>
  </div>
);

const TabBar = ({ items, active }) => (
  <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--kh-border)' }}>
    {items.map(t => (
      <button key={t} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--kh-sans)', fontSize: 13, padding: '12px 18px',
        color: t === active ? 'var(--kh-text)' : 'var(--kh-text-3)',
        borderBottom: t === active ? '2px solid var(--kh-accent)' : '2px solid transparent',
        marginBottom: -1, fontWeight: t === active ? 500 : 400,
      }}>{t}</button>
    ))}
  </div>
);

const TrendsTracker = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header active="Trends" breadcrumb={
      <><span>Trends</span> &nbsp;/&nbsp; <span style={{color:'var(--kh-accent)'}}>Tracker</span></>
    }/>

    {/* Header strip */}
    <section style={{ padding: '40px 40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--kh-5)' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.12+'em',
                          textTransform: 'uppercase', color: 'var(--kh-accent)' }}>SIGNATURE · TRENDS TRACKER</span>
          <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 48, fontWeight: 500, lineHeight: 1.05,
                        marginTop: 8, letterSpacing: -0.02+'em' }}>
            What's <em style={{ fontStyle: 'italic' }}>actually</em> rising this week
          </h1>
          <p style={{ fontSize: 16, color: 'var(--kh-text-2)', maxWidth: 70+'ch', marginTop: 12 }}>
            A weighted weekly score across community chatter, retail availability, and editorial mentions. Each row links to a deep dive. Updated <span className="mono" style={{color:'var(--kh-accent)'}}>Mar 14, 2026 · 09:00 EST</span>.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                          letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>2026 · WEEK</span>
          <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 56, fontWeight: 500, lineHeight: 1, color: 'var(--kh-text)' }}>11</span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)' }}>of 52 · ISSUE No.74</span>
        </div>
      </div>
    </section>

    {/* Hero board summary */}
    <section style={{ padding: '0 40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--kh-border)',
                    border: '1px solid var(--kh-border)' }}>
        {[
          { kicker: 'BIGGEST RISER',  name: 'WS Morandi',         delta: '+38', dir: 'up',   note: 'New entrant, top-10 by Friday', spark:[1,1,2,3,3,4,5,6,8,10] },
          { kicker: 'BIGGEST FALLER', name: 'HMX Macchiato',      delta: '−9',  dir: 'down', note: 'Saturated; restock hangover',  spark:[7,8,8,7,6,5,5,4,4,4] },
          { kicker: 'BREAKOUT',       name: 'Poured-resin caps',  delta: '+62', dir: 'up',   note: '5 new vendors since Jan',       spark:[1,1,2,2,3,4,5,7,9,12] },
          { kicker: 'SLEEPER',        name: 'Cycle7 keycaps',     delta: '+8',  dir: 'flat', note: 'Quietly closes Apr 04',          spark:[5,6,5,6,6,6,7,7,7,7] },
        ].map((c, i) => (
          <div key={i} style={{ background: 'var(--kh-bg-2)', padding: 'var(--kh-5)' }}>
            <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                            textTransform: 'uppercase', color: 'var(--kh-accent)' }}>{c.kicker}</div>
            <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 22, fontWeight: 500, marginTop: 6, lineHeight: 1.15 }}>{c.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <TrendGlyph dir={c.dir} size={14}/>
              <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 16, fontWeight: 500,
                              color: c.dir === 'up' ? 'var(--kh-up)' : c.dir === 'down' ? 'var(--kh-down)' : 'var(--kh-flat)' }}>{c.delta}%</span>
              <Sparkline values={c.spark} dir={c.dir} w={70} h={22}/>
            </div>
            <div style={{ fontSize: 12, color: 'var(--kh-text-3)', marginTop: 12, lineHeight: 1.5 }}>{c.note}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Tabs */}
    <section style={{ padding: '0 40px' }}>
      <TabBar items={['Switches', 'Keycaps', 'Layouts', 'Boards', 'Vendors', 'Profiles']} active="Switches"/>
    </section>

    {/* Filter row */}
    <section style={{ padding: '14px 40px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
                       borderBottom: '1px solid var(--kh-border)' }}>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.08+'em',
                      textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>FILTER</span>
      <Pill active>All types</Pill>
      <Pill>Linear</Pill>
      <Pill>Tactile</Pill>
      <Pill>Clicky</Pill>
      <Pill>Silent</Pill>
      <span style={{ width: 1, height: 20, background: 'var(--kh-border)', margin: '0 4px' }}/>
      <Pill>In stock only</Pill>
      <Pill>≥ 8 weeks of data</Pill>
      <span style={{ flex: 1 }}/>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>RANGE · LAST 10 WEEKS</span>
      <button style={{ background: 'transparent', border: '1px solid var(--kh-border)', color: 'var(--kh-text-2)',
                       fontFamily: 'var(--kh-mono)', fontSize: 11, padding: '4px 10px', borderRadius: 2, cursor: 'pointer' }}>
        Quarter ▾
      </button>
    </section>

    {/* The table */}
    <section style={{ padding: '0' }}>
      <div style={{ display: 'grid',
        gridTemplateColumns: '52px 36px 1fr 110px 90px 70px 140px 1fr 28px',
        padding: '12px 40px', borderBottom: '1px solid var(--kh-border)',
        fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
        textTransform: 'uppercase', color: 'var(--kh-text-3)', alignItems: 'center', gap: 16 }}>
        <span>Rank</span><span>Δ</span><span>Switch</span><span>Type</span>
        <span style={{ textAlign: 'right' }}>Score</span>
        <span style={{ textAlign: 'right' }}>WoW</span>
        <span>10-wk trend</span>
        <span>Editor's note</span>
        <span/>
      </div>

      {TT_ROWS.switches.map((r, i) => {
        const moved = r.lastWk - r.rank;
        return (
          <div key={r.rank} style={{
            display: 'grid',
            gridTemplateColumns: '52px 36px 1fr 110px 90px 70px 140px 1fr 28px',
            padding: '14px 40px', alignItems: 'center', gap: 16,
            borderBottom: '1px solid var(--kh-border)',
            background: i === 0 ? 'color-mix(in oklch, var(--kh-accent) 6%, transparent)' : 'transparent',
          }}>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 18, fontWeight: 500, color: 'var(--kh-text)' }}>
              {String(r.rank).padStart(2,'0')}
            </span>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11,
                            color: moved > 0 ? 'var(--kh-up)' : moved < 0 ? 'var(--kh-down)' : 'var(--kh-flat)' }}>
              {moved > 0 ? '↑'+moved : moved < 0 ? '↓'+Math.abs(moved) : '—'}
            </span>
            <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500, color: 'var(--kh-text)' }}>
              {r.name}
            </span>
            <span><TagChip category="switch" size="sm">{r.cat}</TagChip></span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 14, color: 'var(--kh-text)' }}>{r.score}</span>
              <Bar value={r.score}/>
            </div>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 13, textAlign: 'right',
                            color: r.dir === 'up' ? 'var(--kh-up)' : r.dir === 'down' ? 'var(--kh-down)' : 'var(--kh-flat)' }}>
              <TrendGlyph dir={r.dir} size={11}/> {r.delta}
            </span>
            <Sparkline values={r.spark} dir={r.dir} w={130} h={28}/>
            <span style={{ fontSize: 12, color: 'var(--kh-text-3)', fontStyle: r.note ? 'normal' : 'italic' }}>
              {r.note || <span style={{ color: 'var(--kh-text-4)' }}>—</span>}
            </span>
            <span style={{ color: 'var(--kh-text-3)', textAlign: 'right' }}>→</span>
          </div>
        );
      })}

      {/* Sparse-data row to show empty/early state */}
      <div style={{ display: 'grid',
        gridTemplateColumns: '52px 36px 1fr 110px 90px 70px 140px 1fr 28px',
        padding: '14px 40px', alignItems: 'center', gap: 16,
        borderBottom: '1px solid var(--kh-border)', opacity: 0.7 }}>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 18, fontWeight: 500, color: 'var(--kh-text-3)' }}>09</span>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-flat)' }}>NEW</span>
        <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500, color: 'var(--kh-text-2)' }}>Tecsee Sapphire v2</span>
        <span><TagChip category="switch" size="sm">linear</TagChip></span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 12, color: 'var(--kh-text-4)' }}>insufficient</span>
          <Bar value={0}/>
        </div>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-4)', textAlign: 'right' }}>—</span>
        <Sparkline values={[2,3,2]} dir="flat" w={130} h={28} dotted/>
        <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--kh-text-4)' }}>3 weeks of data · scored from week 5.</span>
        <span style={{ color: 'var(--kh-text-4)', textAlign: 'right' }}>→</span>
      </div>
    </section>

    {/* Methodology */}
    <section style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-7)' }}>
      <Callout kind="fyi" title="How we score">
        50% community signal (Reddit, Geekhack, Discord) · 30% retail availability across the 12 vendors we track · 20% editorial mentions. Scores are normalized weekly and only ranked once a switch has ≥ 4 weeks of data.
      </Callout>
      <Callout kind="note" title="A note on early data">
        New entries appear unranked, with a dotted sparkline, until they hit ≥ 4 weeks. We'd rather under-rank a real breakout than rank-spam a single vendor stunt.
      </Callout>
    </section>

    <section style={{ padding: '40px 40px var(--kh-7)' }}>
      <SectionHeading kicker="From the editors" title="Pieces that explain this week's tracker"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kh-5)' }}>
        <ArticleCard pillar="Trends" title="Linear, but make it dramatic" author="M. Lin" date="Mar 12" read="6 min" imgTone="warm" imgLabel="OIL KING"/>
        <ArticleCard pillar="Trends" title="Tactile is back — and louder than it was" author="J. Aoki" date="Feb 22" read="7 min" imgTone="cool" imgLabel="TACTILES"/>
        <ArticleCard pillar="Trends" title="Why poured-resin keycaps are everyone's craft project this year" author="K. Rao" date="Feb 18" read="5 min" imgTone="green" imgLabel="RESIN CAPS"/>
      </div>
    </section>

    <Footer/>
  </Frame>
);

const Pill = ({ children, active }) => (
  <button style={{
    background: active ? 'var(--kh-text)' : 'transparent',
    color: active ? 'var(--kh-bg)' : 'var(--kh-text-2)',
    border: '1px solid ' + (active ? 'var(--kh-text)' : 'var(--kh-border)'),
    fontFamily: 'inherit', fontSize: 12, padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
  }}>{children}</button>
);

window.TrendsTracker = TrendsTracker;
window.TT_ROWS = TT_ROWS;
window.Pill = Pill;
window.Bar = Bar;
window.TabBar = TabBar;
