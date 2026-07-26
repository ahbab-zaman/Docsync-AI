"use server";

import { z, ZodError } from "zod";
import { registerUser, loginUser, logoutUser } from "@/server/auth";
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
  try {
    const data = registerSchema.parse({
      email: formData.get("email"),
      name: formData.get("name"),
      password: formData.get("password"),
    });

    const user = await registerUser(data.email, data.name, data.password);
    return { success: true, user };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Registration failed" };
  }
}

export async function login(
  _prevState: { error?: string; success?: boolean; user?: UserPublic },
  formData: FormData
): Promise<{ error?: string; success?: boolean; user?: UserPublic }> {
  try {
    const data = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await loginUser(data.email, data.password);
    return { success: true, user };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Validation failed" };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Login failed" };
  }
}

export async function logout(): Promise<void> {
  await logoutUser();
}
