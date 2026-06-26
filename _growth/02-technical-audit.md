# Clicroot.com Technical SEO + GEO + Performance + Accessibility Audit

Repo: `~/nexo-site` (Astro 5.7, Spanish default + English, Cloudflare Pages, Decap CMS at `/admin`).
Date: 2026-06-25. Status of site: zero organic presence, pre-foundation.

This is a prioritized, actionable backlog. Each item: priority, issue, exact file(s), the concrete fix, why it matters. Groups: **P0** (foundation / blocking), **P1** (high impact), **P2** (polish).

Convention reminder for whoever ships this: no em dashes in any output copy. Use periods, colons, commas, parentheses.

---

## Architecture context (read once)

- `prefixDefaultLocale: false`, so the Spanish homepage is `https://clicroot.com/` (no `/es/` prefix). English is `/en/`. Spanish blog is `/es/blog/<slug>/`, English blog `/en/blog/<slug>/`. This asymmetry is the root of several indexability bugs below.
- `build.format: 'directory'` means every route is emitted as `path/index.html` and served with a trailing slash. All internal links and all canonical / hreflang / sitemap URLs must therefore end in a trailing slash. Mixed trailing-slash usage will create duplicate-URL and redirect issues.
- Only one dependency: `astro@^5.7.10`. No `@astrojs/sitemap`, no adapter, no image integration, no compression. Output is a static build deployed on Cloudflare Pages (the `functions/` dir holds Cloudflare Pages Functions for the contact API and Decap OAuth).
- There is no robots.txt, no sitemap, no llms.txt, no OG image, no site-wide canonical/OG plumbing beyond what `Layout.astro` hardcodes.

---

## P0: foundation / blocking

These block crawling, correct indexing, or are actively serving wrong signals. Ship first.

### P0-1: No XML sitemap
- **File(s):** `astro.config.mjs`, `package.json`.
- **Fix:** `npm i @astrojs/sitemap`, then in `astro.config.mjs` add `import sitemap from '@astrojs/sitemap';` and `integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-US' } } })]`. The integration emits `/sitemap-index.xml` plus per-page `<xhtml:link rel="alternate" hreflang>` entries automatically, which also fixes part of the hreflang problem below. Reference it from robots.txt (P0-2) and submit in GSC.
- **Why:** A brand-new domain with zero authority needs every crawl-efficiency lever. Without a sitemap, Google has to discover all pages by following links, and the homepage's only outbound links to deep content are 3 blog cards. The English homepage, English blog posts, and case studies have weak internal-link discovery paths.

### P0-2: No robots.txt
- **File(s):** create `public/robots.txt`.
- **Fix:**
  ```
  User-agent: *
  Allow: /
  Disallow: /admin/

  Sitemap: https://clicroot.com/sitemap-index.xml
  ```
  Do not add blanket AI-bot blocks (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). For a consultancy whose own pitch is "appear in ChatGPT, Perplexity, Claude" (see `es.json` hero.description), blocking those crawlers would contradict the value proposition and kill GEO visibility.
- **Why:** No robots.txt means no machine-readable sitemap pointer and no explicit crawl guidance. `/admin` (Decap CMS) should be kept out of the index defensively even though its `index.html` already has a noindex meta.

### P0-3: hreflang x-default is broken for the default locale
- **File(s):** `src/layouts/Layout.astro` (lines 26-28).
- **Current code:**
  ```astro
  {alternateUrl && <link rel="alternate" hreflang={alternateLang} href={alternateUrl} />}
  <link rel="alternate" hreflang={lang} href={Astro.url.href} />
  <link rel="alternate" hreflang="x-default" href={Astro.url.href.replace(`/${lang}/`, '/es/')} />
  ```
