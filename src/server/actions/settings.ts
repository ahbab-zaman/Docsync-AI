"use server";

import { z, ZodError } from "zod";
import { query } from "@/lib/db";
import { getDevUserId } from "@/lib/auth-helpers";
import { hashPassword, verifyPassword } from "@/server/auth";
import {
  findUserByIdWithHash,
  updateUserAvatar,
  updateUserEmail,
  updateUserPassword,
  updateUserPreferences,
  updateUserName,
} from "@/server/repositories/user";
import { logger, runWithRequestContext, generateRequestId } from "@/lib/logger";
import type { UserPreferences } from "@/types";

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: Date;
  preferences: UserPreferences;
}

export async function getProfile(): Promise<{ profile?: ProfileData; error?: string }> {
  const currentUserId = await getDevUserId();
  const user = await findUserByIdWithHash(currentUserId);
  if (!user) {
    return { error: "User not found." };
  }
  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      preferences: user.preferences,
    },
  };
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  avatarUrl: z.string().url("Avatar URL must be a valid URL").max(500).optional().or(z.literal("")),
});

export async function updateProfile(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "updateProfile" },
    async () => {
      try {
        const currentUserId = await getDevUserId();
        const data = profileSchema.parse({
          name: formData.get("name"),
          email: formData.get("email"),
          avatarUrl: formData.get("avatarUrl") || undefined,
        });

        const emailInUse = await query(
          "SELECT 1 FROM users WHERE email = $1 AND id != $2",
          [data.email, currentUserId]
        );
        if (emailInUse.rows.length > 0) {
          return { error: "That email is already in use." };
        }

        const avatarUrl = data.avatarUrl?.trim() ? data.avatarUrl.trim() : null;

        await updateUserName(currentUserId, data.name);
        await updateUserEmail(currentUserId, data.email);
        await updateUserAvatar(currentUserId, avatarUrl);

        logger.info("Profile updated", {
          action: "updateProfile",
          userId: currentUserId,
          durationMs: Date.now() - start,
          status: "success",
        });

        return { success: true };
      } catch (error) {
        if (error instanceof ZodError) {
          logger.warn("Profile validation failed", { action: "updateProfile", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        if (error instanceof Error) {
          logger.error("Failed to update profile", {
            action: "updateProfile",
            message: error.message,
            status: "failure",
          });
          return { error: "Failed to update profile." };
        }
        return { error: "Failed to update profile." };
      }
    }
  );
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(100),
});

export async function changePassword(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "changePassword" },
    async () => {
      try {
        const currentUserId = await getDevUserId();
        const data = passwordSchema.parse({
          currentPassword: formData.get("currentPassword"),
          newPassword: formData.get("newPassword"),
        });

        const user = await findUserByIdWithHash(currentUserId);
        if (!user) {
          return { error: "User not found." };
        }

        if (!user.password_hash.startsWith("$2")) {
          logger.warn("Password change rejected: no bcrypt hash set", {
            action: "changePassword",
            status: "failure",
          });
          return { error: "No password is set on this account yet." };
        }

        const valid = await verifyPassword(data.currentPassword, user.password_hash);
        if (!valid) {
          logger.warn("Password change rejected", { action: "changePassword", status: "failure" });
          return { error: "Current password is incorrect." };
        }

        const passwordHash = await hashPassword(data.newPassword);
        await updateUserPassword(currentUserId, passwordHash);

        logger.info("Password changed", {
          action: "changePassword",
          userId: currentUserId,
          durationMs: Date.now() - start,
          status: "success",
        });

        return { success: true };
      } catch (error) {
        if (error instanceof ZodError) {
          logger.warn("Password validation failed", { action: "changePassword", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        if (error instanceof Error) {
          logger.error("Failed to change password", {
            action: "changePassword",
            message: error.message,
            status: "failure",
          });
          return { error: "Failed to change password." };
        }
        return { error: "Failed to change password." };
      }
    }
  );
}

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  reducedMotion: z.boolean(),
  density: z.enum(["comfortable", "compact"]),
});

export async function updateAppearance(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const start = Date.now();
  return runWithRequestContext(
    { requestId: generateRequestId(), action: "updateAppearance" },
    async () => {
      try {
        const currentUserId = await getDevUserId();
        const data = appearanceSchema.parse({
          theme: formData.get("theme"),
          reducedMotion: formData.get("reducedMotion") === "on" || formData.get("reducedMotion") === "true",
          density: formData.get("density"),
        });

        await updateUserPreferences(currentUserId, data);

        logger.info("Appearance updated", {
          action: "updateAppearance",
          userId: currentUserId,
          durationMs: Date.now() - start,
          status: "success",
        });

        return { success: true };
      } catch (error) {
        if (error instanceof ZodError) {
          logger.warn("Appearance validation failed", { action: "updateAppearance", status: "failure" });
          return { error: error.issues[0]?.message ?? "Validation failed" };
        }
        if (error instanceof Error) {
          logger.error("Failed to update appearance", {
            action: "updateAppearance",
            message: error.message,
            status: "failure",
          });
          return { error: "Failed to update appearance." };
        }
        return { error: "Failed to update appearance." };
      }
    }
  );
}
