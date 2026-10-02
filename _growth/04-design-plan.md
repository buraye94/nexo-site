# Clicroot.com design plan (Phase 2, reviewed)

Owner: Felipe / JC. Reviewed 2026-10-02 with /plan-design-review, reference site userp.io. This replaces the Phase 2 paragraph in 00-PLAN.md ("recolor + retype the homepage to the 2.0 tokens"), which treated the redesign as a token swap. Build on a branch, hold for Felipe's review before any prod deploy (working agreement in 00-PLAN.md).

## Direction (Step 0 decisions)

- **D1, look:** keep the Clicroot 2.0 visual system (warm-black, paper chapters, olive signal, Outfit / Plus Jakarta Sans / JetBrains Mono). Borrow uSERP's structure, proof density and conversion path, not its look.
- **D2, proof:** phased. Now: verifiable anonymized proof, meaning real numbers with source and window, labeled by industry + market instead of client names, and real artifacts with domains blurred. Later: the same slots upgrade in place to named logos, cases and quotes as clients grant permission.
- **D3, scope:** homepage plus the shared template used by the 24 service and city pages (12 ES + 12 EN). D24 and D25 later added the blog index and the post template to this release.
- **D4, homepage hero:** a live client results dashboard (name and domain masked) as the hero proof, followed by a before/after leads chart across anonymized clients.

Initial impression of the live site: 3/10 for design completeness. No real imagery, three icon-card grids, inconsistent and unverifiable stats (+312% in the hero vs 284% in the band, 98% retention, "4.9 satisfacción", "#1", 12x, 47+), a traffic-led H1, 38 elements hidden at opacity 0 until JS runs on scroll, overlapping hero stat cards, initials testimonials, and landing pages with zero proof.

## Information architecture

### Homepage, 7 blocks (D5)

Proof before the ask, one job per block.

```
  [Offer bar]  Diagnóstico gratis de cómo te ven ChatGPT, Gemini y Google ... [Pedir diagnóstico →] [×]
  [Nav]        clicroot   Servicios ▾  Ciudades ▾  Resultados  Blog        ES · EN  [Agenda una llamada]
  ┌────────────────────────────────────────────────────────────────────────────┐
1 │ HERO        kicker: Consultoría SEO y GEO · Colombia y México               │
  │             H1 + one sentence + [Agenda una llamada] [Ver resultados ↓]     │
  │             trust line            |  masked dashboard screenshot + caption  │
  ├────────────────────────────────────────────────────────────────────────────┤
2 │ RESULTADOS  "Leads desde búsqueda, antes y después." 5 client rows,         │
  │  #resultados before bar (muted) + after bar (olive), 14 → 43 leads/mes,     │
  │             +207% · 9 meses, source line                                    │
  ├──────────────────────────── paper ─────────────────────────────────────────┤
3 │ EN QUÉ TE AYUDAMOS  3 numbered rows, each links to its page:                │
  │             Consultoría SEO · Visibilidad en IA (GEO) · Auditoría SEO       │
  ├────────────────────────────────────────────────────────────────────────────┤
4 │ CÓMO TRABAJAMOS  4 steps, each with a real artifact screenshot (masked):    │
  │             Diagnóstico (sem 2) · Estrategia (sem 3) · Ejecución · Medición │
  ├────────────────────────────────────────────────────────────────────────────┤
5 │ LA PRIMERA LLAMADA  #contacto                                               │
  │   left: H2, "Quién te atiende" (D10), what the call covers (4 items)       │
  │   right: 2-step form (D8)                                                   │
  ├──────────────────────────── paper ─────────────────────────────────────────┤
6 │ FAQ          collapsed questions, FAQ schema kept                           │
  ├────────────────────────────────────────────────────────────────────────────┤
7 │ FOOTER       hello@clicroot.com · Servicios · Ciudades · Blog · ES / EN     │
  └────────────────────────────────────────────────────────────────────────────┘
```

Cut from today's page: the stats band (replaced by block 2), the initials testimonial carousel, the old cases block and the blog teaser. Per D2, block 2 reserves room for one named quote and stays quote-less until a client grants one (no anonymous initials).

If we could only show three things: the dashboard, the before/after rows, the form.

### Landing template for the 24 service and city pages (D6)

```
  Offer bar · Nav
  Breadcrumb (Inicio / Servicios / Consultoría SEO) + BreadcrumbList schema
  HERO   kicker (service · market) · H1 · one sentence · [Agenda una llamada] [Qué incluye]
         trust line (Respuesta en un día hábil · Sin permanencias forzadas, D20)
         | proof card: before/after rows filtered to clients of this service or city
  QUÉ INCLUYE (paper)  4 numbered rows: title · one line · "Entregable: X · semana N"
  LA PRIMERA LLAMADA   Quién te atiende · what the call covers · the form on this page
  FAQ (paper)          page-specific questions, FAQ schema
  TAMBIÉN TE PUEDE SERVIR  4-6 related pages (service ↔ city), plain links
```

No CTA links to `/#contact` anymore. Every page converts where the visitor landed.

### Navigation (D7, with D24)

- Desktop: `Servicios ▾` (Consultoría SEO, Auditoría SEO, SEO técnico, SEO local, Link building, Visibilidad en IA / GEO), `Ciudades ▾` (Bogotá, Medellín, Ciudad de México, Monterrey, Guadalajara), `Resultados` (anchor to block 2 on the homepage), `Blog` (the new index, D24), language switch, CTA.
- Menus are buttons with `aria-expanded`, open on click or Enter, close on Esc or click outside, and are reachable by Tab.
- Phone: a "Menú" button opens a full-screen sheet with both groups listed open (no nested accordions), then Resultados, Blog, language, CTA.
- The sun/moon theme toggle is removed (D16).

### Blog index (D24) and post template (D25)

- `/es/blog/` and `/en/blog/` index, built to the reading rules: no hero, no CTA theater, no cards. One reading column of editorial rows: title, date, one-line summary, reading time. Newest first. Paper surface.
- Post template (`[slug].astro`, ES + EN): a 65 to 75 character measure, more space above headings than below, tabular numbers in data, and a closing block that links to the related service page plus the first-call form. Author line without personal names (consistent with 473c740): "Equipo Clicroot".

## Interaction states

| Feature | Loading | Empty | Error | Success | Partial |
|---|---|---|---|---|---|
| Contact form, step 1 (site + work email) (D8) | n/a | Visible labels above each field, nothing pre-filled | On leaving a field: inline message under it in plain words ("Revisa el correo: le falta el dominio"), field border in terracotta, focus stays usable | "Siguiente" moves to step 2, progress bar fills 2 of 2 | Leaving at step 1 sends nothing |
| Contact form, step 2 (name, need chips, optional message) | Button reads "Enviando…", disabled, form stays visible, short note "toma unos segundos" | Message is optional; server stops requiring it (`functions/api/contact.js`) | Banner: "No pudimos enviar tu mensaje. Tus datos siguen aquí: inténtalo de nuevo, o escríbenos directo a hello@clicroot.com." Nothing typed is cleared. Announced via `role="alert"` | Panel replaces the form (`role="status"`): "Listo, {nombre}. Te escribe un consultor senior desde hello@clicroot.com en un día hábil, con dos o tres horarios para la llamada." | "← Volver al paso 1" keeps step 1 values |
| Offer bar → diagnosis (D9, D22) | n/a | Shows on every page including blog posts | n/a | Click opens the D8 form with "Diagnóstico IA" preselected. Confirmation adds: "en ese correo te confirmamos la fecha de entrega" (no unverified delivery promise) | Closed with × (44px target): hidden for the rest of the visit (sessionStorage), back next visit |
| Hero dashboard (D4, D2) | Static image with width/height set, no layout shift | n/a | If the image fails, the figcaption and the text list of the three KPIs still read correctly | Caption: "Captura real del tablero de un cliente · nombre y dominio ocultos · datos a {mes año}" | n/a |
| Before/after rows (D12, D14) | Fully drawn without JS | Fewer than 3 verified clients: the block shows the ones we have, never padded with illustrative rows | n/a | Bars draw once on first scroll into view, from a visible state | n/a |
| Nav menus (D7) | n/a | n/a | n/a | Open on click/Enter, close on Esc / outside click | n/a |
| Second hero CTA (D19) | n/a | n/a | n/a | "Ver resultados ↓" scrolls to `#resultados` | n/a |

## User journey

| Step | User does | User feels | Plan specifies |
|---|---|---|---|
| 1 | Lands from Google or an AI answer | Skeptical: "another agency" | H1 in clients and leads (D11), masked real dashboard (D4) |
| 2 | Scans the numbers | "Is this real?" | Absolutes, window and source on every number (D2, D12) |
| 3 | Reads what we do | "Do they do my thing?" | Numbered services linking to their pages (D5, D7) |
| 4 | Looks for who they'd work with | "Who is behind this?" | "Quién te atiende" in the first-call block (D10) |
| 5 | Sees how it works | "What happens after I sign?" | 4 steps with real artifacts and timing (D5) |
| 6 | Opens the form | Wary of a sales chase | What the call covers, 2-step form, small first ask (D8) |
| 7 | Submits | Expectant | Confirmation with who writes, from where, by when (D8, D20) |
| 8 | Months later | "They showed me the numbers" | Site, decks and reports share one visual language (D1, D15) |

Time horizons: 5 seconds = H1 + dashboard; 5 minutes = before/after rows, services, first-call list; long term = the monthly report looks like the site that sold it.

## Visual specifics

**Classifier:** PERSUADE (homepage and landings), with the hero dashboard as a product artifact. The blog index and posts are READ.

**Headlines and copy (D11).** No "X, no Y" antithesis anywhere. Every line goes through text-polish and `quality_gate.py --spanish` before build.
- Home H1: "SEO que trae clientes, y te muestra cuántos."
- Consultoría SEO H1: "Consultoría SEO senior: quien diseña tu estrategia es quien la ejecuta." Other landings follow the same voice: service + the concrete promise, no contrast construction.
- Form note: "Te responde un consultor senior en un día hábil." Trust bullet: "Un consultor senior en tu cuenta."
- Lead sentence keeps the demand-capture doctrine: "Capturamos la demanda que ya existe para lo que vendes, en Google y en las respuestas de IA."

**Before/after chart (D12).** Per client: muted "before" bar (`before` token) above an olive "after" bar, label "14 → 43 leads/mes", secondary mono "+207% · 9 meses", legend "Antes de empezar / Hoy", source line under the chart. Bars share one scale per chart. The `%` is never shown without the base.

**Kickers (D13).** One mono kicker, in the hero (category + market). Section kickers that repeat their heading are removed. Mono is reserved for data: source lines, windows, deliverable/timing lines, dashboard labels, step labels.

**Motion (D14).** One authored moment: the before/after bars draw once when they enter the viewport, ease-out, about 600ms, from a fully drawn no-JS default. Everything else is static and visible on load. The typing effect and the 38 opacity-0 reveals are removed. `prefers-reduced-motion`: no animation.

**People (D10).** "Quién te atiende" sits inside the first-call block: a real team or working-session photo (never stock, no names) and two lines of fact (senior consultant, the same person who works the account, markets CO + MX). Every seniority claim must be backed (rule 3).

**Litmus (after fixes):** brand unmistakable in first screen YES (2.0 palette, logo, our dashboard); one strong visual anchor YES (dashboard); understandable from headlines alone YES; one job per section YES (D5); cards necessary YES only where the card is the artifact or the interaction (dashboard, form); motion improves hierarchy YES (D14); premium without shadows YES.

