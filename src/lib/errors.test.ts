import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  AuthenticationError,
  ConflictError,
  RateLimitedError,
  InfrastructureError,
  toFriendlyError,
  isAppError,
} from "@/lib/errors";

describe("AppError subclasses", () => {
  it("assigns correct status codes", () => {
    expect(new ValidationError().statusCode).toBe(400);
    expect(new AuthenticationError().statusCode).toBe(401);
    expect(new AuthorizationError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
    expect(new RateLimitedError().statusCode).toBe(429);
    expect(new InfrastructureError().statusCode).toBe(503);
  });

  it("falls back to friendly default messages", () => {
    expect(new NotFoundError().message).toBe(
      "The requested resource could not be found."
    );
  });

  it("accepts custom messages", () => {
    expect(new ValidationError("Bad input").message).toBe("Bad input");
  });

  it("is detected by isAppError", () => {
    expect(isAppError(new NotFoundError())).toBe(true);
    expect(isAppError(new Error("plain"))).toBe(false);
  });
});

describe("toFriendlyError", () => {
  it("returns AppError message", () => {
    expect(toFriendlyError(new AuthorizationError())).toBe(
      "You do not have permission to perform this action."
    );
  });

  it("extracts first Zod issue message", () => {
    const schema = z.object({ name: z.string().min(5, "Name too short") });
    const parsed = schema.safeParse({ name: "ab" });
    expect(toFriendlyError(parsed.error)).toBe("Name too short");
  });

  it("returns generic message for unknown errors", () => {
    expect(toFriendlyError(new Error("secret stack detail"))).toBe(
      "Something went wrong. Please try again."
    );
  });
});
