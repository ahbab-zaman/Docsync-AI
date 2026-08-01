import type { User, UserPublic } from "@/types";

export interface MockSession {
  userId: string;
  sessionId: string;
  createdAt: Date;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "$pulseboard_demo_salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

const mockUsers: User[] = [
  {
    id: "user-1",
    email: "you@docsync.dev",
    name: "You",
    password_hash: "dev-user", // will be replaced on first use
    avatar_url: null,
    created_at: new Date("2026-01-01"),
    updated_at: new Date("2026-01-01"),
  },
  {
    id: "user-2",
    email: "alex@docsync.dev",
    name: "Alex Chen",
    password_hash: "dev-user",
    avatar_url: null,
    created_at: new Date("2026-01-01"),
    updated_at: new Date("2026-01-01"),
  },
];

const sessions = new Map<string, MockSession>();

async function ensureDevPassword(): Promise<void> {
  if (mockUsers[0].password_hash === "dev-user") {
    const hash = await hashPassword("password123");
    mockUsers.forEach((u) => {
      u.password_hash = hash;
    });
  }
}

export async function createMockUser(
  email: string,
  name: string,
  password: string
): Promise<UserPublic> {
  await ensureDevPassword();
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) throw new Error("Email already registered");

  const hash = await hashPassword(password);
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    password_hash: hash,
    avatar_url: null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  mockUsers.push(user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

export async function findMockUserByEmail(
  email: string
): Promise<User | null> {
  await ensureDevPassword();
  const user = mockUsers.find((u) => u.email === email);
  return user ?? null;
}

export async function findMockUserById(
  id: string
): Promise<UserPublic | null> {
  const user = mockUsers.find((u) => u.id === id);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

export async function verifyMockPassword(
  password: string,
  _hash: string
): Promise<boolean> {
  // In dev mode, accept any password for any user
  const devHash = await hashPassword("password123");
  const inputHash = await hashPassword(password);
  return inputHash === devHash || password === "password123";
}

export async function createMockSession(
  userId: string
): Promise<MockSession> {
  const sessionId = crypto.randomUUID();
  const session: MockSession = {
    userId,
    sessionId,
    createdAt: new Date(),
  };
  sessions.set(sessionId, session);
  return session;
}

export function getMockSession(
  sessionId: string
): MockSession | undefined {
  return sessions.get(sessionId);
}

export function deleteMockSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export { hashPassword, verifyPassword };
