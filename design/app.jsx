// Keyboard Hub — Top-level App: assembles the design canvas

const App = () => (
  <DesignCanvas>
    <DCSection id="brand" title="Brand sketch"
      subtitle="Wordmark, mark, palette, type, spacing — dark-first, photography lifts.">
      <DCArtboard id="wordmark"      label="Wordmark & mark"        width={760}  height={620}><BrandWordmark/></DCArtboard>
      <DCArtboard id="palette-dark"  label="Palette · dark (primary)" width={920}  height={620}><BrandPalette/></DCArtboard>
      <DCArtboard id="palette-light" label="Palette · light (secondary)" width={760} height={620}><BrandPaletteLight/></DCArtboard>
      <DCArtboard id="type"          label="Type system"            width={1200} height={920}><BrandType/></DCArtboard>
      <DCArtboard id="spacing"       label="Spacing & grid"         width={1100} height={620}><BrandSpacing/></DCArtboard>
    </DCSection>

    <DCSection id="primitives" title="Component primitives"
      subtitle="ArticleCard variants, TagChip, Sparkline, TrendDirectionGlyph, PartReference, GroupBuyCard, header & footer.">
      <DCArtboard id="primitives-all" label="Primitives · all variants" width={1480} height={2400}>
        <PrimitivesArtboard/>
      </DCArtboard>
    </DCSection>

    <DCSection id="atoms" title="Editorial atoms"
      subtitle="Pull quote, callouts, image-with-caption, comparison & spec tables, video, gallery, citation.">
      <DCArtboard id="atoms-all" label="Editorial atoms" width={1480} height={2200}>
        <AtomsArtboard/>
      </DCArtboard>
    </DCSection>

    <DCSection id="pages-desktop" title="Mockups · desktop"
      subtitle="Each artboard is a full page. Trends Tracker is the signature.">
      <DCArtboard id="home"           label="01 · Home"               width={1440} height={3000}><HomePage/></DCArtboard>
      <DCArtboard id="article"        label="02 · Article"            width={1440} height={3600}><ArticlePage/></DCArtboard>
      <DCArtboard id="pillar-trends"  label="03 · Pillar · Trends"    width={1440} height={2600}><PillarPage/></DCArtboard>
      <DCArtboard id="tag-linear"     label="04 · Tag · linear"       width={1440} height={2400}><TagPage/></DCArtboard>
      <DCArtboard id="trends-tracker" label="05 · Trends Tracker ★"    width={1440} height={2600}><TrendsTracker/></DCArtboard>
      <DCArtboard id="group-buys"     label="06 · Group Buys"         width={1440} height={2200}><GroupBuysPage/></DCArtboard>
    </DCSection>

    <DCSection id="empty-states" title="Empty & error states"
      subtitle="404, search-no-results, sparse-data tracker rows. Looks intentional, not broken.">
      <DCArtboard id="404"          label="404"                     width={1440} height={900}><EmptyState404/></DCArtboard>
      <DCArtboard id="no-results"   label="Search · no results"     width={1440} height={1200}><EmptyStateNoResults/></DCArtboard>
      <DCArtboard id="sparse-trend" label="Tracker · sparse data"   width={1100} height={520}><EmptyStateSparseTrend/></DCArtboard>
    </DCSection>

    <DCSection id="pages-mobile" title="Mockups · mobile"
      subtitle="Home, article, tracker, tag — 390 × 844. Long reads work on a phone or this product is dead.">
      <DCArtboard id="mobile-grid" label="Mobile · 4 frames" width={1820} height={1000}>
        <MobileFrames/>
      </DCArtboard>
    </DCSection>

    <DCSection id="decisions" title="Decisions & open questions"
      subtitle="What we settled, what we pushed back on, what we still need from you.">
      <DCArtboard id="decisions-doc" label="Round-one summary" width={1280} height={1700}>
        <DecisionsPage/>
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
