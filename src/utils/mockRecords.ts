/** Limit AI-produced examples before returning them to clients. */
export function validateMockRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    throw new Error('Generated examples must be an array');
  }
  if (value.length > 3) {
    throw new Error('Generated examples exceed the requested limit');
  }
  if (!value.every(item => item !== null && typeof item === 'object' && !Array.isArray(item) && Object.getPrototypeOf(item) === Object.prototype)) {
    throw new Error('Generated examples must contain objects only');
  }
  if (value.some(item => Object.keys(item).some(key => ['__proto__', 'constructor', 'prototype'].includes(key)))) {
    throw new Error('Generated examples contain forbidden field names');
  }
  return value as Record<string, unknown>[];
}
