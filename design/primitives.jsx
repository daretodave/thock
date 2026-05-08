// Keyboard Hub — shared primitives & utilities
// Exports: Logo, Mark, Header, Footer, Newsletter, ArticleCard, TagChip,
// TrendGlyph, Sparkline, PartReference, GroupBuyCard, Tok, Img, Frame.

const Frame = ({ children, light, style, padded, scrollable }) => (
  <div className={'kh-frame' + (light ? ' kh-light' : '')}
       style={{ ...(padded ? { padding: 'var(--kh-5)' } : null),
                ...(scrollable ? { overflow: 'auto' } : null), ...style }}>
    {children}
  </div>
);

// striped-SVG image placeholder
const Img = ({ tone, label, style, h, w, children }) => (
  <div className={'kh-img' + (tone ? ' ' + tone : '')}
       style={{ height: h, width: w, ...style }}>
    {label ? <span>{label}</span> : null}
    {children}
  </div>
);

const Tok = ({ children, style }) => <span className="tok" style={style}>{children}</span>;

// ── Brand ───────────────────────────────────────────────────────────
// Mark: square keycap silhouette with the Cherry MX cross stem visible.
// "+" stem is universal and instantly readable to the audience.
const Mark = ({ size = 32, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Keyboard Hub">
    {/* keycap top */}
    <rect x="2.5" y="3" width="27" height="24" rx="2.5"
          stroke={color} strokeWidth="1.6" fill="none" />
    {/* keycap inner sculpt */}
    <rect x="6" y="6.5" width="20" height="17" rx="1.5"
          stroke={color} strokeOpacity="0.45" strokeWidth="1" fill="none" />
    {/* cherry mx cross stem */}
    <path d="M16 11.5 v9 M11.5 16 h9" stroke={color} strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const Logo = ({ size = 22, color, accent }) => {
  const c = color || 'var(--kh-text)';
  const a = accent || 'var(--kh-accent)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: c, lineHeight: 1 }}>
      <Mark size={Math.round(size * 1.15)} color={c} />
      <span style={{ fontFamily: 'var(--kh-serif)', fontSize: size, fontWeight: 500, letterSpacing: -0.015 + 'em' }}>
        <em style={{ fontStyle: 'italic', fontWeight: 500 }}>Keyboard</em>
        <span style={{ color: a, margin: '0 0.18em', fontStyle: 'normal' }}>·</span>
        <span style={{ fontWeight: 600 }}>Hub</span>
      </span>
    </span>
  );
};

// ── Header ──────────────────────────────────────────────────────────
const PILLARS = ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides'];

const Header = ({ active, dense, breadcrumb }) => (
  <header style={{
    borderBottom: '1px solid var(--kh-border)',
    background: 'color-mix(in oklch, var(--kh-bg) 92%, transparent)',
    backdropFilter: 'blur(8px)',
    position: 'sticky', top: 0, zIndex: 5,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kh-6)',
                  padding: dense ? '12px 32px' : '18px 40px' }}>
      <Logo size={dense ? 18 : 20} />
      <nav style={{ display: 'flex', gap: 'var(--kh-5)', flex: 1, marginLeft: 'var(--kh-5)' }}>
        {PILLARS.map(p => (
          <a key={p} style={{
            fontSize: 14, fontWeight: 500,
            color: p === active ? 'var(--kh-text)' : 'var(--kh-text-2)',
            paddingBottom: 4,
            borderBottom: p === active ? '1px solid var(--kh-accent)' : '1px solid transparent',
            letterSpacing: 0.01 + 'em',
          }}>{p}</a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kh-3)' }}>
        <button style={searchBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5" strokeLinecap="round"/></svg>
          <span style={{ opacity: 0.6 }}>Search</span>
          <kbd style={kbd}>⌘K</kbd>
        </button>
        <button style={subscribeBtn}>Subscribe</button>
      </div>
    </div>
    {breadcrumb && (
      <div style={{ padding: '8px 40px', fontFamily: 'var(--kh-mono)', fontSize: 11,
                    color: 'var(--kh-text-3)', letterSpacing: 0.06 + 'em', textTransform: 'uppercase',
                    borderTop: '1px solid var(--kh-border)' }}>
        {breadcrumb}
      </div>
    )}
  </header>
);

const searchBtn = {
  display: 'flex', alignItems: 'center', gap: 8,
  background: 'var(--kh-surface)', border: '1px solid var(--kh-border)',
  color: 'var(--kh-text-2)', fontSize: 13, fontFamily: 'inherit',
  padding: '6px 10px 6px 10px', borderRadius: 4, cursor: 'pointer',
};
const kbd = {
  fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
  border: '1px solid var(--kh-border-hi)', padding: '1px 4px',
  borderRadius: 3, marginLeft: 8,
};
const subscribeBtn = {
  background: 'var(--kh-text)', color: 'var(--kh-bg)',
  border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
  padding: '7px 14px', borderRadius: 4, cursor: 'pointer',
};

// ── TagChip ─────────────────────────────────────────────────────────
// category tinting via a leading colored bar; chip body is neutral so
// many can coexist without becoming a circus.
const TAG_HUE = {
  switch: 'var(--kh-tag-switch)',
  layout: 'var(--kh-tag-layout)',
  brand: 'var(--kh-tag-brand)',
  material: 'var(--kh-tag-material)',
  profile: 'var(--kh-tag-profile)',
};
const TagChip = ({ children, category = 'switch', count, size = 'md', filled, onDark = true }) => {
  const c = TAG_HUE[category];
  const compact = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: filled ? `color-mix(in oklch, ${c} 14%, transparent)` : 'var(--kh-surface)',
      border: '1px solid ' + (filled ? `color-mix(in oklch, ${c} 35%, transparent)` : 'var(--kh-border)'),
      borderRadius: 'var(--kh-r-pill)',
      padding: compact ? '2px 8px 2px 6px' : '4px 10px 4px 8px',
      fontSize: compact ? 11 : 12,
      fontFamily: 'var(--kh-sans)',
      color: 'var(--kh-text-2)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, flex: '0 0 6px' }} />
      <span>{children}</span>
      {count != null && <span style={{ color: 'var(--kh-text-3)', fontFamily: 'var(--kh-mono)', fontSize: compact ? 10 : 11 }}>{count}</span>}
    </span>
  );
};

// ── TrendDirectionGlyph ──────────────────────────────────────────────
// Shape encodes direction so the glyph isn't color-only.
const TrendGlyph = ({ dir = 'up', size = 14 }) => {
  const color = dir === 'up' ? 'var(--kh-up)' : dir === 'down' ? 'var(--kh-down)' : 'var(--kh-flat)';
  const path = dir === 'up' ? 'M2 10 L7 4 L12 10' :
               dir === 'down' ? 'M2 4 L7 10 L12 4' :
                                'M2 7 H12';
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none"
         stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
         aria-label={dir}>
      <path d={path} />
    </svg>
  );
};

// ── Sparkline ────────────────────────────────────────────────────────
const Sparkline = ({ values, w = 84, h = 22, dir = 'up', dotted, baseline = true }) => {
  const min = Math.min(...values), max = Math.max(...values);
  const r = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - 2) + 1;
    const y = h - 1 - ((v - min) / r) * (h - 2);
    return [x, y];
  });
  const d = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1)).join(' ');
  const color = dir === 'up' ? 'var(--kh-up)' : dir === 'down' ? 'var(--kh-down)' : 'var(--kh-flat)';
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      {baseline && <line x1="0" x2={w} y1={h - 0.5} y2={h - 0.5} stroke="var(--kh-border)" strokeDasharray="1 3" strokeWidth="0.5"/>}
      <path d={d} fill="none" stroke={color} strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={dotted ? '2 2' : null} opacity={dotted ? 0.6 : 1}/>
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
    </svg>
  );
};

