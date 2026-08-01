"use server";

import { z, ZodError } from "zod";
import { registerUser, loginUser, logoutUser } from "@/server/auth";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import type { UserPublic } from "@/types";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function register(
  _prevState: { error?: string; success?: boolean; user?: UserPublic },
  formData: FormData
): Promise<{ error?: string; success?: boolean; user?: UserPublic }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "register" },
    async () => {
      try {
        const ip = "global";
        const limit = checkRateLimit(`register:${ip}`, { maxRequests: 5, windowMs: 60_000 });
        if (!limit.allowed) {
          logger.warn("Registration rate limited", { action: "register", status: "failure" });
          return { error: "Too many registration attempts. Please try again later." };
        }

        const data = registerSchema.parse({
          email: formData.get("email"),
          name: formData.get("name"),
          password: formData.get("password"),
        });

        const user = await registerUser(data.email, data.name, data.password);
        logger.info("User registered", { action: "register", userId: user.id, status: "success" });
        return { success: true, user };
      } catch (error) {
        if (error instanceof ZodError) {
          logger.warn("Registration validation failed", { action: "register", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        if (error instanceof Error) {
          logger.warn("Registration failed", {
            action: "register",
            message: error.message,
            status: "failure",
          });
          return { error: error.message };
        }
        return { error: "Registration failed" };
      }
    }
  );
}

export async function login(
  _prevState: { error?: string; success?: boolean; user?: UserPublic },
  formData: FormData
): Promise<{ error?: string; success?: boolean; user?: UserPublic }> {
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "login" },
    async () => {
      try {
        const ip = "global";
        const limit = checkRateLimit(`login:${ip}`, { maxRequests: 10, windowMs: 60_000 });
        if (!limit.allowed) {
          logger.warn("Login rate limited", { action: "login", status: "failure" });
          return { error: "Too many login attempts. Please try again later." };
        }

        const data = loginSchema.parse({
          email: formData.get("email"),
          password: formData.get("password"),
        });

        const user = await loginUser(data.email, data.password);
        logger.info("User logged in", { action: "login", userId: user.id, status: "success" });
        return { success: true, user };
      } catch (error) {
        if (error instanceof ZodError) {
          logger.warn("Login validation failed", { action: "login", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        if (error instanceof Error) {
          logger.warn("Login failed", {
            action: "login",
            message: error.message,
            status: "failure",
          });
          return { error: error.message };
        }
        return { error: "Login failed" };
      }
    }
  );
}

export async function logout(): Promise<void> {
  await logoutUser();
}
