interface RateRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateRecord>();

// Periodically evict expired entries to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.resetAt <= now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  ip: string,
  limit = 60,
  windowMs = 60_000
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || record.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
