import test from 'node:test';
import assert from 'node:assert/strict';
import { isJsonObject } from '../src/utils/jsonBody.ts';

test('accepts ordinary JSON objects', () => {
  assert.equal(isJsonObject({ message: 'Habari' }), true);
  assert.equal(isJsonObject({}), true);
});

test('rejects missing, array and primitive bodies', () => {
  for (const value of [null, undefined, [], ['x'], 'hi', 42, true]) {
    assert.equal(isJsonObject(value), false);
  }
});