- **The bug:** On the Spanish homepage `lang='es'` and `Astro.url.href` is `https://clicroot.com/` with no `/es/` segment. `'https://clicroot.com/'.replace('/es/', '/es/')` finds no match, so x-default stays `https://clicroot.com/`. That happens to be correct for the homepage by luck, but on every Spanish blog post the URL is `/es/blog/<slug>/`, and `.replace('/es/','/es/')` is a no-op there too, so x-default points at the Spanish URL (acceptable but not by design). On the **English** homepage `lang='en'`, `Astro.url.href` is `/en/`, and `.replace('/en/','/es/')` yields `https://clicroot.com/es/`, **which does not exist** (the Spanish home is `/` and `/es/` is a redirect stub, see P0-4). So the English page declares an x-default that 301-redirects. Also note `alternateUrl` is passed as a relative path (`"/en/"`, `"/"`) so the emitted `href` is a relative URL, not absolute. hreflang requires absolute URLs.
- **Fix:** Stop string-replacing. Pass fully-qualified absolute alternate URLs from each page and build a proper cluster. Concretely, change the `Props` to accept an `alternates` map and emit:
  ```astro
  ---
  interface Props {
    title: string; description: string; lang: string;
    alternates: { es: string; en: string }; // absolute URLs
  }
  const { title, description, lang, alternates } = Astro.props;
  const site = 'https://clicroot.com';
  ---
  <link rel="canonical" href={new URL(Astro.url.pathname, site).href} />
  <link rel="alternate" hreflang="es" href={alternates.es} />
  <link rel="alternate" hreflang="en" href={alternates.en} />
  <link rel="alternate" hreflang="x-default" href={alternates.es} />
  ```
  Homepage call (`src/pages/index.astro`): `alternates={{ es: 'https://clicroot.com/', en: 'https://clicroot.com/en/' }}`. English home (`src/pages/en/index.astro`): same map. Blog posts: build both absolute URLs from the slug. x-default should point to the Spanish (default-locale) URL, never to a non-existent `/es/` path.
- **Why:** Wrong hreflang sends Google conflicting canonicalization signals across the language cluster and an x-default that redirects, which Google treats as an error and may ignore the whole annotation set. For a bilingual site this directly damages which language version ranks in which region. This is the single highest-value correctness fix in the audit.

### P0-4: `/es/` redirect stub creates a phantom URL the rest of the code points at
- **File(s):** `src/pages/es/index.astro` (entire file is `Astro.redirect('/')`), interacts with `Layout.astro` x-default and Nav.
- **Issue:** Because the default locale is unprefixed, `/es/` should not be a real page. The stub 301s to `/`. That is defensible, but combined with P0-3 the code generates links and x-default values pointing at `/es/`, so crawlers hit a redirect. Decide one model and make everything obey it.
- **Fix:** Keep the redirect stub (it catches users who manually type `/es/`), but ensure nothing in canonical, hreflang, sitemap, or nav ever emits `/es/` as a destination. After fixing P0-3 the only remaining `/es/`-shaped reference is internal. Confirm the sitemap integration (P0-1) does not emit `/es/` (configure it to treat `es` as the unprefixed default).
- **Why:** Redirect hops waste crawl budget on a zero-authority domain and dilute link equity. One canonical shape per page, no self-redirecting internal links.

### P0-5: Canonical tag uses `Astro.url.href` which can leak the dev/preview origin and ignores trailing-slash normalization
- **File(s):** `src/layouts/Layout.astro` (line 25).
- **Issue:** `Astro.url.href` reflects the request origin at render. In a static build Astro resolves it against `site`, so production output is usually correct, but it is safer and explicit to build the canonical from `site` + `Astro.url.pathname`. Also confirm the pathname carries the trailing slash that `format: 'directory'` produces, so the canonical matches the actually-served URL exactly.
- **Fix:** `<link rel="canonical" href={new URL(Astro.url.pathname, 'https://clicroot.com').href} />` (shown in P0-3). Verify the built HTML for `/` , `/en/`, `/es/blog/seo-latinoamerica/` all emit canonicals ending in `/`.
- **Why:** A canonical that disagrees with the served URL by a trailing slash is a self-referencing-canonical mismatch and can suppress indexing. On a clean site you want zero ambiguity from day one.