// ── ArticleCard ─────────────────────────────────────────────────────
// Variants: hero, large, row, compact.
const Pillar = ({ name, color }) => (
  <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.12 + 'em',
                 textTransform: 'uppercase', color: color || 'var(--kh-accent)' }}>{name}</span>
);

const Byline = ({ author, date, read, sep = ' · ' }) => (
  <span style={{ fontSize: 12, color: 'var(--kh-text-3)' }}>
    {author && <><span style={{ color: 'var(--kh-text-2)' }}>{author}</span>{sep}</>}
    {date}{read ? sep + read : null}
  </span>
);

const ArticleCard = ({ variant = 'large', pillar = 'Trends', title, dek, author, date, read, tags = [], imgTone = 'cool', imgLabel = 'IMAGE', height }) => {
  if (variant === 'hero') {
    return (
      <article style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--kh-7)', alignItems: 'stretch' }}>
        <Img tone={imgTone} label={imgLabel} style={{ aspectRatio: '4/3', minHeight: 360, borderRadius: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--kh-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kh-3)' }}>
            <Pillar name={pillar} />
            <span style={{ width: 14, height: 1, background: 'var(--kh-border-hi)' }} />
            <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)', letterSpacing: 0.08+'em' }}>FEATURED</span>
          </div>
          <h2 style={{ fontSize: 'var(--kh-display)', lineHeight: 1.05, fontWeight: 500, letterSpacing: -0.02 + 'em' }}>{title}</h2>
          <p style={{ fontSize: 17, color: 'var(--kh-text-2)', maxWidth: 52 + 'ch', lineHeight: 1.5 }}>{dek}</p>
          <div style={{ marginTop: 'var(--kh-2)' }}><Byline author={author} date={date} read={read} /></div>
          {tags.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'var(--kh-2)' }}>
            {tags.map(t => <TagChip key={t.label} category={t.cat} size="sm">{t.label}</TagChip>)}
          </div> : null}
        </div>
      </article>
    );
  }
  if (variant === 'row') {
    return (
      <article style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 'var(--kh-5)', padding: 'var(--kh-4) 0',
                        borderTop: '1px solid var(--kh-border)', alignItems: 'start' }}>
        <Img tone={imgTone} label={imgLabel} style={{ aspectRatio: '4/3', borderRadius: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Pillar name={pillar} />
          <h3 style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.18, fontFamily: 'var(--kh-serif)' }}>{title}</h3>
          {dek && <p style={{ fontSize: 14, color: 'var(--kh-text-2)', margin: 0, lineHeight: 1.5, maxWidth: 60+'ch' }}>{dek}</p>}
          <Byline author={author} date={date} read={read} />
        </div>
        {tags.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 220, justifyContent: 'flex-end' }}>
          {tags.slice(0,3).map(t => <TagChip key={t.label} category={t.cat} size="sm">{t.label}</TagChip>)}
        </div> : <span/>}
      </article>
    );
  }
  if (variant === 'compact') {
    return (
      <article style={{ display: 'flex', gap: 'var(--kh-3)', padding: '10px 0', borderTop: '1px solid var(--kh-border)' }}>
        <Img tone={imgTone} label={imgLabel} style={{ width: 56, height: 56, borderRadius: 2, flex: '0 0 56px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <Pillar name={pillar} />
          <h4 style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.25, fontFamily: 'var(--kh-serif)', textWrap: 'pretty' }}>{title}</h4>
          <Byline date={date} read={read} />
        </div>
      </article>
    );
  }
  // large (default)
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-3)' }}>
      <Img tone={imgTone} label={imgLabel} style={{ aspectRatio: '4/3', borderRadius: 2 }} />
      <Pillar name={pillar} />
      <h3 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2, fontFamily: 'var(--kh-serif)', letterSpacing: -0.01+'em' }}>{title}</h3>
      {dek && <p style={{ fontSize: 14, color: 'var(--kh-text-2)', margin: 0, lineHeight: 1.5 }}>{dek}</p>}
      <Byline author={author} date={date} read={read} />
      {tags.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
        {tags.slice(0,3).map(t => <TagChip key={t.label} category={t.cat} size="sm">{t.label}</TagChip>)}
      </div> : null}
    </article>
  );
};

