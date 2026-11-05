import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestLimiter } from '../src/utils/requestLimit.ts';

test('throttles each client after limit and resets in next window', () => {
  const allow = createRequestLimiter(2, 1000);
  assert.equal(allow('student-a', 0), true);
  assert.equal(allow('student-a', 1), true);
  assert.equal(allow('student-a', 2), false);
  assert.equal(allow('student-b', 2), true);
  assert.equal(allow('student-a', 1000), true);
});
