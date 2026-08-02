import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWorkspace } from "@/server/actions/workspace";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
}));

vi.mock("@/server/access", () => ({
  getCurrentUserId: vi.fn(),
  getCurrentUserInfo: vi.fn(),
  requireWorkspaceAccess: vi.fn(),
  ANY_MEMBER: ["owner", "admin", "member"],
  ADMIN_ROLES: ["owner", "admin"],
}));

vi.mock("@/lib/cache", () => ({
  CACHE_KEYS: {
    workspace: (id: string) => `cache:workspace:${id}`,
    workspaces: (id: string) => `cache:workspaces:${id}`,
  },
  setCached: vi.fn(),
  invalidateCache: vi.fn(),
  invalidateWorkspaceCache: vi.fn(),
  invalidateProjectCache: vi.fn(),
  withCache: vi.fn(async (_key: string, fn: () => Promise<unknown>) => fn()),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { query } from "@/lib/db";
import { getCurrentUserId, getCurrentUserInfo } from "@/server/access";
import { setCached, invalidateCache } from "@/lib/cache";

function buildForm(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value);
  }
  return fd;
}

const workspaceRow = {
  id: "ws-1",
  name: "Alpha",
  slug: "alpha",
  description: null,
  owner_id: "user-1",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("createWorkspace server action", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUserId).mockResolvedValue("user-1");
    vi.mocked(getCurrentUserInfo).mockResolvedValue({
      id: "user-1",
      name: "Dev User",
      email: "dev@docsync.dev",
    });
    vi.mocked(query).mockReset();
    vi.mocked(setCached).mockClear();
    vi.mocked(invalidateCache).mockClear();

    vi.mocked(query).mockImplementation(async (text: string) => {
      if (text.includes("INSERT INTO workspaces")) {
        return { rows: [workspaceRow] } as never;
      }
      return { rows: [] } as never;
    });
  });

  it("creates a workspace and returns success with the workspace", async () => {
    const result = await createWorkspace(
      {},
      buildForm({ name: "Alpha", description: "A team" })
    );

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.workspace).toMatchObject({
      id: "ws-1",
      name: "Alpha",
      slug: "alpha",
      member_count: 1,
      project_count: 0,
    });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO workspaces"),
      ["Alpha", "alpha", "A team", "user-1"]
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO workspace_members"),
      ["ws-1", "user-1"]
    );
    expect(setCached).toHaveBeenCalledWith("cache:workspace:ws-1", expect.anything(), 30);
    expect(invalidateCache).toHaveBeenCalledWith("cache:workspaces:user-1");
  });

  it("rejects an unauthenticated user", async () => {
    vi.mocked(getCurrentUserInfo).mockResolvedValue(null);

    const result = await createWorkspace(
      {},
      buildForm({ name: "Alpha" })
    );

    expect(result.error).toBe("Please sign in to create a workspace.");
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an empty workspace name without touching the database", async () => {
    const result = await createWorkspace({}, buildForm({ name: "" }));

    expect(result.success).toBeUndefined();
    expect(result.error).toBe("Workspace name is required");
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an over-long name without touching the database", async () => {
    const result = await createWorkspace(
      {},
      buildForm({ name: "a".repeat(101) })
    );

    expect(result.success).toBeUndefined();
    expect(result.error).toBe("Name is too long");
    expect(query).not.toHaveBeenCalled();
  });

  it("returns a friendly error when the database insert fails", async () => {
    vi.mocked(query).mockRejectedValueOnce(new Error("connection refused"));

    const result = await createWorkspace(
      {},
      buildForm({ name: "Beta" })
    );

    expect(result.success).toBeUndefined();
    expect(result.error).toBe("connection refused");
    expect(result.workspace).toBeUndefined();
  });
});
