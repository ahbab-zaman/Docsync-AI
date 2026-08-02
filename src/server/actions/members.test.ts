import { describe, it, expect, vi, beforeEach } from "vitest";
import { inviteMember, getInviteByToken, acceptInviteByToken } from "@/server/actions/members";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
}));

vi.mock("@/lib/auth-helpers", () => ({
  getDevUserId: vi.fn(),
}));

vi.mock("@/server/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  runWithRequestContext: async (_ctx: unknown, fn: () => Promise<unknown>) => fn(),
  generateRequestId: () => "test-request-id",
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

vi.mock("@/lib/notifications", () => ({
  createActivityEvent: vi.fn(),
  createNotification: vi.fn(),
  notifyWorkspaceMembers: vi.fn(),
  notifyWorkspaceAdmins: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendInviteEmail: vi.fn(),
}));

vi.mock("@/lib/rate-limiter", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 9, resetAt: 0 })),
}));

vi.mock("@/server/repositories/user", () => ({
  findUserByEmail: vi.fn(),
}));

import { query } from "@/lib/db";
import { getDevUserId } from "@/lib/auth-helpers";
import { getCurrentUser } from "@/server/auth";
import { sendInviteEmail } from "@/lib/email";
import { findUserByEmail } from "@/server/repositories/user";

function buildForm(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value);
  }
  return fd;
}

describe("members invite actions", () => {
  beforeEach(() => {
    vi.mocked(getDevUserId).mockResolvedValue("user-1");
    vi.mocked(query).mockReset();
    vi.mocked(sendInviteEmail).mockClear();
    vi.mocked(findUserByEmail).mockClear();
    vi.mocked(sendInviteEmail).mockResolvedValue({ sent: true });
    vi.mocked(findUserByEmail).mockResolvedValue(null);
  });

  describe("inviteMember", () => {
    it("creates a token invite and sends the email", async () => {
      vi.mocked(query).mockImplementation(async (text: string) => {
        if (text.includes("SELECT 1 FROM workspace_members")) {
          return { rows: [] } as never;
        }
        if (text.includes("INSERT INTO workspace_invites")) {
          return { rows: [{ id: "invite-1" }] } as never;
        }
        if (text.includes("SELECT name FROM workspaces")) {
          return { rows: [{ name: "Alpha" }] } as never;
        }
        if (text.includes("SELECT name FROM users")) {
          return { rows: [{ name: "Dev User" }] } as never;
        }
        return { rows: [] } as never;
      });

      const result = await inviteMember(
        {},
        buildForm({
          workspaceId: "ws-1",
          email: "friend@example.com",
          role: "member",
        })
      );

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      const insertCall = vi.mocked(query).mock.calls.find(([sql]) =>
        sql.includes("INSERT INTO workspace_invites")
      );
      expect(insertCall).toBeDefined();
      const params = insertCall![1];
      expect(params![0]).toBe("ws-1");
      expect(params![1]).toBe("friend@example.com");
      expect(params![2]).toBe("member");
      expect(params![4]).toMatch(/^[0-9a-f]{64}$/);
      expect(params![5]).toBeInstanceOf(Date);

      expect(sendInviteEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "friend@example.com",
          workspaceName: "Alpha",
          invitedByName: "Dev User",
          role: "member",
          inviteUrl: expect.stringContaining("/invite/"),
        })
      );
    });

    it("rejects an already-member email", async () => {
      vi.mocked(query).mockResolvedValueOnce({ rows: [{ id: "existing" }] } as never);

      const result = await inviteMember(
        {},
        buildForm({
          workspaceId: "ws-1",
          email: "member@example.com",
          role: "member",
        })
      );

      expect(result.error).toBe("This user is already a member of the workspace.");
      expect(sendInviteEmail).not.toHaveBeenCalled();
    });

    it("rejects an invalid email without touching the database", async () => {
      const result = await inviteMember(
        {},
        buildForm({ workspaceId: "ws-1", email: "not-an-email", role: "member" })
      );

      expect(result.error).toBe("Invalid email address");
      expect(query).not.toHaveBeenCalled();
    });
  });

  describe("getInviteByToken", () => {
    it("returns invite details including workspace name and registration status", async () => {
      vi.mocked(query).mockResolvedValueOnce({
        rows: [
          {
            email: "friend@example.com",
            role: "member",
            workspace_id: "ws-1",
            workspace_name: "Alpha",
            invited_by: "user-1",
            invited_by_name: "Dev User",
            status: "pending",
            expires_at: new Date("2030-01-08T00:00:00.000Z"),
          },
        ],
      } as never);
      vi.mocked(findUserByEmail).mockResolvedValue({ id: "user-9" } as never);

      const result = await getInviteByToken("token-abc");

      expect(result.error).toBeUndefined();
      expect(result.invite).toMatchObject({
        email: "friend@example.com",
        workspaceName: "Alpha",
        invitedByName: "Dev User",
        status: "pending",
        isRegistered: true,
      });
    });

    it("returns an error for an unknown token", async () => {
      vi.mocked(query).mockResolvedValueOnce({ rows: [] } as never);

      const result = await getInviteByToken("bad-token");

      expect(result.error).toBeDefined();
      expect(result.invite).toBeUndefined();
    });
  });

  describe("acceptInviteByToken", () => {
    it("adds the user as a member and marks the invite accepted", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: "user-9",
        email: "friend@example.com",
        name: "Friend",
        avatar_url: null,
        created_at: new Date("2026-01-01T00:00:00.000Z"),
      });
      vi.mocked(query).mockResolvedValueOnce({
        rows: [
          {
            id: "invite-1",
            email: "friend@example.com",
            role: "member",
            workspace_id: "ws-1",
            status: "pending",
            expires_at: new Date("2030-01-08T00:00:00.000Z"),
          },
        ],
      } as never);
      vi.mocked(query).mockResolvedValueOnce({ rows: [] } as never);
      vi.mocked(query).mockResolvedValueOnce({ rows: [] } as never);

      const result = await acceptInviteByToken("token-abc");

      expect(result.success).toBe(true);
      expect(result.workspaceId).toBe("ws-1");

      const insert = vi.mocked(query).mock.calls.find(([sql]) =>
        sql.includes("INSERT INTO workspace_members")
      );
      expect(insert).toBeDefined();
      expect(insert![1]).toEqual(["ws-1", "user-9", "member"]);

      const update = vi.mocked(query).mock.calls.find(([sql]) =>
        sql.includes("UPDATE workspace_invites SET status = 'accepted'")
      );
      expect(update).toBeDefined();
    });

    it("requires a signed-in user", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      const result = await acceptInviteByToken("token-abc");

      expect(result.error).toContain("sign in");
      expect(query).not.toHaveBeenCalled();
    });

    it("rejects an invite whose email does not match the current user", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: "user-9",
        email: "other@example.com",
        name: "Other",
        avatar_url: null,
        created_at: new Date("2026-01-01T00:00:00.000Z"),
      });
      vi.mocked(query).mockResolvedValueOnce({
        rows: [
          {
            id: "invite-1",
            email: "friend@example.com",
            role: "member",
            workspace_id: "ws-1",
            status: "pending",
            expires_at: new Date("2030-01-08T00:00:00.000Z"),
          },
        ],
      } as never);

      const result = await acceptInviteByToken("token-abc");

      expect(result.error).toContain("friend@example.com");
      expect(result.success).toBeUndefined();
    });
  });
});
