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

test("reject infinite request clock", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('student', Infinity), false);
});

test("reject fractional request clock", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('student', 0.5), false);
});

test("reject excessive client key", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('x'.repeat(257), 0), false);
});

test("reject newline client key", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('student\nforged', 0), false);
});

test("reject carriage return client key", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('student\rforged', 0), false);
});

test("normalize padded client key", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow(' student ', 0), true); assert.equal(allow('student', 1), false);
});

test("retain rate limit for unknown clients", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('', 0), true); assert.equal(allow('  ', 1), false);
});

test("recover rate budget after window expiry", () => {
  const allow = createRequestLimiter(1, 1000); assert.equal(allow('student', 0), true); assert.equal(allow('student', 999), false); assert.equal(allow('student', 1000), true);
});

test("reject Date objects as JSON API commands", () => {
  assert.equal(isJsonObject(new Date()), false);
});

test("reject Map objects as JSON API commands", () => {
  assert.equal(isJsonObject(new Map()), false);
});

test("reject Set objects as JSON API commands", () => {
  assert.equal(isJsonObject(new Set()), false);
});

test("accept own-property JSON commands", () => {
  assert.equal(isJsonObject({ universityId: 'mwecau' }), true);
});

test("reject prototype-less command objects", () => {
  assert.equal(isJsonObject(Object.create(null)), false);
});

test("reject Date objects in AI mock records", () => {
  assert.throws(() => validateMockRecords([new Date()]), /objects only/);
});

test("reject arrays nested as mock top-level records", () => {
  assert.throws(() => validateMockRecords([[]]), /objects only/);
});

test("reject prototype pollution keys in AI records", () => {
  const item = JSON.parse('{"__proto__":{"admin":true}}'); assert.throws(() => validateMockRecords([item]), /forbidden field names/);
});
