import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestLimiter } from '../src/utils/requestLimit.ts';
import { validateMockRecords } from '../src/utils/mockRecords.ts';
import { isJsonObject } from '../src/utils/jsonBody.ts';
import { selectCampusDataset } from '../src/utils/campusDataset.ts';


test("reject zero rate limit", () => {
  assert.throws(() => createRequestLimiter(0, 1000), RangeError);
});

test("reject negative rate limit", () => {
  assert.throws(() => createRequestLimiter(-1, 1000), RangeError);
});

test("reject fractional rate limit", () => {
  assert.throws(() => createRequestLimiter(1.5, 1000), RangeError);
});

test("reject infinite rate limit", () => {
  assert.throws(() => createRequestLimiter(Infinity, 1000), RangeError);
});

test("reject zero time window", () => {
  assert.throws(() => createRequestLimiter(1, 0), RangeError);
});

test("reject negative time window", () => {
  assert.throws(() => createRequestLimiter(1, -1000), RangeError);
});

test("reject fractional time window", () => {
  assert.throws(() => createRequestLimiter(1, 1.5), RangeError);
});

test("reject NaN time window", () => {
  assert.throws(() => createRequestLimiter(1, NaN), RangeError);
});

test("reject zero client capacity", () => {
  assert.throws(() => createRequestLimiter(1, 1000, 0), RangeError);
});

test("reject negative client capacity", () => {
  assert.throws(() => createRequestLimiter(1, 1000, -1), RangeError);
});

test("reject fractional client capacity", () => {
  assert.throws(() => createRequestLimiter(1, 1000, 1.5), RangeError);
});

test("reject infinite client capacity", () => {
  assert.throws(() => createRequestLimiter(1, 1000, Infinity), RangeError);
});

test("reject NaN request clock", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('student', NaN), false);
});
