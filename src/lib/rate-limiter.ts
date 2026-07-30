const requestCounts = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 30;

interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimiterOptions = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const now = Date.now();

  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

export function clearRateLimits(): void {
  requestCounts.clear();
}
