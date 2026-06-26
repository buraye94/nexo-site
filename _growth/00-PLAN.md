# Clicroot.com Growth Plan: redesign + SEO + GEO (CO/MX)

Owner: Felipe / JC. Started 2026-06-25. Site repo: ~/nexo-site (Astro 5.7, Cloudflare, bilingual es/en, Decap CMS at /admin). Public domain: https://clicroot.com.

Goal: turn clicroot.com into Clicroot's own best case study. Redesign onto the Clicroot 2.0 brand, and rank for high-intent SEO and AI-visibility (GEO) terms in Colombia and Mexico to drive inbound consulting leads and LLM citations.

Supporting docs in this folder:
- 01-keyword-architecture.md (keyword universe + IA / page map, CO + MX) [agent A]
- 02-technical-audit.md (technical SEO + GEO backlog, P0/P1/P2) [agent B]
- 03-design-audit.md (design + UX audit + 2.0 brand-extension spec)

## Situation
- Greenfield: Ahrefs metrics-by-country returns empty for clicroot.com. Zero organic presence, any country. Nothing to protect, everything to build.
- The site is a fast, well-structured one-pager with a sound funnel, but: brand has drifted to neon-lime (off 2.0), content is hidden at opacity:0 until JS+scroll (crawler/AI-hostile), and there are no dedicated pages to rank.
- No gsc-clicroot GSC namespace exists (measurement gap, needs Felipe).

## Opportunity (real Ahrefs data, 2026-06-25)
- CO is the faster win (soft SERPs, DR 8-43). MX is ~2x volume but defended (DR 40-54); win MX first via GEO + low-KD cities.
- Money terms, low difficulty + high commercial intent: consultoria/consultor seo (MX 500+250 / KD1, CO 350+150 / KD13-2, $60-100 CPC), agencia seo bogota (500 / KD2, $120), agencia seo medellin (300 / KD7, $150), auditoria seo (MX 300 / KD9, CO 200 / KD1).
- GEO land-grab (own the category early): que es geo (200 / KD0), generative engine optimization (200 / KD5), the MX "SEO + IA" micro-cluster, posicionamiento en chatgpt.

## Brand direction (decided 2026-06-25)
Evolve ONE shared brand: extend the Clicroot 2.0 deck DNA (warm-black + paper chapters, muted olive signal, Outfit / Plus Jakarta / JetBrains Mono, editorial run-in, numbers-that-draw-themselves) to the web. Site, decks, and reports become one company. Full brand-extension spec in 03-design-audit.md.

## Roadmap

### Phase 0 — Audit + blueprint  [DONE]
The three docs above. Keyword universe, technical backlog, design audit, brand spec.

### Phase 1 — Technical + GEO foundation  [safe, ship first]
Non-visual, high-leverage, low-risk. Touches astro.config, package.json, public/, Layout.astro.
- Add @astrojs/sitemap (i18n-aware). Create public/robots.txt (allow all, disallow /admin/, explicitly allow AI bots, point to sitemap). Create public/llms.txt (GEO).
- Fix Layout.astro: hreflang absolute URLs + correct x-default (currently broken), canonical from site+pathname, add og:image + og:url + og:site_name + twitter card, fix og:locale.
- Enrich JSON-LD into a graph: Organization (logo, sameAs, contactPoint hello@clicroot.com), Service, Breadcrumb, and BlogPosting on posts. No AggregateRating from anonymized testimonials (rule 3).
- Fix the reveal/animation fragility so content is real and crawlable (content visible by default, animation as enhancement, reduced-motion + no-JS fallback).
- Clean kill-list violations: em dashes in the title tag and case headings.
- og default image: a branded 1200x630 in the 2.0 palette.
- FLAG for Felipe: the +312% vs 284% traffic conflict and the hero stat claims. Resolve to verifiable numbers before they ship (rule 3). I will not invent these.

### Phase 2 — Brand / design -> 2.0  [the visual redesign]
Recolor + retype the homepage (and the shared layout/CSS) to the 2.0 tokens. Keep the dark/paper chapter rhythm, swap the values. Retire neon-lime for muted olive. Apply numbers-that-draw-themselves to the hero stats. Tighten the underdeveloped 4-step process section. Hold for Felipe review before prod deploy.

### Phase 3 — Content / IA expansion  [what actually ranks]
Build the pages from 01-keyword-architecture.md, each on the new 2.0 design, each GEO-built (entity clarity, structured Q&A, citable stats, schema). Parallelizable across sub-agents (one page or cluster per agent). Priority order:
1. /consultoria-seo (MX 500+250 / KD1)
2. /agencia-seo-bogota (CO 500 / KD2)
3. GEO pillar /geo-posicionamiento-en-ia (que es geo + GEO, 400 / KD0-5) + its 5-article cluster
4. homepage as hub (links into all of the above)
5. /agencia-seo-medellin, /auditoria-seo, /agencia-seo-monterrey, /servicios-seo
6. CO + MX local landings + blog topic clusters with internal linking up into the money pages

### Phase 4 — Measurement + GEO ops  [needs Felipe for setup]
- Add clicroot.com to Google Search Console + wire a gsc-clicroot MCP namespace.
- Ahrefs rank-tracker project (CO + MX target keywords).
- Brand Radar prompts: "mejor agencia SEO Colombia / Mexico," "agencia GEO," "como aparecer en ChatGPT," etc. Track LLM citations.
- Submit sitemap, request indexing, monitor schema + llms.txt.

## Setup gaps / heads-ups
- gsc-clicroot namespace does not exist. Needed for Phase 4 measurement.
- Security: the clicroot-portal git remote has a GitHub PAT in plaintext in .git/config. Rotate.
- Stats truth: the hero numbers need Felipe to confirm what is real and verifiable before they ship.

## Working agreement
This is a LIVE production site. Build on a branch, verify (astro build, no console errors, gate-clean copy), and hold visual changes + any prod deploy for Felipe's review. Spanish default, correct tildes, no em dashes, hello@clicroot.com.
