// Page registry shape (eng review R10). The inventory script checks the built pages;
// this checks the registry itself.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pages, relatedPages, linkLabel } from '../src/data/pages.ts';
import { deliverables } from '../src/data/deliverables.ts';

const root = new URL('..', import.meta.url).pathname;
const sourceFor = (path) => {
  const slug = path.replace(/^\/(en\/)?/, '').replace(/\/$/, '');
  return `${root}src/pages/${path.startsWith('/en/') ? 'en/' : ''}${slug}.astro`;
};

test('12 landings, unique ids and paths', () => {
  assert.equal(pages.length, 12);
  assert.equal(new Set(pages.map((p) => p.id)).size, 12);
  const paths = pages.flatMap((p) => [p.es.path, p.en.path]);
  assert.equal(new Set(paths).size, 24);
});

test('every path has a trailing slash and a source page', () => {
  for (const p of pages) {
    for (const lang of ['es', 'en']) {
      assert.match(p[lang].path, /^\/.*\/$/, `${p.id} ${lang}`);
      assert.ok(existsSync(sourceFor(p[lang].path)), `missing ${sourceFor(p[lang].path)}`);
    }
  }
});

test('service pages carry a service tag, city pages a city and market', () => {
  for (const p of pages) {
    if (p.family === 'service') assert.ok(p.service, p.id);
    if (p.family === 'city') assert.ok(p.city && p.market, p.id);
  }
});

test('every page points at a deliverable set with ES and EN rows', () => {
  for (const p of pages) {
    const set = deliverables[p.deliverables];
    assert.ok(set, p.id);
    assert.equal(set.es.length, set.en.length, p.deliverables);
    assert.ok(set.es.length >= 3);
  }
});

test('related pages never include the page itself and stay within 5', () => {
  for (const p of pages) {
    const rel = relatedPages(p.id);
    assert.ok(rel.length >= 4 && rel.length <= 5, p.id);
    assert.ok(!rel.some((r) => r.id === p.id), p.id);
  }
});

test('city link labels read as agency pages', () => {
  const bogota = pages.find((p) => p.id === 'bogota');
  assert.equal(linkLabel(bogota, 'es'), 'Agencia SEO en Bogotá');
  assert.equal(linkLabel(bogota, 'en'), 'SEO agency in Bogotá');
});
