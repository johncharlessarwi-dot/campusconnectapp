import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMockRecords } from '../src/utils/mockRecords.ts';

test('accepts up to three generated records', () => {
  assert.deepEqual(validateMockRecords([{name:'A'}, {name:'B'}]), [{name:'A'}, {name:'B'}]);
});

test('rejects oversized or non-array AI responses', () => {
  assert.throws(() => validateMockRecords([{}, {}, {}, {}]));
  assert.throws(() => validateMockRecords({name:'A'}));
});

test('rejects primitive or nested-array records', () => {
  assert.throws(() => validateMockRecords([{}, null]));
  assert.throws(() => validateMockRecords([['nested']]));
  assert.throws(() => validateMockRecords(['unstructured']));
});
