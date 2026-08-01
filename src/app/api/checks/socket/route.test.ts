import { describe, it, expect, vi, afterEach } from "vitest";
import { GET } from "@/app/api/checks/socket/route";

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

describe("GET /api/checks/socket", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 200 when the socket server responds ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true })
    );

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: "ok", service: "socket" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/health$/),
      expect.anything()
    );
  });

  it("returns 503 when the socket server reports failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false })
    );

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body).toMatchObject({ status: "error", service: "socket" });
  });

  it("returns 503 when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("connection refused")));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body).toMatchObject({ status: "error", service: "socket" });
  });
});
