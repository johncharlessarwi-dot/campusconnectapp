import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestLimiter } from '../src/utils/requestLimit.ts';
import { validateMockRecords } from '../src/utils/mockRecords.ts';
import { isJsonObject } from '../src/utils/jsonBody.ts';
import { selectCampusDataset } from '../src/utils/campusDataset.ts';


test("reject zero rate limit", () => {
  assert.throws(() => createRequestLimiter(0, 1000), RangeError);
});
