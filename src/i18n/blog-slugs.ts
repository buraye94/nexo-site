// es <-> en blog slug pairs, used by the blog [slug].astro templates to emit
// reciprocal hreflang between language versions of the same post.
export const esToEn: Record<string, string> = {
  'seo-latinoamerica': 'seo-latin-america',
  'link-building-2026': 'link-building-2026',
  'contenido-fondo-embudo': 'bottom-funnel-content',
  'como-aparecer-en-chatgpt': 'how-to-appear-in-chatgpt',
  'seo-e-inteligencia-artificial': 'seo-and-ai',
  'optimizar-para-perplexity-gemini': 'optimize-for-perplexity-gemini',
  'ai-overviews-google': 'google-ai-overviews',
  'seo-con-inteligencia-artificial': 'ai-powered-seo',
  'que-es-seo': 'what-is-seo',
  'como-posicionar-pagina-web': 'how-to-rank-website',
  'estrategia-seo': 'seo-strategy',
  'marketing-de-contenidos-seo': 'content-marketing-seo',
  'que-es-seo-local': 'what-is-local-seo',
  'que-es-link-building': 'what-is-link-building',
  'seo-tecnico-guia': 'technical-seo-guide',
};

export const enToEs: Record<string, string> = Object.fromEntries(
  Object.entries(esToEn).map(([es, en]) => [en, es])
);
