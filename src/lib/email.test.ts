import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sendInviteEmail,
  isEmailConfigured,
  isSmtpConfigured,
} from "@/lib/email";

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { createTransportMock, sendMailMock } = vi.hoisted(() => ({
  createTransportMock: vi.fn(),
  sendMailMock: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

createTransportMock.mockReturnValue({ sendMail: sendMailMock });

describe("email service", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_SECURE;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM;
    vi.restoreAllMocks();
    createTransportMock.mockClear();
    sendMailMock.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  const baseParams = {
    to: "user@example.com",
    inviteUrl: "https://docsync.example.com/invite/abc",
    workspaceName: "Alpha",
    invitedByName: "Dev User",
    role: "member",
    expiresAt: new Date("2026-01-08T00:00:00.000Z"),
  };

  it("reports unconfigured when no provider is configured", () => {
    expect(isEmailConfigured()).toBe(false);
    expect(isSmtpConfigured()).toBe(false);
  });

  it("reports configured when Resend key and from email are present", () => {
    process.env.RESEND_API_KEY = "re_123";
    expect(isEmailConfigured()).toBe(false);
    process.env.RESEND_FROM_EMAIL = "Docsync <invites@example.com>";
    expect(isEmailConfigured()).toBe(true);
  });

  it("reports configured when SMTP credentials are present", () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_USER = "you@gmail.com";
    process.env.SMTP_PASS = "app-pass";
    process.env.SMTP_FROM = "Docsync <you@gmail.com>";
    expect(isSmtpConfigured()).toBe(true);
    expect(isEmailConfigured()).toBe(true);
  });

  it("skips sending (returns sent:false) when no provider is configured", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as never;
    const result = await sendInviteEmail(baseParams);
    expect(result.sent).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends via the Resend API when configured", async () => {
    process.env.RESEND_API_KEY = "re_123";
    process.env.RESEND_FROM_EMAIL = "Docsync <invites@example.com>";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as never;

    const result = await sendInviteEmail(baseParams);

    expect(result.sent).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_123",
          "Content-Type": "application/json",
        }),
        body: expect.any(String),
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.to).toEqual(["user@example.com"]);
    expect(body.subject).toContain("Alpha");
    expect(body.html).toContain("https://docsync.example.com/invite/abc");
    expect(body.html).toContain("invited you");
  });

  it("returns sent:false and logs when Resend returns an error", async () => {
    process.env.RESEND_API_KEY = "re_123";
    process.env.RESEND_FROM_EMAIL = "Docsync <invites@example.com>";
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "unauthorized",
    }) as never;

    const result = await sendInviteEmail(baseParams);
    expect(result.sent).toBe(false);
  });

  it("sends via SMTP when Resend is not configured", async () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_SECURE = "false";
    process.env.SMTP_USER = "you@gmail.com";
    process.env.SMTP_PASS = "app-pass";
    process.env.SMTP_FROM = "Docsync <you@gmail.com>";

    const result = await sendInviteEmail(baseParams);

    expect(result.sent).toBe(true);
    expect(createTransportMock).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: "you@gmail.com", pass: "app-pass" },
    });
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Docsync <you@gmail.com>",
        to: "user@example.com",
        subject: expect.stringContaining("Alpha"),
        html: expect.stringContaining("https://docsync.example.com/invite/abc"),
      })
    );
  });

  it("returns sent:false and logs when SMTP fails", async () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_USER = "you@gmail.com";
    process.env.SMTP_PASS = "app-pass";
    process.env.SMTP_FROM = "Docsync <you@gmail.com>";
    sendMailMock.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await sendInviteEmail(baseParams);
    expect(result.sent).toBe(false);
  });

  it("prefers Resend over SMTP when both are configured", async () => {
    process.env.RESEND_API_KEY = "re_123";
    process.env.RESEND_FROM_EMAIL = "Docsync <invites@example.com>";
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_USER = "you@gmail.com";
    process.env.SMTP_PASS = "app-pass";
    process.env.SMTP_FROM = "Docsync <you@gmail.com>";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as never;

    const result = await sendInviteEmail(baseParams);

    expect(result.sent).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
    expect(createTransportMock).not.toHaveBeenCalled();
  });
});
