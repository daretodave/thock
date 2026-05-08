// Keyboard Hub — Editorial atoms
// Pull quote, callout, image+caption, comparison table, switch spec table,
// video embed, gallery, citation. Plus the "switch-density" treatment.

const PullQuote = ({ quote, who }) => (
  <figure style={{ margin: '8px 0', padding: '0 0 0 var(--kh-5)',
                    borderLeft: '2px solid var(--kh-accent)' }}>
    <blockquote style={{ margin: 0, fontFamily: 'var(--kh-serif)', fontStyle: 'italic',
                         fontSize: 26, lineHeight: 1.3, color: 'var(--kh-text)', textWrap: 'balance' }}>
      "{quote}"
    </blockquote>
    {who && <figcaption style={{ marginTop: 12, fontFamily: 'var(--kh-mono)', fontSize: 11,
                                  letterSpacing: 0.08+'em', textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>
      — {who}
    </figcaption>}
  </figure>
);

const Callout = ({ kind = 'note', title, children }) => {
  const tones = {
    note:  { c: 'var(--kh-text-2)', label: 'NOTE' },
    spec:  { c: 'var(--kh-tag-layout)', label: 'SPEC' },
    fyi:   { c: 'var(--kh-accent)', label: 'EDITORS NOTE' },
  }[kind];
  return (
    <aside style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)',
                    borderLeft: `2px solid ${tones.c}`,
                    padding: 'var(--kh-4) var(--kh-5)' }}>
      <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                    textTransform: 'uppercase', color: tones.c, marginBottom: 6 }}>{tones.label}</div>
      {title && <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500, marginBottom: 6 }}>{title}</div>}
      <div style={{ fontSize: 14, color: 'var(--kh-text-2)', lineHeight: 1.55 }}>{children}</div>
    </aside>
  );
};

const ImageCaption = ({ tone = 'cool', label = 'PHOTO', cap, credit, ratio = '16/10' }) => (
  <figure style={{ margin: 0 }}>
    <Img tone={tone} label={label} style={{ aspectRatio: ratio, borderRadius: 2 }} />
    <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8,
                          fontSize: 12, color: 'var(--kh-text-3)' }}>
      <span style={{ flex: 1 }}>{cap}</span>
      {credit && <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11 }}>{credit}</span>}
    </figcaption>
  </figure>
);

