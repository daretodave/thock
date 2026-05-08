// Keyboard Hub — Brand artboards
// Wordmark, mark, palette, type system, spacing/grid tokens.

const Swatch = ({ name, value, dark, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{
      width: '100%', aspectRatio: '1.4/1',
      background: value, borderRadius: 2,
      border: '1px solid var(--kh-border)',
    }}/>
    <div style={{ fontSize: 11, fontFamily: 'var(--kh-mono)', color: 'var(--kh-text-3)', letterSpacing: 0.04+'em' }}>{label}</div>
    <div style={{ fontSize: 13, color: 'var(--kh-text)' }}>{name}</div>
  </div>
);

const BrandWordmark = () => (
  <Frame padded style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--kh-8)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>
      01 · WORDMARK & MARK
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-7)', alignItems: 'flex-start' }}>
      <Logo size={64} />
      <div style={{ display: 'flex', gap: 'var(--kh-8)', alignItems: 'center' }}>
        <div>
          <Mark size={88} color="var(--kh-text)" />
          <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                        marginTop: 12, letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>
            Compact mark · favicon / OG
          </div>
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--kh-border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
          <p style={{ fontFamily: 'var(--kh-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--kh-text-2)', lineHeight: 1.4 }}>
            "A keycap silhouette with the Cherry MX cross stem visible. The <Tok>+</Tok> is universal — every reader recognizes it without needing to be told."
          </p>
          <p style={{ fontSize: 13, color: 'var(--kh-text-3)', lineHeight: 1.6 }}>
            Wordmark pairs a <em style={{ fontFamily: 'var(--kh-serif)' }}>Newsreader italic</em> with a roman <strong>Hub</strong>. The italic carries editorial gravitas; the roman anchors. A small accent dot in brass marks the seam.
          </p>
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 'var(--kh-5)', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ background: 'var(--kh-surface)', padding: 'var(--kh-3) var(--kh-5)', border: '1px solid var(--kh-border)' }}>
        <Logo size={14} />
      </div>
      <div style={{ background: '#fff', padding: 'var(--kh-3) var(--kh-5)' }}>
        <Logo size={14} color="oklch(0.18 0.006 250)" accent="oklch(0.55 0.13 60)" />
      </div>
      <div style={{ background: 'var(--kh-bg)', padding: 'var(--kh-3) var(--kh-5)', border: '1px solid var(--kh-border)' }}>
        <Mark size={20} color="var(--kh-text)" />
      </div>
      <div style={{ background: 'var(--kh-accent)', padding: 'var(--kh-3) var(--kh-5)' }}>
        <Mark size={20} color="oklch(0.18 0.006 250)" />
      </div>
    </div>
  </Frame>
);

const BrandPalette = () => (
  <Frame style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-6)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>
      02 · PALETTE — DARK PRIMARY
    </div>

    <div>
      <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>Surface ramp</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <Swatch name="bg"          label="L 17.5" value="oklch(0.175 0.006 250)" />
        <Swatch name="bg-2"        label="L 20.5" value="oklch(0.205 0.006 250)" />
        <Swatch name="surface"     label="L 23.5" value="oklch(0.235 0.006 250)" />
        <Swatch name="surface-hi"  label="L 27.5" value="oklch(0.275 0.006 250)" />
        <Swatch name="border"      label="L 30.5" value="oklch(0.305 0.007 250)" />
        <Swatch name="border-hi"   label="L 42"   value="oklch(0.42  0.008 250)" />
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-6)' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>Text</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <Swatch name="text"   label="L 96.5" value="oklch(0.965 0.005 90)" />
          <Swatch name="text-2" label="L 78"   value="oklch(0.78  0.005 90)" />
          <Swatch name="text-3" label="L 58"   value="oklch(0.58  0.006 90)" />
          <Swatch name="text-4" label="L 42"   value="oklch(0.42  0.007 250)" />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>Accent + semantic</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <Swatch name="accent (brass)" label="80 / 0.135 / 75"  value="oklch(0.80 0.135 75)" />
          <Swatch name="up"             label="78 / 0.115 / 145" value="oklch(0.78 0.115 145)" />
          <Swatch name="down"           label="68 / 0.135 / 25"  value="oklch(0.68 0.135 25)"  />
          <Swatch name="flat"           label="62 / 0.006 / 90"  value="oklch(0.62 0.006 90)"  />
        </div>
      </div>
    </div>

    <div>
      <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>
        Tag categories — matched <Tok>L 0.74 / C 0.085</Tok>, hue varies. Read as taxonomy, not decoration.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <Swatch name="switch"   label="hue 75"  value="oklch(0.78 0.10  75)" />
        <Swatch name="layout"   label="hue 225" value="oklch(0.74 0.085 225)" />
        <Swatch name="brand"    label="hue 155" value="oklch(0.76 0.085 155)" />
        <Swatch name="material" label="hue 325" value="oklch(0.74 0.085 325)" />
        <Swatch name="profile"  label="hue 285" value="oklch(0.74 0.085 285)" />
      </div>
    </div>

    <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center', paddingTop: 12,
                  borderTop: '1px solid var(--kh-border)' }}>
      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
        {['oklch(0.175 0.006 250)', 'oklch(0.235 0.006 250)', 'oklch(0.965 0.005 90)', 'oklch(0.80 0.135 75)'].map((c, i) => (
          <div key={i} style={{ flex: 1, height: 32, background: c, borderRadius: 2 }}/>
        ))}
      </div>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                     letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>Reduced palette</span>
    </div>
  </Frame>
);

