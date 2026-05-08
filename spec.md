# Keyboard Hub — Product Spec

## 1. Overview

A web-based content and news hub for mechanical keyboard enthusiasts. The site aggregates and publishes editorial content about keyboard trends, new releases, group buys, build ideas, and the broader hobby. Readers come to discover what's happening in the scene, deepen their knowledge, and find inspiration for their next build.

**One-line pitch:** *The Verge × r/MechanicalKeyboards — a curated home for keyboard culture, trends, and ideas.*

## 2. Goals & Non-Goals

### Goals
- Be the single best source for keyboard news, trend analysis, and build ideas.
- Surface signal over noise — curate, don't just aggregate.
- Make discovery effortless: trending topics, new launches, and editorial picks on the home page.
- Build a returning audience through a daily/weekly cadence of fresh content.

### Non-Goals (for v1)
- E-commerce / direct sales (link out to vendors only).
- User-generated forums or comment threads (separate community problem).
- Group-buy hosting or coordination.
- Mobile-native app (responsive web only at launch).
- Reviews of every keyboard ever made — focus is current and trending.

## 3. Target Audience

**Primary:** Mechanical keyboard enthusiasts — hobbyists who build custom boards, follow group buys, and care about switches, keycaps, plates, foam, and firmware.

**Reader assumptions:**
- Knows what a TKL, 60%, HHKB, and Alice layout is.
- Familiar with switch types (linear/tactile/clicky) and basic terminology (stab, lube, gasket-mount).
- Visits weekly or more, often from desktop while planning a build.

**Out of scope:** Casual office-keyboard shoppers (different content tone, different SEO play).

## 4. Content Pillars

1. **News** — New releases, vendor announcements, group-buy openings, firmware updates, brand news.
2. **Trends** — Analytical pieces tracking what's rising/falling: "Why low-profile is having a moment," "The return of doubleshot ABS," etc.
3. **Ideas & Builds** — Build inspiration, theme spotlights, parts-pairing guides, "build of the week."
4. **Deep Dives** — Long-form on switches, sound profiling, materials, history of layouts, interviews with designers.
5. **Guides** — Evergreen reference: lubing tutorials, stabilizer modding, firmware (QMK/VIA/ZMK), buying frameworks.

## 5. Core Features (MVP)

### 5.1 Home Page
- Hero block: editor's pick or breaking news.
- Trending now: top 5 articles from the last 7 days.
- Latest by pillar: news, trends, ideas, deep dives, guides.
- "Group buys this week" widget (curated list with end dates and vendor links).

### 5.2 Article Page
- Clean reading experience, large hero image.
- Tags (e.g., `linear`, `gasket-mount`, `gmk`, `polycarbonate`, `40%`).
- Related articles (same tag or pillar).
- "Mentioned in this article" — structured product/part references that link out to vendors.
- Estimated read time, publish date, author byline.

### 5.3 Browsing & Discovery
- Pillar landing pages (one per content pillar).
- Tag pages (faceted by switch type, layout, brand, material).
- Search (title + body + tags).
- Archive by date.

### 5.4 Trends Tracker (signature feature)
- A visual "what's hot" dashboard updated weekly.
- Tracks mentions/sentiment of switches, keycap profiles, layouts, vendors over time.
- Sources: editorial picks + tagged article mentions (no scraping in v1).
- Each trend entry links to a deep-dive article explaining the movement.

### 5.5 Newsletter
- Weekly digest: top 5 articles, 2 group buys ending soon, 1 build of the week.
- Email capture in footer + after-article CTA.

### 5.6 RSS
- Per-pillar and global RSS feeds.

## 6. Information Architecture

```
/                          Home
/news                      News pillar
/trends                    Trends pillar
/trends/tracker            Trends Tracker dashboard
/ideas                     Ideas & Builds pillar
/deep-dives                Long-form
/guides                    Evergreen guides
/tag/{slug}                Tag page
/article/{slug}            Article page
/group-buys                Curated active group buys
/about                     About / editorial standards
/newsletter                Newsletter signup + archive
/search                    Search results
```

## 7. Content Model