const ComparisonTable = ({ rows, cols }) => (
  <div style={{ border: '1px solid var(--kh-border)', borderRadius: 2, overflow: 'hidden' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--kh-sans)' }}>
      <thead>
        <tr>
          <th style={th}></th>
          {cols.map(c => <th key={c} style={th}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderTop: '1px solid var(--kh-border)' }}>
            <td style={tdLabel}>{r.label}</td>
            {r.values.map((v, j) => (
              <td key={j} style={{ ...td, color: v.best ? 'var(--kh-accent)' : 'var(--kh-text)',
                                        fontFamily: typeof v === 'object' ? 'var(--kh-mono)' : 'var(--kh-sans)' }}>
                {typeof v === 'object' ? v.label : v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const th = { textAlign: 'left', padding: '12px 14px', fontFamily: 'var(--kh-mono)', fontSize: 10,
             color: 'var(--kh-text-3)', letterSpacing: 0.08+'em', textTransform: 'uppercase',
             borderBottom: '1px solid var(--kh-border)', background: 'var(--kh-surface)' };
const td = { padding: '11px 14px', fontFamily: 'var(--kh-mono)' };
const tdLabel = { ...td, color: 'var(--kh-text-2)', fontFamily: 'var(--kh-sans)', fontSize: 12 };

const SwitchSpec = ({ name, type = 'Linear', actuation, bottomOut, travel, spring, housing, stem, lube }) => (
  <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)',
                padding: 'var(--kh-5)', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 'var(--kh-5)' }}>
    <div>
      <Img tone="warm" label="SWITCH" style={{ aspectRatio: '1/1', borderRadius: 2 }}/>
      <div style={{ marginTop: 10, fontFamily: 'var(--kh-mono)', fontSize: 10,
                    letterSpacing: 0.1+'em', textTransform: 'uppercase', color: 'var(--kh-tag-switch)' }}>{type.toUpperCase()}</div>
      <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 22, fontWeight: 500, marginTop: 4 }}>{name}</div>
    </div>
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px',
                 alignContent: 'start', fontSize: 13 }}>
      {[['Actuation force', actuation], ['Bottom-out', bottomOut], ['Total travel', travel],
        ['Spring', spring], ['Housing', housing], ['Stem', stem], ['Factory lube', lube],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                              borderBottom: '1px dotted var(--kh-border-hi)', paddingBottom: 6 }}>
          <dt style={{ color: 'var(--kh-text-3)' }}>{k}</dt>
          <dd style={{ margin: 0, fontFamily: 'var(--kh-mono)', color: 'var(--kh-text)' }}>{v}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const VideoEmbed = ({ caption, source }) => (
  <figure style={{ margin: 0 }}>
    <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden' }}>
      <Img tone="dark" label="SOUND TEST · VIDEO" style={{ position: 'absolute', inset: 0 }}/>
      <button style={{ position: 'absolute', inset: 0, margin: 'auto', width: 56, height: 56,
                       borderRadius: '50%', border: '1px solid rgba(255,255,255,0.6)',
                       background: 'rgba(0,0,0,0.45)', cursor: 'pointer', color: '#fff',
                       display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M5 3 L14 9 L5 15 Z"/></svg>
      </button>
      <div style={{ position: 'absolute', left: 12, bottom: 12, fontFamily: 'var(--kh-mono)',
                    fontSize: 10, letterSpacing: 0.08+'em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.5)', padding: '3px 6px' }}>
        SOUND TEST · 0:42
      </div>
    </div>
    {caption && <figcaption style={{ marginTop: 8, fontSize: 12, color: 'var(--kh-text-3)' }}>{caption}</figcaption>}
    {source && <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-accent)', marginTop: 4 }}>{source}</div>}
  </figure>
);

const Gallery = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, height: 280 }}>
    <Img tone="warm" label="HERO" style={{ gridRow: 'span 2', borderRadius: 2 }}/>
    <Img tone="cool" label="SIDE" style={{ borderRadius: 2 }}/>
    <Img tone="green" label="MACRO" style={{ borderRadius: 2 }}/>
    <Img tone="dark" label="UNDER" style={{ borderRadius: 2 }}/>
    <Img tone="cool" label="DETAIL" style={{ borderRadius: 2 }}/>
  </div>
);

const Citation = ({ children, source, url }) => (
  <span style={{ borderBottom: '1px dotted var(--kh-accent-mu)', paddingBottom: 1, color: 'var(--kh-text-2)' }}>
    {children}
    <sup style={{ marginLeft: 2, fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-accent)' }}>
      [{source}]
    </sup>
  </span>
);

// Switch-density treatment — shows how many switch names breathe.
const SwitchDensitySample = () => (
  <div style={{ background: 'var(--kh-bg)', padding: 'var(--kh-5)', borderRadius: 2 }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.08+'em',
                  textTransform: 'uppercase', color: 'var(--kh-text-3)', marginBottom: 10 }}>
      AS BODY COPY · 15 SWITCH NAMES
    </div>
    <p style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, lineHeight: 1.65, color: 'var(--kh-text)',
                margin: 0, textWrap: 'pretty' }}>
      The linears that mattered this quarter were <Tok>Gateron Oil King</Tok>, <Tok>WS Morandi</Tok>, and the
      reissued <Tok>Cherry MX2A Black</Tok>. On the tactile side: <Tok>Boba U4T X</Tok>, <Tok>Akko V3 Pro Cream Yellow</Tok>,
      and the dark-horse <Tok>Kailh Cocoa</Tok>. Clicky was a quieter year — only <Tok>Box Jade v2</Tok> and
      <Tok>Drop Holy Pandas</Tok> moved meaningfully. Honourable mentions to <Tok>HMX Macchiato</Tok>,
      <Tok>JWK Alpaca v3</Tok>, <Tok>Outemu Cream</Tok>, <Tok>NK Cream+</Tok>, <Tok>Tecsee Sapphire</Tok>,
      <Tok>Akko V3 Lavender</Tok>, and <Tok>WS Heavy Tactile</Tok>.
    </p>
  </div>
);