const BrandPaletteLight = () => (
  <Frame light style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-6)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>
      02b · PALETTE — LIGHT (SECONDARY)
    </div>
    <p style={{ fontSize: 14, color: 'var(--kh-text-2)', maxWidth: 60+'ch', lineHeight: 1.55 }}>
      Light mode is a courtesy, not the home. Same accent; warmer paper. Photography still does the heavy lifting.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
      <Swatch name="bg"        label="paper"   value="oklch(0.965 0.004 85)" />
      <Swatch name="bg-2"      label="ivory"   value="oklch(0.94  0.004 85)" />
      <Swatch name="surface"   label="white"   value="#fff" />
      <Swatch name="border"    label="hairline"value="oklch(0.88 0.004 85)" />
      <Swatch name="text"      label="ink"     value="oklch(0.18 0.006 250)" />
      <Swatch name="accent"    label="bronze"  value="oklch(0.55 0.13 60)" />
    </div>

    <div style={{ background: 'var(--kh-surface)', padding: 'var(--kh-5)', border: '1px solid var(--kh-border)', marginTop: 'var(--kh-3)' }}>
      <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                    letterSpacing: 0.08+'em', textTransform: 'uppercase', marginBottom: 10 }}>SAMPLE COMPONENT</div>
      <h3 style={{ fontFamily: 'var(--kh-serif)', fontSize: 24, fontWeight: 500, marginBottom: 6 }}>Linear, but make it dramatic</h3>
      <p style={{ color: 'var(--kh-text-2)', fontSize: 14, margin: 0 }}>
        We A/B'd <Tok>Gateron Oil King</Tok> against <Tok>Akko V3 Cream Yellow Pro</Tok> across three plate materials.
      </p>
    </div>
  </Frame>
);