**Hard rejections:** none open. "No cards in hero" is satisfied only because the dashboard is a real screenshot (D2). A recreated KPI-tile mosaic would violate it.

## Design system (D15, D16)

Create `DESIGN.md` at the repo root (open DESIGN.md format, YAML front matter) as the single source; `global.css` reads from it. Contents:

- **Colors:** `ink #16150F`, `ink2 #1E1D16`, `paper #F2EEE3`, `paper2 #E9E4D6`, `olive #AFC178` (signal on dark), `olive-deep #6B7C4E` (large type and non-text on paper), `olive-text #5C6B42` (small text on paper, 4.98:1), `muted-dark #A8A390` (on ink, 7.23:1), `muted-paper #5E5A4C` (on paper, 5.95:1), `before #5B5848` (chart), `terracotta #C58A5B` (errors and rare alarms, on ink only; 2.53:1 on paper, so never as text there).
- **Retired:** `--gold`, `--gold-subtle`, `--accent-glow`, `--hero-grad-1..4`, `--radius-xl` (3rem), `--radius-lg` (2rem). Radius scale: 6 / 10 / 12 / 16px.
- **Type:** Outfit 800 display (H1 58px desktop / 38px phone, H2 36 / 28), Plus Jakarta Sans body 16-18px, JetBrains Mono 11-12px for data only. Tabular numbers on all figures.
- **Browser surfaces:** selection olive on ink; focus ring 2px olive (olive-text on paper), offset 3px; underline offset 4px; caret olive.
- **Components:** offer bar, nav with two menus, phone menu sheet, hero + dashboard figure, before/after chart, service rows, artifact steps, first-call block with "Quién te atiende", 2-step form with states, FAQ (details/summary), related links, breadcrumb, sticky phone CTA, blog index row, post closing block.
- **Rhythm (D16):** one designed rhythm, no theme toggle. Dark for the hero, proof and first call; paper for reading sections (services, "Qué incluye", FAQ, blog). Remove the `[data-theme]` patches in `global.css`.

The deck and doc templates keep `#6B7C4E` as the brand accent. The site adds `olive-text` for small text only, so the upload guard's brand signal is unaffected.

## Responsive and accessibility (D17, D18)

**Phone (≤720px):**
- Offer bar is one line, "Diagnóstico IA gratis →", plus a × target.
- The nav becomes logo + "Menú".
- H1 at 38px, about 3 lines; both CTAs full-width.
- The dashboard drops its browser frame: 3 KPIs as a compact row, then the 3 query rows.
- Chart rows: label and absolutes on one line, bars full-width below.
- Services, steps and the first-call block go to a single column, with artifact thumbnails at 16:7.
- A sticky bottom "Agenda una llamada" sits above the safe area.
- 16px gutters. No horizontal scroll (`scrollWidth == clientWidth`).

**Tablet (721-1024px):** the hero stacks (copy, then the framed dashboard full-width); steps run in 2 columns.

**Accessibility baseline (WCAG 2.2 AA):**
- Skip link and landmarks (`header`, `nav` labeled, `main`, `footer`).
- Body text 16px minimum; contrast 4.5:1 for small text using the tokens above.
- 44px minimum touch targets, including the offer bar button and ×.
- Themed focus ring on every interactive element.
- Menus with `aria-expanded` and Esc.
- Form errors linked with `aria-describedby` and announced; visible labels (no placeholder-as-label).
- The chart's bars are `aria-hidden`, and the numbers live in text. The dashboard image has alt text naming the three KPIs, and the KPIs also appear in the caption or a visually hidden list (also lets AI crawlers quote them).
- Visited links in body copy get a distinct color.
- A `lang` attribute on every page.

## Unresolved decisions (Pass 7, all answered)

| Decision | Answer |
|---|---|
| D19: where "Ver un tablero real" goes | Renamed "Ver resultados ↓", anchors to `#resultados` |
| D20: what we promise | "Respuesta en un día hábil" and "Sin permanencias forzadas" (Felipe confirmed both are true) |
| D21: English pages | Same release, ES + EN. EN copy written, not machine-translated |
| D22: offer bar presence | All pages, closable per visit |

## NOT in scope

- Self-serve AI-visibility diagnostic tool (D9 option B): every scan costs Bright Data credits, so it's its own project.
- A public `/resultados` page with a full masked dashboard (D19 option B).
- Named logos, case studies and quotes: phase 2 of D2, when clients grant permission.
- Light mode (D16).
- New brand exploration via /design-consultation (D1 and D15 keep 2.0).
- Phase 1 technical SEO items in 00-PLAN.md (sitemap, robots, llms.txt, hreflang, schema graph). The reveal fix moved here as D14.
- Contact endpoint hardening (HTML escaping, honeypot, limits): a separate task already queued.
- Small olive text contrast in decks and Docs (cross-portfolio, outside this repo).

## What already exists (reuse, don't rebuild)

- 2.0 tokens in `src/styles/global.css` and the brand-extension spec in `_growth/03-design-audit.md`.
- `src/components/Nav.astro`, `src/components/Footer.astro`, `src/layouts/Layout.astro` (JSON-LD, current form handler), `src/i18n/utils.ts` with `es.json` / `en.json`.
- `functions/api/contact.js` (Resend to hello@clicroot.com). Reuse it, and make `message` optional.
- FAQ content and `faqSchema` on the homepage and every landing. Move them into the template.
- Copy and FAQs of the 24 landing pages, to migrate into the new template.
- Content collections: `src/content/cases` (3 entries) becomes the single source for proof rows, with new fields (industry, market, before, after, window_months, source, client_ok). `src/content/testimonials` (4 entries) stops rendering after D5. Delete it only after Felipe confirms whether any are real, permitted quotes.
- `src/pages/es/index.astro` already redirects to `/`. Keep it.
- ai.clicroot.com, the client dashboard, is the source of the masked hero screenshot and the step artifacts.
- Approved mockups (below).

## Implementation tasks

Synthesized from this review's findings. Each task derives from a specific decision above. Run with Claude Code, and check each box as it ships.

- [ ] **T1 (P1, human: ~4h / CC: ~30min)**: Design system: write DESIGN.md and clean the tokens
  - Surfaced by: Pass 5, D15 (no single source, drift tokens), D18 (contrast tokens)
  - Files: `DESIGN.md`, `src/styles/global.css`
  - Verify: `grep -E "gold|accent-glow|hero-grad|radius-xl" src/styles/global.css` returns nothing; the contrast script shows every small-text pair ≥ 4.5:1
- [ ] **T2 (P1, human: ~3h / CC: ~20min)**: Motion: remove the hidden-content reveal and the typing effect; one drawing moment
  - Surfaced by: Pass 4, D14 (38 elements at opacity 0 before JS/scroll)
  - Files: `src/layouts/Layout.astro`, `src/styles/global.css`, new `src/components/BeforeAfter.astro`
  - Verify: `$B js` count of elements with computed opacity 0 on load = 0; with JS disabled all content and fully drawn bars show; reduced-motion shows no animation
- [ ] **T3 (P1, human: ~4h / CC: ~30min)**: Nav: Servicios and Ciudades menus, Resultados, Blog; remove the theme toggle
  - Surfaced by: Pass 1, D7 + D24 (anchor nav with dead links); Pass 5, D16
  - Files: `src/components/Nav.astro`, `src/i18n/es.json`, `src/i18n/en.json`, `src/styles/global.css`
  - Verify: keyboard-only pass (Tab, Enter, Esc); no `#cases` or `#blog` anchors remain; phone sheet at 390px
- [ ] **T4 (P1, human: ~2h / CC: ~15min)**: Offer bar on every page, closable, opens the form with the diagnosis preselected
  - Surfaced by: Pass 2, D9 + D22
  - Files: new `src/components/OfferBar.astro`, `src/layouts/Layout.astro`
  - Verify: closing it hides it for the visit and it returns in a new session; the click preselects "Diagnóstico IA"; 44px targets
- [ ] **T5 (P1, human: ~5h / CC: ~40min)**: Contact form: 2 steps, all states, optional message on the server
  - Surfaced by: Pass 2, D8 (placeholder labels, silent reset, unexplained error, required-message mismatch)
  - Files: new `src/components/ContactForm.astro`, `src/layouts/Layout.astro` (remove old handler), `functions/api/contact.js`
  - Verify: screenshots of the 5 states match `states-1680.png`; submitting without a message returns 200; error keeps typed values
- [ ] **T6 (P1, human: ~1.5d / CC: ~2h)**: Homepage rebuilt as the 7-block spine, ES and EN
  - Surfaced by: Pass 1, D5; Pass 3, D10; Pass 4, D11-D13; Pass 7, D19, D21
  - Files: `src/pages/index.astro`, `src/pages/en/index.astro`, new components (DashboardFigure, ServiceRows, ArtifactSteps, FirstCall, Faq)
  - Verify: side by side with `home-1440.png` and `home-390.png`; FAQ schema still valid; `astro build` clean
- [ ] **T7 (P1, human: ~2d / CC: ~3h)**: Landing template component, then migrate the 12 ES + 12 EN pages
  - Surfaced by: Pass 1, D6 (no proof, `/#contact` bounce, icon grid)
  - Files: new `src/layouts/LandingPage.astro`; the 24 files under `src/pages/` and `src/pages/en/`
  - Verify: `grep -rn "/#contact" src/pages` returns nothing; every page has breadcrumb + BreadcrumbList schema, a proof card, the form on the page, and related links; compare with `landing-1440.png` / `landing-390.png`
