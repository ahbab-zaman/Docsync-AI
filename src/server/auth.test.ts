import { describe, it, expect, vi } from "vitest";
import { hashPassword, verifyPassword } from "@/server/auth";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/server/repositories/user", () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn(),
}));

describe("authentication password flow", () => {
  it("hashes a password into a bcrypt hash that never contains the plaintext", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).toBeTruthy();
    expect(hash).not.toContain("correct horse battery staple");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("verifies a correct password", async () => {
    const hash = await hashPassword("s3cret!");
    expect(await verifyPassword("s3cret!", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("s3cret!");
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("produces unique hashes for the same password", async () => {
    const [a, b] = await Promise.all([hashPassword("same"), hashPassword("same")]);
    expect(a).not.toBe(b);
  });
});