// ── PartReference ───────────────────────────────────────────────────
const PartReference = ({ name, kind, vendor, price, img = 'warm' }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 'var(--kh-3)',
                padding: 'var(--kh-3)', borderTop: '1px solid var(--kh-border)', alignItems: 'center' }}>
    <Img tone={img} label="" style={{ width: 64, height: 64, borderRadius: 2 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                    letterSpacing: 0.08 + 'em', textTransform: 'uppercase' }}>{kind}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--kh-text)', marginTop: 2 }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--kh-text-2)', marginTop: 2 }}>
        <span className="mono" style={{ color: 'var(--kh-accent)' }}>{vendor}</span>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      {price && <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 13, color: 'var(--kh-text)' }}>{price}</div>}
      <button style={{ marginTop: 4, fontSize: 11, fontFamily: 'var(--kh-mono)', color: 'var(--kh-accent)',
                       background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                       letterSpacing: 0.06+'em', textTransform: 'uppercase' }}>VIEW →</button>
    </div>
  </div>
);

// ── GroupBuyCard ────────────────────────────────────────────────────
// Urgency surfaced via a subtle progress bar + countdown, not red doom.
const GroupBuyCard = ({ name, vendor, region, ends, daysLeft, total, img = 'green', status = 'live' }) => {
  const progress = Math.max(0, Math.min(1, 1 - daysLeft / total));
  const urgent = daysLeft <= 3;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-3)',
                  background: 'var(--kh-surface)', padding: 'var(--kh-4)', borderRadius: 2,
                  border: '1px solid var(--kh-border)' }}>
      <Img tone={img} label="GB IMAGE" style={{ aspectRatio: '16/10', borderRadius: 2 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kh-2)' }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: status === 'live' ? 'var(--kh-up)' : 'var(--kh-flat)',
          boxShadow: status === 'live' ? '0 0 0 3px color-mix(in oklch, var(--kh-up) 25%, transparent)' : 'none',
        }} />
        <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, letterSpacing: 0.08+'em',
                       textTransform: 'uppercase', color: 'var(--kh-text-3)' }}>
          {status === 'live' ? 'LIVE' : 'CLOSED'} · {region}
        </span>
      </div>
      <h4 style={{ fontFamily: 'var(--kh-serif)', fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>{name}</h4>
      <div style={{ fontSize: 12, color: 'var(--kh-text-2)' }}>
        via <span className="mono" style={{ color: 'var(--kh-accent)' }}>{vendor}</span>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: urgent ? 'var(--kh-accent)' : 'var(--kh-text-2)' }}>
            {urgent ? `${daysLeft} day${daysLeft===1?'':'s'} left` : `Closes ${ends}`}
          </span>
          <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div style={{ height: 2, background: 'var(--kh-border)', position: 'relative', borderRadius: 1 }}>
          <div style={{ position: 'absolute', inset: 0, width: (progress*100)+'%',
                        background: urgent ? 'var(--kh-accent)' : 'var(--kh-text-2)' }} />
        </div>
      </div>
    </div>
  );
};