- [ ] **T8 (P1, human: ~4h + Felipe input / CC: ~30min)**: Proof data: verified numbers only, from one source
  - Surfaced by: Step 0 + D2 + D12 (+312% vs 284%, 98%, 4.9, #1, 12x, 47+ unverifiable)
  - Files: `src/content/config.ts`, `src/content/cases/*.json`, the components that read them
  - Verify: `grep -rnE "312|284|98%|4\.9|#1|12x|47\+" src` returns nothing; every proof entry has before, after, window, source and client_ok=true. Needs Felipe: which clients, their GA4/CRM before/after numbers, and their OK for anonymized use
- [ ] **T9 (P1, human: ~2h + Felipe input / CC: ~15min)**: Hero dashboard and step artifacts: real masked screenshots
  - Surfaced by: D2 + D4 (and the Pass 4 note that a recreated tile mosaic breaks "no cards in hero")
  - Files: `public/img/` (webp, width/height set), `DashboardFigure` and `ArtifactSteps`
  - Verify: no client name or domain readable at 2x zoom; alt text and the text KPI list match the image. Needs Felipe: pick the client and approve the masking
- [ ] **T10 (P2, human: ~4h / CC: ~30min)**: Copy pass: D11 rewrites, landing H1s in the same voice, EN copy written
  - Surfaced by: Pass 4, D11; Pass 7, D21
  - Files: page files and `src/i18n/*.json`
  - Verify: text-polish applied; `python3 knowledge/quality_gate.py <copy> --public-content --spanish` exits 0 (run from the consulting repo); no "no X" antithesis in any H1, button or note; no em dashes
- [ ] **T11 (P2, human: ~1h / CC: ~10min)**: Kickers: keep the hero kicker, move mono to data only
  - Surfaced by: Pass 4, D13
  - Files: page and component markup, `src/styles/global.css`
  - Verify: one `.mono` kicker per page, in the hero
- [ ] **T12 (P2, human: ~4h / CC: ~30min)**: Accessibility baseline
  - Surfaced by: Pass 6, D18
  - Files: `src/layouts/Layout.astro`, components, `src/styles/global.css`
  - Verify: `$B ux-audit` and a keyboard-only walkthrough; touch targets ≥ 44px; chart and dashboard numbers present as text
- [ ] **T13 (P2, human: ~4h / CC: ~30min)**: Phone and tablet layouts plus the sticky CTA
  - Surfaced by: Pass 6, D17 (390px render broke: wrapped offer bar, nav overflow, dashboard off-screen)
  - Files: component CSS, `src/styles/global.css`
  - Verify: `$B responsive` at 390 / 768 / 1440; `document.documentElement.scrollWidth === clientWidth` at each width
- [ ] **T14 (P2, human: ~3h / CC: ~20min)**: Blog index for ES and EN
  - Surfaced by: D7 + D24
  - Files: new `src/pages/es/blog/index.astro`, `src/pages/en/blog/index.astro`
  - Verify: lists every post newest first; reading rules (one column, no cards, no hero); linked from nav and footer
- [ ] **T15 (P2, human: ~4h / CC: ~30min)**: Post template: reading layout and closing block
  - Surfaced by: D25
  - Files: `src/pages/es/blog/[slug].astro`, `src/pages/en/blog/[slug].astro`
  - Verify: measure 65-75ch; closing block links to the related service page and the form; author line without personal names
- [ ] **T16 (P2, human: ~1h + Felipe input / CC: ~10min)**: "Quién te atiende": real photo and backed facts
  - Surfaced by: Pass 3, D10
  - Files: `FirstCall` component, `public/img/`
  - Verify: photo is real (not stock); every claim backed. Needs Felipe: photo and the two lines of fact

After implementation: run /design-review on the branch for visual QA before Felipe reviews and deploys.

## Approved mockups

| Screen/Section | Mockup path | Direction | Notes |
|---|---|---|---|
| Homepage (as approved in D4) | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/homepage-variants-20261002/variant-B.png | Live client dashboard hero + before/after chart | Superseded in detail by the v2 render below (D7, D11-D13, D19, D22) |
| Landing template (pre-review) | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/landing-template-20261002/landing-B.png | Derived from B | Superseded by the v2 render below |
| Homepage v2, desktop | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/reviewed-v2-20261002/home-1440.png | 7-block spine with all review decisions | Build reference. Numbers are illustrative until T8 |
| Homepage v2, phone | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/reviewed-v2-20261002/home-390.png (+ home-390-fold.png) | D17 phone layout | Sticky CTA hidden in the stitched render, visible in the fold render |
| Landing v2, desktop | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/reviewed-v2-20261002/landing-1440.png | D6 template, Consultoría SEO as the example | Proof card filters to the page's service or city |
| Landing v2, phone | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/reviewed-v2-20261002/landing-390.png (+ landing-390-fold.png) | D17 | |
| Form states | /Users/felipegallo/.gstack/projects/buraye94-nexo-site/designs/reviewed-v2-20261002/states-1680.png | D8, D9, D20 | Source HTML for all v2 renders sits in the same folder |

## Completion summary

```
  +====================================================================+
  |         DESIGN PLAN REVIEW: COMPLETION SUMMARY                    |
  +====================================================================+
  | System Audit         | no DESIGN.md; Astro 5, home + 24 landings   |
  | Step 0               | 3/10; proof, IA, slop, motion, mobile       |
  | Pass 1  (Info Arch)  | 3/10 → 9/10 after fixes                     |
  | Pass 2  (States)     | 1/10 → 9/10 after fixes                     |
  | Pass 3  (Journey)    | 2/10 → 9/10 after fixes                     |
  | Pass 4  (AI Slop)    | 4/10 → 9/10 after fixes                     |
  | Pass 5  (Design Sys) | 3/10 → 9/10 after fixes                     |
  | Pass 6  (Responsive) | 1/10 → 9/10 after fixes                     |
  | Pass 7  (Decisions)  | 4 resolved, 0 deferred                      |
  +--------------------------------------------------------------------+
  | NOT in scope         | written (8 items)                           |
  | What already exists  | written                                     |
  | TODOS.md updates     | 2 proposed, both moved into this release    |
  | Approved Mockups     | 3 generated (A/B/C), 1 approved; v2 renders |
  | Decisions made       | 20 added to plan (D5-D22, D24, D25)         |
  | Decisions deferred   | 0                                           |
  | Overall design score | 1/10 → 9/10                                 |
  +====================================================================+
```

Why each pass stops at 9: the remaining gap in every pass is real material, not a missing decision. The verified proof numbers and client OKs (T8), the masked dashboard and artifact screenshots (T9), and the team photo and facts (T16) have to come from Felipe. The blog index (P1) and the tablet layout (P6) are specified but not rendered.

Inputs Felipe owes before launch: proof clients and their before/after numbers with OK (T8), the dashboard client and masking approval (T9), team photo and facts (T16), and whether the 4 entries in `src/content/testimonials` are real permitted quotes.

## Unresolved decisions

None. Every finding got an individual decision (D5 to D22, D24, D25). The open items above are factual inputs, tracked as T8, T9 and T16.

## Engineering review (plan-eng-review, 2026-10-02)

Target: `~/nexo-site/_growth/04-design-plan.md` (this file), reviewed against the current code at nexo-site `dd9d324`. Report file: this file.

### Scope record

feature answers: no feature cuts proposed (design scope D3, D24, D25 kept); structure: B (Smaller arrangement), answer D2 2026-10-02; accepted scope: all 16 design tasks, built with 7 components (OfferBar, ContactForm with states, Proof, NumberedRows, FirstCall, Faq, LandingPage layout), homepage dashboard figure inline; pending remedies: S1 (unique page content), S2 (Qué incluye copy for 23 pages), S3 (footer and blog breadcrumb links), S4 (hreflang to missing ES post), S5 (empty proof on landings), S6 (release strategy).

## Decision ledger

### R1: preserve each landing's unique content through the migration (regression contract)
Finding: S1, P1, confidence 9/10, `src/pages/consultoria-seo.astro:85` ("¿Qué es una consultoría SEO?"), `src/pages/agencia-seo-bogota.astro:85` ("Por qué Bogotá"), `src/pages/geo-posicionamiento-en-ia.astro:88-150` (4 unique sections); reviewer: plan-eng-review (Claude, main)
Plan baseline: D6 template (breadcrumb, hero, proof card, Qué incluye, first call, FAQ, related links) has no place for page-specific sections; T7 says "migrate the 24 pages" with no content rule
Runtime evidence: every landing has at least one unique H2 section (Definición x10, Por qué <ciudad>, Cobertura x3, Qué revisamos x2, Dónde encaja x2, SEO frente a GEO, Cómo funcionan, El método); title, description, alternateUrl and BreadcrumbList/Service/FAQPage schema are hardcoded per file
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R1 behavior: unique sections | dropped by D6 (pending) | kept: LandingPage default slot between hero and Qué incluye; copy carried over (text-polish edits only) | same as A |
| R1 intentional changes | none specified | replaced on purpose: icon services grid → Qué incluye rows; "Quién lo hace" → Quién te atiende; bottom CTA band → first-call block | same as A |
| R1 acceptance assertions | none | per page: same title, description, canonical, hreflang pair, FAQ count, schema types; every unique H2 present | same as A |
| R1 proof depth | none | build-time inventory script diffs dist/ before vs after for all 24 pages, run before merge | manual spot-check of 4 pages (one per page family) |
Question D3:
D3: How do we guarantee the 24 pages keep their unique ranking content through the migration?

nexo-site main. Every landing has text no template provides: consultoria-seo.astro:85 defines "consultoría SEO", agencia-seo-bogota.astro:85 explains "Por qué Bogotá", and the GEO page (geo-posicionamiento-en-ia.astro:88-150) has four unique sections. Those definitions are what Google and AI engines quote. The D6 template has no slot for them, so a straight migration deletes them.

Stakes: losing the definitional sections is a silent SEO and GEO regression on the exact pages meant to rank; nobody would notice until rankings drop weeks later.

Recommendation: A, because a 24-page manual check is where things slip, and a script that compares the built pages before and after costs minutes with Claude and catches every dropped section.

Completeness: A=10/10, B=6/10.

Both options keep the same contract: the LandingPage layout gets a slot for page-specific sections between the hero and Qué incluye; the unique copy moves over (text-polish edits only); on purpose we replace the icon grid with Qué incluye rows, "Quién lo hace" with Quién te atiende, and the bottom CTA band with the first-call block; every page keeps its title, description, canonical, hreflang pair, FAQ count and schema types.
Header: Page content
Options:
A) A: Slot + inventory script (Recommended)
The contract above, proven by a small build script that extracts title, description, canonical, hreflang, H2 list, FAQ count and schema types from dist/ for all 24 pages before and after, and fails on any drop. Human ~4h / CC ~20min; runs before merge; reusable for later page work.
B) B: Slot + spot-check
The same contract, verified by hand on 4 pages (one service, one city, the GEO pillar, the services hub). Human ~1h / CC ~5min, but 20 pages go unchecked and a dropped section ships silently.

State: approved
Actual answer: A) A: Slot + inventory script (Recommended), answer to D3, 2026-10-02
Accepted scope: LandingPage layout gets a default slot between the hero and Qué incluye for page-specific sections; every existing unique section's copy moves over (text-polish edits only); intentional replacements are the icon services grid → Qué incluye rows, "Quién lo hace" → Quién te atiende, bottom CTA band → first-call block; every page keeps title, description, canonical, hreflang pair, FAQ count and schema types; a build-time inventory script extracts those fields plus the H2 list from dist/ for all 24 pages before and after and fails on any drop; it runs before merge.
History: none

### R2: where the "Qué incluye" rows come from for the other 23 pages
Finding: S2, P1, confidence 9/10, design plan "Landing template" block (`QUÉ INCLUYE (paper) 4 numbered rows: title · one line · "Entregable: X · semana N"`) and mockup `landing.html` (written only for Consultoría SEO); current pages use a generic 6-card services grid (`src/pages/consultoria-seo.astro:10-17`); reviewer: plan-eng-review (Claude, main)
Plan baseline: D6 requires 4 deliverable rows with timing on every landing; no task authors that copy (T10 covers H1s only)
Runtime evidence: the 6-card services copy is near-identical across service and city pages; no deliverable/timing copy exists outside the mockup
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R2 source of rows | none for 23 pages (pending) | one set per service family (7 sets: consultoría, auditoría, SEO técnico, SEO local, link building, GEO, servicios hub); the 5 city pages reuse the consultoría set; ES + EN in one data file read by the layout | one hand-written set per page (12 per language), inline in each page |
| R2 copy QA | n/a | text-polish + quality_gate on 7 sets x 2 languages | text-polish + quality_gate on 12 sets x 2 languages |
| R2 timing claims ("semana 2") | only in mockup | Felipe confirms the real timing per set before build (rule 3) | Felipe confirms per page |
| New task | none | add T17: author and confirm the 7 sets | add T17: author and confirm 12 sets |
Question D4:
D4: Who writes the "Qué incluye" deliverables for the 23 pages that don't have them yet?

nexo-site main. D6 promised every landing a "Qué incluye" block: 4 numbered rows, each with a deliverable and its timing ("Entregable: auditoría priorizada · semana 2"). Only Consultoría SEO has that copy, in the mockup. The other pages today show the same generic 6-card grid (consultoria-seo.astro:10-17), and no task covers writing the new rows.

