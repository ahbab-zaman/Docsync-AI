import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, clearRateLimits } from "@/lib/rate-limiter";

describe("checkRateLimit", () => {
  beforeEach(() => {
    clearRateLimits();
  });

  it("allows the first request", () => {
    const result = checkRateLimit("test-key");
    expect(result.allowed).toBe(true);
  });

  it("blocks requests beyond the max in a window", () => {
    const key = "limited-key";
    for (let i = 0; i < 3; i++) {
      const result = checkRateLimit(key, { maxRequests: 3, windowMs: 60_000 });
      expect(result.allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, { maxRequests: 3, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("reports remaining count", () => {
    const result = checkRateLimit("remaining-key", { maxRequests: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("resets the window after expiry", () => {
    const key = "expiring-key";
    checkRateLimit(key, { maxRequests: 1, windowMs: 100 });
    const blocked = checkRateLimit(key, { maxRequests: 1, windowMs: 100 });
    expect(blocked.allowed).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const reset = checkRateLimit(key, { maxRequests: 1, windowMs: 100 });
        expect(reset.allowed).toBe(true);
        resolve();
      }, 150);
    });
  });

  it("tracks keys independently", () => {
    const a = checkRateLimit("key-a", { maxRequests: 1 });
    expect(a.allowed).toBe(true);
    const b = checkRateLimit("key-b", { maxRequests: 1 });
    expect(b.allowed).toBe(true);
    const a2 = checkRateLimit("key-a", { maxRequests: 1 });
    expect(a2.allowed).toBe(false);
    const b2 = checkRateLimit("key-b", { maxRequests: 1 });
    expect(b2.allowed).toBe(false);
  });

  it("returns a resetAt timestamp in the future", () => {
    const result = checkRateLimit("reset-key", { windowMs: 60_000 });
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});
