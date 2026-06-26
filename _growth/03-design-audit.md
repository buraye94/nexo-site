# Clicroot.com Design + UX Audit

Date: 2026-06-25. Method: live capture via gstack browse (desktop 1440, mobile 375), forced-reveal to expose hidden sections, heading + structured-data reads. Source screenshots in /tmp/cr-full.png.

## Snapshot
- Astro one-page site, 9 sections, scrollHeight ~7905px. Loads fast: total 1042ms, TTFB 76ms, 0 console errors (Cloudflare static).
- Section order (sound conversion funnel): hero (dark) -> trust strip -> services 2x2 (paper) -> metrics/telemetry band (dark) -> cases stacked (paper) -> testimonials (paper) -> 4-step process (paper) -> blog 3-up (dark) -> CTA + form (lime gradient) -> footer (dark).
- Already alternates dark and light "chapters." This is spiritually close to the 2.0 warm-black + paper rhythm. The bones are good.

## What is already right (keep)
- The dark/paper alternating chapter rhythm. We recolor it, we do not rebuild it.
- The funnel order: proof-forward hero, then services, proof (cases + testimonials), process, ideas, CTA. Solid.
- Fast static delivery on Cloudflare. Protect this in any redesign (no heavy JS frameworks).
- Bilingual es/en with i18n routing.
- Floating stat cards in the hero (+312% / #1 / 12x / 98%) are a strong device. They become the "numbers that draw themselves" signature.

## Critical issues
1. P1 FUNCTIONAL/SEO/GEO. Reveal-on-scroll renders sections at `opacity:0` until an IntersectionObserver fires. No-JS, pre-scroll, and many crawlers (including AI bots that do not scroll) see a near-empty page. Fix: content visible by default, animation as progressive enhancement only, plus a prefers-reduced-motion off switch and a no-JS fallback. This is the single most damaging issue for an SEO/GEO consultancy site.
2. BRAND divergence from Clicroot 2.0. The hero and CTA use a bright lime/chartreuse gradient that reads generic-SaaS, not the muted editorial olive of 2.0. Typography is Urbanist + Cormorant Garamond (serif) + Figtree, vs the decks' Outfit + Plus Jakarta Sans. Default theme is light, vs 2.0 warm-black-default. Recolor + retype to unify.
3. Counters and the telemetry band are animation-dependent (render 0 or empty without JS). Same class of fragility as issue 1.
4. KILL-LIST violations in our own brand surface: the title tag is "clicroot — Consultoria SEO" (em dash) and case headings use em dashes ("Plataforma SaaS — Engagement," "Villas de Lujo — Turismo"). Our own site violates constitution rule 2.
5. Underdeveloped 4-step process section: large empty space, weak visual payload.
6. One-page only. No dedicated service / local / GEO pages. This is the core ranking gap (handled in the content workstream, not here, but the homepage redesign must add clear entry points that link out to those new pages).
7. og:locale is es_ES. Targets are CO + MX. Use es_CO / es_MX (or a neutral es) and set proper og:image (currently none, blank share cards).

## Brand-extension spec (2.0 applied to the web medium)
This is "evolve one shared brand," not a slide deck pasted onto a page. Tokens map as:
- Surfaces: warm-black `#16150F` default; warm-paper `#F2EEE3` for the alternating chapter sections (services, cases, testimonials, process). Keep the existing dark/paper rhythm, just swap the values.
- Signal: olive `#AFC178` on dark, `#6B7C4E` on paper, used as a restrained accent (links, eyebrows, key figures), NOT a full neon gradient flood. The lime gradient hero/CTA becomes a warm-black hero with olive accents; CTA can use a single muted-olive field, not chartreuse.
- Alarm: terracotta `#C58A5B` rare. Status colors `--pos #7FA86A` / `--neg #C56B53` / `--crit #B4412E` (red rationed). Data ramp `--s1..s5` for any chart.
- Type: Outfit 800 `tabular-nums` for display + big figures; Plus Jakarta Sans for body; JetBrains Mono for the eyebrow at 0.14em. Decision needed on the Cormorant serif: retire it for full deck-site unity (recommended), OR keep a single serif accent only if we also add a serif to the deck system (otherwise it re-fractures the brand). Default recommendation: retire Cormorant, lean on Outfit weight contrast for the editorial feel.
- Editorial layer: insights use the run-in pattern (mono kicker + olive lead-in clause), never a left-accent-bar callout box (the AI tell we already banned in the decks).
- Signature motion: the hero stat cards adopt "numbers that draw themselves" (per-word blur headline reveal + count-up + a self-drawing sparkline), on the shared `--ease cubic-bezier(0.16,1,0.3,1)`, always with a reduced-motion + print/no-JS finalizer.

## Conversion notes
- Hero proof: the +312% / 12x / 98% claims must be defensible (see technical audit: hero hardcodes +312% while es.json says 284% average). Resolve to real, verifiable numbers with Felipe before they ship. Unverifiable stats violate rule 3 and undercut a credibility-driven sale.
- Add per-service entry points in the services grid that link to the new dedicated service pages (once built), so the homepage feeds the money pages.
- Strengthen the single primary CTA (agenda una llamada) and keep the form, but restyle off the neon field.

## Verdict
Recolor and retype to 2.0, fix the reveal/animation fragility so content is real and crawlable, clean the kill-list violations, and turn the homepage into the hub that links to the new service/local/GEO pages. The structure is a keeper; the brand expression and the JS-dependency are the work.