const BrandType = () => (
  <Frame style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-5)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>
      03 · TYPE SYSTEM
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--kh-6)', borderBottom: '1px solid var(--kh-border)', paddingBottom: 'var(--kh-5)' }}>
      <div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                      letterSpacing: 0.08+'em', textTransform: 'uppercase', marginBottom: 6 }}>HEADLINES · SERIF</div>
        <div style={{ fontFamily: 'var(--kh-serif)', fontSize: 36, fontWeight: 500, lineHeight: 1, color: 'var(--kh-text)' }}>Newsreader</div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', marginTop: 6 }}>400 / 500 / 600 + italic</div>
        <p style={{ fontSize: 12, color: 'var(--kh-text-2)', marginTop: 12, lineHeight: 1.55 }}>
          Designed at Google for newsreader UIs — high stroke contrast at large sizes, comfortable on screen at body sizes. Italic carries our editorial signal without the over-stylized look of a display serif.
        </p>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                      letterSpacing: 0.08+'em', textTransform: 'uppercase', marginBottom: 6 }}>BODY · SANS</div>
        <div style={{ fontFamily: 'var(--kh-sans)', fontSize: 36, fontWeight: 500, lineHeight: 1, color: 'var(--kh-text)' }}>IBM Plex Sans</div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', marginTop: 6 }}>300 / 400 / 500 / 600 / 700</div>
        <p style={{ fontSize: 12, color: 'var(--kh-text-2)', marginTop: 12, lineHeight: 1.55 }}>
          Grown-up neutral with character — slightly squared joints, restrained x-height, designed in the same family as Plex Mono so the technical voice doesn't feel grafted on.
        </p>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                      letterSpacing: 0.08+'em', textTransform: 'uppercase', marginBottom: 6 }}>TECHNICAL · MONO</div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 36, fontWeight: 500, lineHeight: 1, color: 'var(--kh-text)' }}>JetBrains Mono</div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', marginTop: 6 }}>400 / 500 / 600</div>
        <p style={{ fontSize: 12, color: 'var(--kh-text-2)', marginTop: 12, lineHeight: 1.55 }}>
          Reserved for switch names, firmware, SKUs, and metadata. Open apertures so part numbers like <Tok>NK87 v3</Tok> don't smudge at small sizes.
        </p>
      </div>
    </div>

    {/* Type ramp */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kh-3)' }}>
      <Ramp size={56} family="serif" weight={500} label="display / 56" sample="The keyboard you build is the keyboard you keep." />
      <Ramp size={40} family="serif" weight={500} label="h1 / 40"      sample="A switch that sounds like falling rain." />
      <Ramp size={28} family="serif" weight={500} label="h2 / 28"      sample="What's rising: poured-resin keycaps, Alice layouts, low-pitch tactiles." />
      <Ramp size={20} family="serif" weight={500} label="h3 / 20"      sample="Mentioned in this article" />
      <Ramp size={16} family="sans"  weight={400} label="body / 16"    sample="Linears used to mean Cherry Reds. Now they mean a hundred things, half of them sold by one Shenzhen factory."  />
      <Ramp size={14} family="sans"  weight={400} label="small / 14"   sample="By Mara Lin · 8 min read · Mar 14, 2026" />
      <Ramp size={11} family="mono"  weight={500} label="micro / 11"   sample="DEEP DIVE · 2026·W11 · ISSUE No.74" letterSpacing={0.1} upper />
    </div>

    <div style={{ background: 'var(--kh-surface)', border: '1px solid var(--kh-border)', padding: 'var(--kh-4)', display: 'flex', gap: 'var(--kh-3)', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                     letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>MONO IN FLOW</span>
      <span style={{ flex: 1, fontSize: 14, color: 'var(--kh-text-2)' }}>
        We tested <Tok>Gateron Oil King</Tok>, <Tok>WS Heavy Tactiles</Tok>, and <Tok>Kailh Box Jade</Tok> on a <Tok>NK87 v3</Tok> running <Tok>QMK 0.24.x</Tok>.
      </span>
    </div>
  </Frame>
);

const Ramp = ({ size, family, weight, label, sample, letterSpacing = -0.012, upper }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'baseline', gap: 'var(--kh-4)',
                borderTop: '1px solid var(--kh-border)', paddingTop: 'var(--kh-3)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)',
                  letterSpacing: 0.08+'em', textTransform: 'uppercase' }}>{label}</div>
    <div style={{
      fontFamily: family === 'serif' ? 'var(--kh-serif)' : family === 'mono' ? 'var(--kh-mono)' : 'var(--kh-sans)',
      fontSize: size, fontWeight: weight, color: 'var(--kh-text)',
      letterSpacing: letterSpacing + 'em',
      textTransform: upper ? 'uppercase' : 'none',
      lineHeight: size > 30 ? 1.05 : 1.4,
    }}>{sample}</div>
  </div>
);

const BrandSpacing = () => (
  <Frame style={{ padding: 'var(--kh-7)', display: 'flex', flexDirection: 'column', gap: 'var(--kh-5)' }}>
    <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)',
                  letterSpacing: 0.1+'em', textTransform: 'uppercase' }}>
      04 · SPACING & GRID
    </div>

    <div>
      <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>4-px scale</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {[
          ['1', 4], ['2', 8], ['3', 12], ['4', 16], ['5', 24], ['6', 32], ['7', 48], ['8', 64], ['9', 96],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: v, height: v, background: 'var(--kh-accent)' }}/>
            <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)' }}>--kh-{k}</div>
            <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-2)' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kh-6)' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>Desktop grid · 12 col · 24px gutter</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8, padding: 12, background: 'var(--kh-surface)', border: '1px solid var(--kh-border)' }}>
          {Array.from({length:12}).map((_,i) => (
            <div key={i} style={{ height: 60, background: 'color-mix(in oklch, var(--kh-accent) 12%, transparent)',
                                  border: '1px dashed color-mix(in oklch, var(--kh-accent) 50%, transparent)' }}/>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', marginTop: 8 }}>
          1280 max · gutter 24 · margin 40<br/>
          Editorial layouts use 8/4/12 splits; tracker uses 12.
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--kh-text-2)', marginBottom: 12 }}>Radii & elevation</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            ['r-1', 2], ['r-2', 4], ['r-3', 8], ['pill', 999],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{
                width: '100%', aspectRatio: '1.4/1', background: 'var(--kh-surface)',
                border: '1px solid var(--kh-border)', borderRadius: v,
              }}/>
              <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 10, color: 'var(--kh-text-3)', marginTop: 6 }}>--kh-{k}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--kh-mono)', fontSize: 11, color: 'var(--kh-text-3)', marginTop: 16, lineHeight: 1.6 }}>
          We default to <Tok>2px</Tok> — soft enough to feel modern, hard enough to read as editorial.
          Pills are reserved for tags.
        </div>
      </div>
    </div>
  </Frame>
);

Object.assign(window, { BrandWordmark, BrandPalette, BrandPaletteLight, BrandType, BrandSpacing, Swatch, Ramp });