### P0-6: No OG image anywhere (every share + many AI snippets render blank)
- **File(s):** `public/` (no image present, confirmed: only `favicon.svg`, `logo.svg`), `src/layouts/Layout.astro`.
- **Fix:** Create `public/og-default.png` (1200x630, clicroot wordmark on the charcoal `#1A1A1A` brand background with the `#84BD00` accent, matching `global.css` tokens). Add to `Layout.astro` head: `og:image` (absolute URL), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, plus `og:url`, `og:site_name` ("clicroot"), and Twitter tags (`twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`). Allow a per-page `ogImage` prop override so blog posts can supply their own later.
- **Why:** Zero social/preview image means every LinkedIn, WhatsApp, Slack, and X share of clicroot.com renders a blank or garbage card, which destroys click-through during the exact founder-led outreach phase a new consultancy depends on. It also weakens entity presentation in some AI and SERP rich previews.

### P0-7: `og:url`, `og:site_name`, and Twitter card tags entirely missing
- **File(s):** `src/layouts/Layout.astro` (lines 30-34, current OG block only has type/title/description/locale).
- **Fix:** In the same head block add:
  ```astro
  <meta property="og:url" content={new URL(Astro.url.pathname, 'https://clicroot.com').href}>
  <meta property="og:site_name" content="clicroot">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content="https://clicroot.com/og-default.png">
  ```
- **Why:** `og:url` anchors the canonical entity for the share graph; `og:site_name` establishes the brand entity name consistently (important for GEO entity clarity). Without `twitter:card`, X falls back to a tiny summary card.

---

## P1: high impact

Major SEO/GEO/CWV/accessibility wins. Ship right after the foundation.

