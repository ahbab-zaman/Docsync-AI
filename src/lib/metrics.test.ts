import { describe, it, expect, beforeEach } from "vitest";
import { recordMetric, snapshotMetrics, resetMetrics } from "@/lib/metrics";

describe("metrics", () => {
  beforeEach(() => {
    resetMetrics();
  });

  it("records a single metric", () => {
    recordMetric("db:query", 100, "success");
    const snap = snapshotMetrics();
    expect(snap.counters["db:query"]).toEqual({ count: 1, avgMs: 100 });
  });

  it("computes average duration", () => {
    recordMetric("api:load", 50);
    recordMetric("api:load", 150);
    const snap = snapshotMetrics();
    expect(snap.counters["api:load"]).toEqual({ count: 2, avgMs: 100 });
  });

  it("records failures with a timestamp", () => {
    recordMetric("db:query", 10, "failure");
    const snap = snapshotMetrics();
    expect(snap.counters["db:query"].count).toBe(1);
    expect(snap.counters["db:query"].lastErrorAt).toBeDefined();
  });

  it("tracks metrics independently", () => {
    recordMetric("a", 1);
    recordMetric("b", 2);
    const snap = snapshotMetrics();
    expect(snap.counters["a"].count).toBe(1);
    expect(snap.counters["b"].count).toBe(1);
  });

  it("records a startedAt timestamp", () => {
    const snap = snapshotMetrics();
    expect(snap.startedAt).toBeDefined();
  });
});
