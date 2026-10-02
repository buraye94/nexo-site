#!/usr/bin/env node
// Content inventory for the built site (dist/).
//   node scripts/inventory.mjs snapshot [--out scripts/inventory-baseline.json]
//   node scripts/inventory.mjs check [--baseline scripts/inventory-baseline.json] [--allow-pending]
// `check` is the merge gate: landing content and SEO fields must survive the redesign,
// internal links and hreflang targets must resolve, fonts stay within the loaded weights,
// and nothing marked data-gate="pending" (illustrative proof, unconfirmed copy) may ship.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE = 'https://clicroot.com';
const ALLOWED_WEIGHTS = new Set(['400', '500', '600', '700', '800', 'normal', 'bold', 'inherit']);

const args = process.argv.slice(2);
const mode = args[0];
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function pagePath(file) {
  const rel = '/' + relative(DIST, file).replace(/index\.html$/, '');
  return rel;
}

function schemaTypes(html) {
  const types = new Set();
  let faqCount = 0;
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      types.add('INVALID_JSON');
      continue;
    }
    const nodes = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
    for (const n of nodes) {
      if (!n || !n['@type']) continue;
      types.add(n['@type']);
      if (n['@type'] === 'FAQPage') faqCount = Math.max(faqCount, (n.mainEntity || []).length);
    }
  }
  return { types: [...types].sort(), faqCount };
}

function inspect(file) {
  const html = readFileSync(file, 'utf8');
  const one = (re) => {
    const m = html.match(re);
    return m ? decode(m[1]) : null;
  };
  const hreflang = {};
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) hreflang[m[1]] = m[2];
  const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => decode(m[1])).filter(Boolean);
  const { types, faqCount } = schemaTypes(html);
  return {
    title: one(/<title>([\s\S]*?)<\/title>/),
    description: one(/<meta name="description" content="([^"]*)"/),
    canonical: one(/<link rel="canonical" href="([^"]*)"/),
    hreflang,
    h2,
    faqCount,
    schemaTypes: types,
  };
}

function htmlPages() {
  if (!existsSync(DIST)) {
    console.error('dist/ not found: run `npm run build` first.');
    process.exit(2);
  }
  return walk(DIST).filter((f) => f.endsWith('.html') && !f.includes(`${DIST}/admin/`));
}

function snapshot() {
  const pages = {};
  for (const f of htmlPages()) pages[pagePath(f)] = inspect(f);
  const out = opt('--out', join(ROOT, 'scripts/inventory-baseline.json'));
  writeFileSync(out, JSON.stringify(pages, null, 2) + '\n');
  console.log(`snapshot: ${Object.keys(pages).length} pages -> ${relative(ROOT, out)}`);
}

const isLanding = (path) => path !== '/' && path !== '/en/' && path !== '/es/' && !path.includes('/blog/') && !path.startsWith('/admin');

function resolveTarget(path) {
  const clean = path.split('#')[0].split('?')[0];
  if (clean === '' ) return true;
  const candidates = [join(DIST, clean), join(DIST, clean, 'index.html')];
  return candidates.some((c) => existsSync(c) && (statSync(c).isFile() || existsSync(join(c, 'index.html'))));
}

