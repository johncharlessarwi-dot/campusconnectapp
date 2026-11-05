import test from 'node:test';
import assert from 'node:assert/strict';
import { selectCampusDataset } from '../src/utils/campusDataset.ts';

test('unknown university does not receive another campus listings', () => {
  const data = { udsm: [{title:'UDSM hostel'}], mwecau: [{title:'Moshi hostel'}] };
  assert.deepEqual(selectCampusDataset(data, 'mwecau'), [{title:'Moshi hostel'}]);
  assert.deepEqual(selectCampusDataset(data, 'unknown'), []);
});

test('campus lookups are case insensitive', () => {
  const data = { mwecau: [{ title: 'Moshi notice' }] };
  assert.deepEqual(selectCampusDataset(data, 'MWECAU'), data.mwecau);
});

test('prototype properties cannot be treated as campus records', () => {
  const data = Object.create({ inherited: [{ title: 'untrusted' }] }) as Record<string, {title:string}[]>;
  assert.deepEqual(selectCampusDataset(data, 'inherited'), []);
});

test('missing campus datasets safely return no listings', () => {
  assert.deepEqual(selectCampusDataset(undefined, 'mwecau'), []);
  assert.deepEqual(selectCampusDataset({}, 'mwecau'), []);
  assert.deepEqual(selectCampusDataset({ mwecau: [] }, ''), []);
});

test('malformed or whitespace campus scopes do not leak data', () => {
  const data = { '': [{ title: 'unscoped' }], mwecau: [{ title: 'valid' }] };
  for (const acronym of [' ', '\t', '../mwecau', 'mwecau/other', 'x'.repeat(33), null, 99]) {
    assert.deepEqual(selectCampusDataset(data, acronym as string), []);
  }
  assert.deepEqual(selectCampusDataset(data, '  MWECAU  '), data.mwecau);
});
