// Keyboard Hub — Pillar landing (Trends) + Tag landing (linear) + Group Buys + Empty states

const PillarPage = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header active="Trends" breadcrumb={<><span style={{color:'var(--kh-accent)'}}>Trends</span> &nbsp;/&nbsp; <span>Index</span></>}/>

    <section style={{ padding: '48px 40px 28px', borderBottom: '1px solid var(--kh-border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--kh-5)' }}>
        <div>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.12+'em',
                          textTransform: 'uppercase', color: 'var(--kh-accent)' }}>PILLAR · 02 of 05</span>
          <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 64, fontWeight: 500, lineHeight: 1.02,
                        marginTop: 8, letterSpacing: -0.022+'em' }}>
            <em style={{ fontStyle: 'italic' }}>Trends</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--kh-text-2)', maxWidth: 60+'ch', marginTop: 12 }}>
            What's rising, what's softening, what's about to land. Analytical pieces, not hot takes.
          </p>
        </div>
        <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)', padding: 'var(--kh-4) var(--kh-5)' }}>
          <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                         textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>OPEN THE DASHBOARD</div>
          <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 22, fontWeight: 500, marginTop: 4 }}>Trends Tracker →</div>
          <div style={{ fontSize: 12, color: 'var(--kh-text-3)', marginTop: 4 }}>Updated weekly · 11 / 52</div>
        </div>
      </div>
    </section>

    <section style={{ padding: '32px 40px 0' }}>
      <ArticleCard variant="hero" pillar="Trends · Sound"
        title={<>Linear, but <em style={{fontStyle:'italic'}}>make it dramatic</em></>}
        dek="Three new linears that argue against the genre's cliché — and what they tell us about where switch design is moving in 2026."
        author="Mara Lin" date="Mar 12" read="6 min"
        tags={[{label:'linear', cat:'switch'},{label:'sound', cat:'material'}]}
        imgTone="warm" imgLabel="LEAD · 16:10"/>
    </section>

    <section style={{ padding: '40px 40px 0' }}>
      <SectionHeading kicker="On the rise" title="Stories that are climbing the tracker"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kh-5)' }}>
        <ArticleCard pillar="Trends" title="Why everyone is suddenly trying Alice layouts again" author="M. Lin" date="Mar 09" read="6 min" imgTone="cool" imgLabel="ALICE" tags={[{label:'Alice',cat:'layout'}]}/>
        <ArticleCard pillar="Trends" title="Poured-resin keycaps are everyone's craft project this year" author="K. Rao" date="Mar 06" read="5 min" imgTone="warm" imgLabel="RESIN" tags={[{label:'poured-resin',cat:'material'}]}/>
        <ArticleCard pillar="Trends" title="Tactile is back — and louder than it was" author="J. Aoki" date="Feb 22" read="7 min" imgTone="green" imgLabel="TACTILE" tags={[{label:'tactile',cat:'switch'}]}/>
      </div>
    </section>

    <section style={{ padding: '40px 40px 0' }}>
      <SectionHeading kicker="Archive" title="All Trends pieces"/>
      <div>
        {[
          ['The case against budget linears in 2026','A. Park','Mar 04','5 min','warm', [{label:'linear',cat:'switch'}]],
          ['What polycarbonate plates are really for','K. Rao','Feb 14','11 min','dark', [{label:'plate',cat:'material'}]],
          ['The slow death of the open group-buy','M. Lin','Feb 10','9 min','cool', [{label:'group buys',cat:'brand'}]],
          ['Why HHKB-likes are the most over-valued boards in the hobby','A. Park','Feb 03','8 min','green', [{label:'HHKB',cat:'layout'}]],
          ['Mode Designs ate the high-end. What now?','J. Aoki','Jan 27','10 min','warm', [{label:'Mode',cat:'brand'}]],
        ].map(([t,a,d,r,tone,tags],i)=>(
          <ArticleCard key={i} variant="row" pillar="Trends" title={t} author={a} date={d} read={r} imgTone={tone} imgLabel="ARCHIVE" tags={tags}/>
        ))}
      </div>
    </section>

    <section style={{ padding: '40px 40px var(--kh-7)' }}><Newsletter inline/></section>
    <Footer/>
  </Frame>
);