Stakes: without this, the build either ships empty blocks or someone improvises timing promises on 23 pages, and a wrong "semana 2" is a promise to a client.

Recommendation: A, because a service has the same deliverables whether the visitor came from Bogotá or Monterrey, so 7 sets per language cover all 24 pages with about 40% less copy than one set per page, and one place to fix a timing.

Completeness: A=9/10, B=10/10.
Header: Qué incluye
Options:
A) A: 7 sets by service (Recommended)
One set per service family (consultoría, auditoría, SEO técnico, SEO local, link building, GEO, servicios hub), ES + EN in one data file; the 5 city pages reuse the consultoría set. New task T17; Felipe confirms each timing. Human ~1d / CC ~1h for the copy, plus text-polish and the gate.
B) B: One set per page
Every page gets its own four rows, written inline (12 sets per language). Most specific (a city page could mention local work), but more copy, 12 places per language to update a timing, and more room for contradictions. Human ~2d / CC ~2h.

State: approved
Actual answer: A) A: 7 sets by service (Recommended), answer to D4, 2026-10-02
Accepted scope: new task T17 authors 7 "Qué incluye" sets (consultoría, auditoría, SEO técnico, SEO local, link building, GEO, servicios hub), ES + EN, in one data file read by the LandingPage layout; the 5 city pages reuse the consultoría set; each set passes text-polish and quality_gate; Felipe confirms every timing claim before build.
History: none

### R3: footer anchors and blog breadcrumb/back link (carried forward, no question)
Finding: S3, P2, confidence 9/10, `src/components/Footer.astro:35-38` (`#services`, `#cases`, `#blog`, `#contact`), `src/pages/es/blog/[slug].astro:35` (`'item': 'https://clicroot.com/#blog'`) and `:59` (`href="/#blog"`), same in the EN twin; footer service links lack trailing slashes (`Footer.astro:10-19`, build format is `directory`); reviewer: plan-eng-review (Claude, main)
Plan baseline: D5 removes the cases and blog sections, D7 replaces the anchor nav, D24 adds the blog index (design review answers, 2026-10-02)
Runtime evidence: those anchors exist only on the current homepage; after D5 they resolve to nothing
Comparison grid: not needed. This is necessary implementation of the approved D5, D7 and D24 contracts (removing the sections means their links must move), so no new behavior is chosen here.
State: approved
Actual answer: carried forward from design review answers D5, D7, D24 (2026-10-02)
Accepted scope: added to T3 and T15: footer links point to real pages (services, cities, /es/blog/ or /en/blog/, #contacto on the current page or /#contacto), with trailing slashes; blog post BreadcrumbList item 2 and the back link point to the language's blog index.
History: none

### R4: hreflang that points to a Spanish post that doesn't exist
Finding: S4, P2, confidence 9/10, `src/i18n/blog-slugs.ts` maps `'seo-tecnico-guia': 'technical-seo-guide'`, but `src/content/blog/es/` has no `seo-tecnico-guia.md` (14 ES posts vs 15 EN); `src/pages/en/blog/[slug].astro:25-26` builds `alternateUrl` from the map without checking the post exists; reviewer: plan-eng-review (Claude, main)
Plan baseline: not in the plan (pre-existing bug)
Runtime evidence: /en/blog/technical-seo-guide/ declares an `es` alternate at /es/blog/seo-tecnico-guia/, which is not generated, so Google sees a broken hreflang pair
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R4 alternate generation | from the static map, unchecked | only when the twin post exists in the collection; the R1 inventory script also fails on any hreflang target that doesn't resolve | unchanged (broken pair stays) |
| Missing ES post seo-tecnico-guia | absent | not decided here (separate TODO candidate) | not decided here (separate TODO candidate) |
| Effort | n/a | Human ~1h / CC ~10min, inside T15 | none |
Question D5:
D5: Fix the English blog post that declares a Spanish version that doesn't exist?

nexo-site main. blog-slugs.ts pairs "seo-tecnico-guia" with "technical-seo-guide", but there is no Spanish file for it, so /en/blog/technical-seo-guide/ tells Google its Spanish version lives at a URL that 404s (en/blog/[slug].astro:25-26 never checks). It's a small, existing bug, and T15 rewrites exactly that template. Whether to write the missing Spanish post is a separate content choice, asked later as a TODO.

Stakes: a broken hreflang pair is a mixed signal to Google on the language versions of the blog the GEO cluster depends on; left alone, every future missing twin repeats it.

Recommendation: A, because the template is being rewritten anyway and a check against the collection prevents the whole class of bug, not just this one URL.

Completeness: A=9/10, B=3/10.
Header: Hreflang
Options:
A) A: Check the twin exists (Recommended)
Generate the alternate only when the twin post is in the collection, and have the R1 inventory script fail on any hreflang target that doesn't resolve. Human ~1h / CC ~10min, inside T15. The missing Spanish post is decided separately.
B) B: Leave it
No change to how alternates are generated. Zero work; the broken pair stays live and the next missing twin repeats it.

State: approved
Actual answer: A) A: Check the twin exists (Recommended), answer to D5, 2026-10-02
Accepted scope: in T15, both blog [slug] templates emit the hreflang alternate only when the twin post exists in the blog collection; the R1 inventory script fails on any hreflang target that doesn't resolve. Writing the missing ES post stays a separate TODO candidate.
History: factual correction 2026-10-02 (build phase): `src/content/blog/es/seo-tecnico-guia.md` DOES exist (15 ES and 15 EN posts; a clean build emits /es/blog/seo-tecnico-guia/). The review's directory listing came from a wrapper that misreports directories, so the broken pair never existed. The approved twin-exists check stays as a cheap guard; no behavior changes.

### R5: what the landing proof card shows when few clients match the page
Finding: S5, P2, confidence 8/10, design plan landing template ("proof card: before/after rows filtered to clients of this service or city") and interaction-states row ("Fewer than 3 verified clients: the block shows the ones we have, never padded"); reviewer: plan-eng-review (Claude, main)
Plan baseline: filter per service or city; behavior at 0-1 matches undefined
Runtime evidence: the illustrative proof set has 5 clients (B2B SaaS MX, e-commerce CO, turismo MX, restaurantes Bogotá, fitness CO/MX); pages such as Guadalajara, Monterrey, Medellín, link building or SEO técnico would match 0-1 of them; T8 decides the real set
Comparison grid:
| Choice | Current | A | B | C |
|---|---|---|---|---|
| R5 selection rule | filter per page, no floor | each proof entry tagged with services and markets; show page matches if 2 or more, otherwise the overall top 3 under a neutral heading ("Clientes de Clicroot: leads por mes") | no filter: every landing shows the same overall top 3 | filter per page; hide the card when fewer than 2 match |
| R5 claim safety | n/a | the heading never claims a service or city the rows don't match | neutral heading everywhere | n/a |
| Effort | n/a | Human ~2h / CC ~15min, build-time in LandingPage | Human ~30min / CC ~5min | Human ~1h / CC ~10min |
Question D6:
D6: What should a landing's proof card show when almost no clients match that page?

nexo-site main. The landing template filters the before/after proof to clients of that service or city. With around 5 anonymized clients, many pages (Guadalajara, Monterrey, link building, SEO técnico) will match zero or one. The plan only says "show what we have, never pad", which on those pages means an empty or one-row card in the first screen.

Stakes: an empty proof card above the fold reads as "no results here" on the exact pages people land on from search; a mislabeled one ("clientes de SEO técnico" over unrelated clients) breaks rule 3.

Recommendation: A, because it keeps specific proof where we have it and still shows real numbers everywhere, without ever claiming a match that isn't there.

Completeness: A=10/10, B=7/10, C=4/10.
Header: Thin proof
Options:
A) A: Match, else top 3 (Recommended)
Tag each proof entry with its services and markets. A page shows its matches when there are 2 or more; otherwise it shows the overall top 3 under a neutral heading ("Clientes de Clicroot: leads por mes"). Built at compile time in the LandingPage layout. Human ~2h / CC ~15min.
B) B: Same top 3 everywhere
No filtering: every landing shows the overall top 3 under the neutral heading. Simplest and always full, but a Bogotá page never gets its Bogotá client up front. Human ~30min / CC ~5min.
C) C: Hide when thin
Filter per page and drop the card when fewer than 2 match. Honest, but those pages lose the above-the-fold proof D6 promised. Human ~1h / CC ~10min.

State: approved
Actual answer: A) A: Match, else top 3 (Recommended), answer to D6 (eng review), 2026-10-02
Accepted scope: each proof entry in the cases collection carries services[] and markets[] tags; the LandingPage layout selects at build time: page matches when 2 or more exist, otherwise the overall top 3 under the neutral heading "Clientes de Clicroot: leads por mes" (EN equivalent); the heading never claims a service or city the rows don't match.
History: none

### R6: how the redesign reaches production
Finding: S6, P1, confidence 8/10, `src/styles/global.css` (790 lines, shared by every page) plus design decisions D16 (remove theme) and D21 (ES + EN same release); reviewer: plan-eng-review (Claude, main)
Plan baseline: working agreement in 00-PLAN.md: "Build on a branch, verify (astro build, no console errors, gate-clean copy), and hold visual changes + any prod deploy for Felipe's review"; no merge gate beyond that
Runtime evidence: Cloudflare Pages project `nexo-site` is GitHub-connected (repo nexo-site), production branch `main`, preview deployments enabled for all branches (API probe 2026-10-02); no CI workflow and no tests in the repo; a push to main deploys production
Comparison grid:
| Choice | Current | A | B | C |
|---|---|---|---|---|
| R6 branch and preview | "build on a branch" | one branch (redesign-2-0), ordered commits per task, Felipe reviews the branch preview URL | phased pushes straight to main (tokens + nav, then home, then landings) | one branch + preview, as A |
| R6 merge gate | astro build + visual review | astro build, R1 inventory script, internal link check (no dead anchors, no /#contact), all pass before merge | none per phase beyond build | astro build + visual review only |
| R6 rollback | unspecified | Cloudflare Pages rollback to the previous production deployment, or revert the merge commit | per-phase reverts | as A |
| R6 preview indexing | unverified | verify the preview URL is not indexable (noindex header or robots) before sharing it | n/a | as A |
Question D7:
D7: How should the redesign reach production?

nexo-site main. Cloudflare Pages builds clicroot.com from GitHub: anything pushed to main goes live, and every other branch gets its own preview URL automatically (checked through the Cloudflare API today). The redesign touches about 55 files, including global.css, which styles every page, and you chose to ship ES and EN together (D21). The repo has no tests and no CI.

Stakes: a half-migrated main means a live site with two designs and broken links; a merge with no gate can drop content or links on pages nobody re-opened.

Recommendation: A, because the preview URL is free, one merge keeps D21, and an automated gate catches what a visual pass on 30 pages misses. Rollback stays one click.

Completeness: A=10/10, B=4/10, C=7/10.
Header: Release
Options:
A) A: Branch, preview, gated merge (Recommended)
One branch (redesign-2-0) with ordered commits per task; you review the branch's preview URL; before merge, astro build, the R1 inventory script and an internal link check (no dead anchors, no /#contact) must all pass. Merge to main is the single release; rollback is Cloudflare's previous-deployment rollback or a revert. We confirm the preview isn't indexable before sharing it. Human ~3h for the gate / CC ~20min.
B) B: Phased pushes to main
Ship in slices straight to production (tokens and nav, then the homepage, then landings). Feedback lands sooner, but the live site mixes two designs for days, breaks D21, and every slice is a production deploy with no gate.
C) C: Branch + preview, visual only
Same branch and preview as A, merged after a visual review with astro build as the only automated check. Less setup, but dropped sections and dead links on the pages nobody opens ship silently.

