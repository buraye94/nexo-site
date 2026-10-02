// Contract tests for functions/api/contact.js (eng review R13). Resend's fetch is stubbed.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost, onRequestOptions, escapeHtml, validateLead } from '../functions/api/contact.js';

const valid = {
  name: 'Ana Restrepo',
  email: 'ana@mimarca.com.co',
  website: 'mimarca.com.co',
  need: 'diagnostico',
  message: '',
  page: '/agencia-seo-bogota/',
  lang: 'es',
  company_fax: '',
};

let calls;
const realFetch = globalThis.fetch;
const realError = console.error;

function stubResend(response = { ok: true, status: 200, text: async () => '' }) {
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (response instanceof Error) throw response;
    return response;
  };
}

const post = (body, { host = 'clicroot.com', key = 'test-key', raw } = {}) =>
  onRequestPost({
    request: new Request(`https://${host}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw ?? JSON.stringify(body),
    }),
    env: key ? { RESEND_API_KEY: key } : {},
  });

beforeEach(() => {
  calls = [];
  console.error = () => {};
  stubResend();
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
});

test('valid lead: 200, one Resend call with the preserved from / to / reply_to', async () => {
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer test-key');
  assert.equal(calls[0].body.from, 'clicroot <noreply@clicroot.com>');
  assert.deepEqual(calls[0].body.to, ['hello@clicroot.com']);
  assert.equal(calls[0].body.reply_to, 'ana@mimarca.com.co');
});

test('message is optional (design D8)', async () => {
  const res = await post({ ...valid, message: undefined });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
});

test('subject leads with need and page, no preview prefix on clicroot.com (R8)', async () => {
  await post(valid);
  assert.equal(calls[0].body.subject, 'Diagnóstico IA · /agencia-seo-bogota/ · Ana Restrepo');
});

test('"[preview]" prefix off clicroot.com (R11)', async () => {
  await post(valid, { host: 'redesign-2-0.nexo-site.pages.dev' });
  assert.match(calls[0].body.subject, /^\[preview\] Diagnóstico IA/);
});

test('page, need and lang reach the email body', async () => {
  await post({ ...valid, lang: 'en' });
  const html = calls[0].body.html;
  assert.match(html, /\/agencia-seo-bogota\//);
  assert.match(html, /Diagnóstico IA/);
  assert.match(html, />en</);
});

test('every field is HTML-escaped in the email (R7)', async () => {
  await post({ ...valid, name: '<b>Ana</b>', message: '<a href="https://evil.example">x</a>', website: '"><img src=x>' });
  const html = calls[0].body.html;
  assert.ok(!html.includes('<b>Ana</b>'));
  assert.ok(!html.includes('<a href="https://evil.example">'));
  assert.ok(!html.includes('<img src=x>'));
  assert.match(html, /&lt;b&gt;Ana&lt;\/b&gt;/);
});

test('line breaks are stripped from subject values (R7)', async () => {
  await post({ ...valid, name: 'Ana\r\nBcc: x@y.com' });
  assert.ok(!/[\r\n]/.test(calls[0].body.subject));
});

test('honeypot filled: 200 and nothing is sent (R7)', async () => {
  const res = await post({ ...valid, company_fax: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('malformed JSON returns 400 instead of 500 (R13)', async () => {
  const res = await post(null, { raw: '{not json' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'invalid_json' });
  assert.equal(calls.length, 0);
});

const invalid = [
  ['missing name', { name: '' }, 'name_required'],
  ['name too long', { name: 'a'.repeat(121) }, 'name_too_long'],
  ['missing email', { email: '' }, 'email_required'],
  ['incomplete email', { email: 'ana@mimarca' }, 'email_invalid'],
  ['website too long', { website: 'a'.repeat(301) }, 'website_too_long'],
  ['message too long', { message: 'a'.repeat(5001) }, 'message_too_long'],
  ['unknown need', { need: 'seo-gratis' }, 'need_invalid'],
  ['missing need', { need: undefined }, 'need_invalid'],
];
for (const [label, patch, code] of invalid) {
  test(`validation: ${label} -> 400 ${code}`, async () => {
    const res = await post({ ...valid, ...patch });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: code });
    assert.equal(calls.length, 0);
  });
}

test('odd page values are dropped, the lead still sends', async () => {
  const res = await post({ ...valid, page: 'https://evil.example/x' });
  assert.equal(res.status, 200);
  assert.match(calls[0].body.subject, / · \/ · /);
});

test('missing RESEND_API_KEY: loud 500, never a fake success (R11)', async () => {
  const res = await post(valid, { key: null });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'email_not_configured' });
  assert.equal(calls.length, 0);
});

test('Resend rejects: 500 email_failed', async () => {
  stubResend({ ok: false, status: 422, text: async () => 'bad' });
  const res = await post(valid);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'email_failed' });
});

test('Resend unreachable: 500 email_failed', async () => {
  stubResend(new Error('network down'));
  const res = await post(valid);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'email_failed' });
});

test('preflight headers unchanged', async () => {
  const res = await onRequestOptions();
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://clicroot.com');
  assert.equal(res.headers.get('Access-Control-Allow-Methods'), 'POST, OPTIONS');
  assert.equal(res.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});

test('escapeHtml covers the five HTML metacharacters', () => {
  assert.equal(escapeHtml(`<a href="x" title='y'>&</a>`), '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
});

test('validateLead trims and defaults lang to es', () => {
  const { lead } = validateLead({ ...valid, name: '  Ana  ', lang: 'fr' });
  assert.equal(lead.name, 'Ana');
  assert.equal(lead.lang, 'es');
});
