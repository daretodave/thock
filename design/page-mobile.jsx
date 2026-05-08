// Keyboard Hub — Mobile screens (390 × 844 viewport)

const Phone = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
    <div style={{ width: 390, height: 844, background: 'var(--kh-bg)', color: 'var(--kh-text)',
                   border: '8px solid #18171a', borderRadius: 36, overflow: 'hidden',
                   fontFamily: 'var(--kh-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* status bar */}
      <div style={{ height: 28, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                     fontFamily: 'var(--kh-mono)', fontSize: 11 }}>
        <span>9:41</span>
        <span style={{ width: 60, height: 16, background: '#18171a', borderRadius: 10 }}/>
        <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span>·il</span><span>100</span>
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.08+'em',
                   textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>{label}</div>
  </div>
);

const MobNav = ({ title }) => (
  <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 borderBottom: '1px solid var(--kh-border)' }}>
    <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.01+'em' }}>
      Keyboard <span style={{ color: 'var(--kh-accent)' }}>Hub</span>
    </span>
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: 'var(--kh-text-2)' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4.5"/><path d="m9.5 9.5 3 3"/></svg>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h10M2 7h10M2 10h10"/></svg>
    </div>
  </div>
);

const MobPillarRow = () => (
  <div style={{ display: 'flex', gap: 6, padding: '10px 18px', overflowX: 'auto', borderBottom: '1px solid var(--kh-border)' }}>
    {['Home','News','Trends','Ideas','Deep','Guides'].map((p,i)=>(
      <span key={p} style={{
        fontFamily: 'var(--kh-mono)', fontSize: 11, letterSpacing: 0.06+'em', textTransform: 'uppercase',
        padding: '5px 10px', borderRadius: 999, whiteSpace: 'nowrap',
        background: i===2 ? 'var(--kh-text)' : 'transparent',
        color: i===2 ? 'var(--kh-bg)' : 'var(--kh-text-2)',
        border: '1px solid ' + (i===2 ? 'var(--kh-text)' : 'var(--kh-border)'),
      }}>{p}</span>
    ))}
  </div>
);

const MobHome = () => (
  <Phone label="01 · Home">
    <MobNav/>
    <MobPillarRow/>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px 4px' }}>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-accent)' }}>DEEP DIVE · 14 MIN</span>
      </div>
      <Img tone="warm" label="HERO 4:3" style={{ height: 260, margin: '8px 18px 0', borderRadius: 2 }}/>
      <div style={{ padding: '12px 18px 0' }}>
        <h2 style={{ fontFamily: 'var(--kh-serif)', fontSize: 26, fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.015+'em' }}>
          The factory that makes <em style={{fontStyle:'italic'}}>40%</em> of your switches
        </h2>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, fontSize: 11, color: 'var(--kh-text-3)', fontFamily: 'var(--kh-mono)' }}>
          <span>A. PARK</span>·<span>MAR 14</span>·<span>14 MIN</span>
        </div>
      </div>
      <div style={{ marginTop: 18, padding: '14px 18px 8px', borderTop: '1px solid var(--kh-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                          textTransform: 'uppercase', color: 'var(--kh-accent)' }}>WK 11 · TRENDING</span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>OPEN TRACKER →</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 18px', overflowX: 'auto' }}>
        {[
          {n:'Gateron Oil King', d:'+34', dr:'up',   t:'switch'},
          {n:'Alice 3-row',      d:'+18', dr:'up',   t:'layout'},
          {n:'Resin caps',       d:'+62', dr:'up',   t:'material'},
          {n:'MT3',              d:'−9',  dr:'down', t:'profile'},
        ].map((c,i)=>(
          <div key={i} style={{ minWidth: 150, padding: 10, border: '1px solid var(--kh-border)',
                                 background: 'var(--kh-surface)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 9, letterSpacing: 0.1+'em',
                            textTransform: 'uppercase', color: `var(--kh-tag-${c.t})` }}>{c.t}</span>
            <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 14, fontWeight: 500 }}>{c.n}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11,
                              color: c.dr==='up'?'var(--kh-up)':c.dr==='down'?'var(--kh-down)':'var(--kh-flat)' }}>{c.d}%</span>
              <Sparkline values={[3,4,4,5,6,5,7,8,9,11]} dir={c.dr} w={60} h={16}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Phone>
);

const MobArticle = () => (
  <Phone label="02 · Article">
    <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   borderBottom: '1px solid var(--kh-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--kh-text-3)' }}>← Trends</span>
      <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 14, fontWeight: 500, fontStyle: 'italic' }}>Keyboard <span style={{color:'var(--kh-accent)'}}>Hub</span></span>
      <span style={{ fontSize: 12, color: 'var(--kh-text-3)' }}>★</span>
    </div>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px 8px' }}>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-accent)' }}>TRENDS · SOUND</span>
        <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 30, fontWeight: 500, lineHeight: 1.05, marginTop: 8, letterSpacing: -0.015+'em' }}>
          Linear, but <em style={{fontStyle:'italic'}}>make it dramatic</em>
        </h1>
        <div style={{ display: 'flex', gap: 6, marginTop: 12, fontSize: 11, color: 'var(--kh-text-3)', fontFamily: 'var(--kh-mono)' }}>
          <span>M. LIN</span>·<span>MAR 12</span>·<span>6 MIN</span>
        </div>
      </div>
      <Img tone="warm" label="HERO 16:10" style={{ height: 220, margin: '8px 18px 0' }}/>
      <div style={{ padding: '14px 18px', fontFamily: 'var(--kh-serif)', fontSize: 17, lineHeight: 1.55, color: 'var(--kh-text-2)' }}>
        Linears used to mean <Tok>Cherry MX Red</Tok>. Now they mean a hundred things — half of them sold by one Shenzhen factory under three brand names. The genre has fragmented…
      </div>
      <div style={{ margin: '0 18px', borderLeft: '2px solid var(--kh-accent)', paddingLeft: 14 }}>
        <p style={{ fontFamily: 'var(--kh-serif)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.35, color: 'var(--kh-text)' }}>
          "A great switch isn't quiet — it's articulate."
        </p>
      </div>
    </div>
    {/* Sticky bottom action bar */}
    <div style={{ padding: '10px 18px', borderTop: '1px solid var(--kh-border)', background: 'var(--kh-surface)',
                   display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 4, height: 4, background: 'var(--kh-accent)', borderRadius: 2 }}/>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--kh-text-2)' }}>
        <span>Listen</span><span>Save</span><span>Share</span>
      </div>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>32%</span>
    </div>
  </Phone>
);