State: approved
Actual answer: A) A: Branch, preview, gated merge (Recommended), answer to D7 (eng review), 2026-10-02
Accepted scope: all work on branch redesign-2-0, ordered commits per task; Felipe reviews the branch preview URL (nexo-site Pages preview); merge gate = astro build + R1 inventory script + internal link check (no dead anchors, no /#contact) all passing; merge to main is the single release (keeps D21); rollback via Cloudflare Pages previous-deployment rollback or reverting the merge commit; confirm the preview is not indexable before sharing it.
History: none

Scope Challenge result: scope accepted as-is (the smaller arrangement in D2 keeps every feature). MODE: FULL_REVIEW.

### R7: contact endpoint hardening inside this release
Finding: A1, P1, confidence 9/10, `functions/api/contact.js` interpolates `${name}`, `${website}` and `${message.replace(/\n/g, "<br>")}` into the Resend email HTML unescaped, has no length limits, no email format check and no bot protection; the redesign puts a form on every landing plus an offer bar on every page (D8, D9, D22) and makes `message` optional server-side (D8), removing one of the only checks; reviewer: plan-eng-review (Claude, main)
Plan baseline: T5 changes the endpoint only to make `message` optional; hardening is a separate queued task (task chip "Escape lead fields in nexo-site contact email")
Runtime evidence: verified by reading contact.js (lines quoted above); the chip task has not run
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R7 where hardening lands | separate task, any time | inside T5 on the redesign branch: escape every interpolated field, strip CR/LF from subject values, server-side email format and length limits (name 120, website 300, message 5000), honeypot field in ContactForm (filled = 200 with no send); the separate chip becomes redundant | separate task, but required to merge before the redesign merges |
| R7 response contract | {success} / {error} | unchanged shape, with an error code per validation case for the form's error banner | unchanged |
| Effort | n/a | Human ~2h / CC ~15min, plus contract tests | same work, coordinated across two branches |
Question D8:
D8: Should the contact endpoint hardening ship inside this redesign instead of as a separate task?

nexo-site main. functions/api/contact.js pastes the visitor's name, website and message straight into the HTML email sent to hello@clicroot.com, with no escaping, no length limits and no bot protection. Today that form sits on one page. After the redesign it's on every landing plus an offer bar on every page, and the new 2-step form (design decision D8) makes the message optional on the server, which removes one of the few checks it has. There's already a separate task queued for the fix.

Stakes: more forms with no protection means spam and injected links landing in the inbox you read leads from, starting the day the redesign goes live.

Recommendation: A, because T5 already rewrites the same file and the same form, so doing it once avoids two branches editing contact.js and guarantees the protection ships with the exposure.

Completeness: A=10/10, B=9/10.
Header: Form security
Options:
A) A: Fold into T5 (Recommended)
T5 also escapes every field in the email, strips line breaks from subject values, checks email format and lengths (name 120, website 300, message 5000) and adds a honeypot field; each validation case returns its own error code for the form's error banner. The separate task becomes redundant. Human ~2h / CC ~15min plus tests.
B) B: Separate, merge first
Keep the queued task as its own change, but require it on main before the redesign merges. Same protection, two branches touching contact.js and a merge-order dependency to track.

State: approved
Actual answer: A) A: Fold into T5 (Recommended), answer to D8 (eng review), 2026-10-02
Accepted scope: T5 also escapes every interpolated field in the lead email, strips CR/LF from subject values, validates email format and lengths server-side (name 120, website 300, message 5000), and adds a honeypot field to ContactForm (filled = 200 with no send); each validation case returns its own error code consumed by the form's error banner; response shape stays {success} / {error}. The separate queued task was withdrawn as redundant.
History: none

### R8: which page and need a lead came from
Finding: A2, P2, confidence 9/10, `functions/api/contact.js` receives only `{ name, email, website, message }`; the site has no analytics script of any kind (grep for gtag, googletagmanager, plausible, umami, clarity across src/public/functions returns nothing); reviewer: plan-eng-review (Claude, main)
Plan baseline: D8 adds a "what you need" chip and D9 preselects "Diagnóstico IA", but the plan never says the chip value or the source page reaches the email; Phase 4 of 00-PLAN.md covers GSC only
Runtime evidence: a lead email today says nothing about which landing or language produced it
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R8 lead payload | name, email, website, message | adds need (chip value), page (pathname), lang; the email subject leads with the need ("Diagnóstico IA · /agencia-seo-bogota/") | unchanged (chip value only inside the body, no page) |
| R8 tracking tech | none | none added: no cookies, no script, no consent banner | none |
| Effort | n/a | Human ~1h / CC ~10min inside T5, plus a contract test | none |
Question D9:
D9: Should every lead email say which page it came from and what the person asked for?

nexo-site main. contact.js only receives name, email, website and message, and the site runs no analytics at all. After the redesign there will be a form on 24 landings and an offer bar everywhere, but a lead email still won't say whether it came from "agencia SEO Bogotá" or the GEO page, or whether the person picked "Diagnóstico IA". The homepage literally promises "y te muestra cuántos".

Stakes: without it you can't tell which landing produces clients, so the Phase 3 page work can't be judged on leads, only on traffic, which is the opposite of the demand-capture doctrine.

Recommendation: A, because three hidden fields give per-page lead attribution with no cookies, no new vendor and no consent banner, and it costs about ten minutes inside T5.

Completeness: A=9/10, B=3/10.
Header: Lead source
Options:
A) A: Add page, need, lang (Recommended)
The form sends the chip value, the page path and the language; the email subject leads with the need and the page ("Diagnóstico IA · /agencia-seo-bogota/"). No tracking script, no cookies. Human ~1h / CC ~10min inside T5, plus a contract test.
B) B: Keep the payload as is
Leads arrive without page or need in a structured field. Zero work; per-page attribution stays impossible until analytics arrives in some later phase.

State: approved
Actual answer: A) A: Add page, need, lang (Recommended), answer to D9 (eng review), 2026-10-02
Accepted scope: inside T5, ContactForm sends need (chip value), page (location.pathname) and lang with the lead; contact.js validates them (need against the 4 known values, page as a same-site path) and the email subject leads with need and page ("Diagnóstico IA · /agencia-seo-bogota/"); no tracking script, no cookies; covered by a contract test.
History: none

### Carried forward in Architecture (implementation of approved decisions, no question)
- Offer bar preselect (design D9, D22): the bar links to `#contacto` with `?motivo=diagnostico-ia` on pages that have the form and to `/?motivo=diagnostico-ia#contacto` (or `/en/...`) elsewhere; ContactForm reads `motivo` on load and preselects the chip.
- Offer bar close without a flash (D22): an inline head script reads sessionStorage and sets a class on `<html>` before first paint, in the slot the theme script leaves when D16 removes it (`src/layouts/Layout.astro:41-51`).
- Smooth scroll respects reduced motion (D14, D18): the in-page anchor handler (`Layout.astro:125-134`) uses `behavior: 'auto'` under `prefers-reduced-motion`.
- Before/after percentages are computed at build time from `before` and `after`, never stored (D12, one source of truth).
- Bars draw without a flash (D14): the drawn state is the default; the pre-draw class is added only when `html.js` is set and reduced motion is off.

### R9: build each landing's schema graph in the LandingPage layout
Finding: Q1, P2, confidence 9/10, every landing hand-builds its JSON-LD graph (BreadcrumbList, Service, FAQPage) in its own frontmatter, e.g. `src/pages/consultoria-seo.astro:30-58`, repeated across all 24 files; reviewer: plan-eng-review (Claude, main)
Plan baseline: D2 (eng) approved a LandingPage layout with breadcrumb and related links; schema generation is not assigned to it; T7 says each page keeps BreadcrumbList schema
Runtime evidence: 24 files x about 30 lines of schema code each (about 700 lines), identical shape, page-specific values (name, URL, serviceType, FAQs); within each file the FAQPage is already built from the same `faqs` array the visible FAQ renders (`consultoria-seo.astro:51`), so FAQ drift is not the risk; the duplication is the breadcrumb/Service code itself
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R9 schema source | each page builds its own graph | LandingPage builds BreadcrumbList + Service + FAQPage from props (title, path, breadcrumb, service fields, faqs); pages pass data only | each migrated page keeps its own hand-built graph |
| R9 shared-code accounting | n/a | removes about 700 lines across 24 pages, adds about 50 in the layout; net about -650 | 0 |
| R9 coverage | none | R1 inventory script asserts schema types and FAQ count per page (already approved) | R1 inventory script (already approved) |
| Blast radius | per page | one layout bug breaks schema on 24 pages, caught by the inventory script before merge | per page |
Question D10:
D10: Should the LandingPage layout generate each page's structured data instead of every page hand-writing it?

nexo-site main. Every landing builds its own JSON-LD block (breadcrumb, service and FAQ schema) by hand, about 30 lines per file, the same shape in all 24 (consultoria-seo.astro:30-58 is typical). The new layout will already receive the title, path, breadcrumb and FAQs as props.

Stakes: the migration rewrites all 24 files anyway; keeping 24 copies of the same breadcrumb and service schema code means any later fix (a URL format, the provider id, a new field) has to be made 24 times, and one missed copy ships inconsistent structured data.

Recommendation: A, because the layout already has every value it needs, it removes about 650 net lines, and the inventory script you approved catches a layout bug before it ships.

Completeness: A=10/10, B=6/10.
Header: Schema
Options:
A) A: Layout builds it (Recommended)
LandingPage generates BreadcrumbList, Service and FAQPage from the props each page passes; the FAQ schema keeps coming from the same array the visible FAQ renders. Removes about 700 lines, adds about 50. Covered by the approved R1 inventory script. Human ~3h / CC ~20min.
B) B: Each page keeps its own
Migrated pages keep their hand-written graphs. No new shared code and no shared blast radius, but 24 copies of the same schema code to maintain.

State: approved
Actual answer: A) A: Layout builds it (Recommended), answer to D10 (eng review), 2026-10-02
Accepted scope: LandingPage generates BreadcrumbList, Service and FAQPage JSON-LD from the props each page passes; FAQPage keeps coming from the same faqs array the visible FAQ renders; pages stop hand-writing schema; covered by the approved R1 inventory script (schema types and FAQ count per page).
History: none

### R10: one page registry for nav, footer, related links, hreflang and proof matching
Finding: Q2, P2, confidence 8/10, the same page list lives in several places today: `src/components/Footer.astro:10-19` (serviceLinks per language), a hardcoded `alternateUrl` in each of the 24 pages (e.g. `consultoria-seo.astro:61` `alternateUrl="/en/seo-consulting/"`), and the plan adds three more consumers (Nav menus D7, related links D6, proof matching R5) plus the R1 inventory script; reviewer: plan-eng-review (Claude, main)
Plan baseline: not specified; each consumer would carry its own list
Runtime evidence: existing callers verified (Footer list, 24 alternateUrl props); Nav, related links and proof matching are proposed callers (plan requirements D6, D7, R5)
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R10 page list source | Footer list + 24 hardcoded alternateUrl | one `src/data/pages.ts`: id, family (service, city, hub), service/market tags, ES and EN path + label; Nav menus, Footer, related links, LandingPage alternateUrl and breadcrumb, proof matching and the inventory script all read it | each consumer keeps its own list (Nav, Footer, related links, alternateUrl per page) |
| R10 shared-code accounting | n/a | removes the Footer list and 24 alternateUrl literals, avoids 3 new lists; adds about 80 lines of data | 0 removed, about 3 new lists added |
| R10 coverage | none | inventory script asserts every registry entry builds in both languages and every hreflang pair resolves | inventory script checks hreflang only |
| Blast radius | per list | a wrong registry entry affects every consumer of that page, caught by the inventory script | per list |
Question D11:
D11: Keep one list of the site's pages that the nav, footer, related links and hreflang all read from?

