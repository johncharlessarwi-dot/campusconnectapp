/** Select only data explicitly associated with the requested campus. */
export function selectCampusDataset<T>(source: Record<string, T[]> | undefined, acronym: string): T[] {
  if (!source || !acronym) return [];
  const campus = acronym.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(source, campus) && Array.isArray(source[campus])
    ? source[campus]
    : [];
}
