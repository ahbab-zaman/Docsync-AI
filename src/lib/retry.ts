export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine !== false;
}

export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("fetch failed") ||
    error.message.includes("NetworkError") ||
    error.message.includes("network") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("ENOTFOUND") ||
    error.message.includes("ETIMEDOUT") ||
    error.message.includes("load failed")
  );
}

export function getNetworkErrorMessage(error: unknown): string {
  if (!isOnline()) {
    return "You appear to be offline. Please check your connection and try again.";
  }
  if (isNetworkError(error)) {
    return "Unable to reach the server. Please check your connection and try again.";
  }
  return null as unknown as string;
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  retryable?: (error: unknown) => boolean;
}

const DEFAULT_RETRY: Required<Omit<RetryOptions, "retryable">> & {
  retryable: (error: unknown) => boolean;
} = {
  maxRetries: 2,
  baseDelayMs: 500,
  retryable: (error) => {
    if (isNetworkError(error)) return true;
    if (!isOnline()) return true;
    return false;
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, baseDelayMs, retryable } = {
    ...DEFAULT_RETRY,
    ...options,
  };

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= maxRetries || !retryable(error)) {
        break;
      }
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt += 1;
    }
  }

  throw lastError;
}

export function safeErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
