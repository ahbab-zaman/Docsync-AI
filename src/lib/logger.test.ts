import { describe, it, expect } from "vitest";
import {
  generateRequestId,
  runWithRequestContext,
  getRequestContext,
} from "@/lib/logger";

describe("logger request context", () => {
  it("generates unique request IDs", () => {
    const a = generateRequestId();
    const b = generateRequestId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it("returns undefined context outside a request scope", () => {
    expect(getRequestContext()).toBeUndefined();
  });

  it("scopes request context to the async function", async () => {
    await runWithRequestContext(
      { requestId: "req-123", action: "test" },
      async () => {
        const ctx = getRequestContext();
        expect(ctx).toBeDefined();
        expect(ctx!.requestId).toBe("req-123");
        expect(ctx!.action).toBe("test");
      }
    );
  });

  it("does not leak context outside the scope", async () => {
    await runWithRequestContext({ requestId: "req-leak" }, async () => {
      /* inner */
    });
    expect(getRequestContext()).toBeUndefined();
  });
});
