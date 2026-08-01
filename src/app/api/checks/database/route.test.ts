import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/checks/database/route";

vi.mock("@/lib/db", () => ({
  healthCheck: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { healthCheck } from "@/lib/db";

describe("GET /api/checks/database", () => {
  beforeEach(() => {
    vi.mocked(healthCheck).mockReset();
  });

  it("returns 200 when the database is reachable", async () => {
    vi.mocked(healthCheck).mockResolvedValue(true);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: "ok", service: "database" });
  });

  it("returns 503 when the database is unreachable", async () => {
    vi.mocked(healthCheck).mockResolvedValue(false);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body).toMatchObject({ status: "error", service: "database" });
  });
});
