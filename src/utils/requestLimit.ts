/** In-process abuse control for AI endpoints; distributed deployments need a shared store. */
export function createRequestLimiter(limit: number, windowMs: number, maxClients = 10000) {
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('Request limit must be a positive safe integer');
  if (!Number.isSafeInteger(windowMs) || windowMs < 1) throw new RangeError('Request window must be a positive safe integer');
  if (!Number.isSafeInteger(maxClients) || maxClients < 1) throw new RangeError('Maximum clients must be a positive safe integer');
  const clients = new Map<string, { count: number; started: number }>();
  return (clientId: string, now = Date.now()): boolean => {
    if (!Number.isFinite(now) || !Number.isSafeInteger(now)) return false;
    const key = clientId || 'unknown';
    const previous = clients.get(key);
    if (previous && (now < previous.started || now - previous.started < windowMs)) {
      if (previous.count >= limit) return false;
      previous.count++;
      return true;
    }
    if (!previous && clients.size >= maxClients) {
      for (const [candidate, value] of clients) {
        if (now - value.started >= windowMs) clients.delete(candidate);
      }
      if (clients.size >= maxClients) return false;
    }
    clients.set(key, { count: 1, started: now });
    return true;
  };
}
