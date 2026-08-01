import { ZodError } from "zod";

export type ErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "not-found"
  | "conflict"
  | "rate-limited"
  | "infrastructure"
  | "unknown";

export const ERROR_MESSAGES: Record<ErrorCategory, string> = {
  validation: "The provided input is invalid.",
  authentication: "Please sign in to continue.",
  authorization: "You do not have permission to perform this action.",
  "not-found": "The requested resource could not be found.",
  conflict: "The request conflicts with the current state.",
  "rate-limited": "Too many requests. Please try again later.",
  infrastructure: "A service is temporarily unavailable. Please try again.",
  unknown: "Something went wrong. Please try again.",
};

export class AppError extends Error {
  readonly category: ErrorCategory;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(
    category: ErrorCategory,
    message?: string,
    details?: unknown
  ) {
    super(message ?? ERROR_MESSAGES[category]);
    this.name = "AppError";
    this.category = category;
    this.statusCode = statusCodeFor(category);
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message?: string, details?: unknown) {
    super("validation", message, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message?: string) {
    super("authentication", message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message?: string) {
    super("authorization", message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super("not-found", message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message?: string) {
    super("conflict", message);
    this.name = "ConflictError";
  }
}

export class RateLimitedError extends AppError {
  constructor(message?: string) {
    super("rate-limited", message);
    this.name = "RateLimitedError";
  }
}

export class InfrastructureError extends AppError {
  constructor(message?: string) {
    super("infrastructure", message);
    this.name = "InfrastructureError";
  }
}

function statusCodeFor(category: ErrorCategory): number {
  switch (category) {
    case "validation":
      return 400;
    case "authentication":
      return 401;
    case "authorization":
      return 403;
    case "not-found":
      return 404;
    case "conflict":
      return 409;
    case "rate-limited":
      return 429;
    case "infrastructure":
      return 503;
    default:
      return 500;
  }
}

export function toFriendlyError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? ERROR_MESSAGES.validation;
  }
  return ERROR_MESSAGES.unknown;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