// ── Tag page ─────────────────────────────────────────────────────────
const TagPage = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header active={null} breadcrumb={<><span>Tag</span> &nbsp;/&nbsp; <span>Switch</span> &nbsp;/&nbsp; <span style={{color:'var(--kh-accent)'}}>linear</span></>}/>

    <section style={{ padding: '48px 40px 32px', borderBottom: '1px solid var(--kh-border)',
                       display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--kh-5)', alignItems: 'flex-end' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--kh-tag-switch)' }} />
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.1+'em',
                          textTransform: 'uppercase', color: 'var(--kh-tag-switch)' }}>TAG · SWITCH</span>
        </div>
        <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 72, fontWeight: 500, lineHeight: 1, marginTop: 8 }}>
          linear
        </h1>
        <p style={{ fontSize: 16, color: 'var(--kh-text-2)', maxWidth: 65+'ch', marginTop: 12, lineHeight: 1.55 }}>
          Smooth all the way down. We currently track <Tok>34 linear switches</Tok> across <Tok>9 vendors</Tok>; this page collects everything we've published touching them, plus the parts we recommend right now.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>ARTICLES</div>
        <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 56, fontWeight: 500, lineHeight: 1, color: 'var(--kh-text)' }}>142</div>
        <button style={{ marginTop: 8, background: 'var(--kh-surface)', border: '1px solid var(--kh-border)', color: 'var(--kh-text)',
                          fontFamily: 'inherit', fontSize: 13, padding: '6px 12px', cursor: 'pointer' }}>★ Follow tag</button>
      </div>
    </section>

    {/* Related tags rail */}
    <section style={{ padding: '20px 40px', borderBottom: '1px solid var(--kh-border)',
                       display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                      textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>NARROW BY</span>
      <TagChip category="switch" filled count={142} size="sm">linear</TagChip>
      <TagChip category="switch" count={86} size="sm">tactile</TagChip>
      <TagChip category="switch" count={29} size="sm">clicky</TagChip>
      <span style={{ width: 1, height: 20, background: 'var(--kh-border)' }}/>
      <TagChip category="brand" count={42} size="sm">Gateron</TagChip>
      <TagChip category="brand" count={31} size="sm">JWK</TagChip>
      <TagChip category="brand" count={24} size="sm">Cherry</TagChip>
      <TagChip category="brand" count={18} size="sm">Akko</TagChip>
      <span style={{ width: 1, height: 20, background: 'var(--kh-border)' }}/>
      <TagChip category="material" count={56} size="sm">POM stem</TagChip>
      <TagChip category="material" count={38} size="sm">UHMWPE</TagChip>
      <TagChip category="material" count={22} size="sm">long-pole</TagChip>
      <span style={{ flex: 1 }}/>
      <a style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.06+'em',
                   textTransform: 'uppercase', color: 'var(--kh-accent)' }}>All linear-switch tags →</a>
    </section>

    {/* Two-up: top picks rail + recent articles */}
    <section style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--kh-7)' }}>
      <div>
        <SectionHeading kicker="Recent" title="Articles tagged linear"/>
        <div>
          {[
            ['Linear, but make it dramatic','M. Lin','Mar 12','6 min','warm','Trends'],
            ['The case against budget linears in 2026','A. Park','Mar 04','5 min','cool','Trends'],
            ['Gateron Oil King — long-term review, six months in','J. Aoki','Feb 17','9 min','warm','Deep Dive'],
            ['I lubed JWK Alpaca v3 four ways. Only one survived','K. Rao','Feb 02','12 min','green','Guides'],
            ['What "smooth" actually means, mechanically','M. Lin','Jan 22','11 min','dark','Deep Dive'],
            ['HMX is making half your switches now','A. Park','Jan 09','14 min','warm','Trends'],
          ].map(([t,a,d,r,tone,p],i)=>(
            <ArticleCard key={i} variant="row" pillar={p} title={t} author={a} date={d} read={r} imgTone={tone} imgLabel="ARTICLE"
              tags={[{label:'linear',cat:'switch'}]}/>
          ))}
        </div>
      </div>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-5)' }}>
        <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)' }}>
          <div style={{ padding: 'var(--kh-3) var(--kh-4)' }}>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                            textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>TOP-RANKED LINEARS</span>
            <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-4)', marginTop: 2 }}>From the tracker · week 11</div>
          </div>
          <PartReference kind="#1 · Score 94" name="Gateron Oil King" vendor="MKBoards · KBDfans" price="$58" img="warm"/>
          <PartReference kind="#3 · Score 81" name="Cherry MX2A Black" vendor="Cherry · Drop" price="$36" img="dark"/>
          <PartReference kind="#5 · Score 71" name="WS Morandi" vendor="WuQue Studio" price="$52" img="cool"/>
        </div>
        <Callout kind="note" title="Definition">
          A switch with no pre-travel bump and no click. We don't enforce a specific actuation curve — silent linears live here too.
        </Callout>
      </aside>
    </section>

    <section style={{ padding: '40px 40px var(--kh-7)' }}><Newsletter inline/></section>
    <Footer/>
  </Frame>
);

