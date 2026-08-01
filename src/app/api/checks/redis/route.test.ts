import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/checks/redis/route";

vi.mock("@/lib/redis", () => ({
  redisHealthCheck: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { redisHealthCheck } from "@/lib/redis";

describe("GET /api/checks/redis", () => {
  beforeEach(() => {
    vi.mocked(redisHealthCheck).mockReset();
  });

  it("returns 200 when redis is reachable", async () => {
    vi.mocked(redisHealthCheck).mockResolvedValue(true);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: "ok", service: "redis" });
  });

  it("returns 503 when redis is unreachable", async () => {
    vi.mocked(redisHealthCheck).mockResolvedValue(false);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body).toMatchObject({ status: "error", service: "redis" });
  });
});
