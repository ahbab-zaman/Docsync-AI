import { getRedis, isRedisAvailable } from "@/lib/redis";
import { logger } from "@/lib/logger";

const DEFAULT_TTL_SECONDS = 60;

export const CACHE_KEYS = {
  workspaces: (userId: string) => `cache:workspaces:${userId}`,
  workspace: (workspaceId: string) => `cache:workspace:${workspaceId}`,
  projects: (workspaceId: string) => `cache:projects:${workspaceId}`,
  project: (projectId: string) => `cache:project:${projectId}`,
  documents: (projectId: string) => `cache:documents:${projectId}`,
  document: (documentId: string) => `cache:document:${documentId}`,
  dashboard: (userId: string) => `cache:dashboard:${userId}`,
} as const;

export interface CacheOptions {
  ttlSeconds?: number;
  key: string;
}

export async function getCached<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable()) return null;
  try {
    const redis = await getRedis();
    if (!redis) return null;
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    logger.warn("[Cache] Read failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      action: "cache:get",
      status: "failure",
    });
    return null;
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  if (!isRedisAvailable()) return;
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    logger.warn("[Cache] Write failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      action: "cache:set",
      status: "failure",
    });
  }
}

export async function invalidateCache(...keys: string[]): Promise<void> {
  if (!isRedisAvailable()) return;
  try {
    const redis = await getRedis();
    if (!redis) return;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.warn("[Cache] Invalidation failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      action: "cache:invalidate",
      status: "failure",
    });
  }
}

export async function invalidateWorkspaceCache(
  workspaceId: string | undefined
): Promise<void> {
  if (!workspaceId) return;
  await invalidateCache(
    CACHE_KEYS.workspace(workspaceId),
    CACHE_KEYS.projects(workspaceId)
  );
}

export async function invalidateProjectCache(
  projectId: string,
  workspaceId?: string
): Promise<void> {
  const keys = [CACHE_KEYS.project(projectId), CACHE_KEYS.documents(projectId)];
  if (workspaceId) {
    keys.push(CACHE_KEYS.workspace(workspaceId), CACHE_KEYS.projects(workspaceId));
  }
  await invalidateCache(...keys);
}

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = { key }
): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await fn();
  await setCached(key, value, options.ttlSeconds ?? DEFAULT_TTL_SECONDS);
  return value;
}