nexo-site main. Today the list of service and city pages lives in Footer.astro:10-19 and as a hardcoded English twin URL in each of the 24 pages (consultoria-seo.astro:61). The redesign adds three more places that need the same list: the Servicios and Ciudades menus, the related-links block, and the proof matching by service and city.

Stakes: with five separate lists, adding or renaming a page means five edits, and a missed one ships a dead menu link or a wrong language pair.

Recommendation: A, because every consumer needs the same facts (path, label, language twin, service and city), and one registry makes adding page 25 a one-line change the inventory script can verify.

Completeness: A=10/10, B=6/10.
Header: Page registry
Options:
A) A: One page registry (Recommended)
A single src/data/pages.ts with each page's family, service and market tags, and its ES and EN path and label. Nav menus, Footer, related links, the layout's hreflang and breadcrumb, proof matching and the inventory script all read it. About 80 lines of data. Human ~3h / CC ~20min.
B) B: A list per consumer
Nav, Footer, related links and each page keep their own copies. Nothing shared, but five places to update per page change.

State: approved
Actual answer: A) A: One page registry (Recommended), answer to D11 (eng review), 2026-10-02
Accepted scope: new `src/data/pages.ts` holds every landing (id, family service/city/hub, service and market tags, ES and EN path + label); Nav menus, Footer, related links, LandingPage alternateUrl and breadcrumb, R5 proof matching and the R1 inventory script read it; the Footer list and the 24 hardcoded alternateUrl literals are removed; the inventory script asserts every entry builds in both languages and every hreflang pair resolves.
History: none

### Carried forward in Code quality (no question)
- Cleanup first (Felipe's standing rule for files over 300 lines): before the structural work, one separate commit removes dead code from `src/styles/global.css` (790 lines), `src/pages/index.astro` (345) and `src/pages/en/index.astro` (348): unused selectors, the theme and typing code paths, debug leftovers. Added as T0.
- Blog emoji (design slop rule): the post template and index stop rendering `post.data.emoji` (`es/blog/[slug].astro:60`); the schema field stays to avoid touching 29 markdown files.
- New UI copy (form states, offer bar, nav labels, proof headings) lives in `src/i18n/es.json` and `en.json`, not inline in two languages.
- `Layout.astro` drops the typing ticker (`:149-175`), the counters (`:106-123`) and the theme toggle (`:94-99`, `:41-51`) as part of D14 and D16.

### R11: the contact form on the preview URL
Finding: A3 (late architecture finding, found during test review), P1, confidence 9/10, Cloudflare Pages project `nexo-site`: production env vars are GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, RESEND_API_KEY; preview env vars: none (API probe 2026-10-02, names only); `functions/api/contact.js:22` reads `context.env.RESEND_API_KEY`; reviewer: plan-eng-review (Claude, main)
Plan baseline: R6 approved reviewing the redesign on the branch preview URL; nothing says the form works there
Runtime evidence: on any preview deployment the Resend call goes out with an undefined key, fails, and the endpoint returns 500, so the form always shows its error state on the preview
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R11 preview form behavior | always 500 (no key) | sends real email: Felipe adds RESEND_API_KEY to the Preview environment in the Cloudflare dashboard; contact.js prefixes the subject with "[preview]" when the request host is not clicroot.com | unchanged; the success path is first tested in production right after merge |
| R11 who handles the key | n/a | Felipe, in the dashboard (Claude never sees it) | n/a |
| R11 silent-loss guard | none | a missing key still returns 500 (never a fake success), in every environment | as today |
| Effort | n/a | Human ~5min for Felipe + ~30min code / CC ~5min | none |
Question D12:
D12: How should the contact form behave on the preview URL you'll review?

nexo-site main. You approved reviewing the redesign on the branch preview URL. But Cloudflare only has RESEND_API_KEY in the Production environment; Preview has no variables at all (checked by name through the API, values never read). contact.js:22 needs that key, so on the preview the form will always fail and show its error banner. You couldn't test the success state, the confirmation panel or the lead email before launch.

Stakes: the form is the only conversion point; if its success path is first exercised in production, a broken submit can cost real leads on day one.

Recommendation: A, because it takes you about five minutes in the dashboard, the "[preview]" subject keeps test leads easy to spot, and a missing key still fails loudly instead of faking success.

Completeness: A=10/10, B=5/10.
Header: Preview form
Options:
A) A: Add the key to Preview (Recommended)
You add RESEND_API_KEY to the Preview environment in Cloudflare (I never handle it). contact.js prefixes the subject with "[preview]" when the request isn't from clicroot.com, and a missing key keeps returning a loud 500, never a fake success. Human: ~5min for you, ~30min code / CC ~5min.
B) B: Test after launch
Leave Preview without the key. The form shows its error state on the preview, and the success path is tested in production right after the merge.

State: approved
Actual answer: A) A: Add the key to Preview (Recommended), answer to D12 (eng review), 2026-10-02
Accepted scope: Felipe adds RESEND_API_KEY to the Preview environment of the nexo-site Pages project in the Cloudflare dashboard (Claude never handles the key); contact.js prefixes the subject with "[preview]" when the request host is not clicroot.com; a missing key returns a loud 500 in every environment, never a fake success.
History: none

### R13: regression contract for the contact endpoint rewrite
Finding: T1-test, P1, confidence 9/10, `functions/api/contact.js` (whole file) is rewritten by T5 with approved changes R7, R8, R11 and design D8; the repo has no tests (`git ls-files` matches 0 test files); reviewer: plan-eng-review (Claude, main)
Plan baseline: R7 and R8 mention contract tests but no behavior-to-preserve list exists
Runtime evidence: today a valid POST returns 200 `{success:true}` after a Resend call with from `clicroot <noreply@clicroot.com>`, to `hello@clicroot.com`, `reply_to` = visitor email; OPTIONS returns Allow-Origin `https://clicroot.com`, Methods `POST, OPTIONS`, Headers `Content-Type`; invalid JSON currently falls into the catch and returns 500
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R13 behavior to preserve | implicit | valid lead → 200 {success:true}; Resend payload keeps from, to and reply_to; OPTIONS headers unchanged; same-origin POST from the page keeps working | same |
| R13 intentional changes | n/a | message optional (D8); need/page/lang added and validated (R8); escaping, CR/LF strip, length and email checks, honeypot (R7); "[preview]" prefix and loud missing-key 500 (R11); invalid JSON returns 400 instead of 500 | same |
| R13 acceptance assertions | none | one automated contract test per row of the code-path diagram for contact.js (preserved + changed), with Resend's fetch stubbed, run before merge | same assertions run by hand with curl against the preview, recorded in the QA notes |
Question D13:
D13: How do we prove the rewritten contact endpoint still delivers leads exactly as it does today?

nexo-site main. T5 rewrites functions/api/contact.js, the only path a lead takes to your inbox, and the repo has no tests. Today a valid submission returns success and sends one email from noreply@clicroot.com to hello@clicroot.com with reply-to set to the visitor. On top of that we're adding validation, escaping, new fields and a preview prefix.

Stakes: a regression here is silent lost leads; nothing on the site would look broken while emails stop arriving.

Recommendation: A, because the endpoint is small and pure enough to test in seconds, and an automated contract runs on every change instead of once.

Both options keep the same contract: a valid lead still returns success and sends one email with the same from, to and reply-to; the preflight headers stay the same; on purpose we make the message optional, add need/page/lang, escape and validate every field, add the honeypot and the "[preview]" prefix, return a loud error when the key is missing, and return 400 instead of 500 for malformed requests.

Completeness: A=10/10, B=6/10.
Header: Lead contract
Options:
A) A: Automated contract tests (Recommended)
One test per case in the contact.js diagram (valid lead, honeypot, each validation error, escaping, preview prefix, missing key, Resend failure, preflight headers), with the call to Resend stubbed so nothing is sent. Runs before every merge. Runner chosen in the next question. Human ~3h / CC ~20min.
B) B: Manual curl checklist
The same cases sent by hand with curl against the preview URL and recorded in the QA notes. No test code, but it runs once and real emails go out for the success cases.

State: approved
Actual answer: A) A: Automated contract tests (Recommended), answer to D13 (eng review), 2026-10-02
Accepted scope: regression contract for contact.js: preserve valid lead → 200 {success:true} with one Resend call keeping from `clicroot <noreply@clicroot.com>`, to `hello@clicroot.com`, reply_to = visitor email; OPTIONS headers unchanged; same-origin POST works. Intentional changes: message optional; need/page/lang added and validated; escaping, CR/LF strip, length and email checks, honeypot; "[preview]" prefix off clicroot.com; loud 500 on missing key; malformed JSON → 400. Proven by one automated contract test per case with Resend's fetch stubbed, run before every merge (runner decided in R12).
History: none

### R12: test runner for the contract and unit tests
Finding: T2-test, P2, confidence 9/10, `package.json` has no test script and no dev dependencies; no jest/vitest/playwright config; local Node is v24.12.0; reviewer: plan-eng-review (Claude, main)
Plan baseline: R13 approved automated contract tests; R5 adds a pure selection function (selectProof) that needs unit tests; no runner chosen
Runtime evidence: Node 24 ships `node:test` and `node:assert`; `Request`, `Response` and `fetch` are global, so `onRequestPost` can be imported and called directly with a stubbed fetch
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R12 runner | none | built-in `node:test` (zero dependencies); `npm test` = `node --test tests/` | Vitest as a dev dependency; `npm test` = `vitest run` |
| R12 what it covers | n/a | contact.js contract (R13), selectProof (R5), page registry shape (R10) | same, plus room for Astro component tests via the container API later |
| Effort and upkeep | n/a | Human ~30min setup / CC ~5min; nothing to upgrade | Human ~1h setup / CC ~10min; one more dependency to keep current |
Question D14:
D14: Which test runner should the new tests use?

nexo-site main. The repo has no test setup at all (package.json has no test script and no dev dependencies). The tests we just agreed on are plain functions: the contact endpoint, the proof selection rule and the page registry. Node 24, which you run locally, has a built-in test runner and already includes the Request, Response and fetch objects the endpoint uses.

Stakes: small either way; a heavier tool than the job needs is one more dependency to update on a site with no other dev tooling.

Recommendation: A, because the built-in runner covers everything we're testing with zero new dependencies; we can add Vitest later if component tests ever earn their place.

Note: options differ in kind, not coverage, so no completeness score.
Header: Test runner
Options:
A) A: Node's built-in runner (Recommended)
node:test with node:assert, run by "npm test" (node --test tests/). Covers the contact contract, proof selection and registry checks. No new dependencies. Human ~30min setup / CC ~5min.
B) B: Vitest
Add Vitest as a dev dependency. Same tests, nicer watch mode and a path to testing Astro components later, at the cost of a dependency to maintain. Human ~1h setup / CC ~10min.

