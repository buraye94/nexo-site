// Proof selection and row math (design D12, eng R5). Pure: no Astro imports, so
// node:test can run it directly (tests/proof.test.mjs).

export interface ProofEntry {
  id: string;
  label: string;
  services: string[];
  markets: string[];
  city?: string;
  before: number;
  after: number;
  windowMonths: number;
  source: string;
  status: 'illustrative' | 'verified';
  clientOk: boolean;
  order: number;
}

export interface ProofRow extends ProofEntry {
  pct: number;
  beforeWidth: number;
  afterWidth: number;
}

export interface ProofSelection {
  rows: ProofRow[];
  /** true when the rows match the page's service or city; false = overall fallback. */
  scoped: boolean;
  /** true when any row is illustrative (renders data-gate="pending"). */
  pending: boolean;
}

export interface ProofScope {
  service?: string;
  city?: string;
}

/** Entries allowed on the page: verified with the client's OK, or illustrative (flagged). */
export const displayable = (entries: ProofEntry[]) =>
  entries
    .filter((e) => e.status === 'illustrative' || e.clientOk)
    .sort((a, b) => a.order - b.order);

export const pctChange = (before: number, after: number) =>
  before > 0 ? Math.round(((after - before) / before) * 100) : 0;

export function toRows(entries: ProofEntry[]): ProofRow[] {
  const max = Math.max(1, ...entries.map((e) => Math.max(e.before, e.after)));
  return entries.map((e) => ({
    ...e,
    pct: pctChange(e.before, e.after),
    beforeWidth: Math.round((e.before / max) * 100),
    afterWidth: Math.round((e.after / max) * 100),
  }));
}

/**
 * Landing pages show their own matches when there are at least 2; otherwise the
 * overall top `limit` under a neutral heading. No scope (homepage) returns everything.
 */
export function selectProof(entries: ProofEntry[], scope: ProofScope = {}, limit = 3): ProofSelection {
  const pool = displayable(entries);
  const hasScope = Boolean(scope.service || scope.city);
  if (!hasScope) {
    const rows = toRows(pool);
    return { rows, scoped: false, pending: rows.some((r) => r.status === 'illustrative') };
  }
  const matches = pool.filter(
    (e) => (scope.service && e.services.includes(scope.service)) || (scope.city && e.city === scope.city),
  );
  const chosen = matches.length >= 2 ? matches.slice(0, limit) : pool.slice(0, limit);
  const rows = toRows(chosen);
  return { rows, scoped: matches.length >= 2, pending: rows.some((r) => r.status === 'illustrative') };
}
