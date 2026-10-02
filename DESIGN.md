---
name: Clicroot 2.0 (web)
colors:
  ink: "#16150F"
  ink2: "#1E1D16"
  ink3: "#232216"
  paper: "#F2EEE3"
  paper2: "#E9E4D6"
  olive: "#AFC178"
  olive-deep: "#6B7C4E"
  olive-text: "#5C6B42"
  fg: "#F2EEE3"
  muted-dark: "#A8A390"
  muted-paper: "#5E5A4C"
  body-paper: "#45433A"
  before: "#5B5848"
  terracotta: "#C58A5B"
  line-dark: "rgba(242,238,227,.12)"
  line-paper: "rgba(22,21,15,.12)"
typography:
  display: { family: "Outfit", weights: [500, 600, 700, 800] }
  body: { family: "Plus Jakarta Sans", weights: [400, 500, 600, 700] }
  data: { family: "JetBrains Mono", weights: [500, 600] }
  scale:
    h1: { desktop: 58px, phone: 38px, line: 1.04 }
    h2: { desktop: 36px, phone: 28px, line: 1.1 }
    h3: { desktop: 20px, phone: 19px, line: 1.25 }
    body: { size: 17px, min: 16px, line: 1.6 }
    data: { size: 12px, tracking: .1em }
rounded: { sm: 6px, md: 10px, lg: 12px, xl: 16px }
spacing: { gutter-desktop: 40px, gutter-phone: 16px, section: 72px, section-phone: 52px, max-width: 1240px, reading: 70ch }
---

# Clicroot 2.0 for the web

One source of truth for clicroot.com. `src/styles/global.css` reads these values as CSS custom properties; never hardcode a hex in a component. Site, decks and reports share the same brand, so these tokens match the deck system with one addition: `olive-text` for small text on paper.

## Color

| Token | Value | Use |
|---|---|---|
| `ink` | #16150F | page background, dark chapters |
| `ink2` | #1E1D16 | proof band, first-call block, cards on dark |
| `ink3` | #232216 | offer bar |
| `paper` / `paper2` | #F2EEE3 / #E9E4D6 | reading chapters (services, Qué incluye, FAQ, blog) |
| `olive` | #AFC178 | signal on dark: primary button, "after" bars, focus ring on dark (9.34:1 on ink) |
| `olive-deep` | #6B7C4E | large type and non-text on paper only (3.92:1, fails for small text) |
| `olive-text` | #5C6B42 | small text and links on paper (4.98:1) |
| `muted-dark` | #A8A390 | secondary text on ink (7.23:1) |
| `muted-paper` | #5E5A4C | secondary text on paper (5.95:1) |
| `before` | #5B5848 | "before" bars in the proof chart |
| `terracotta` | #C58A5B | form errors and rare alarms, on ink only (2.53:1 on paper: never text there) |

Retired from the old site: gold, glow tokens, the 4-stop hero gradient, radii above 16px, light/dark theme switching.

## Type

Outfit 800 for display, Plus Jakarta Sans for body, JetBrains Mono for data only (source lines, windows, deliverable and timing lines, dashboard labels, form step labels). One mono kicker per page, in the hero. Tabular numbers on every figure. Body text never below 16px.

## Rhythm

Light and dark come from what a section is for, not from a switch. Dark: hero, proof band, first call, footer. Paper: services, Qué incluye, FAQ, blog reading. More space above a heading than below it.

## Browser surfaces

Selection olive on ink. Focus ring 2px olive (olive-text on paper), offset 3px. Underline offset 4px. Caret olive. Visited links in body copy are a shade darker than unvisited.

## Motion

One authored moment: the before/after bars draw once on first scroll into view, ease-out about 600ms, from a fully drawn default (no JS = drawn). Nothing else animates. `prefers-reduced-motion`: no animation, instant scroll.

## Components

| Component | File | Notes |
|---|---|---|
| Offer bar | `src/components/OfferBar.astro` | every page, closable for the visit (sessionStorage), 44px targets, opens the form with "Diagnóstico IA" preselected |
| Nav | `src/components/Nav.astro` | Servicios and Ciudades menus from the page registry, Resultados, Blog, language switch to the page's twin, CTA; phone sheet |
| Footer | `src/components/Footer.astro` | registry-driven links, hello@clicroot.com |
| Proof | `src/components/Proof.astro` | before/after rows (muted before bar, olive after bar, absolutes, % computed, window), `band` and `card` variants, source line |
| NumberedRows | `src/components/NumberedRows.astro` | numbered editorial rows; services, Qué incluye, artifact steps (optional image), localized grids; never icon cards |
| FirstCall | `src/components/FirstCall.astro` | "La primera llamada", Quién te atiende, what the call covers, ContactForm; `id="contacto"` |
| ContactForm | `src/components/ContactForm.astro` | 2 steps, visible labels, inline errors, sending, success panel, error banner, honeypot, need/page/lang |
| Faq | `src/components/Faq.astro` | details/summary, emits FAQPage JSON-LD from the same array |
| Section | `src/components/Section.astro` | dark or paper chapter wrapper with an H2, for page-specific content |
| LandingPage | `src/layouts/LandingPage.astro` | breadcrumb, hero + proof card, page-specific slot, Qué incluye, first call, FAQ, related links, BreadcrumbList + Service/Article JSON-LD |

## Proof rules

Every number has a before, an after, a window and a source. Percentages are computed at build time, never stored. Labels are industry + market, never client names, until a client grants permission. Entries not yet verified render with a visible "cifras ilustrativas" tag and `data-gate="pending"`, which blocks the merge (`npm run check`).