const AtomsArtboard = () => (
  <Frame style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-5)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>EDITORIAL ATOMS</div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--kh-6)' }}>
      <PullQuote
        quote="A great switch isn't quiet — it's articulate. Every press should sound like a sentence ending."
        who="Mara Lin · Sound design column"/>
      <Callout kind="fyi" title="A note on rankings">
        We rank by week-over-week chatter weighted against retail availability. A switch that's hot but unbuyable
        gets a lower score than one you can actually have on your desk.
      </Callout>
    </div>

    <SwitchDensitySample/>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-6)' }}>
      <ImageCaption tone="warm" label="POURED-RESIN KEYCAP" ratio="4/3"
        cap="Hand-poured resin keycaps from Studio Ohne, Tokyo." credit="PHOTO · Yui Nakamura"/>
      <SwitchSpec name="Gateron Oil King"
        type="Linear" actuation="55g" bottomOut="65g" travel="3.5mm"
        spring="22mm two-stage" housing="Ink (mod) + Nylon (top)"
        stem="POM, factory-tightened" lube="Krytox 205g0"/>
    </div>

    <ComparisonTable
      cols={['Oil King', 'Cream Yellow Pro', 'WS Morandi']}
      rows={[
        { label: 'Type',          values: ['Linear', 'Linear', 'Linear'] },
        { label: 'Actuation',     values: ['55g', '50g', '52g'] },
        { label: 'Bottom-out',    values: ['65g', '63g', '60g'] },
        { label: 'Sound profile', values: [{ label: 'deep / wet', best: true }, 'creamy / clack', 'muted / pillow'] },
        { label: 'Price (90pc)',  values: ['$58', '$32', '$45'] },
      ]}
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-6)' }}>
      <VideoEmbed caption="Same board, three switches, identical tap sequence." source="VIDEO · Mara Lin / Keyboard Hub"/>
      <Gallery/>
    </div>

    <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)', padding: 'var(--kh-5)' }}>
      <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.1+'em',
                    textTransform: 'uppercase', color: 'var(--kh-text-3)', marginBottom: 10 }}>CITATIONS</div>
      <p style={{ fontSize: 14, color: 'var(--kh-text-2)', lineHeight: 1.6, margin: 0 }}>
        <Citation source="1">According to Geekhack's 2026 Q1 group-buy ledger</Citation>, the median group-buy
        ran 38 days; <Citation source="2">Drop's vendor-side data</Citation> says fulfilment time has compressed
        to ~120 days from 220 in 2022.
      </p>
      <ol style={{ marginTop: 16, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6,
                   fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', counterReset: 'cite' }}>
        <li>[1] Geekhack public ledger, Q1 2026 — <span style={{ color: 'var(--kh-accent)' }}>geekhack.org/index.php?topic=…</span></li>
        <li>[2] Drop logistics report, Mar 2026 — <span style={{ color: 'var(--kh-accent)' }}>drop.com/keyboards/report</span></li>
      </ol>
    </div>
  </Frame>
);

Object.assign(window, { PullQuote, Callout, ImageCaption, ComparisonTable, SwitchSpec, VideoEmbed, Gallery, Citation, SwitchDensitySample, AtomsArtboard });
