// Keyboard Hub — Component primitives showcase artboard

const ComponentSpec = ({ id, name, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 6,
                  borderBottom: '1px solid var(--kh-border)' }}>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                     letterSpacing: 0.1+'em' }}>{id}</span>
      <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500 }}>{name}</span>
    </div>
    {children}
  </div>
);

const PrimitivesArtboard = () => (
  <Frame style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-6)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>COMPONENT PRIMITIVES</div>

    <ComponentSpec id="C-01" name="ArticleCard — variants">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-5)' }}>
        <div>
          <Pillar name="Hero" /><div style={{height:8}}/>
          <ArticleCard variant="hero" pillar="Deep Dive"
            title={<>The factory that makes 40% of your switches</>}
            dek="Inside the Shenzhen consolidation that quietly reshaped the hobby's supply chain — and what happens when the music stops."
            author="Anya Park" date="Mar 14, 2026" read="14 min"
            tags={[{label:'supply chain', cat:'brand'},{label:'switches', cat:'switch'}]}
            imgTone="warm" imgLabel="HERO IMAGE"/>
        </div>
        <div>
          <Pillar name="Large" /><div style={{height:8}}/>
          <ArticleCard
            title="Linear, but make it dramatic"
            dek="Three new linears that argue against the genre's cliché."
            author="Mara Lin" date="Mar 12" read="6 min"
            tags={[{label:'linear', cat:'switch'}, {label:'sound', cat:'material'}]}
            imgTone="cool" imgLabel="ARTICLE LEAD"/>
          <div style={{height:'var(--kh-5)'}}/>
          <Pillar name="Compact (rail)" /><div style={{height:8}}/>
          <ArticleCard variant="compact" pillar="News"
            title="GMK Olivia++ R3 dates announced"
            date="2h ago"/>
          <ArticleCard variant="compact" pillar="Trends"
            title="Why everyone is suddenly trying Alice layouts again"
            date="Yesterday"/>
        </div>
      </div>
      <div style={{height:'var(--kh-3)'}}/>
      <Pillar name="Row (list-dense)" /><div style={{height:8}}/>
      <ArticleCard variant="row" pillar="Guides"
        title="A grown-up's guide to lubing stabs"
        dek="Skip the 70 forum threads. We tested four lubes against four stab styles and only one combination actually shut up."
        author="Jules Aoki" date="Feb 28, 2026" read="9 min"
        tags={[{label:'stabs', cat:'material'}, {label:'guide', cat:'profile'}]}
        imgTone="green" imgLabel="STABS"/>
    </ComponentSpec>

    <ComponentSpec id="C-02" name="TagChip — category tinted, taxonomy not decoration">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <TagChip category="switch">linear</TagChip>
        <TagChip category="switch">tactile</TagChip>
        <TagChip category="switch" filled>Gateron Oil King</TagChip>
        <TagChip category="layout">TKL</TagChip>
        <TagChip category="layout">60%</TagChip>
        <TagChip category="layout">Alice</TagChip>
        <TagChip category="brand">GMK</TagChip>
        <TagChip category="brand">Drop</TagChip>
        <TagChip category="material">PBT</TagChip>
        <TagChip category="material">poured-resin</TagChip>
        <TagChip category="profile">Cherry</TagChip>
        <TagChip category="profile">SA</TagChip>
        <TagChip category="profile">MT3</TagChip>
        <TagChip category="switch" count={142} size="sm">linear</TagChip>
        <TagChip category="brand" count={28} size="sm">Norbauer</TagChip>
      </div>
      <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)' }}>
        Color-coded dot · neutral chip body · count slot for tag-cloud use. Filled variant for the canonical tag of an article.
      </div>
    </ComponentSpec>

    <ComponentSpec id="C-03" name="Sparkline + TrendDirectionGlyph — used in Trends Tracker rows">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--kh-5)' }}>
        {[
          { dir: 'up',   values: [3,4,3,5,6,5,7,8,7,9], label: 'rising' },
          { dir: 'down', values: [9,8,7,8,6,5,5,4,3,3], label: 'falling' },
          { dir: 'flat', values: [6,6,7,5,6,7,5,6,6,6], label: 'flat' },
          { dir: 'up',   values: [1,2,1,2,3,2,5,8,12,16], label: 'breakout' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8,
                                background: 'var(--kh-surface)', padding: 'var(--kh-3)', border: '1px solid var(--kh-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendGlyph dir={s.dir}/>
              <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                             letterSpacing: 0.06+'em', textTransform: 'uppercase' }}>{s.label}</span>
            </div>
            <Sparkline values={s.values} dir={s.dir} w={180} h={36}/>
          </div>
        ))}
      </div>
    </ComponentSpec>

    <ComponentSpec id="C-04" name="PartReference — &quot;mentioned in this article&quot; rail">
      <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)' }}>
        <div style={{ padding: 'var(--kh-3) var(--kh-4)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                         textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>Mentioned in this article</span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>3 parts</span>
        </div>
        <PartReference kind="Switch · linear" name="Gateron Oil King" vendor="MKBoards · KBDfans" price="$58 / 90pc" img="warm"/>
        <PartReference kind="Keycaps · Cherry" name="GMK Olivia++ R3" vendor="NovelKeys · Drop" price="$135 / base" img="cool"/>
        <PartReference kind="Board · 75%" name="NK87 v3" vendor="NovelKeys" price="$295" img="green"/>
      </div>
    </ComponentSpec>

    <ComponentSpec id="C-05" name="GroupBuyCard — urgency without doom">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kh-4)' }}>
        <GroupBuyCard name="GMK Olivia++ R3" vendor="NovelKeys" region="US · EU · OC" ends="Mar 28" daysLeft={11} total={45}/>
        <GroupBuyCard name="Mode Sixty / Eighty" vendor="Mode Designs" region="US · EU" ends="Mar 18" daysLeft={2} total={30}/>
        <GroupBuyCard name="Cycle7 keycaps" vendor="Cannon Keys" region="Worldwide" ends="Apr 04" daysLeft={18} total={28}/>
      </div>
      <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)' }}>
        Live-dot pulses while open. Progress bar fills as the window closes. The bar — not a banner — turns brass when ≤ 3 days remain.
      </div>
    </ComponentSpec>

    <ComponentSpec id="C-06" name="Header · breadcrumb · pillar nav">
      <div style={{ border: '1px solid var(--kh-border)', borderRadius: 2, overflow: 'hidden' }}>
        <Header active="Trends" breadcrumb={<><span style={{color:'var(--kh-accent)'}}>Trends</span> &nbsp;/&nbsp; <span>Switches</span> &nbsp;/&nbsp; <span style={{color:'var(--kh-text-2)'}}>Linear</span></>} dense/>
      </div>
    </ComponentSpec>

    <ComponentSpec id="C-07" name="Newsletter CTA — inline embed">
      <Newsletter inline/>
    </ComponentSpec>

    <ComponentSpec id="C-08" name="Footer">
      <div style={{ border: '1px solid var(--kh-border)', borderRadius: 2 }}>
        <Footer/>
      </div>
    </ComponentSpec>
  </Frame>
);

window.PrimitivesArtboard = PrimitivesArtboard;
