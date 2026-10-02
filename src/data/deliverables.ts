// "Qué incluye" rows per service family. City pages reuse "consultoria".
// Timings are promises to clients (rule 3): keep `timingConfirmed: false` until
// Felipe confirms them; unconfirmed sets render data-gate="pending", which blocks the merge.
import type { Lang, ServiceKey } from './pages';

export interface Deliverable {
  title: string;
  text: string;
  /** "Entregable: X · semana N" */
  meta: string;
}

export interface DeliverableSet {
  timingConfirmed: boolean;
  es: Deliverable[];
  en: Deliverable[];
}

export const deliverables: Record<ServiceKey, DeliverableSet> = {
  consultoria: {
    timingConfirmed: false,
    es: [
      { title: 'Diagnóstico técnico y de demanda', text: 'Qué búsquedas traen clientes en tu categoría y qué frena hoy a tu sitio.', meta: 'Entregable: auditoría priorizada · semana 2' },
      { title: 'Estrategia de 2 a 3 frentes', text: 'Solo lo que mueve leads, con su impacto estimado y su orden.', meta: 'Entregable: hoja de ruta · semana 3' },
      { title: 'Ejecución on-page y de contenido', text: 'Páginas que responden a la intención real de búsqueda y que la IA puede citar.', meta: 'Entregable: briefs y cambios en vivo · mensual' },
      { title: 'Tablero de resultados en vivo', text: 'Leads, visibilidad en IA y búsquedas de marca, actualizado cada semana.', meta: 'Entregable: acceso al tablero · desde el mes 1' },
    ],
    en: [
      { title: 'Technical and demand diagnosis', text: 'Which searches bring customers in your category and what is holding your site back today.', meta: 'Deliverable: prioritized audit · week 2' },
      { title: 'A strategy built on 2 or 3 fronts', text: 'Only what moves leads, with its estimated impact and its order.', meta: 'Deliverable: roadmap · week 3' },
      { title: 'On-page and content execution', text: 'Pages that answer the real search intent and that AI can cite.', meta: 'Deliverable: briefs and live changes · monthly' },
      { title: 'Live results dashboard', text: 'Leads, AI visibility and branded searches, updated every week.', meta: 'Deliverable: dashboard access · from month 1' },
    ],
  },
  auditoria: {
    timingConfirmed: false,
    es: [
      { title: 'Salud técnica del sitio', text: 'Rastreo, indexación, velocidad y arquitectura, revisados página por página donde importa.', meta: 'Entregable: informe técnico · semana 1' },
      { title: 'Contenido, enlaces y SEO local', text: 'Cada frente evaluado contra las búsquedas que de verdad traen clientes.', meta: 'Entregable: diagnóstico por frente · semana 2' },
      { title: 'Acceso de la IA y datos estructurados', text: 'Si ChatGPT, Gemini y Google pueden leer, entender y citar tu sitio.', meta: 'Entregable: revisión GEO · semana 2' },
      { title: 'Lista priorizada y llamada de entrega', text: 'Qué arreglar primero según su impacto en leads, explicado por el consultor que hizo la auditoría.', meta: 'Entregable: plan de correcciones · semana 3' },
    ],
    en: [
      { title: 'Technical health of the site', text: 'Crawling, indexing, speed and architecture, reviewed page by page where it matters.', meta: 'Deliverable: technical report · week 1' },
      { title: 'Content, links and local SEO', text: 'Each area measured against the searches that actually bring customers.', meta: 'Deliverable: diagnosis by area · week 2' },
      { title: 'AI access and structured data', text: 'Whether ChatGPT, Gemini and Google can read, understand and cite your site.', meta: 'Deliverable: GEO review · week 2' },
      { title: 'Prioritized list and handover call', text: 'What to fix first by its impact on leads, explained by the consultant who ran the audit.', meta: 'Deliverable: fix plan · week 3' },
    ],
  },
  tecnico: {
    timingConfirmed: false,
    es: [
      { title: 'Auditoría técnica', text: 'Core Web Vitals, rastreo, indexación, canónicas y arquitectura de enlaces internos.', meta: 'Entregable: auditoría técnica · semana 2' },
      { title: 'Correcciones listas para tu equipo', text: 'Cada problema con su causa, su prioridad y lo que tiene que cambiar el desarrollador.', meta: 'Entregable: tickets priorizados · semana 3' },
      { title: 'Acceso de los bots de IA', text: 'robots.txt, datos estructurados y llms.txt para que los motores de IA lean tu sitio.', meta: 'Entregable: configuración GEO técnica · semana 3' },
      { title: 'Monitoreo de salud técnica', text: 'Seguimiento de errores, velocidad e indexación para que nada se rompa en silencio.', meta: 'Entregable: reporte técnico · mensual' },
    ],
    en: [
      { title: 'Technical audit', text: 'Core Web Vitals, crawling, indexing, canonicals and internal link architecture.', meta: 'Deliverable: technical audit · week 2' },
      { title: 'Fixes ready for your team', text: 'Every issue with its cause, its priority and what the developer needs to change.', meta: 'Deliverable: prioritized tickets · week 3' },
      { title: 'AI bot access', text: 'robots.txt, structured data and llms.txt so AI engines can read your site.', meta: 'Deliverable: technical GEO setup · week 3' },
      { title: 'Technical health monitoring', text: 'Tracking errors, speed and indexing so nothing breaks silently.', meta: 'Deliverable: technical report · monthly' },
    ],
  },
  local: {
    timingConfirmed: false,
    es: [
      { title: 'Perfil de Google optimizado', text: 'Categorías, servicios, fotos y datos de tu ficha listos para el paquete local.', meta: 'Entregable: Google Business Profile · semana 2' },
      { title: 'Páginas por ciudad o zona', text: 'Contenido local que responde cómo busca tu cliente en su barrio o su plaza.', meta: 'Entregable: páginas locales · mensual' },
      { title: 'Citas y reseñas consistentes', text: 'Nombre, dirección y teléfono iguales en todos los directorios que importan.', meta: 'Entregable: auditoría de citas · mensual' },
      { title: 'Visibilidad local en la IA', text: 'Si los asistentes de IA te nombran cuando alguien pregunta "cerca de mí".', meta: 'Entregable: medición local · mensual' },
    ],
    en: [
      { title: 'Optimized Google profile', text: 'Categories, services, photos and listing data ready for the local pack.', meta: 'Deliverable: Google Business Profile · week 2' },
      { title: 'City and area pages', text: 'Local content that answers how your customer searches in their neighborhood or city.', meta: 'Deliverable: local pages · monthly' },
      { title: 'Consistent citations and reviews', text: 'The same name, address and phone across every directory that matters.', meta: 'Deliverable: citation audit · monthly' },
      { title: 'Local visibility in AI', text: 'Whether AI assistants name you when someone asks for something "near me".', meta: 'Deliverable: local measurement · monthly' },
    ],
  },
  linkbuilding: {
    timingConfirmed: false,
    es: [
      { title: 'Perfil de enlaces auditado', text: 'Qué enlaces te suman, cuáles son un riesgo y dónde está la brecha con tu competencia.', meta: 'Entregable: auditoría de enlaces · semana 2' },
      { title: 'Plan de autoridad', text: 'Temas, medios y menciones que construyen autoridad en tu categoría.', meta: 'Entregable: plan de autoridad · semana 3' },
      { title: 'Enlaces y menciones ganados', text: 'Colocaciones en sitios reales y relevantes, nunca redes de enlaces comprados.', meta: 'Entregable: enlaces publicados · mensual' },
      { title: 'Reporte con cada enlace', text: 'La URL, el sitio y su autoridad de cada enlace, para que veas exactamente qué se hizo.', meta: 'Entregable: reporte de enlaces · mensual' },
    ],
    en: [
      { title: 'Audited link profile', text: 'Which links help you, which ones are a risk and where the gap with your competitors is.', meta: 'Deliverable: link audit · week 2' },
      { title: 'Authority plan', text: 'Topics, publications and mentions that build authority in your category.', meta: 'Deliverable: authority plan · week 3' },
      { title: 'Earned links and mentions', text: 'Placements on real, relevant sites, never networks of bought links.', meta: 'Deliverable: published links · monthly' },
      { title: 'A report with every link', text: 'The URL, the site and its authority for each link, so you see exactly what was done.', meta: 'Deliverable: link report · monthly' },
    ],
  },
  geo: {
    timingConfirmed: false,
    es: [
      { title: 'Diagnóstico de visibilidad en IA', text: 'Cómo te nombran ChatGPT, Gemini y los AI Overviews en las preguntas de tu categoría.', meta: 'Entregable: diagnóstico IA · semana 2' },
      { title: 'Contenido citable y entidad de marca', text: 'Respuestas claras, datos con fuente y una marca que el modelo reconoce.', meta: 'Entregable: plan de contenido citable · semana 3' },
      { title: 'Acceso de bots y datos estructurados', text: 'Que los motores de IA puedan rastrear, entender y citar tus páginas.', meta: 'Entregable: configuración técnica GEO · semana 3' },
      { title: 'Medición de menciones y citas', text: 'Cuántas respuestas de IA te nombran y te citan, mes contra mes.', meta: 'Entregable: tablero de visibilidad en IA · mensual' },
    ],
    en: [
      { title: 'AI visibility diagnosis', text: 'How ChatGPT, Gemini and AI Overviews name you in the questions of your category.', meta: 'Deliverable: AI diagnosis · week 2' },
      { title: 'Citable content and brand entity', text: 'Clear answers, sourced data and a brand the model recognizes.', meta: 'Deliverable: citable content plan · week 3' },
      { title: 'Bot access and structured data', text: 'So AI engines can crawl, understand and cite your pages.', meta: 'Deliverable: technical GEO setup · week 3' },
      { title: 'Mentions and citations measured', text: 'How many AI answers name and cite you, month over month.', meta: 'Deliverable: AI visibility dashboard · monthly' },
    ],
  },
  hub: {
    timingConfirmed: false,
    es: [
      { title: 'Diagnóstico de los seis frentes', text: 'Técnica, contenido, enlaces, local, IA y medición, en un solo diagnóstico.', meta: 'Entregable: diagnóstico integral · semana 2' },
      { title: 'Hoja de ruta de 2 a 3 frentes', text: 'Los frentes que más mueven leads en tu caso, en orden de impacto.', meta: 'Entregable: hoja de ruta · semana 3' },
      { title: 'Ejecución mensual', text: 'El consultor senior que diseñó la estrategia la ejecuta con tu equipo.', meta: 'Entregable: cambios en vivo · mensual' },
      { title: 'Tablero de resultados', text: 'Leads, visibilidad en IA y búsquedas de marca en un solo lugar.', meta: 'Entregable: acceso al tablero · desde el mes 1' },
    ],
    en: [
      { title: 'Diagnosis of all six areas', text: 'Technical, content, links, local, AI and measurement, in a single diagnosis.', meta: 'Deliverable: full diagnosis · week 2' },
      { title: 'A roadmap built on 2 or 3 fronts', text: 'The fronts that move leads most in your case, in order of impact.', meta: 'Deliverable: roadmap · week 3' },
      { title: 'Monthly execution', text: 'The senior consultant who designed the strategy runs it with your team.', meta: 'Deliverable: live changes · monthly' },
      { title: 'Results dashboard', text: 'Leads, AI visibility and branded searches in one place.', meta: 'Deliverable: dashboard access · from month 1' },
    ],
  },
};

export const getDeliverables = (key: ServiceKey, lang: Lang) => ({
  rows: deliverables[key][lang],
  confirmed: deliverables[key].timingConfirmed,
});