### P1-1: JSON-LD is a single thin `ProfessionalService` with no entity graph
- **File(s):** `src/layouts/Layout.astro` (lines 42-51).
- **Current:** one `ProfessionalService` node, `name: "clicroot"`, no logo, no sameAs, no contactPoint, no founders, no address. It is also injected on every page identically (including blog posts) which is wrong for article pages.
- **Fix:** Build a typed `@graph`. On all pages emit an `Organization` (or keep `ProfessionalService` as a subtype) with: `name` "clicroot", `url` "https://clicroot.com", `logo` "https://clicroot.com/logo.svg", `image` the OG image, `email` "hello@clicroot.com", `contactPoint` (`contactType` "sales", `email` hello@clicroot.com, `availableLanguage` ["es","en"]), `areaServed` ["CO","MX","US","ES"], `founder` two `Person` nodes (Felipe Gallo, JC Espinosa), and `sameAs` with the real LinkedIn/X URLs once the footer placeholders (P1-6) are filled. Add a `Service` node (or `hasOfferCatalog` with the 4 services from `es.json` services.items: Auditorias SEO Tecnicas, Link Building Estrategico, Estrategia de Contenido, SEO Bilingue). Move article-specific schema to the blog template (P1-2).
- **Why:** This is the core of both classic rich-result eligibility and GEO entity grounding. AI engines (the consultancy's own target surfaces) build an entity card from Organization + sameAs + contactPoint. A thin node with no logo/sameAs gives them almost nothing to anchor "clicroot" as a known entity, which is fatal when the domain has zero external authority to corroborate it.

### P1-2: Blog posts have no `BlogPosting`/`Article` schema and no `BreadcrumbList`
- **File(s):** `src/pages/es/blog/[slug].astro`, `src/pages/en/blog/[slug].astro`, `src/content/config.ts`.
- **Fix:** In each blog template emit a `BlogPosting` with `headline` (post.data.title), `description`, `datePublished` (post.data.date, ISO), `inLanguage` (lang), `author` (Person or the clicroot Organization), `publisher` (Organization with logo), `mainEntityOfPage` the canonical URL, and `image` the post OG image. Add a `BreadcrumbList` (Home > Blog > Post). To support `author` and `dateModified` properly, extend the content schema in `config.ts` with optional `author` and `updated` (z.date().optional()) fields.
- **Why:** Article structured data is table stakes for blog rich results and is one of the strongest signals AI engines use to attribute a claim to a source ("according to clicroot..."). Breadcrumbs improve SERP presentation and give crawlers an explicit hierarchy on a site whose nav is otherwise all same-page anchors (P1-5).

### P1-3: 4 render-blocking Google Font families loaded from a third-party origin
- **File(s):** `src/layouts/Layout.astro` (lines 36-39).
- **Issue:** One blocking `<link rel="stylesheet">` to `fonts.googleapis.com` pulling Urbanist (7 weights), Figtree (5 weights), Cormorant Garamond (italic+roman), and JetBrains Mono (4 weights). That is a large CSS+WOFF2 payload on the critical path, plus a cross-origin connection (extra DNS/TLS) that delays first render. There is no `font-display` control beyond Google's `&display=swap` and no preload.
- **Fix (preferred):** Self-host. `npm i @fontsource-variable/urbanist @fontsource-variable/figtree @fontsource/cormorant-garamond @fontsource-variable/jetbrains-mono` and import only the weights actually used, served same-origin (eliminates the cross-origin handshake, and Cloudflare can cache + HTTP/2 push them). **Cut weights aggressively**: the design uses far fewer than 18 weights. Audit `global.css` for actual `font-weight` values (display uses 800/900, body 400/500/600/700, serif 500, mono 600/700) and drop the rest. Keep `font-display: swap`. **Then preload only the two fonts needed for the hero LCP** (the Urbanist weight in `.hero-title` and the Figtree body weight) with `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- **Why:** Fonts on the critical path are the most common LCP and CLS killer. The hero `<h1>` (`.hero-title`, Urbanist 900) is the LCP element on both homepages; if its font arrives late the LCP text either blocks or reflows. Cutting 18 weights to ~8 and self-hosting removes a third-party round trip and a chunk of transfer from the critical path. Directly moves LCP and reduces layout shift.

### P1-4: No image optimization pipeline; raw `<img>` and inline SVG only
- **File(s):** `astro.config.mjs`, `src/components/Nav.astro` (logo `<img>`), `src/pages/index.astro` + `src/pages/en/index.astro` (footer logo `<img>`), `public/images/` (currently empty).
- **Fix:** Add `@astrojs/sitemap`'s sibling concern now so it is ready when real images land: enable Astro's built-in `<Image />` (Sharp is bundled in Astro 5) and migrate any future case-study / blog hero images to it for automatic AVIF/WebP + width/height + lazy loading. The two current `<img>` logos already set `width`/`height` (good, no CLS) so they are fine as-is, but document the rule: every future raster image goes through `<Image />`, never raw `<img>`. The blog cards currently render an SVG placeholder (`.blog-card-img`) instead of a real image, which is fine for now but means social/article images do not exist yet (ties to P1-2 image fields).
- **Why:** The site has no raster content yet, so this is preventive, but the moment case studies or blog heroes get real photos, unoptimized images become the new LCP/transfer problem. Establishing the `<Image />` rule now prevents a regression later. Low effort while the image dir is empty.

### P1-5: Entire site navigation is same-page anchors; deep pages have almost no internal links
- **File(s):** `src/components/Nav.astro` (lines 35-38, 59-63), `src/pages/index.astro` + `en/index.astro` footer (lines 305-318), blog templates (only a "Volver"/"Back" link to home).
- **Issue:** Nav links are all `#services`, `#results`, `#cases`, `#blog` (same-page jumps). The footer service links are also all `#services`. The only crawlable links to real distinct URLs are: the 3 most-recent blog cards on the homepage, the lang toggle, and the blog post "back to home" link. There is no `/blog` index page, no link from English home to Spanish content or vice versa beyond the lang toggle, and case studies are not standalone pages at all (they live only as cards on the homepage).
- **Fix:** (a) Build a real `/es/blog/` and `/en/blog/` index page listing all posts, link it from nav and footer. (b) Make the footer "Servicios" links point to real anchor IDs or dedicated service pages rather than all `#services`. (c) Consider promoting case studies to indexable `/casos/<slug>/` pages (they have rich metrics in `src/content/cases/*.json` that are currently invisible to search and to AI). (d) Add prev/next or related-posts links between blog posts.
- **Why:** Internal linking is how PageRank and crawl discovery flow. Right now link equity pools on the homepage and cannot reach blog posts beyond the latest 3, and case-study content is entirely uncrawlable. For a zero-authority site this throttles indexation of exactly the long-tail content meant to win GEO citations.

### P1-6: Placeholder `href="#"` social links and unverifiable `sameAs` gap
- **File(s):** `src/pages/index.astro` + `src/pages/en/index.astro` (lines 322-323: LinkedIn and `Twitter / X` both `href="#"`).
- **Fix:** Replace with real profile URLs, or remove the links until profiles exist. Then reuse those exact URLs in the Organization `sameAs` array (P1-1). If no profiles exist yet, create at least a LinkedIn company page (cheap, high-trust entity signal) before launch.
- **Why:** `href="#"` links are dead ends that look broken to users and provide zero entity corroboration. `sameAs` to real, active social profiles is one of the few entity-authority signals available to a brand-new domain, and AI engines lean on it heavily to confirm an organization is real.

### P1-7: No `prefers-reduced-motion` guard on any animation (accessibility + CWV)
- **File(s):** `src/styles/global.css` (confirmed: zero `prefers-reduced-motion` rules), `src/layouts/Layout.astro` (the scroll-reveal IntersectionObserver, counter animation, typewriter, float keyframes).
- **Issue:** The page runs continuous infinite animations (`@keyframes floatA/B/C` on the 4 hero metric cards, `marquee` 25s on the logo track, `pulse-dot`, `blink-cursor`), plus JS-driven scroll-reveal opacity/translate, a 2s counter count-up, and an infinite typewriter. None respect `prefers-reduced-motion: reduce`. The `.reveal` elements start at `opacity: 0`, so a reduced-motion user (or any user if the JS fails) could see blank content.
- **Fix:** Add a global guard:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
    .reveal { opacity: 1 !important; transform: none !important; }
  }
  ```
  In `Layout.astro`, gate the scroll-reveal, counter, and typewriter JS behind `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`, and in the reduced-motion branch set final states immediately (counters show their target number, reveals are visible, typewriter shows the first full message). Also see P1-8 for the no-JS fallback.
- **Why:** WCAG 2.1 SC 2.3.3 (Animation from Interactions) and vestibular-safety. The infinite float/marquee animations are exactly the kind that trigger motion sickness. Separately, infinite animations keep the main thread and compositor busy, which can hurt INP and battery. This is both an a11y compliance gap and a performance nicety.

### P1-8: Content is opacity:0 until JS runs (no-JS / slow-JS users and some crawlers see blank)
- **File(s):** `src/styles/global.css` (`.reveal { opacity: 0 }`), `src/layouts/Layout.astro` (reveal observer).
- **Issue:** Almost every section is wrapped in `.reveal`, which is `opacity: 0; transform: translateY(32px)` until the IntersectionObserver adds `.visible`. If JS is disabled, fails, or is slow, large parts of both homepages render invisible. Google renders JS so it generally recovers, but it is fragile, and some AI crawlers and link-preview bots do not execute JS.
- **Fix:** Adopt a `no-js`/`js` html-class pattern: add `class="no-js"` to `<html>`, immediately set it to `js` with an inline head script, and scope the hidden initial state to `.js .reveal { opacity: 0; ... }`. That way no-JS clients get fully visible content while JS clients still animate. Combine with the reduced-motion fix in P1-7.
- **Why:** Defensive content visibility. The whole point of the rebuild is to be citation-ready for AI engines and crawlers; shipping content that is invisible without JS undercuts that for any non-rendering bot and is a resilience risk.

### P1-9: No GEO surface: missing `llms.txt` and no machine-readable "facts" block
- **File(s):** create `public/llms.txt` (and optionally `public/llms-full.txt`); content sources in `src/i18n/es.json`, `src/content/cases/*.json`.
- **Fix:** Publish `public/llms.txt` (Markdown) summarizing the entity for AI crawlers: who clicroot is (bilingual SEO + AI-visibility consultancy, LatAm + US), the four services, contact `hello@clicroot.com`, primary URL, language coverage, and links to the blog posts and (once they exist) case-study pages. Keep it factual and current. This is an emerging convention several AI crawlers read.
- **Why:** The consultancy literally sells AI visibility. Shipping its own `llms.txt` is both a credibility proof point and a direct GEO lever: it hands AI engines a clean, structured description of the clicroot entity and its top content, improving the odds of being cited correctly.

### P1-10: Marketing claims have no verifiable substantiation (trust + comparative-claim risk)
- **File(s):** `src/i18n/es.json` (hero.badge "4.9 en satisfaccion", results.stats "284% / 12x / 47+ / 98%"), `src/pages/index.astro` (hardcoded `+312%`, `#1`, `12x`, `98%` in the hero metric cards, lines 67-101), `src/content/cases/*.json`, `src/content/testimonials/*.json`.
- **Issue:** The hero cards hardcode `+312%` traffic and `#1` rankings while `es.json` results.stats says `284%`: two different "average traffic" numbers on the same page. Testimonials use initials-only attribution (Maria C., Andrea L., Daniel P., James R.) with generic roles, which reads as invented and weakens E-E-A-T. None of the stats cite a source. The badge asserts "4.9" satisfaction with no rating basis.
- **Fix:** (a) Reconcile the conflicting traffic numbers to one figure sourced from real client data, or reframe as a range. (b) Where real named clients/permissions exist, use full names + company + ideally a photo (the constitution's portfolio lists Leal, Floowi, RMH, etc., several of which already appear in the `logos` array). (c) Only add `Review`/`AggregateRating` schema if the ratings are real and you can stand behind them. The hero badge claims "4.9" and there are 4 testimonials; that is not a defensible `aggregateRating ratingCount`. **Do not** manufacture an `AggregateRating` from 4 anonymized testimonials, it is a structured-data spam risk and a trust risk. (d) Avoid unqualified superlatives like `#1` without specifying the keyword/market.
- **Why:** Google's reviews-snippet and E-E-A-T guidance penalizes fabricated or self-serving rating markup, and AI engines increasingly cross-check claims against corroborating sources. For an SEO consultancy, getting caught with conflicting or unverifiable on-page stats is reputationally worse than for most businesses. This also intersects the Clicroot constitution's own rule 3 (no comparative claims without verifiable data), which the site should model.

---

## P2: polish

Refinements and hardening. Ship after P0 and P1.

### P2-1: Add compression / build hardening integration
- **File(s):** `astro.config.mjs`, `package.json`.
- **Fix:** Cloudflare Pages already gzips/brotlis HTML/CSS/JS at the edge, so a build-time compressor is mostly redundant; instead focus on minification (Astro minifies HTML by default in prod) and verify Cloudflare's Auto Minify and Brotli are on. Optionally add `astro-compress` only if you want pre-compressed assets. Document that the static build + Cloudflare edge already covers most transfer concerns.
- **Why:** Marginal transfer savings. Lower priority because the edge already handles the bulk. Listed for completeness so nobody adds a heavy redundant compressor.

### P2-2: Self-referencing hreflang completeness and `lang` on `<html>` for blog
- **File(s):** `src/layouts/Layout.astro` (line 14, `<html lang={lang}>` is correct), blog templates.
- **Fix:** After P0-3, double-check every page (home es, home en, each blog post in both languages) emits the full 3-link hreflang set (es, en, x-default) with absolute URLs and that each page includes a self-referential hreflang. Blog posts currently pass no `alternateUrl` at all (`src/pages/es/blog/[slug].astro` line 23-27 and the en equivalent omit it), so today blog posts emit only a self hreflang and a broken x-default. The P0-3 refactor must also be wired into the two blog templates, not just the homepages.
- **Why:** Incomplete or one-sided hreflang on the blog is the same class of bug as P0-3 and will mis-cluster the bilingual blog. Calling it out separately so the blog templates are not forgotten when the homepages get fixed.

### P2-3: Per-page titles are decent but could be more keyword-led
- **File(s):** `src/pages/index.astro` (line 35: `clicroot — Consultoria SEO`), `src/pages/en/index.astro` (line 35: `clicroot — SEO Consulting`), blog templates (`${post.data.title} — clicroot`).
- **Fix:** The title separator uses an em dash (`—`), which contradicts the Clicroot no-em-dash standard; switch to a pipe or colon, e.g. `clicroot | Consultoria SEO y Visibilidad en IA` (es) and `clicroot | SEO and AI Visibility Consulting` (en). Front-load the primary entity + service keywords rather than just "Consultoria SEO". Blog titles are fine but apply the same separator change. Descriptions are reused from `hero.description` on the homepages, which is acceptable.
- **Why:** Titles are the strongest on-page ranking and CTR lever. Adding "Visibilidad en IA / AI Visibility" to the homepage title aligns the title with the actual positioning (already in the meta description) and the em-dash swap keeps the public site consistent with the brand's own writing rules.

### P2-4: Single contrast / focus-visible accessibility pass
- **File(s):** `src/styles/global.css` (only one `:focus` rule exists, line 554, on form inputs; text-muted `#888` on cream, and many low-opacity whites on charcoal).
- **Fix:** (a) Add a visible global focus indicator for keyboard users: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }` and ensure nav links, lang toggle, buttons, and the theme toggle all show it (currently only form inputs have any focus styling, and it removes the outline). (b) Run a contrast check on `--text-muted: #888` on `--cream` (`#F5F4F0`) which is roughly 3.5:1 (fails WCAG AA 4.5:1 for body text; OK only for large text), and on the many `rgba(255,255,255,0.3-0.5)` labels on the charcoal hero/footer. Darken muted text or restrict it to large text only. (c) The `.section-label` mono text at `0.72rem` in accent green on cream should be checked too.
- **Why:** Keyboard focus visibility is WCAG 2.1 SC 2.4.7 and removing outlines on focus (as the form rule does) without a replacement is a direct failure. Low-contrast muted text fails SC 1.4.3. Accessibility is also a minor ranking and a real GEO/credibility factor for a consultancy site.

### P2-5: Heading order and landmark structure
- **File(s):** `src/pages/index.astro` / `en/index.astro` (one `<h1>` hero, multiple `<h2>` section titles, `<h3>` cards: order is good), blog templates (single `<h1>` then content `<h2>`s: good), `src/components/Nav.astro`.
- **Fix:** Heading hierarchy is actually clean (one h1 per page, logical h2/h3 nesting), so no major change. Minor: wrap the main page body in a `<main>` landmark (currently sections sit directly in `<body>` via the slot) and give the `<nav>` an `aria-label`. Add a visually-hidden "skip to content" link as the first focusable element. The decorative inline SVG sprite in `Nav.astro` (lines 11-26) is `display:none` (fine) but the many decorative `<use>` icons throughout should have `aria-hidden="true"` where they are purely decorative, and the testimonial star ratings should expose an accessible name (e.g. `role="img" aria-label="5 de 5"`).
- **Why:** Landmarks and a skip link are baseline screen-reader ergonomics; decorative-icon hiding reduces SR noise. These are polish because the core heading structure is already correct, which is the part search engines and AI parsers care about most.

### P2-6: Blog content is thin and lacks GEO-friendly structure (definitions, Q&A, dates, author)
- **File(s):** `src/content/blog/**/*.md` (e.g. `es/seo-latinoamerica.md` is ~250 words), `src/content/config.ts`.
- **Fix:** Over time, expand posts toward citation-worthy depth: add a one-sentence definition/answer near the top of each post (the "answer-first" pattern AI engines extract), use descriptive `<h2>`/`<h3>` question-style subheads, include concrete stats with sources, and add visible author + published/updated dates on the page (the data exists in frontmatter `date` but there is no author field and no `updated`). Extend the schema (`config.ts`) with `author` and `updated`, surface both in the template, and consider an `FAQPage` block on posts that naturally Q&A. Keep Spanish-first with correct tildes.
- **Why:** GEO citation favors content that directly answers a question in extractable, well-structured prose with clear authorship and freshness signals. The current posts are short and undated-on-page, which limits both ranking and the chance of being quoted by an AI engine, the consultancy's core value proposition.

### P2-7: Remove the stale `config.yml.bak` from the deployed `public/`
- **File(s):** `public/admin/config.yml.bak`.
- **Fix:** Delete `public/admin/config.yml.bak` (it ships to production as a publicly fetchable file at `/admin/config.yml.bak`). Keep only `config.yml`. Confirm the Decap config does not expose the backend repo details unnecessarily.
- **Why:** Stale `.bak` files in `public/` are served publicly, leak configuration history, and are crawl noise. The `/admin` is noindexed but the `.bak` is still directly fetchable. Trivial cleanup, minor information-hygiene win.

### P2-8: Theme is hardcoded `light` server-side; brief flash + canonical content unaffected (no SEO impact, note only)
- **File(s):** `src/layouts/Layout.astro` (line 14, `data-theme="light"` hardcoded; theme JS runs after paint at lines 57-67).
- **Fix:** The theme toggle reads `localStorage`/`prefers-color-scheme` in a script at the end of `<body>`, which can cause a flash of the wrong theme (FOUC) for dark-mode-preferring users. Move that small theme-init script into the `<head>` as a blocking inline script so the correct `data-theme` is set before first paint. No SEO consequence (content is identical in both themes), purely UX polish.
- **Why:** FOUC is a perceived-quality issue for a site selling technical excellence. Listed as P2 because it has zero indexability or content impact, only a visual flash.

---

## Quick-win sequencing

1. **One PR for P0-1, P0-2, P0-6, P0-7** (sitemap + robots + OG image + OG/Twitter meta): pure additions, no refactor, unblocks crawling and sharing.
2. **One PR for P0-3, P0-4, P0-5, P2-2** (the hreflang/canonical refactor across `Layout.astro` + both homepages + both blog templates): this is the correctness core, keep it isolated and verify the built HTML.
3. **One PR for P1-1, P1-2, P1-9** (structured data graph + blog Article/Breadcrumb schema + llms.txt): the GEO/entity layer.
4. **One PR for P1-3, P1-7, P1-8** (fonts + reduced-motion + no-JS reveal): the CWV/accessibility/resilience cluster.
5. Then P1-5, P1-6, P1-10 (internal linking, real social links, claim substantiation) and the P2 polish as capacity allows.

Verify after each PR: `npm run build` succeeds, then inspect the built `dist/` HTML for `/`, `/en/`, and `/es/blog/seo-latinoamerica/` to confirm canonical, hreflang (3 absolute links each), OG/Twitter tags, and JSON-LD render exactly as intended. Submit the sitemap in GSC once live.
