import { AsyncLocalStorage } from "async_hooks";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  userId?: string;
  workspaceId?: string;
  action?: string;
  [key: string]: string | number | boolean | undefined;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: string;
  workspaceId?: string;
  action?: string;
  durationMs?: number;
  status?: "success" | "failure" | "retry";
  severity?: LogLevel;
  context?: LogContext;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const LOG_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel | undefined) ?? "info";

const requestStorage = new AsyncLocalStorage<LogContext>();

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatTimestamp(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.` +
    `${date.getMilliseconds().toString().padStart(3, "0")}`
  );
}

function write(entry: LogEntry): void {
  const line = JSON.stringify(entry);
  if (entry.level === "error") {
    console.error(line);
  } else if (entry.level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[LOG_LEVEL]) return;

  const scope = requestStorage.getStore();
  const entry: LogEntry = {
    timestamp: formatTimestamp(new Date()),
    level,
    message,
    requestId: context?.requestId ?? scope?.requestId,
    userId: context?.userId ?? scope?.userId,
    workspaceId: context?.workspaceId ?? scope?.workspaceId,
    action: context?.action,
    durationMs: typeof context?.durationMs === "number" ? context.durationMs : undefined,
    status:
      context?.status === "success" ||
      context?.status === "failure" ||
      context?.status === "retry"
        ? context.status
        : undefined,
    severity:
      context?.severity === "debug" ||
      context?.severity === "info" ||
      context?.severity === "warn" ||
      context?.severity === "error"
        ? context.severity
        : undefined,
    context,
  };

  write(entry);
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    log("debug", message, context);
  },
  info(message: string, context?: LogContext): void {
    log("info", message, context);
  },
  warn(message: string, context?: LogContext): void {
    log("warn", message, context);
  },
  error(message: string, context?: LogContext): void {
    log("error", message, context);
  },
};

export function runWithRequestContext<T>(
  context: LogContext,
  fn: () => T | Promise<T>
): Promise<T> {
  return requestStorage.run(context, async () => fn());
}

export function getRequestContext(): LogContext | undefined {
  return requestStorage.getStore();
}

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
