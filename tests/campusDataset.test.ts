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
