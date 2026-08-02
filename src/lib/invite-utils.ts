import { randomBytes, randomUUID } from "crypto";

export type InviteStatus = "pending" | "accepted" | "declined" | "expired";

export const INVITE_TTL_DAYS = 7;
export const INVITE_TTL_MS = INVITE_TTL_DAYS * 24 * 60 * 60 * 1000;

export function generateInviteToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateInviteId(): string {
  return randomUUID();
}

export function inviteExpiryDate(): Date {
  return new Date(Date.now() + INVITE_TTL_MS);
}

export function isInviteExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true;
  return expiresAt.getTime() < Date.now();
}

export function effectiveInviteStatus(
  status: InviteStatus,
  expiresAt: Date | null
): InviteStatus {
  if (status === "pending" && isInviteExpired(expiresAt)) {
    return "expired";
  }
  return status;
}

export function buildInviteUrl(token: string): string {
  const baseUrl =
    process.env.AUTH_URL ??
    process.env.APP_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;
  return `${baseUrl.replace(/\/+$/, "")}/invite/${token}`;
}