// ── Group Buys index ─────────────────────────────────────────────────
const GroupBuysPage = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header active={null} breadcrumb={<><span style={{color:'var(--kh-accent)'}}>Group Buys</span> &nbsp;/&nbsp; <span>Active</span></>}/>

    <section style={{ padding: '48px 40px 28px', borderBottom: '1px solid var(--kh-border)',
                       display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--kh-7)', alignItems: 'flex-end' }}>
      <div>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.12+'em',
                        textTransform: 'uppercase', color: 'var(--kh-accent)' }}>CURATED · 24 ACTIVE</span>
        <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 56, fontWeight: 500, lineHeight: 1.02,
                      marginTop: 8, letterSpacing: -0.02+'em' }}>Group Buys</h1>
        <p style={{ fontSize: 16, color: 'var(--kh-text-2)', maxWidth: 60+'ch', marginTop: 12 }}>
          The buys our editors think are worth your money this month — not every active GB on the internet. Updated daily; we drop anything where the vendor stops responding to us.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Pill active>All</Pill>
        <Pill>Keyboards</Pill>
        <Pill>Keycaps</Pill>
        <Pill>Switches</Pill>
        <Pill>Accessories</Pill>
        <span style={{ width: 1, height: 26, background: 'var(--kh-border)', margin: '0 4px' }}/>
        <Pill>Region · WW</Pill>
        <Pill>≤ 7 days</Pill>
      </div>
    </section>

    <section style={{ padding: '32px 40px 0' }}>
      <SectionHeading kicker="Closing this week" title="Don't miss the close"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--kh-4)' }}>
        <GroupBuyCard name="Mode Sixty / Eighty"   vendor="Mode Designs"  region="US · EU"     ends="Mar 18" daysLeft={2}  total={30}/>
        <GroupBuyCard name="Salvun R2 keycaps"     vendor="Cannon Keys"   region="WW"          ends="Mar 19" daysLeft={3}  total={28}/>
        <GroupBuyCard name="Class65 v3"            vendor="KBDfans"       region="US · EU · OC" ends="Mar 24" daysLeft={8} total={30}/>
        <GroupBuyCard name="Olivia++ R3"           vendor="NovelKeys"     region="WW"          ends="Mar 28" daysLeft={11} total={45}/>
      </div>
    </section>

    <section style={{ padding: '32px 40px 0' }}>
      <SectionHeading kicker="Live" title="All active group buys"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--kh-4)' }}>
        <GroupBuyCard name="Cycle7 keycaps"        vendor="Cannon Keys"   region="WW"          ends="Apr 04" daysLeft={18} total={28}/>
        <GroupBuyCard name="Frog TKL R3"           vendor="Geekhack"      region="US · EU"     ends="Apr 08" daysLeft={22} total={30}/>
        <GroupBuyCard name="Heliodor desk-mat"     vendor="Norbauer"      region="WW"          ends="Apr 12" daysLeft={26} total={30}/>
        <GroupBuyCard name="WS Heavy Tactiles"     vendor="WuQue Studio"  region="WW"          ends="Apr 14" daysLeft={28} total={30}/>
      </div>
    </section>

    <section style={{ padding: '32px 40px 0' }}>
      <SectionHeading kicker="Closed · last 30 days" title="Recently shipped or shipping"/>
      <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)' }}>
        {[
          ['GMK Olivia++ R2', 'NovelKeys', 'Closed Feb 18', 'In production · est. Q3 2026', 'closed'],
          ['Mode Tofu80 GE',  'Mode',      'Closed Feb 09', 'Shipping now',                  'shipped'],
          ['Drop CTRL+ R2',   'Drop',      'Closed Jan 28', 'Shipping now',                  'shipped'],
          ['Lily58 Pro PE',   'Cannon',    'Closed Jan 14', 'Manufacturing · est. Q2',       'closed'],
        ].map(([n,v,c,s,k],i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 100px',
            gap: 16, padding: '14px 20px', borderTop: i ? '1px solid var(--kh-border)' : 'none',
            alignItems: 'center', fontSize: 13 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%',
                            background: k === 'shipped' ? 'var(--kh-up)' : 'var(--kh-flat)' }}/>
            <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 17, fontWeight: 500 }}>{n}</span>
            <span className="mono" style={{ color: 'var(--kh-accent)', fontSize: 12 }}>{v}</span>
            <span style={{ color: 'var(--kh-text-3)', fontFamily: 'var(--kh-mono)', fontSize: 11 }}>{c}</span>
            <span style={{ color: 'var(--kh-text-2)', fontSize: 12, textAlign: 'right' }}>{s}</span>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: '40px 40px 0' }}>
      <Callout kind="fyi" title="What we mean by 'curated'">
        We don't take vendor money. We don't list every GB. We list buys that pass three checks: vendor with a fulfilment track record, transparent timeline, and a product we'd want on our own desks. Everything else can be found on Geekhack.
      </Callout>
    </section>

    <section style={{ padding: '40px 40px var(--kh-7)' }}><Newsletter inline/></section>
    <Footer/>
  </Frame>
);

