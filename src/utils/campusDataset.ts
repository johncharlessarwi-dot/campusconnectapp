/** Select only data explicitly associated with the requested campus. */
export function selectCampusDataset<T>(source: Record<string, T[]> | undefined, acronym: string): T[] {
  if (!source || typeof acronym !== 'string') return [];
  const campus = acronym.trim().toLowerCase();
  if (!/^[a-z0-9_-]{1,32}$/.test(campus)) return [];
  return Object.prototype.hasOwnProperty.call(source, campus) && Array.isArray(source[campus])
    ? source[campus]
    : [];
}