**Article**
- `title`, `slug`, `subtitle`, `hero_image`, `body` (Markdown/MDX)
- `pillar` (enum: news | trends | ideas | deep-dives | guides)
- `tags` (many)
- `author`, `published_at`, `updated_at`
- `read_time_minutes`
- `mentioned_parts` (relation to Part)
- `related_articles` (manual or auto)
- `status` (draft | scheduled | published)

**Part** (referenced from articles, no full product DB in v1)
- `name`, `category` (switch | keycap-set | board | accessory)
- `vendor_links` (array of `{vendor, url}`)
- `image`

**Tag**
- `slug`, `display_name`, `category` (switch | layout | material | brand | profile | misc)

**Trend Entry**
- `name`, `category`, `direction` (up | down | flat), `week_score`, `linked_article`

**Group Buy**
- `name`, `vendor`, `image`, `start_date`, `end_date`, `external_url`, `region_notes`

## 8. Editorial Workflow

- Headless CMS (recommendation: Sanity, Contentful, or self-hosted Payload).
- Draft → review → schedule → publish.
- Image pipeline with automatic responsive variants and CDN delivery.
- Preview URLs for unpublished drafts.

## 9. Tech Stack (recommended)

- **Frontend:** Next.js (App Router) on Vercel — strong content site primitives, ISR for freshness, great Lighthouse scores out of the box.
- **CMS:** Sanity or Payload (developer-friendly, good content modeling).
- **Search:** Algolia or Meilisearch (Meili if cost-sensitive).
- **Analytics:** Plausible or Fathom (privacy-respecting, no cookie banner).
- **Email:** Buttondown or ConvertKit for the newsletter.
- **Hosting/CDN:** Vercel + the CMS's own CDN for assets.

Alternatives worth considering: Astro (if interactivity is minimal — faster builds, smaller bundles), or a static-site-generator + Markdown-in-repo approach if the team prefers Git-based editing.

## 10. Design & Tone

- **Visual:** Editorial, image-forward, generous whitespace. Hero images are the star — keyboards are a visual hobby.
- **Typography:** A serif for headlines (gravitas), a clean sans for body. One monospaced accent for technical terms, switch names, and code (firmware snippets).
- **Color:** Restrained. Let the keyboard photography carry the color. Dark mode is non-negotiable for this audience.
- **Voice:** Knowledgeable peer, not breathless hype-machine. Assume the reader knows the basics; explain what's new or surprising.

## 11. SEO & Distribution

- Each article targets a specific search intent (a switch name, a layout question, a "best X" framing).
- Strong internal linking between related articles and tag pages.
- Schema.org `Article` markup, OpenGraph and Twitter cards.
- Sitemap, robots.txt, canonical URLs handled correctly.
- Cross-post snippets to r/MechanicalKeyboards, Discord servers, and keyboard Twitter/Mastodon.

## 12. Success Metrics

- Weekly active readers and returning-visitor rate.
- Articles read per session.
- Newsletter open rate (target: 40%+ for an enthusiast audience).
- Time on page for deep-dives (target: 4+ minutes).
- Organic search share of traffic (target: 50%+ within 6 months).

## 13. Phased Roadmap

**Phase 1 — MVP (launch, 8–12 weeks)**
- Home, article, pillar pages, tag pages, search.
- CMS wired up; first 30 articles seeded across pillars.
- Newsletter signup and RSS.
- Group-buys widget (manual entry).

**Phase 2 — Signature features (post-launch, +6–10 weeks)**
- Trends Tracker dashboard.
- Build-of-the-week recurring slot.
- Author profiles and per-author archives.

**Phase 3 — Depth (later)**
- Personalized "for you" feed based on read history.
- Saved articles / read later.
- Comparison tool for switches or layouts.
- Possibly: light community layer (reactions, not threads).

## 14. Open Questions

- Editorial staffing: solo founder writing, contributor network, or paid staff?
- Affiliate revenue: pursue from day one, or stay neutral until audience is established?
- Group-buy data: manual curation indefinitely, or invest in vendor integrations / scraping later?
- Localization: English-only at launch — plan for JP/CN/KR audiences (large in this hobby) eventually?
- Comments: stay off-platform (Reddit/Discord) permanently, or reconsider once traffic justifies moderation?