function check() {
  const baselineFile = opt('--baseline', join(ROOT, 'scripts/inventory-baseline.json'));
  const replacedFile = join(ROOT, 'scripts/inventory-replaced.json');
  const baseline = JSON.parse(readFileSync(baselineFile, 'utf8'));
  const replaced = existsSync(replacedFile) ? JSON.parse(readFileSync(replacedFile, 'utf8')) : {};
  // Sections whose H2 was rewritten (e.g. to remove an "X, no Y" contrast): old text -> new text.
  const renamedFile = join(ROOT, 'scripts/inventory-renamed.json');
  const renamed = existsSync(renamedFile) ? JSON.parse(readFileSync(renamedFile, 'utf8')) : {};
  const errors = [];
  const pending = [];
  const files = htmlPages();
  const current = {};
  const ids = {};
  const htmlByPath = {};
  for (const f of files) {
    const p = pagePath(f);
    const html = readFileSync(f, 'utf8');
    htmlByPath[p] = html;
    current[p] = inspect(f);
    ids[p] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }

  // 1. Landing pages keep their SEO fields and unique sections.
  for (const [path, before] of Object.entries(baseline)) {
    if (!isLanding(path)) continue;
    const now = current[path];
    if (!now) {
      errors.push(`${path}: page missing from the build`);
      continue;
    }
    for (const key of ['title', 'description', 'canonical']) {
      if (before[key] !== now[key]) errors.push(`${path}: ${key} changed\n    before: ${before[key]}\n    now:    ${now[key]}`);
    }
    for (const [lang, href] of Object.entries(before.hreflang)) {
      if (now.hreflang[lang] !== href) errors.push(`${path}: hreflang ${lang} changed (${href} -> ${now.hreflang[lang]})`);
    }
    if (now.faqCount < before.faqCount) errors.push(`${path}: FAQ count dropped ${before.faqCount} -> ${now.faqCount}`);
    for (const t of before.schemaTypes) {
      if (!now.schemaTypes.includes(t)) errors.push(`${path}: schema type ${t} dropped`);
    }
    const allowed = new Set(replaced[path] || []);
    for (const h of before.h2) {
      if (allowed.has(h)) continue;
      if (now.h2.includes(h)) continue;
      const newName = renamed[path] && renamed[path][h];
      if (newName && now.h2.includes(newName)) continue;
      errors.push(newName ? `${path}: renamed section missing: "${h}" -> "${newName}"` : `${path}: unique section dropped: "${h}"`);
    }
  }

  // 2. Internal links, anchors, legacy contact anchor, hreflang targets.
  for (const [path, html] of Object.entries(htmlByPath)) {
    for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
      const href = m[1];
      if (/\/#contact(?!o)/.test(href) || href === '#contact') errors.push(`${path}: legacy contact anchor ${href}`);
      if (href.startsWith('#') && href.length > 1) {
        const id = href.slice(1).split('?')[0];
        if (!ids[path].has(id)) errors.push(`${path}: dead in-page anchor ${href}`);
      } else if (href.startsWith('/') && !href.startsWith('//')) {
        const target = href.split('#')[0].split('?')[0];
        if (/\.(svg|png|ico|xml|txt|css|js|webp|avif|jpg|woff2?)$/.test(target)) continue;
        if (target.startsWith('/admin')) continue;
        if (!resolveTarget(target)) errors.push(`${path}: dead link ${href}`);
        const hash = href.includes('#') ? href.split('#')[1].split('?')[0] : '';
        if (hash) {
          const key = target.endsWith('/') ? target : target + '/';
          if (ids[key] && !ids[key].has(hash)) errors.push(`${path}: dead anchor ${href}`);
        }
      }
    }
    for (const href of Object.values(current[path].hreflang)) {
      if (!href.startsWith(SITE)) continue;
      if (!resolveTarget(href.slice(SITE.length) || '/')) errors.push(`${path}: hreflang target missing ${href}`);
    }
    for (const m of html.matchAll(/data-gate="pending"[^>]*data-gate-reason="([^"]+)"/g)) pending.push(`${path}: ${m[1]}`);
  }

  // 3. Font weights stay within the loaded set.
  for (const f of walk(DIST).filter((x) => x.endsWith('.css') || x.endsWith('.html'))) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/font-weight:\s*([^;}"']+)/g)) {
      const w = m[1].trim();
      if (!ALLOWED_WEIGHTS.has(w)) errors.push(`${relative(DIST, f)}: font-weight ${w} is not loaded`);
    }
  }

  const uniquePending = [...new Set(pending)];
  if (uniquePending.length) {
    const label = flag('--allow-pending') ? 'pending (allowed on preview)' : 'pending (blocks merge)';
    console.log(`\n${label}: ${uniquePending.length}`);
    for (const p of uniquePending) console.log(`  - ${p}`);
    if (!flag('--allow-pending')) errors.push(`${uniquePending.length} pending item(s) need Felipe's input before merge`);
  }

  const dedup = [...new Set(errors)];
  if (dedup.length) {
    console.log(`\ninventory check FAILED (${dedup.length}):`);
    for (const e of dedup) console.log(`  - ${e}`);
    process.exit(1);
  }
  console.log(`\ninventory check passed: ${Object.keys(current).length} pages, ${Object.keys(baseline).filter(isLanding).length} landings compared`);
}

if (mode === 'snapshot') snapshot();
else if (mode === 'check') check();
else {
  console.error('usage: inventory.mjs snapshot|check [--baseline file] [--out file] [--allow-pending]');
  process.exit(2);
}
