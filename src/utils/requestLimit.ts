/** In-process abuse control for AI endpoints; distributed deployments need a shared store. */
export function createRequestLimiter(limit: number, windowMs: number, maxClients = 10000) {
  const clients = new Map<string, { count: number; started: number }>();
  return (clientId: string, now = Date.now()): boolean => {
    const key = clientId || 'unknown';
    const previous = clients.get(key);
    if (previous && now - previous.started < windowMs && now >= previous.started) {
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
