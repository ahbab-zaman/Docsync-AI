interface MetricCounter {
  count: number;
  totalMs: number;
  lastErrorAt?: string;
}

const counters = new Map<string, MetricCounter>();
const STARTED_AT = new Date().toISOString();

export function recordMetric(
  name: string,
  durationMs?: number,
  status: "success" | "failure" = "success"
): void {
  const entry = counters.get(name) ?? { count: 0, totalMs: 0 };
  entry.count += 1;
  if (durationMs !== undefined) {
    entry.totalMs += durationMs;
  }
  if (status === "failure") {
    entry.lastErrorAt = new Date().toISOString();
  }
  counters.set(name, entry);
}

export function snapshotMetrics(): {
  startedAt: string;
  counters: Record<string, { count: number; avgMs: number; lastErrorAt?: string }>;
} {
  const result: Record<string, { count: number; avgMs: number; lastErrorAt?: string }> = {};
  for (const [name, entry] of counters.entries()) {
    result[name] = {
      count: entry.count,
      avgMs: entry.count > 0 ? Math.round(entry.totalMs / entry.count) : 0,
      lastErrorAt: entry.lastErrorAt,
    };
  }
  return { startedAt: STARTED_AT, counters: result };
}

export function resetMetrics(): void {
  counters.clear();
}
