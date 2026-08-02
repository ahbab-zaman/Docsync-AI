import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail, findUserById } from "@/server/repositories/user";
import {
  createSession,
  findSessionById,
  deleteSessionById,
} from "@/server/repositories/session";
import { logger } from "@/lib/logger";
import type { UserPublic } from "@/types";

const SESSION_COOKIE = "pulseboard_session";

const SALT_ROUNDS = 12;

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserPublic> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  );

  await createSession(sessionId, user.id, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

export async function registerUser(
  email: string,
  name: string,
  password: string
): Promise<UserPublic> {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(email, name, passwordHash);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteSessionById(sessionId);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<UserPublic | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const session = await findSessionById(sessionId);
    if (!session) return null;

    const user = await findUserById(session.user_id);
    if (!user) return null;

    return user;
  } catch (error) {
    logger.warn("Failed to resolve current user", {
      action: "auth:getCurrentUser",
      status: "failure",
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
