// Keyboard Hub — Article page (desktop)

const ArticlePage = () => (
  <Frame style={{ display: 'flex', flexDirection: 'column' }}>
    <Header active="Trends" breadcrumb={
      <><span>Trends</span> &nbsp;/&nbsp; <span style={{color:'var(--kh-text-2)'}}>Switches</span> &nbsp;/&nbsp; <span style={{color:'var(--kh-accent)'}}>Linear, but make it dramatic</span></>
    }/>

    {/* Hero */}
    <section style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--kh-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kh-3)' }}>
        <Pillar name="Trends · Sound" />
        <span style={{ width: 14, height: 1, background: 'var(--kh-border-hi)' }} />
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)', letterSpacing: 0.08+'em' }}>2026 · WEEK 11</span>
      </div>
      <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 64, fontWeight: 500, lineHeight: 1.02,
                   letterSpacing: -0.022+'em', maxWidth: 22+'ch' }}>
        Linear, but <em style={{ fontStyle: 'italic' }}>make it dramatic</em>
      </h1>
      <p style={{ fontSize: 21, color: 'var(--kh-text-2)', lineHeight: 1.45, maxWidth: 60+'ch', margin: 0 }}>
        Three new linears that argue against the genre's cliché — and what they tell us about where switch design is moving in 2026.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kh-5)', paddingTop: 'var(--kh-3)',
                    borderTop: '1px solid var(--kh-border)', marginTop: 'var(--kh-2)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%',
                      background: 'oklch(0.42 0.08 60)', flex: '0 0 36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--kh-serif)', fontSize: 16, fontStyle: 'italic', color: 'var(--kh-bg)' }}>M</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, color: 'var(--kh-text)' }}>Mara Lin</span>
          <span style={{ fontSize: 12, color: 'var(--kh-text-3)' }}>Sound design column</span>
        </div>
        <div style={{ width: 1, height: 28, background: 'var(--kh-border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 12, color: 'var(--kh-text-3)' }}>
          <span>Mar 12, 2026</span>
          <span style={{ fontFamily: 'var(--kh-mono)' }}>6 min read</span>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={iconBtn} title="Listen"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5v4h2l3 2.5v-9L4 5H2zM10 4.5c1 .8 1 3.2 0 4M11.5 3c1.8 1.5 1.8 5 0 6.5"/></svg></button>
          <button style={iconBtn} title="Save"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1.5h8v11l-4-2.5-4 2.5z"/></svg></button>
          <button style={iconBtn} title="Share"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="3.5" cy="7" r="1.4"/><circle cx="10.5" cy="3" r="1.4"/><circle cx="10.5" cy="11" r="1.4"/><path d="M5 6.3l4.2-2.5M5 7.7l4.2 2.5"/></svg></button>
        </div>
      </div>
    </section>

    <section style={{ padding: '32px 40px 0' }}>
      <Img tone="warm" label="HERO PHOTO · KEYBOARD MACRO · 16:9 · ≥ 1600w"
           style={{ aspectRatio: '16/8', borderRadius: 2 }}/>
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--kh-text-3)' }}>
        <span>Three switches, identical board, identical sequence. Studio shot, Toronto.</span>
        <span style={{ fontFamily: 'var(--kh-mono)' }}>PHOTO · Yui Nakamura</span>
      </div>
    </section>

    {/* Body — two-column */}
    <section style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--kh-7)' }}>
      <article style={{ fontFamily: 'var(--kh-serif)', fontSize: 19, lineHeight: 1.65, color: 'var(--kh-text)', maxWidth: 65+'ch' }}>
        <p style={{ marginTop: 0 }}>
          <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 56, fontWeight: 500, lineHeight: 0.9, float: 'left',
                          marginRight: 12, marginTop: 6, color: 'var(--kh-accent)' }}>L</span>
          inears used to mean <Tok>Cherry MX Red</Tok>. Now they mean a hundred things — half of them sold by one Shenzhen factory under three brand names. The genre has fragmented, and what's interesting is no longer "linear vs tactile" but the texture inside a single linear press.
        </p>
        <p>
          The three switches we tested this week — <Tok>Gateron Oil King</Tok>, <Tok>WS Morandi</Tok>, and the
          reissued <Tok>Cherry MX2A Black</Tok> — sit in roughly the same actuation band. On paper they're cousins.
          On a board, they argue.
        </p>

        <PullQuote
          quote="A great switch isn't quiet — it's articulate. Every press should sound like a sentence ending."
          who="Mara Lin"/>

        <p style={{ marginTop: 24 }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.1+'em', textTransform: 'uppercase',
                          color: 'var(--kh-tag-switch)' }}>01 · OIL KING</span>
        </p>
        <p>
          <Tok>Gateron Oil King</Tok> is the loudest of the three, and the most opinionated. Bottom-out is heavy
          enough that the board can't help singing back. On a brass plate it reads as bass; on POM, it's a creamier
          mid. Either way you hear it across a room — which is either the whole point or a deal-breaker.
        </p>
        <p>
          We measured it on a <Tok>NK87 v3</Tok> running <Tok>QMK 0.24.x</Tok>, gasket-mounted, with PBT shine-through
          caps for control. The takeaway is consistency: across 1,000 presses the std-dev of bottom-out decibels was
          the lowest of the three.
        </p>

        <Callout kind="spec" title="What a 'sound profile' actually measures">
          We capture an SM57 12cm above the spacebar in a treated room, normalize to the loudest switch in the
          group, then compare power spectral density between 80–8kHz. It's not science. It's not nothing.
        </Callout>

        <p style={{ marginTop: 24 }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.1+'em', textTransform: 'uppercase',
                          color: 'var(--kh-tag-switch)' }}>02 · MORANDI</span>
        </p>
        <p>
          <Tok>WS Morandi</Tok>, by contrast, is the introvert. It's the only switch in this round that we'd call
          "warm" — a fuzzed-up bottom-out and a stem-rattle that's near-zero out of the box. It's also the one most
          likely to disappear into a build, which is either a feature or a bug depending on whether you wanted to
          hear the build at all.
        </p>

        <ImageCaption tone="cool" label="MORANDI · STEM MACRO" cap="Two-stage 22mm spring; POM stem; nylon top, milky bottom." credit="PHOTO · Yui Nakamura"/>
      </article>

      {/* Right rail */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-5)' }}>
        <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)' }}>
          <div style={{ padding: 'var(--kh-3) var(--kh-4)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                            textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>Mentioned in this article</span>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>3</span>
          </div>
          <PartReference kind="Switch · linear" name="Gateron Oil King" vendor="MKBoards · KBDfans" price="$58" img="warm"/>
          <PartReference kind="Switch · linear" name="WS Morandi"        vendor="WuQue Studio"         price="$52" img="cool"/>
          <PartReference kind="Switch · linear" name="Cherry MX2A Black" vendor="Cherry · Drop"        price="$36" img="dark"/>
        </div>

        <div style={{ background: 'var(--kh-bg)', border: '1px solid var(--kh-border)', padding: 'var(--kh-4)' }}>
          <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                          textTransform: 'uppercase', color: 'var(--kh-text-3)', marginBottom: 12 }}>SOUND TEST</div>
          <VideoEmbed source="VIDEO · M. Lin / Y. Nakamura"/>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                          textTransform: 'uppercase', color: 'var(--kh-text-3)', marginBottom: 12 }}>JUMP TO</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6,
                       fontSize: 13, color: 'var(--kh-text-2)' }}>
            <li style={{ borderLeft: '2px solid var(--kh-accent)', paddingLeft: 12 }}>01 · Oil King</li>
            <li style={{ borderLeft: '2px solid var(--kh-border)',  paddingLeft: 12, color: 'var(--kh-text-3)' }}>02 · Morandi</li>
            <li style={{ borderLeft: '2px solid var(--kh-border)',  paddingLeft: 12, color: 'var(--kh-text-3)' }}>03 · MX2A Black</li>
            <li style={{ borderLeft: '2px solid var(--kh-border)',  paddingLeft: 12, color: 'var(--kh-text-3)' }}>04 · Verdict</li>
          </ol>
        </div>
      </aside>
    </section>

    {/* Comparison table full-width */}
    <section style={{ padding: '40px 40px 0' }}>
      <ComparisonTable
        cols={['Oil King', 'Morandi', 'MX2A Black']}
        rows={[
          { label: 'Type',          values: ['Linear', 'Linear', 'Linear'] },
          { label: 'Actuation',     values: ['55g', '52g', '60g'] },
          { label: 'Bottom-out',    values: ['65g', '60g', '70g'] },
          { label: 'Sound',         values: [{label:'deep / wet', best:true}, 'muted / pillow', 'sharp / clack'] },
          { label: 'Std-dev (dB)',  values: [{label:'1.2', best:true}, '1.6', '2.4'] },
          { label: 'Price (90pc)',  values: ['$58', '$52', '$36'] },
        ]}
      />
    </section>

    {/* Tags + author + related */}
    <section style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-7)',
                       borderTop: '1px solid var(--kh-border)', marginTop: 'var(--kh-7)', paddingTop: 'var(--kh-7)' }}>
      <div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-text-3)', marginBottom: 12 }}>FILED UNDER</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <TagChip category="switch" filled>linear</TagChip>
          <TagChip category="switch">Gateron Oil King</TagChip>
          <TagChip category="switch">WS Morandi</TagChip>
          <TagChip category="switch">Cherry MX2A</TagChip>
          <TagChip category="material">sound</TagChip>
          <TagChip category="brand">Gateron</TagChip>
          <TagChip category="brand">WuQue</TagChip>
          <TagChip category="brand">Cherry</TagChip>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--kh-4)', alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'oklch(0.42 0.08 60)',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontFamily: 'var(--kh-serif)', fontSize: 28, fontStyle: 'italic', color: 'var(--kh-bg)' }}>M</div>
        <div>
          <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 22, fontWeight: 500 }}>Mara Lin</div>
          <p style={{ fontSize: 13, color: 'var(--kh-text-2)', marginTop: 4, lineHeight: 1.55, maxWidth: 50+'ch' }}>
            Writes the Sound column. Previously at WIRED and a small recording studio in Toronto. Plays an HHKB at home and a Type-S at work.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-accent)' }}>
            <span>@maralin</span>·<span>32 articles</span>·<span>Joined 2024</span>
          </div>
        </div>
      </div>
    </section>

    <section style={{ padding: '40px 40px var(--kh-7)' }}>
      <SectionHeading kicker="Related" title="More from Trends — switches"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kh-5)' }}>
        <ArticleCard pillar="Trends" title="The case against 'budget' linears in 2026"
          author="A. Park" date="Mar 04" read="5 min"
          imgTone="cool" imgLabel="BUDGET LINEARS"
          tags={[{label:'linear', cat:'switch'}]}/>
        <ArticleCard pillar="Trends" title="Tactile is back — and louder than it was"
          author="J. Aoki" date="Feb 22" read="7 min"
          imgTone="green" imgLabel="TACTILE"
          tags={[{label:'tactile', cat:'switch'}]}/>
        <ArticleCard pillar="Deep Dive" title="What polycarbonate plates are really for"
          author="K. Rao" date="Feb 14" read="11 min"
          imgTone="dark" imgLabel="PLATE MATERIALS"
          tags={[{label:'plate', cat:'material'}]}/>
      </div>
    </section>

    <section style={{ padding: '0 40px var(--kh-7)' }}><Newsletter inline/></section>
    <Footer/>
  </Frame>
);

const iconBtn = {
  width: 28, height: 28, border: '1px solid var(--kh-border)', borderRadius: 4,
  background: 'var(--kh-surface)', color: 'var(--kh-text-2)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

window.ArticlePage = ArticlePage;
