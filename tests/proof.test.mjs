// selectProof rules (eng review R5) and row math (design D12).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectProof, pctChange, toRows } from '../src/lib/proof.ts';

const entry = (id, over = {}) => ({
  id,
  label: id,
  services: ['consultoria'],
  markets: ['CO'],
  before: 10,
  after: 20,
  windowMonths: 6,
  source: 'GA4',
  status: 'verified',
  clientOk: true,
  order: 0,
  ...over,
});

test('percentage is computed from before and after, never stored', () => {
  assert.equal(pctChange(14, 43), 207);
  assert.equal(pctChange(52, 85), 63);
  assert.equal(pctChange(0, 10), 0);
});

test('bar widths share one scale per chart', () => {
  const rows = toRows([entry('a', { before: 50, after: 100 }), entry('b', { before: 10, after: 25 })]);
  assert.equal(rows[0].afterWidth, 100);
  assert.equal(rows[0].beforeWidth, 50);
  assert.equal(rows[1].afterWidth, 25);
});

test('verified entries without the client OK never render', () => {
  const sel = selectProof([entry('a'), entry('b', { clientOk: false })]);
  assert.deepEqual(sel.rows.map((r) => r.id), ['a']);
});

test('illustrative entries render and flag the selection as pending', () => {
  const sel = selectProof([entry('a', { status: 'illustrative', clientOk: false })]);
  assert.equal(sel.rows.length, 1);
  assert.equal(sel.pending, true);
});

test('homepage (no scope) shows every displayable entry in order', () => {
  const sel = selectProof([entry('b', { order: 2 }), entry('a', { order: 1 }), entry('c', { order: 3 })]);
  assert.deepEqual(sel.rows.map((r) => r.id), ['a', 'b', 'c']);
  assert.equal(sel.scoped, false);
});

test('a service page with 2+ matches shows its own clients', () => {
  const sel = selectProof(
    [entry('x', { services: ['geo'], order: 1 }), entry('y', { services: ['local'], order: 2 }), entry('z', { services: ['geo', 'local'], order: 3 })],
    { service: 'geo' },
  );
  assert.equal(sel.scoped, true);
  assert.deepEqual(sel.rows.map((r) => r.id), ['x', 'z']);
});

test('a city page with fewer than 2 matches falls back to the overall top 3, unscoped', () => {
  const sel = selectProof(
    [entry('a', { order: 1 }), entry('b', { order: 2, city: 'monterrey' }), entry('c', { order: 3 }), entry('d', { order: 4 })],
    { city: 'monterrey' },
  );
  assert.equal(sel.scoped, false);
  assert.deepEqual(sel.rows.map((r) => r.id), ['a', 'b', 'c']);
});

test('no displayable entries: empty selection (the card is not rendered)', () => {
  const sel = selectProof([entry('a', { clientOk: false })], { service: 'geo' });
  assert.equal(sel.rows.length, 0);
});