State: approved
Actual answer: A) A: Node's built-in runner (Recommended), answer to D14 (eng review), 2026-10-02
Accepted scope: tests use node:test + node:assert with no new dependencies; package.json gets `"test": "node --test tests/"`; covers the contact.js contract (R13), selectProof (R5) and the page registry shape (R10).
History: none

### R14: how the browser flows get verified before merge
Finding: T3-test, P2, confidence 8/10, the lead-capture flow spans ContactForm (client states), the offer bar preselect and functions/api/contact.js (3+ components, the conversion path, marked [→E2E] in the coverage diagram); offer bar, nav menus, bars draw and blog index are browser-only behaviors; reviewer: plan-eng-review (Claude, main)
Plan baseline: design plan says "run /design-review on the branch for visual QA"; no functional browser verification is specified
Runtime evidence: no browser test tooling in the repo; gstack /qa and the browse tool are available in this environment
Comparison grid:
| Choice | Current | A | B | C |
|---|---|---|---|---|
| R14 lead-capture flow (steps, errors, double submit, back, ?motivo preselect) | unverified | one /qa pass on the preview from the Test Plan artifact | automated Playwright spec in the repo, with /api/contact intercepted so no email is sent | automated Playwright spec, as B |
| R14 other browser flows (offer bar, nav menus, bars draw, blog index) | unverified | same /qa pass | same /qa pass | automated Playwright specs |
| R14 new dependency | none | none | @playwright/test (dev) + a Chromium download | same as B |
| Effort | n/a | Human ~2h / CC ~20min, once per release | Human ~4h / CC ~30min + the /qa pass | Human ~1.5d / CC ~1.5h |
Question D15:
D15: How should the browser flows be verified before the merge?

nexo-site main. The contract tests prove the server side. The rest only exists in a browser: the 2-step form's states (inline errors, double-click on Enviar, going back, the diagnosis preselect from the offer bar), the offer bar's close, the nav menus, the drawing bars and the blog index. The form flow is the one that loses money if it breaks.

Stakes: a client-side bug in the form (say, Enviar stuck on "Enviando…") passes every server test and still loses leads; a broken menu is visible but cheap.

Recommendation: B, because it automates the one flow that costs money when it breaks, without sending emails, and keeps the cheaper flows on a single guided QA pass.

Completeness: A=7/10, B=9/10, C=10/10.
Header: Browser QA
Options:
A) A: One guided QA pass
A /qa pass on the preview, driven by the Test Plan artifact, covers every browser flow once before merge. No new dependencies, but nothing re-runs when the form changes later. Human ~2h / CC ~20min.
B) B: Automate the form, QA the rest (Recommended)
A Playwright spec for the lead-capture flow (both steps, inline errors, server error banner, double submit, back, ?motivo preselect) with the API intercepted so no email goes out; the /qa pass covers offer bar, menus, bars and blog. Adds @playwright/test as a dev dependency. Human ~4h / CC ~30min plus the QA pass.
C) C: Automate everything
Playwright specs for every browser flow. Fully repeatable, but the most code to maintain on a site that changes rarely. Human ~1.5d / CC ~1.5h.

State: approved
Actual answer: B) B: Automate the form, QA the rest (Recommended), answer to D15 (eng review), 2026-10-02
Accepted scope: add @playwright/test as a dev dependency with one spec for the lead-capture flow (step 1 and step 2, inline errors, server error banner, double submit, back to step 1, ?motivo=diagnostico-ia preselect), with /api/contact intercepted so no email is sent; a /qa pass on the preview, driven by the Test Plan artifact, covers offer bar, nav menus, bars draw and blog index before merge.
History: none

### Carried forward in Performance (no question)
- Hero dashboard and artifact screenshots (T9) go through Astro's built-in `<Image>` from `src/assets/` (webp, explicit width/height, srcset for 390/780/1200 widths); the hero image is not lazy-loaded and gets `fetchpriority="high"` since it is the homepage's largest element. This is how T9's approved "webp, width/height set" gets done, using what Astro already ships.

### R15: trim the Google Fonts request to the weights DESIGN.md uses
Finding: P1-perf, P2, confidence 9/10, `src/layouts/Layout.astro:85` loads Outfit 300-900 (7 weights), Plus Jakarta Sans 400-800 (5) and JetBrains Mono 400-700 (4), 16 font files in all, on every page; reviewer: plan-eng-review (Claude, main)
Plan baseline: the approved mockups (`designs/reviewed-v2-20261002/base.css`) load Outfit 500-800, Plus Jakarta Sans 400-700 and JetBrains Mono 500-600, which DESIGN.md (T1) will fix as the type scale
Runtime evidence: the stylesheet request asks for 16 weights; render-blocking CSS from fonts.googleapis.com on every page
Comparison grid:
| Choice | Current | A | B |
|---|---|---|---|
| R15 font weights requested | 16 (Outfit 300-900, Jakarta 400-800, JetBrains 400-700) | 10: Outfit 500/600/700/800, Jakarta 400/500/600/700, JetBrains 500/600 (matches the mockups and DESIGN.md) | unchanged 16 |
| R15 guard | none | the R1 inventory script fails if built CSS uses a font weight outside the loaded set | none |
| Effort | n/a | Human ~30min / CC ~5min | none |
Question D16:
D16: Cut the web fonts down to the weights the new design actually uses?

nexo-site main. Layout.astro:85 asks Google Fonts for 16 font weights on every page (Outfit from 300 to 900, Plus Jakarta Sans 400 to 800, JetBrains Mono 400 to 700). The approved mockups load 10 of them (Outfit 500 to 800, Jakarta 400 to 700, JetBrains 500 and 600), and DESIGN.md will fix that as the type scale.

Stakes: unused weights slow the first paint on phones, which is most first visits; cutting the wrong one would make some text fall back to a synthesized bold.

Recommendation: A, because the design already fixes the weights, and a build check catches any CSS that asks for a weight we stopped loading.

Completeness: A=9/10, B=5/10.
Header: Font weights
Options:
A) A: Load only the 10 used weights (Recommended)
Trim the request to Outfit 500/600/700/800, Plus Jakarta Sans 400/500/600/700 and JetBrains Mono 500/600, matching the mockups and DESIGN.md, and have the inventory script fail if built CSS uses any other weight. Human ~30min / CC ~5min.
B) B: Keep all 16
Leave the font request as is. No risk of a missing weight, but every page keeps downloading styles nobody sees.

State: approved
Actual answer: A) A: Load only the 10 used weights (Recommended), answer to D16 (eng review), 2026-10-02
Accepted scope: the Google Fonts request in Layout.astro loads only Outfit 500/600/700/800, Plus Jakarta Sans 400/500/600/700 and JetBrains Mono 500/600 (matching the mockups and DESIGN.md); the R1 inventory script fails if built CSS uses any other weight.
History: none

### R16: Spanish twin of the technical SEO guide (TODO candidate from R4)
Finding: R4 follow-up, P2, `src/i18n/blog-slugs.ts` reserves `seo-tecnico-guia` with no file in `src/content/blog/es/`; reviewer: plan-eng-review (Claude, main)
Question D17: Write the Spanish version of the technical SEO guide? Options: A) Add to TODOS.md (Recommended), B) Skip, C) Build it in this release.
State: approved
Actual answer: C) Build it in this release, answer to D17 (eng review), 2026-10-02
Accepted scope: superseded, see History.
History: 2026-10-02 (build phase): the Spanish post already exists (see the R4 correction), so T21 is void; the post simply moves to the new template with the rest of the blog.

Approval readiness: PASS. Checked R1 (D3), R2 (D4), R3 (carried from design D5, D7, D24), R4 (D5), R5 (D6), R6 (D7), R7 (D8), R8 (D9), R9 (D10), R10 (D11), R11 (D12), R12 (D14), R13 (D13), R14 (D15), R15 (D16), R16 (D17); carried-forward items cite design decisions D9, D12, D14, D16, D17, D18, D22, D25 and Felipe's standing cleanup rule. All D-numbers in this ledger are the engineering review's own sequence (D1 office hours skipped, D2 structure).

## Engineering review outputs

### Amendments to the design tasks (T1-T16)
- **T1:** also trims the Google Fonts request to 10 weights (R15).
- **T2:** anchor scrolling uses `behavior: 'auto'` under reduced motion; the bars' drawn state is the default (carried, D14).
- **T3:** Nav and Footer read the page registry (R10); footer anchors and trailing slashes fixed (R3).
- **T4:** offer bar links with `?motivo=diagnostico-ia`; close state set before first paint, sessionStorage wrapped in try/catch (carried, D22).
- **T5:** adds endpoint hardening and honeypot (R7), need/page/lang fields (R8), "[preview]" prefix and loud missing-key 500 (R11), malformed JSON → 400 (R13). The honeypot input gets `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"` and a name browsers don't autofill, so real leads are never dropped as bots.
- **T6:** built with the D2 component set (Proof, NumberedRows, FirstCall, Faq, ContactForm, OfferBar); the dashboard figure stays inline.
- **T7:** LandingPage layout with a slot for unique sections (R1), schema generated in the layout (R9), alternateUrl, breadcrumb and related links from the registry (R10), proof selection with the top-3 fallback (R5), Qué incluye from the deliverables data file (R2).
- **T8:** the cases collection schema gains `services[]`, `markets[]`, `before`, `after`, `window_months`, `source`, `client_ok`; percentages are computed at build time.
- **T9:** images go through Astro `<Image>` from `src/assets/`, hero with `fetchpriority="high"` (carried).
- **T14 / T15:** blog breadcrumb and back link point to the language's index (R3); hreflang only when the twin exists (R4); no emoji rendered.

### Flows

Lead capture (T4, T5, R7, R8, R11):
```
 offer bar "Pedir diagnóstico" ──► page has form? ──yes──► #contacto?motivo=diagnostico-ia
                                        │no
                                        └──► /?motivo=diagnostico-ia#contacto
 ContactForm  step 1 (site, email) ──blur──► inline error | Siguiente
              step 2 (name, need chip, message?) ──Enviar──► button disabled "Enviando…"
                 │ POST /api/contact {name,email,website,need,page,lang,message?,honeypot}
                 ▼
 contact.js  bad JSON ─► 400 · honeypot filled ─► 200 (no send) · invalid field ─► 400 {code}
             no RESEND key ─► 500 · escape fields, subject "[preview]? need · page"
             Resend fetch ─► ok ─► 200 {success} ─► confirmation panel (role=status)
                         └► fail/throw ─► 500 ─► banner, values kept, hello@clicroot.com
```

Landing build (T7, T17, T18, T19, R1, R5, R9, R10):
```
 src/data/pages.ts ─┐   src/content/cases (tags, before/after) ─┐   src/data/deliverables (7 sets)
                    ▼                                           ▼              ▼
 page.astro (props + unique sections slot) ──► LandingPage: breadcrumb · hreflang · proof (selectProof)
                                               · Qué incluye · FirstCall · Faq · JSON-LD · related links
                                                        ▼
                                            astro build ──► dist/ ──► inventory script (before vs after:
                                            title, desc, canonical, hreflang, H2s, FAQ count, schema,
                                            font weights, dead links) ──► merge gate (R6)
```

