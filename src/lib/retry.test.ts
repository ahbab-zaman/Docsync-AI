import { describe, it, expect } from "vitest";
import { withRetry, isNetworkError, safeErrorMessage } from "@/lib/retry";

describe("withRetry", () => {
  it("returns the resolved value on success", async () => {
    const result = await withRetry(async () => "ok");
    expect(result).toBe("ok");
  });

  it("retries transient failures then succeeds", async () => {
    let calls = 0;
    const fn = async () => {
      calls += 1;
      if (calls < 3) throw new Error("NetworkError: fetch failed");
      return "recovered";
    };
    const result = await withRetry(fn, { maxRetries: 3, baseDelayMs: 1 });
    expect(result).toBe("recovered");
    expect(calls).toBe(3);
  });

  it("gives up after max retries", async () => {
    let calls = 0;
    const fn = async () => {
      calls += 1;
      throw new Error("NetworkError: fetch failed");
    };
    await expect(
      withRetry(fn, { maxRetries: 2, baseDelayMs: 1 })
    ).rejects.toThrow();
    expect(calls).toBe(3);
  });

  it("does not retry non-retryable errors", async () => {
    let calls = 0;
    const fn = async () => {
      calls += 1;
      throw new Error("validation failed");
    };
    await expect(
      withRetry(fn, { maxRetries: 3, baseDelayMs: 1 })
    ).rejects.toThrow("validation failed");
    expect(calls).toBe(1);
  });

  it("uses custom retryable predicate", async () => {
    let calls = 0;
    const fn = async () => {
      calls += 1;
      if (calls < 2) throw new Error("custom error");
      return "done";
    };
    const result = await withRetry(fn, {
      maxRetries: 2,
      baseDelayMs: 1,
      retryable: (error) => (error as Error).message === "custom error",
    });
    expect(result).toBe("done");
    expect(calls).toBe(2);
  });
});

describe("isNetworkError", () => {
  it("detects network errors", () => {
    expect(isNetworkError(new Error("fetch failed"))).toBe(true);
    expect(isNetworkError(new Error("NetworkError"))).toBe(true);
    expect(isNetworkError(new Error("ECONNREFUSED"))).toBe(true);
    expect(isNetworkError(new Error("ENOTFOUND"))).toBe(true);
  });

  it("rejects non-network errors", () => {
    expect(isNetworkError(new Error("validation failed"))).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });
});

describe("safeErrorMessage", () => {
  it("returns error message when available", () => {
    expect(safeErrorMessage(new Error("boom"), "fallback")).toBe("boom");
  });

  it("returns fallback for non-errors", () => {
    expect(safeErrorMessage("nope", "fallback")).toBe("fallback");
    expect(safeErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});
