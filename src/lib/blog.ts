// Blog helpers: which service page a post hands off to, and reading time.

const TAG_TO_PAGE: Record<string, string> = {
  geo: 'geo',
  'link-building': 'linkbuilding',
  'seo-local': 'local',
  'local-seo': 'local',
  'seo-tecnico': 'tecnico',
  'technical-seo': 'tecnico',
  'consultoria-seo': 'consultoria',
  'seo-consulting': 'consultoria',
};

/** First tag that maps to a service page wins; everything else goes to consultoría. */
export function relatedPageId(tags: string[]): string {
  for (const tag of tags) {
    if (TAG_TO_PAGE[tag]) return TAG_TO_PAGE[tag];
  }
  return 'consultoria';
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/[#*_>`\-\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (date: Date, lang: 'es' | 'en') =>
  date.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
