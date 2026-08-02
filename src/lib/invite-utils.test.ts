import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateInviteToken,
  inviteExpiryDate,
  isInviteExpired,
  effectiveInviteStatus,
  buildInviteUrl,
  INVITE_TTL_DAYS,
} from "@/lib/invite-utils";

describe("invite-utils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    process.env = { ...originalEnv };
    delete process.env.AUTH_URL;
    delete process.env.APP_URL;
    delete process.env.PORT;
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env = originalEnv;
  });

  it("generates a hex token of the expected length", () => {
    const token = generateInviteToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique tokens on each call", () => {
    expect(generateInviteToken()).not.toBe(generateInviteToken());
  });

  it("computes an expiry date 7 days in the future", () => {
    const expiry = inviteExpiryDate();
    expect(expiry.getTime()).toBe(
      new Date("2026-01-01T00:00:00.000Z").getTime() +
        INVITE_TTL_DAYS * 24 * 60 * 60 * 1000
    );
  });

  it("treats a null expiry as expired", () => {
    expect(isInviteExpired(null)).toBe(true);
  });

  it("reports a past expiry as expired and a future expiry as valid", () => {
    expect(isInviteExpired(new Date("2025-12-31T00:00:00.000Z"))).toBe(true);
    expect(isInviteExpired(new Date("2026-01-02T00:00:00.000Z"))).toBe(false);
  });

  it("promotes an expired pending invite to expired", () => {
    expect(
      effectiveInviteStatus("pending", new Date("2025-12-31T00:00:00.000Z"))
    ).toBe("expired");
    expect(
      effectiveInviteStatus("pending", new Date("2026-01-02T00:00:00.000Z"))
    ).toBe("pending");
    expect(effectiveInviteStatus("accepted", null)).toBe("accepted");
  });

  it("builds an invite URL from AUTH_URL", () => {
    process.env.AUTH_URL = "https://docsync.example.com/";
    expect(buildInviteUrl("abc")).toBe("https://docsync.example.com/invite/abc");
  });

  it("falls back to APP_URL when AUTH_URL is missing", () => {
    process.env.APP_URL = "https://app.example.com";
    expect(buildInviteUrl("xyz")).toBe("https://app.example.com/invite/xyz");
  });

  it("falls back to localhost when no URL is configured", () => {
    process.env.PORT = "4000";
    expect(buildInviteUrl("abc")).toBe("http://localhost:4000/invite/abc");
  });
});
