import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/health/route";

vi.mock("@/lib/db", () => ({
  healthCheck: vi.fn(),
}));

vi.mock("@/lib/redis", () => ({
  redisHealthCheck: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { healthCheck } from "@/lib/db";
import { redisHealthCheck } from "@/lib/redis";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.mocked(healthCheck).mockReset();
    vi.mocked(redisHealthCheck).mockReset();
  });

  it("returns healthy with 200 when both services are up", async () => {
    vi.mocked(healthCheck).mockResolvedValue(true);
    vi.mocked(redisHealthCheck).mockResolvedValue(true);

    const res = await GET();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.services).toEqual({ database: "up", redis: "up" });
    expect(typeof body.timestamp).toBe("string");
  });

  it("returns degraded with 503 when the database is down", async () => {
    vi.mocked(healthCheck).mockResolvedValue(false);
    vi.mocked(redisHealthCheck).mockResolvedValue(true);

    const res = await GET();

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.status).toBe("degraded");
    expect(body.services.database).toBe("down");
    expect(body.services.redis).toBe("up");
  });

  it("returns degraded with 503 when redis is down", async () => {
    vi.mocked(healthCheck).mockResolvedValue(true);
    vi.mocked(redisHealthCheck).mockResolvedValue(false);

    const res = await GET();

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.status).toBe("degraded");
  });
});