// ── Empty states + 404 + search-no-results + sparse trends ─────────
const EmptyState404 = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header/>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--kh-9)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-9)', alignItems: 'center', maxWidth: 900 }}>
        <div>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.12+'em',
                          textTransform: 'uppercase', color: 'var(--kh-accent)' }}>404 · NO ROUTE</span>
          <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 80, fontWeight: 500, lineHeight: 0.95,
                        marginTop: 12, letterSpacing: -0.025+'em' }}>
            That key isn't <em style={{ fontStyle: 'italic' }}>mapped</em>.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--kh-text-2)', marginTop: 16, lineHeight: 1.55, maxWidth: 50+'ch' }}>
            We can't find <Tok>/article/clack-vs-thock-supercut</Tok>. It might've been retitled, archived, or never existed. Try the homepage, or search for what you wanted.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button style={{ background: 'var(--kh-accent)', color: 'var(--kh-bg)', border: 'none',
                              fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '10px 18px', cursor: 'pointer' }}>
              ← Home
            </button>
            <button style={{ background: 'var(--kh-surface)', color: 'var(--kh-text)', border: '1px solid var(--kh-border-hi)',
                              fontFamily: 'inherit', fontSize: 14, padding: '10px 18px', cursor: 'pointer' }}>
              Try search ⌘K
            </button>
          </div>
        </div>
        <div style={{ position: 'relative', aspectRatio: '1/1' }}>
          <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--kh-border)',
                         display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(6, 1fr)' }}>
            {Array.from({length:36}).map((_,i)=>(
              <div key={i} style={{ borderRight: '1px solid var(--kh-border)', borderBottom: '1px solid var(--kh-border)',
                                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                                     fontFamily: 'var(--kh-mono)', fontSize: 10, color: i === 14 ? 'var(--kh-accent)' : 'var(--kh-text-4)' }}>
                {i === 14 ? '?' : ''}
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: -22, left: 0, fontFamily: 'var(--kh-mono)', fontSize: 10,
                         color: 'var(--kh-text-3)', letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>
            6 × 6 layout · key not bound
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </Frame>
);

const EmptyStateNoResults = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header breadcrumb={<><span style={{color:'var(--kh-accent)'}}>Search</span> &nbsp;/&nbsp; <span className="mono">"polycarbonate alps"</span></>}/>

    <section style={{ padding: '40px 40px 0' }}>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.1+'em',
                      textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>RESULTS FOR</span>
      <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 48, fontWeight: 500, lineHeight: 1.05, marginTop: 4 }}>
        "polycarbonate alps"
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 13, color: 'var(--kh-text-2)' }}>
          <span style={{ color: 'var(--kh-accent)' }}>0</span> articles · <span style={{ color: 'var(--kh-accent)' }}>0</span> tags · <span style={{ color: 'var(--kh-accent)' }}>0</span> parts
        </span>
      </div>
    </section>

    <section style={{ padding: '32px 40px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-7)' }}>
      <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)', padding: 'var(--kh-6)' }}>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-accent)' }}>NOTHING MATCHED</div>
        <h2 style={{ fontFamily: 'var(--kh-serif)', fontSize: 30, fontWeight: 500, marginTop: 8, lineHeight: 1.15 }}>
          We don't have a piece on that combination — yet.
        </h2>
        <p style={{ fontSize: 14, color: 'var(--kh-text-2)', marginTop: 12, lineHeight: 1.6 }}>
          Try one of these instead, or follow a tag and we'll email when something lands.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
          <TagChip category="material">polycarbonate</TagChip>
          <TagChip category="profile">Alps</TagChip>
          <TagChip category="switch">Matias</TagChip>
          <TagChip category="material">PC plate</TagChip>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-text-3)', marginBottom: 12 }}>YOU MIGHT MEAN</div>
        <ArticleCard variant="row" pillar="Deep Dive" title="What polycarbonate plates are really for"
          dek="A material people choose for the wrong reason and end up loving anyway."
          author="K. Rao" date="Feb 14" read="11 min" imgTone="cool" imgLabel="PC PLATE" tags={[{label:'plate',cat:'material'}]}/>
        <ArticleCard variant="row" pillar="Guides" title="The Alps switches still worth caring about"
          dek="Matias, AEK reissues, and the rare 1980s clones." author="A. Park" date="Jan 04" read="12 min" imgTone="dark" imgLabel="ALPS" tags={[{label:'Alps',cat:'switch'}]}/>
      </div>
    </section>

    <section style={{ padding: '40px 40px var(--kh-7)' }}>
      <Callout kind="note" title="Search index, plain English">
        We index titles, deks, body text, image alt, switch names, vendor names, and tag synonyms. Quotes search exactly. Switch names are case-insensitive. Hyphens are ignored.
      </Callout>
    </section>

    <Footer/>
  </Frame>
);

