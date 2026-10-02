import { getCollection } from 'astro:content';
import type { Lang } from '../data/pages';
import type { ProofEntry } from './proof';

/** Load the cases collection as language-specific proof entries. */
export async function loadProof(lang: Lang): Promise<ProofEntry[]> {
  const cases = await getCollection('cases');
  return cases.map(({ id, data }) => ({
    id,
    label: lang === 'es' ? data.label_es : data.label_en,
    services: data.services,
    markets: data.markets,
    city: data.city,
    before: data.before,
    after: data.after,
    windowMonths: data.window_months,
    source: lang === 'es' ? data.source_es : data.source_en,
    status: data.status,
    clientOk: data.client_ok,
    order: data.order,
  }));
}