### Failure modes
| Path | Realistic failure | Test | Error handling | User sees |
|---|---|---|---|---|
| Form submit | Resend outage | contract test + Playwright intercept | 500 → banner, values kept | clear error + email fallback |
| Form submit | key missing after an env change | contract test | loud 500 | clear error + email fallback |
| Honeypot | browser autofill fills the trap field | Playwright: a normal fill leaves it empty | attributes block autofill | nothing (prevented) |
| Offer bar | sessionStorage throws (private mode) | /qa pass | try/catch, bar stays visible | bar stays, no break |
| Landing migration | a unique section or schema type dropped | inventory script | merge blocked | nothing ships |
| Proof card | no verified client matches the page | selectProof unit test | top-3 fallback, neutral heading | real numbers, no false claim |
| Preview review | preview URL gets indexed | manual check before sharing | noindex verified | nothing (prevented) |
| Blog | twin post missing | inventory script | alternate omitted | nothing |

Critical gaps (no test, no handling, silent): none. Residual risk worth knowing: nothing alerts you if submissions start failing in production; visitors see the error and the email fallback, but you'd only notice from a drop in leads.

### Worktree parallelization
| Step | Modules touched | Depends on |
|---|---|---|
| T0 cleanup, T1 tokens + fonts | src/styles, src/layouts | none |
| T5 + T20 contract tests | functions/, tests/ | none |
| T18 registry + T19 inventory script | src/data, scripts/ | none |
| T17 Qué incluye copy, T10 copy | src/data (deliverables), src/i18n | none |
| T2, T3, T4 motion, nav, offer bar | src/components, src/layouts | T0, T1 |
| T6 homepage, T7 landings | src/pages, src/components | T2-T5, T17, T18 |
| T14, T15, T21 blog | src/pages/*/blog, src/content/blog | T1, T3 |
| T8, T9, T16 proof, images, people | src/content/cases, src/assets | Felipe's inputs |
| T23 release | branch, preview, /qa | everything above, T22 |

Lane A: T0 → T1 → T2/T3/T4 (shared styles and Layout). Lane B: T5 → T20 (functions, tests). Lane C: T18 → T19 (data, scripts). Lane D: T17 + T10 (copy). Launch A, B, C, D together; merge all four; then T6 + T7, then blog, then T8/T9/T16 as inputs arrive, then T23. Conflict flags: `src/layouts/Layout.astro` is touched by T1, T2, T4 and T5 (old form handler removal), so those stay sequential inside lane A, with T5's Layout change applied after lane A merges; `src/styles/global.css` belongs to lane A only.

### Implementation tasks (engineering review additions)
- [ ] **T0 (P1, human: ~2h / CC: ~15min)**: Cleanup: dead code out of global.css and both homepages, in its own commit
  - Surfaced by: Code quality, Felipe's standing rule for files over 300 lines
  - Files: `src/styles/global.css`, `src/pages/index.astro`, `src/pages/en/index.astro`
  - Verify: `npx astro build` clean; visual diff of / and /en/ unchanged on the preview
- [ ] **T17 (P1, human: ~1d / CC: ~1h)**: Qué incluye: 7 deliverable sets, ES + EN
  - Surfaced by: Scope Challenge S2 → R2 (D4)
  - Files: new `src/data/deliverables.ts`
  - Verify: text-polish applied; quality_gate exits 0 on the copy; Felipe confirms every timing
- [ ] **T18 (P1, human: ~3h / CC: ~20min)**: Page registry
  - Surfaced by: Code quality → R10 (D11)
  - Files: new `src/data/pages.ts`; consumers in Nav, Footer, LandingPage
  - Verify: registry shape test (node:test); inventory script confirms every entry builds in both languages
- [ ] **T19 (P1, human: ~4h / CC: ~25min)**: Inventory script and merge gate
  - Surfaced by: R1 (D3), R4 (D5), R6 (D7), R10 (D11), R15 (D16)
  - Files: new `scripts/inventory.mjs`, `package.json` script `check`
  - Verify: run on current main to produce the baseline snapshot; deliberately delete one H2 on a branch and confirm the script fails
- [ ] **T20 (P1, human: ~1d / CC: ~1h)**: Tests: contract, unit and the lead-capture E2E
  - Surfaced by: Test review → R12 (D14), R13 (D13), R14 (D15)
  - Files: `tests/contact.test.mjs`, `tests/proof.test.mjs`, `tests/pages.test.mjs`, `e2e/lead-capture.spec.ts`, `package.json` (`test`, `e2e`, @playwright/test dev dependency)
  - Verify: `npm test` and `npx playwright test` pass; each contact.js case in the diagram has a test
- [x] **T21 (void)**: Spanish technical SEO guide, already exists (R4 correction)
  - Surfaced by: R4 follow-up → R16 (D17)
  - Files: new `src/content/blog/es/seo-tecnico-guia.md`
  - Verify: text-polish and quality_gate exit 0; hreflang pair resolves both ways in the inventory script
- [ ] **T22 (P1, Felipe, ~5min)**: Add RESEND_API_KEY to the Preview environment
  - Surfaced by: R11 (D12)
  - Where: Cloudflare dashboard → Pages → nexo-site → Settings → Variables and secrets → Preview
  - Verify: a test submission on the preview delivers a "[preview]" email to hello@clicroot.com
- [ ] **T23 (P1, human: ~3h / CC: ~30min)**: Release on branch redesign-2-0
  - Surfaced by: R6 (D7), R14 (D15)
  - Steps: build on the branch, confirm the preview URL is not indexable, run `npm test`, `npx playwright test`, `npm run check` (inventory + links + fonts), /qa pass from the Test Plan artifact, /design-review, Felipe review, merge to main
  - Verify: all gates green before merge; production smoke test (one real submission) right after

QA test plan artifact: `~/.gstack/projects/buraye94-nexo-site/felipegallo-main-eng-review-test-plan-20261002-142643.md`.

### NOT in scope (engineering)
- Analytics or tag management (GA4 or similar): needs a consent decision; R8 gives per-page lead attribution without it. Phase 4 of 00-PLAN.md covers measurement.
- Alerting on failed submissions: no monitoring stack on this site; noted as residual risk.
- Moving the 24 landings into a content collection with one dynamic route: changes routing and URLs for little gain over the D2 layout.
- Turnstile or other CAPTCHA on the form: the honeypot and validation come first; revisit only if spam gets through.
- Self-hosting fonts: the 10-weight trim (R15) covers the main cost.

### What already exists (engineering)
- `Layout.astro` head (canonical, hreflang, OG, org JSON-LD) is reused; only scripts and the font request change.
- `functions/api/contact.js` and its Resend integration are rewritten in place (same route, same response shape).
- Zod content collections (`src/content/config.ts`): the cases collection gains fields instead of a new data store.
- `blog-slugs.ts` keeps the ES↔EN pairing; templates now check the twin exists.
- Astro's built-in `<Image>`, `node:test` and Cloudflare Pages preview deployments are used instead of new tooling; Playwright is the only new dev dependency (D15).

### Unresolved decisions
None in this review.

### Completion summary
- Step 0: Scope Challenge: scope accepted as-is (6 findings, all resolved: R1-R6)
- Architecture Review: 3 issues found (R7, R8, R11)
- Code Quality Review: 2 issues found (R9, R10)
- Test Review: diagram produced, 27 gaps identified (resolved through R12, R13, R14 and the Test Plan artifact)
- Performance Review: 1 issue found (R15)
- NOT in scope: written
- What already exists: written
- TODOS.md updates: 1 item proposed to user (built now as T21; no TODOS.md entry)
- Failure modes: 0 critical gaps flagged
- Unresolved decisions: 0 in this review
- Outside voice: Codex unavailable (installed, binary missing; fix: `npm install -g @openai/codex`); native fallback unavailable (background task output tool not in this session); no outside coverage
- Parallelization: 4 lanes, 4 parallel / 5 sequential steps
- Lake Score: 8/13 (the most complete option chosen in 8 of 13 coverage choices; the others took a 9/10 option, never a shortcut)

### Build-phase spec notes (2026-10-02)
- T0 folded into the rewrite: `global.css` and both homepages are replaced wholesale, not refactored, so a separate cleanup commit would only touch code that is deleted anyway.
- R1 refined: city and service pages keep their localized "what we do" grids (the content-reviewer pass made each city's cards unique), rendered as numbered rows without icons. Only the generic senior-consultant pitch, FAQ headings, closing CTA bands and the interlink sections are replaced; the allowlist lives in `scripts/inventory-replaced.json`. This keeps more content than the approved contract required.
- Qué incluye renders on paper2 so it stays distinct from a paper section right before it.

## Build status (2026-10-02)

Branch `redesign-2-0`, pushed; Cloudflare preview at https://redesign-2-0.nexo-site.pages.dev (sends `x-robots-tag: noindex`). Production (clicroot.com) still serves `dd9d324`; nothing merges to main until Felipe approves.

Done and verified on the branch:
- T1 design system (DESIGN.md + global.css), T2 motion (no hidden content; bars draw once below the fold), T3 nav + footer from the registry, T4 offer bar, T5 form + hardened endpoint (R7, R8, R11, R13), T6 homepage (ES + EN from one component), T7 LandingPage + all 24 landings, T10 copy (contrast sweep across the 24 pages, quality gate clean), T11 one kicker per page, T12/T13 accessibility and responsive (44px targets, no horizontal scroll at 390 / 768 / 1440), T14 blog index, T15 post template, T17 deliverable copy (timings pending), T18 registry, T19 inventory gate, T20 tests.
- Checks: `npm run build` (59 pages), `node scripts/inventory.mjs check --allow-pending` passes (24 landings compared to the live baseline, 82 pending items), `npm test` 38/38, `npx playwright test` 16/16, quality gate on all ES landings + homepage passes. Browser QA on the preview: offer bar close persists for the visit, menus open/close with Enter/Esc/outside click, phone sheet focus and Esc, bars draw, blog lists 15 posts per language, endpoint returns 400 / 400 / 500 per contract.

Blocked on Felipe (the merge gate `npm run check` fails until these are done):
- T22: add RESEND_API_KEY to the Preview environment (Cloudflare → Pages → nexo-site → Settings → Variables and secrets → Preview), then test one real submission on the preview.
- T8: verified proof clients (before, after, window, OK) to replace the 5 illustrative entries in `src/content/cases/`.
- T9: real masked dashboard screenshot for the homepage hero and 4 deliverable screenshots for "Cómo trabajamos".
- T16: team photo and the facts for "Quién te atiende".
- T17: confirm the timings in `src/data/deliverables.ts` (flip `timingConfirmed` per set) and the homepage steps.
- Whether the 4 entries in `src/content/testimonials/` are real permitted quotes (not rendered; delete if not).

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | not run | n/a |
| Outside Review | Codex, outside voice of `/plan-eng-review` | Independent 2nd opinion | 1 | unavailable | n/a (Codex binary missing; native fallback unavailable) |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | ISSUES OPEN | 33 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR (PLAN) | score: 1/10 → 9/10, 20 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | not run | n/a |

- **OUTSIDE COVERAGE:** Codex, plan-review phase, unavailable (CLI installed but its binary is missing; fix with `npm install -g @openai/codex`); the native fallback was unavailable in this session; design outside voices were not run. No outside coverage for either review.
- **VERDICT:** DESIGN CLEARED. Eng review ISSUES OPEN by definition: 33 findings, every one resolved into an approved task (T0-T23), 0 unresolved decisions, 0 critical gaps. Eng review required.

NO UNRESOLVED DECISIONS
