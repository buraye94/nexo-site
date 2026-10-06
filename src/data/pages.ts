// The single list of landing pages. Nav menus, Footer, related links, hreflang,
// breadcrumbs, proof matching and scripts/inventory.mjs all read from here.

export type Lang = 'es' | 'en';
export type Family = 'service' | 'city' | 'hub';
export type ServiceKey = 'consultoria' | 'auditoria' | 'tecnico' | 'local' | 'linkbuilding' | 'geo' | 'hub';
export type Market = 'CO' | 'MX';
export type CityKey = 'bogota' | 'medellin' | 'mexico' | 'monterrey' | 'guadalajara';

export interface PageEntry {
  id: string;
  family: Family;
  /** Deliverable set shown in "Qué incluye" (cities reuse consultoría). */
  deliverables: ServiceKey;
  /** Proof matching: a service page matches entries with this service. */
  service?: ServiceKey;
  /** Proof matching: a city page matches entries in this city. */
  city?: CityKey;
  market?: Market;
  es: { path: string; label: string };
  en: { path: string; label: string };
}

export const pages: PageEntry[] = [
  { id: 'consultoria', family: 'service', deliverables: 'consultoria', service: 'consultoria',
    es: { path: '/consultoria-seo/', label: 'Consultoría SEO' }, en: { path: '/en/seo-consulting/', label: 'SEO consulting' } },
  { id: 'auditoria', family: 'service', deliverables: 'auditoria', service: 'auditoria',
    es: { path: '/auditoria-seo/', label: 'Auditoría SEO' }, en: { path: '/en/seo-audit/', label: 'SEO audit' } },
  { id: 'tecnico', family: 'service', deliverables: 'tecnico', service: 'tecnico',
    es: { path: '/seo-tecnico/', label: 'SEO técnico' }, en: { path: '/en/technical-seo/', label: 'Technical SEO' } },
  { id: 'local', family: 'service', deliverables: 'local', service: 'local',
    es: { path: '/seo-local/', label: 'SEO local' }, en: { path: '/en/local-seo/', label: 'Local SEO' } },
  { id: 'linkbuilding', family: 'service', deliverables: 'linkbuilding', service: 'linkbuilding',
    es: { path: '/link-building/', label: 'Link building' }, en: { path: '/en/link-building/', label: 'Link building' } },
  { id: 'geo', family: 'service', deliverables: 'geo', service: 'geo',
    es: { path: '/geo-posicionamiento-en-ia/', label: 'Visibilidad en IA (GEO)' }, en: { path: '/en/geo-generative-engine-optimization/', label: 'AI visibility (GEO)' } },
  { id: 'servicios', family: 'hub', deliverables: 'hub',
    es: { path: '/servicios-seo/', label: 'Todos los servicios' }, en: { path: '/en/seo-services/', label: 'All services' } },
  { id: 'bogota', family: 'city', deliverables: 'consultoria', city: 'bogota', market: 'CO',
    es: { path: '/agencia-seo-bogota/', label: 'Bogotá' }, en: { path: '/en/seo-agency-bogota/', label: 'Bogotá' } },
  { id: 'medellin', family: 'city', deliverables: 'consultoria', city: 'medellin', market: 'CO',
    es: { path: '/agencia-seo-medellin/', label: 'Medellín' }, en: { path: '/en/seo-agency-medellin/', label: 'Medellín' } },
  { id: 'mexico', family: 'city', deliverables: 'consultoria', city: 'mexico', market: 'MX',
    es: { path: '/agencia-seo-mexico/', label: 'México' }, en: { path: '/en/seo-agency-mexico/', label: 'Mexico' } },
  { id: 'monterrey', family: 'city', deliverables: 'consultoria', city: 'monterrey', market: 'MX',
    es: { path: '/agencia-seo-monterrey/', label: 'Monterrey' }, en: { path: '/en/seo-agency-monterrey/', label: 'Monterrey' } },
  { id: 'guadalajara', family: 'city', deliverables: 'consultoria', city: 'guadalajara', market: 'MX',
    es: { path: '/agencia-seo-guadalajara/', label: 'Guadalajara' }, en: { path: '/en/seo-agency-guadalajara/', label: 'Guadalajara' } },
];

export const homePath = (lang: Lang) => (lang === 'es' ? '/' : '/en/');
export const blogPath = (lang: Lang) => (lang === 'es' ? '/es/blog/' : '/en/blog/');
export const privacyPath = (lang: Lang) => (lang === 'es' ? '/privacidad/' : '/en/privacy/');

export function getPage(id: string): PageEntry {
  const page = pages.find((p) => p.id === id);
  if (!page) throw new Error(`Unknown page id "${id}" (src/data/pages.ts)`);
  return page;
}

/** Link text outside the menus: cities read as "Agencia SEO en Bogotá". */
export function linkLabel(page: PageEntry, lang: Lang): string {
  if (page.family !== 'city') return page[lang].label;
  return lang === 'es' ? `Agencia SEO en ${page.es.label}` : `SEO agency in ${page.en.label}`;
}

export const servicePages = () => pages.filter((p) => p.family === 'service');
export const cityPages = () => pages.filter((p) => p.family === 'city');
export const hubPage = () => pages.find((p) => p.family === 'hub')!;

/** 4-6 related pages: same-family neighbours first, then the other family. */
export function relatedPages(id: string, max = 5): PageEntry[] {
  const page = getPage(id);
  const others = pages.filter((p) => p.id !== id);
  const ordered =
    page.family === 'city'
      ? [...others.filter((p) => p.family === 'service' && ['consultoria', 'local', 'auditoria'].includes(p.id)),
         ...others.filter((p) => p.family === 'city' && p.market === page.market),
         ...others.filter((p) => p.family === 'city' && p.market !== page.market)]
      : page.family === 'hub'
        ? [...servicePages(), ...cityPages().slice(0, 1)]
        : [...others.filter((p) => p.family === 'service'), hubPage(), ...cityPages().slice(0, 2)];
  return [...new Map(ordered.map((p) => [p.id, p])).values()].slice(0, max);
}