const MobTracker = () => (
  <Phone label="03 · Trends Tracker">
    <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   borderBottom: '1px solid var(--kh-border)' }}>
      <span style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500 }}>Tracker · <em style={{fontStyle:'italic'}}>Switches</em></span>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-accent)' }}>WK 11</span>
    </div>
    <div style={{ display: 'flex', gap: 6, padding: '10px 18px', overflowX: 'auto', borderBottom: '1px solid var(--kh-border)' }}>
      {['Switches','Caps','Layouts','Boards','Vendors'].map((t,i)=>(
        <span key={t} style={{ fontSize: 11, padding: '5px 10px',
          color: i===0 ? 'var(--kh-text)' : 'var(--kh-text-3)',
          borderBottom: i===0 ? '2px solid var(--kh-accent)' : '2px solid transparent',
          fontWeight: i===0 ? 500 : 400, whiteSpace: 'nowrap' }}>{t}</span>
      ))}
    </div>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      {[
        { r:1, n:'Gateron Oil King', s:94, d:'+12', dr:'up',   sp:[3,4,4,5,6,5,7,8,9,11], best:true },
        { r:2, n:'WS Heavy Tactiles', s:88, d:'+24', dr:'up',   sp:[2,2,3,3,4,5,5,7,9,11] },
        { r:3, n:'Cherry MX2A Black', s:81, d:'−4',  dr:'down', sp:[8,9,8,7,8,7,6,7,6,5] },
        { r:4, n:'Akko V3 Cream Yellow Pro', s:77, d:'−2', dr:'down', sp:[7,8,7,7,6,7,6,6,5,6] },
        { r:5, n:'WS Morandi', s:71, d:'+38', dr:'up',   sp:[1,1,2,3,3,4,5,6,8,10] },
      ].map((row,i)=>(
        <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid var(--kh-border)',
          background: row.best ? 'color-mix(in oklch, var(--kh-accent) 6%, transparent)' : 'transparent',
          display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 16, color: 'var(--kh-text)' }}>{String(row.r).padStart(2,'0')}</span>
          <div>
            <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 16, fontWeight: 500 }}>{row.n}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Sparkline values={row.sp} dir={row.dr} w={88} h={18}/>
              <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11,
                              color: row.dr==='up'?'var(--kh-up)':row.dr==='down'?'var(--kh-down)':'var(--kh-flat)' }}>
                {row.d}
              </span>
            </div>
          </div>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 14, color: 'var(--kh-text)' }}>{row.s}</span>
        </div>
      ))}
    </div>
  </Phone>
);

const MobTag = () => (
  <Phone label="04 · Tag · linear">
    <MobNav/>
    <div style={{ padding: '14px 18px 6px', borderBottom: '1px solid var(--kh-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--kh-tag-switch)' }}/>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                        textTransform: 'uppercase', color: 'var(--kh-tag-switch)' }}>TAG · SWITCH</span>
      </div>
      <h1 style={{ fontFamily: 'var(--kh-serif)', fontSize: 44, fontWeight: 500, lineHeight: 1, marginTop: 6 }}>linear</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)' }}>142 ARTICLES · 34 SWITCHES</span>
        <button style={{ fontSize: 11, padding: '4px 10px', border: '1px solid var(--kh-border-hi)',
                          background: 'var(--kh-surface)', color: 'var(--kh-text)' }}>★ Follow</button>
      </div>
    </div>
    <div style={{ padding: '10px 18px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: '1px solid var(--kh-border)' }}>
      <TagChip category="switch" filled count={142} size="sm">linear</TagChip>
      <TagChip category="brand" count={42} size="sm">Gateron</TagChip>
      <TagChip category="material" count={56} size="sm">POM stem</TagChip>
      <TagChip category="material" count={22} size="sm">long-pole</TagChip>
    </div>
    <div style={{ flex: 1, overflow: 'hidden', padding: '8px 0' }}>
      {[
        ['Linear, but make it dramatic','M. Lin','warm'],
        ['The case against budget linears','A. Park','cool'],
        ['Oil King, six months in','J. Aoki','warm'],
      ].map(([t,a,tone],i)=>(
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 12, padding: '10px 18px',
                               borderTop: i ? '1px solid var(--kh-border)' : 'none' }}>
          <Img tone={tone} label="" style={{ aspectRatio: '4/3' }}/>
          <div>
            <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 15, fontWeight: 500, lineHeight: 1.2 }}>{t}</div>
            <div style={{ marginTop: 6, fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>
              {a} · 6 MIN
            </div>
          </div>
        </div>
      ))}
    </div>
  </Phone>
);

const MobileFrames = () => (
  <div style={{ display: 'flex', gap: 'var(--kh-7)', padding: 'var(--kh-7) 0', flexWrap: 'wrap' }}>
    <MobHome/>
    <MobArticle/>
    <MobTracker/>
    <MobTag/>
  </div>
);

window.MobileFrames = MobileFrames;
