import { describe, it, expect, vi, beforeEach } from "vitest";
import { CACHE_KEYS, getCached, setCached, invalidateCache, withCache } from "@/lib/cache";

vi.mock("@/lib/redis", () => ({
  isRedisAvailable: vi.fn(() => false),
  getRedis: vi.fn(async () => null),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

describe("cache graceful degradation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null from getCached when redis is unavailable", async () => {
    expect(await getCached("cache:workspace:ws-1")).toBeNull();
  });

  it("no-ops setCached when redis is unavailable", async () => {
    await expect(setCached("cache:workspace:ws-1", { name: "A" }, 30)).resolves.toBeUndefined();
  });

  it("no-ops invalidateCache when redis is unavailable", async () => {
    await expect(
      invalidateCache("cache:workspace:ws-1", "cache:workspaces:u-1")
    ).resolves.toBeUndefined();
  });

  it("falls back to the source function when redis is unavailable", async () => {
    const source = vi.fn(async () => ({ name: "fresh" }));
    const value = await withCache("cache:workspace:ws-1", source, { key: "cache:workspace:ws-1", ttlSeconds: 30 });

    expect(value).toEqual({ name: "fresh" });
    expect(source).toHaveBeenCalledTimes(1);
  });

  it("exposes predictable cache key conventions", () => {
    expect(CACHE_KEYS.workspaces("u-1")).toBe("cache:workspaces:u-1");
    expect(CACHE_KEYS.workspace("w-1")).toBe("cache:workspace:w-1");
    expect(CACHE_KEYS.projects("w-1")).toBe("cache:projects:w-1");
    expect(CACHE_KEYS.document("d-1")).toBe("cache:document:d-1");
  });
});
