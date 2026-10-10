/**
 * Rate Limiter for SOEZE AI Studio Assistant
 * Limits anonymous visitors to:
 * - 10 requests per hour
 * - 30 requests per 24 hours
 *
 * Implements a sliding window counter.
 * Includes modular fallback for production deployment.
 */

type RateLimitRecord = {
  timestamps: number[];
};

const store = new Map<string, RateLimitRecord>();

const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // 15 mins
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  for (const [key, record] of store.entries()) {
    record.timestamps = record.timestamps.filter((ts) => ts > oneDayAgo);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  limitPerHour: number;
  remainingPerHour: number;
  limitPerDay: number;
  remainingPerDay: number;
  retryAfterSeconds?: number;
};

export function checkRateLimit(
  identifier: string,
  limits = { perHour: 10, perDay: 30 }
): RateLimitResult {
  cleanupExpired();

  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Filter out older timestamps beyond 24h
  record.timestamps = record.timestamps.filter((ts) => ts > oneDayAgo);

  const pastHourCount = record.timestamps.filter((ts) => ts > oneHourAgo).length;
  const pastDayCount = record.timestamps.length;

  if (pastHourCount >= limits.perHour) {
    const oldestInHour = record.timestamps.filter((ts) => ts > oneHourAgo)[0];
    const retryAfter = Math.ceil((oldestInHour + 60 * 60 * 1000 - now) / 1000);
    return {
      allowed: false,
      limitPerHour: limits.perHour,
      remainingPerHour: 0,
      limitPerDay: Math.max(0, limits.perDay - pastDayCount),
      remainingPerDay: Math.max(0, limits.perDay - pastDayCount),
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  if (pastDayCount >= limits.perDay) {
    const oldestInDay = record.timestamps[0];
    const retryAfter = Math.ceil((oldestInDay + 24 * 60 * 60 * 1000 - now) / 1000);
    return {
      allowed: false,
      limitPerHour: Math.max(0, limits.perHour - pastHourCount),
      remainingPerHour: Math.max(0, limits.perHour - pastHourCount),
      limitPerDay: limits.perDay,
      remainingPerDay: 0,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  // Record this hit
  record.timestamps.push(now);

  return {
    allowed: true,
    limitPerHour: limits.perHour,
    remainingPerHour: limits.perHour - (pastHourCount + 1),
    limitPerDay: limits.perDay,
    remainingPerDay: limits.perDay - (pastDayCount + 1),
  };
}
