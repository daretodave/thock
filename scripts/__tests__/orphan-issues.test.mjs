import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findOrphans, isMirror, severityOf } from '../plan/orphan-issues.mjs';

const mirror = (number, extra = []) => ({
  number,
  title: `finding ${number}`,
  labels: [{ name: 'loop:opened' }, { name: 'source:audit' }, ...extra.map((name) => ({ name }))],
});

test('isMirror needs loop:opened plus a source label', () => {
  assert.equal(isMirror(mirror(1)), true);
  assert.equal(isMirror({ number: 2, labels: [{ name: 'loop:opened' }, { name: 'loop:lock' }] }), false);
  assert.equal(isMirror({ number: 3, labels: [{ name: 'source:audit' }] }), false);
});

test('severityOf reads the severity label', () => {
  assert.equal(severityOf(mirror(1, ['severity:med'])), 'med');
  assert.equal(severityOf(mirror(1)), 'unknown');
});

test('findOrphans returns mirrors not referenced in the plan', () => {
  const plan = '### [x] row\n- issue: #776\n### row\n- issue: #1016, #8000';
  const orphans = findOrphans([mirror(799, ['severity:med']), mirror(776), mirror(80), mirror(1016)], plan);
  assert.deepEqual(orphans, [
    { number: 80, title: 'finding 80', severity: 'unknown' },
    { number: 799, title: 'finding 799', severity: 'med' },
  ]);
});