// ── Footer + Newsletter ─────────────────────────────────────────────
const Newsletter = ({ inline }) => (
  <div style={{
    display: inline ? 'grid' : 'flex',
    gridTemplateColumns: inline ? '1fr 1fr' : null,
    flexDirection: inline ? null : 'column',
    gap: inline ? 'var(--kh-7)' : 'var(--kh-3)',
    background: inline ? 'var(--kh-surface)' : 'transparent',
    border: inline ? '1px solid var(--kh-border)' : 'none',
    padding: inline ? 'var(--kh-7)' : 0,
    alignItems: inline ? 'center' : 'stretch',
  }}>
    <div>
      <h3 style={{ fontFamily: 'var(--kh-serif)', fontSize: inline ? 28 : 20, fontWeight: 500, lineHeight: 1.15 }}>
        A weekly read for people who care about how their keyboards sound.
      </h3>
      {inline && <p style={{ fontSize: 14, color: 'var(--kh-text-2)', marginTop: 12, maxWidth: 50+'ch' }}>
        Every Thursday: one trend, three releases worth your time, and a build worth stealing from. No drops, no doom-bars.
      </p>}
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
      <input placeholder="you@inbox.com" style={{
        flex: 1, background: 'var(--kh-bg)', border: '1px solid var(--kh-border-hi)',
        color: 'var(--kh-text)', fontFamily: 'inherit', fontSize: 14,
        padding: '10px 12px', borderRadius: 2, outline: 'none',
      }} />
      <button style={{
        background: 'var(--kh-accent)', color: 'var(--kh-bg)',
        border: 'none', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
        padding: '0 18px', borderRadius: 2, cursor: 'pointer', whiteSpace: 'nowrap',
      }}>Subscribe →</button>
    </div>
  </div>
);

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--kh-border)',
    padding: '40px 40px 28px',
    display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 'var(--kh-7)',
    color: 'var(--kh-text-2)', fontSize: 13,
  }}>
    <div>
      <Logo size={18} />
      <p style={{ marginTop: 16, color: 'var(--kh-text-3)', fontSize: 12, maxWidth: 38+'ch', lineHeight: 1.6 }}>
        Editorial coverage of mechanical keyboards: switches, builds, group buys, and the people building them.
      </p>
      <div style={{ marginTop: 16, fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                    letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>
        © 2026 KH MEDIA · ISSN 0000-0000
      </div>
    </div>
    {[
      ['Read', ['News', 'Trends', 'Ideas & Builds', 'Deep Dives', 'Guides']],
      ['Reference', ['Trends Tracker', 'Group Buys', 'Tag index', 'About']],
      ['Subscribe', ['Newsletter', 'RSS', 'Bluesky', 'YouTube']],
    ].map(([h, items]) => (
      <div key={h}>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                      letterSpacing: 0.08+'em', textTransform: 'uppercase', marginBottom: 12 }}>{h}</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(i => <li key={i} style={{ color: 'var(--kh-text-2)' }}>{i}</li>)}
        </ul>
      </div>
    ))}
  </footer>
);

Object.assign(window, {
  Frame, Img, Tok, Mark, Logo, Header, Footer, Newsletter,
  TagChip, TrendGlyph, Sparkline, ArticleCard, PartReference, GroupBuyCard, Pillar, Byline,
  PILLARS,
});