const EmptyStateSparseTrend = () => (
  <Frame style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-5)' }}>
    <div>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.1+'em',
                      textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>EMPTY STATE · TRENDS TRACKER ROW</span>
      <h2 style={{ fontFamily: 'var(--kh-serif)', fontSize: 28, fontWeight: 500, marginTop: 8 }}>Sparse data, on purpose</h2>
      <p style={{ fontSize: 14, color: 'var(--kh-text-2)', marginTop: 8, maxWidth: 60+'ch', lineHeight: 1.55 }}>
        New entries should look intentional, not broken. Dotted sparkline · greyed score column · explicit week-count · a kicker that names the state. Reader can tell at a glance: this isn't an error, the data just isn't here yet.
      </p>
    </div>

    <div style={{ border: '1px solid var(--kh-border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '52px 36px 1fr 110px 100px 70px 140px 1fr',
        padding: '12px 20px', borderBottom: '1px solid var(--kh-border)',
        fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
        textTransform: 'uppercase', color: 'var(--kh-text-3)', alignItems: 'center', gap: 16 }}>
        <span>Rank</span><span>Δ</span><span>Switch</span><span>Type</span>
        <span style={{ textAlign: 'right' }}>Score</span>
        <span style={{ textAlign: 'right' }}>WoW</span>
        <span>10-wk trend</span>
        <span>Editor's note</span>
      </div>
      {[
        { rank:'—', d:'NEW',     name:'Tecsee Sapphire v2',   weeks: 3, dotted:true,  values:[2,3,2] },
        { rank:'—', d:'NEW',     name:'KTT Strawberry Latte', weeks: 2, dotted:true,  values:[1,2] },
        { rank:'—', d:'PAUSED',  name:'Equalz Crystal SE',    weeks: 0, dotted:true,  values:[] },
      ].map((r,i)=>(
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 36px 1fr 110px 100px 70px 140px 1fr',
          padding: '14px 20px', alignItems: 'center', gap: 16,
          borderTop: i ? '1px solid var(--kh-border)' : 'none', opacity: 0.85 }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 18, fontWeight: 500, color: 'var(--kh-text-3)' }}>{r.rank}</span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-flat)',
                          background: 'color-mix(in oklch, var(--kh-flat) 18%, transparent)', padding: '2px 6px',
                          letterSpacing: 0.06+'em' }}>{r.d}</span>
          <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500, color: 'var(--kh-text-2)' }}>{r.name}</span>
          <span><TagChip category="switch" size="sm">linear</TagChip></span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 12, color: 'var(--kh-text-4)', textAlign: 'right' }}>insufficient</span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-4)', textAlign: 'right' }}>—</span>
          {r.values.length ? <Sparkline values={r.values} dir="flat" w={130} h={28} dotted/> :
            <div style={{ width:130, height:28, display:'flex', alignItems:'center', gap:4 }}>
              {Array.from({length:10}).map((_,j)=>(
                <span key={j} style={{ flex:1, height:1, background:'var(--kh-border)' }}/>
              ))}
            </div>}
          <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--kh-text-4)' }}>
            {r.weeks ? r.weeks + ' weeks of data · scored from week ' + (r.weeks+1) : 'No samples this issue · vendor unreachable'}
          </span>
        </div>
      ))}
    </div>
  </Frame>
);

window.PillarPage = PillarPage;
window.TagPage = TagPage;
window.GroupBuysPage = GroupBuysPage;
window.EmptyState404 = EmptyState404;
window.EmptyStateNoResults = EmptyStateNoResults;
window.EmptyStateSparseTrend = EmptyStateSparseTrend;
