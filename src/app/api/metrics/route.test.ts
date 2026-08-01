import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "@/app/api/metrics/route";
import { recordMetric, resetMetrics, snapshotMetrics } from "@/lib/metrics";

describe("GET /api/metrics", () => {
  beforeEach(() => {
    resetMetrics();
  });

  it("returns 200 with an empty snapshot before any metrics", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.counters).toEqual({});
    expect(typeof body.startedAt).toBe("string");
  });

  it("reflects recorded metrics in the snapshot", async () => {
    recordMetric("db:query", 120, "success");
    recordMetric("db:query", 200, "success");
    recordMetric("ai:request", 1000, "failure");

    const res = await GET();
    const body = await res.json();

    expect(body.counters["db:query"]).toEqual({ count: 2, avgMs: 160, lastErrorAt: undefined });
    expect(body.counters["ai:request"].count).toBe(1);
    expect(body.counters["ai:request"].avgMs).toBe(1000);
    expect(body.counters["ai:request"].lastErrorAt).toBeTypeOf("string");

    const live = snapshotMetrics();
    expect(live).toEqual(body);
  });
});
