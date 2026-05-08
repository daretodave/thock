// Keyboard Hub — Home page (desktop)

const SectionHeading = ({ kicker, title, more }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--kh-4)', marginBottom: 'var(--kh-4)' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      {kicker && <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.12+'em',
                                 textTransform: 'uppercase', color: 'var(--kh-accent)' }}>{kicker}</span>}
      <h2 style={{ fontFamily: 'var(--kh-serif)', fontSize: 28, fontWeight: 500, lineHeight: 1.1 }}>{title}</h2>
    </div>
    <div style={{ height: 1, background: 'var(--kh-border)', flex: 1 }} />
    {more && <a style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.08+'em',
                          textTransform: 'uppercase', color: 'var(--kh-accent)' }}>{more} →</a>}
  </div>
);

// Trending strip — horizontal rail of mini sparkline cards
const TrendingStrip = () => {
  const items = [
    { tag: 'switch',   label: 'Gateron Oil King',  delta: '+34%', dir: 'up',   spark: [3,4,4,5,6,5,7,8,9,11] },
    { tag: 'layout',   label: 'Alice (3-row)',     delta: '+18%', dir: 'up',   spark: [4,5,4,6,5,7,7,8,8,9] },
    { tag: 'material', label: 'Poured-resin caps', delta: '+62%', dir: 'up',   spark: [1,1,2,2,3,4,5,7,9,12] },
    { tag: 'profile',  label: 'MT3',               delta: '−9%',  dir: 'down', spark: [9,9,8,7,8,7,6,6,5,5] },
    { tag: 'brand',    label: 'Mode Designs',      delta: '+12%', dir: 'up',   spark: [4,5,5,6,5,6,7,6,7,8] },
    { tag: 'switch',   label: 'WS Heavy Tactile',  delta: 'flat', dir: 'flat', spark: [6,6,7,5,6,7,5,6,6,6] },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--kh-border)',
                  border: '1px solid var(--kh-border)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ background: 'var(--kh-bg)', padding: 'var(--kh-4)', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 110 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--kh-tag-${it.tag})` }} />
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.08+'em',
                           textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>{it.tag}</span>
          </div>
          <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 16, fontWeight: 500, lineHeight: 1.2, flex: 1 }}>{it.label}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 12,
                           color: it.dir === 'up' ? 'var(--kh-up)' : it.dir === 'down' ? 'var(--kh-down)' : 'var(--kh-flat)' }}>
              <TrendGlyph dir={it.dir} size={12}/> &nbsp;{it.delta}
            </span>
            <Sparkline values={it.spark} dir={it.dir} w={70} h={20}/>
          </div>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header active="Home"/>

    <section style={{ padding: '40px 40px 28px' }}>
      <ArticleCard variant="hero" pillar="Deep Dive"
        title={<>The factory that makes <em style={{ fontStyle: 'italic' }}>40%</em> of your switches</>}
        dek={<>Inside the Shenzhen consolidation that quietly reshaped the hobby's supply chain — and what happens when the music stops. We talked to <Tok>HMX</Tok>, <Tok>JWK</Tok>, and three vendors who don't want their names attached.</>}
        author="Anya Park" date="Mar 14, 2026" read="14 min"
        tags={[{label:'supply chain', cat:'brand'}, {label:'switches', cat:'switch'}, {label:'manufacturing', cat:'material'}]}
        imgTone="warm" imgLabel="HERO · 16:10 · 1600+ wide"/>
    </section>

    <section style={{ padding: '0 40px var(--kh-7)' }}>
      <SectionHeading kicker="Week 11 / 2026" title="Trending — what's moving on the tracker" more="Open Trends Tracker"/>
      <TrendingStrip/>
    </section>

    {/* Latest by pillar — 4-up grid */}
    <section style={{ padding: '0 40px var(--kh-7)' }}>
      <SectionHeading kicker="Latest" title="By pillar" more="All articles"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--kh-5)' }}>
        <ArticleCard pillar="News"
          title="GMK Olivia++ R3 dates announced — and they're tighter than R2"
          author="J. Aoki" date="2h" read="3 min"
          tags={[{label:'GMK', cat:'brand'}]}
          imgTone="cool" imgLabel="OLIVIA R3"/>
        <ArticleCard pillar="Trends"
          title="Why everyone is suddenly trying Alice layouts again"
          author="M. Lin" date="Yesterday" read="6 min"
          tags={[{label:'Alice', cat:'layout'}]}
          imgTone="warm" imgLabel="ALICE BUILD"/>
        <ArticleCard pillar="Ideas"
          title="A monochrome build that earns its silence"
          author="K. Rao" date="Mar 11" read="4 min"
          tags={[{label:'monochrome', cat:'material'}]}
          imgTone="dark" imgLabel="BUILD"/>
        <ArticleCard pillar="Guides"
          title="A grown-up's guide to lubing stabilisers"
          author="J. Aoki" date="Feb 28" read="9 min"
          tags={[{label:'stabs', cat:'material'}]}
          imgTone="green" imgLabel="STABS"/>
      </div>
    </section>

    {/* Two-up: deep dive + group buys widget */}
    <section style={{ padding: '0 40px var(--kh-7)', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--kh-7)' }}>
      <div>
        <SectionHeading kicker="Deep Dives" title="Long reads worth your weekend"/>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ArticleCard variant="row" pillar="Deep Dive"
            title="A history of the Topre dome, told through eight keyboards"
            dek="From the 1983 Realforce 10 to the 2025 Norbauer Heliodor."
            author="A. Park" date="Mar 09" read="22 min"
            tags={[{label:'Topre', cat:'switch'}, {label:'Norbauer', cat:'brand'}]}
            imgTone="warm" imgLabel="TOPRE DOME · MACRO"/>
          <ArticleCard variant="row" pillar="Deep Dive"
            title="The end of the open group-buy era"
            dek="Lead times dropped, in-stock wins, and the community's center of gravity moved with it."
            author="M. Lin" date="Mar 02" read="18 min"
            tags={[{label:'group buys', cat:'brand'}, {label:'industry', cat:'profile'}]}
            imgTone="cool" imgLabel="WAREHOUSE"/>
          <ArticleCard variant="row" pillar="Deep Dive"
            title="What firmware is for, now that VIA solved one problem"
            dek="QMK, ZMK, Vial, Kanata. Four answers to a question most users no longer ask."
            author="K. Rao" date="Feb 24" read="16 min"
            tags={[{label:'QMK', cat:'profile'}, {label:'ZMK', cat:'profile'}]}
            imgTone="dark" imgLabel="FIRMWARE / TERMINAL"/>
        </div>
      </div>

      <aside style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)', padding: 'var(--kh-5)',
                       display: 'flex', flexDirection: 'column', gap: 'var(--kh-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--kh-up)',
                          boxShadow: '0 0 0 3px color-mix(in oklch, var(--kh-up) 25%, transparent)' }}/>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                         textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>GROUP BUYS · ENDING SOON</span>
        </div>
        <h3 style={{ fontFamily: 'var(--kh-serif)', fontSize: 20, fontWeight: 500 }}>Don't miss the close</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            ['Mode Sixty / Eighty', 'Mode Designs', 2, 30],
            ['GMK Olivia++ R3',     'NovelKeys',   11, 45],
            ['Cycle7 keycaps',      'Cannon Keys', 18, 28],
            ['Class65 v3',          'KBDfans',     24, 30],
          ].map(([n, v, d, t], i) => (
            <div key={i} style={{ padding: '12px 0', borderTop: '1px solid var(--kh-border)',
                                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 11, color: 'var(--kh-text-3)' }}>via <span className="mono" style={{color:'var(--kh-accent)'}}>{v}</span></div>
              </div>
              <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: d <= 3 ? 'var(--kh-accent)' : 'var(--kh-text-2)' }}>
                {d}d
              </div>
              <div style={{ gridColumn: '1 / -1', height: 2, background: 'var(--kh-border)', position: 'relative', borderRadius: 1, marginTop: 4 }}>
                <div style={{ position: 'absolute', inset: 0, width: ((1 - d/t)*100)+'%',
                              background: d <= 3 ? 'var(--kh-accent)' : 'var(--kh-text-2)' }} />
              </div>
            </div>
          ))}
        </div>
        <a style={{ marginTop: 8, fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.08+'em',
                    textTransform: 'uppercase', color: 'var(--kh-accent)' }}>All active group buys →</a>
      </aside>
    </section>

    {/* Builds row */}
    <section style={{ padding: '0 40px var(--kh-7)' }}>
      <SectionHeading kicker="Ideas & Builds" title="Reader builds — Mar / week 2" more="Submit a build"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kh-5)' }}>
        {[
          { tone:'warm',  t:'A quiet office build, all PBT, all whisper', who:'@kuro_writes · Tokyo' },
          { tone:'cool',  t:'Mint Salvun + ePBT Cyan — ice cream board', who:'@danish_keys · Copenhagen' },
          { tone:'green', t:'CNC raw aluminum, on a tray-mount, on a desk made of doors', who:'@buildsbygabe · Lisbon' },
        ].map((b,i) => (
          <article key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-3)' }}>
            <Img tone={b.tone} label="BUILD PHOTO" style={{ aspectRatio: '4/3' }}/>
            <h4 style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>{b.t}</h4>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-accent)' }}>{b.who}</span>
          </article>
        ))}
      </div>
    </section>

    <section style={{ padding: '0 40px var(--kh-7)' }}>
      <Newsletter inline/>
    </section>

    <Footer/>
  </Frame>
);

window.HomePage = HomePage;
window.SectionHeading = SectionHeading;
window.TrendingStrip = TrendingStrip;
