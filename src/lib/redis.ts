import Redis from "ioredis";
import { logger } from "@/lib/logger";

let client: Redis | null = null;
let redisAvailable = false;
let connectionAttempted = false;

const REDIS_URL = process.env.REDIS_URL ?? "";

function isRedisConfigured(): boolean {
  return Boolean(REDIS_URL);
}

function createClient(): Redis {
  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 2,
    connectTimeout: 3000,
    lazyConnect: true,
    enableOfflineQueue: true,
    retryStrategy: (times) => {
      if (times > 3) {
        logger.warn("[Redis] Giving up reconnection attempts");
        return null;
      }
      return Math.min(times * 500, 2000);
    },
  });

  redis.on("connect", () => {
    redisAvailable = true;
    logger.info("[Redis] Connected");
  });

  redis.on("ready", () => {
    redisAvailable = true;
    logger.info("[Redis] Ready");
  });

  redis.on("error", (err) => {
    redisAvailable = false;
    logger.warn("[Redis] Error", {
      message: err.message,
      action: "redis:error",
      status: "failure",
    });
  });

  redis.on("close", () => {
    redisAvailable = false;
  });

  return redis;
}

function ensureClient(): Redis | null {
  if (!isRedisConfigured()) {
    return null;
  }
  if (!client) {
    client = createClient();
  }
  return client;
}

export function isRedisAvailable(): boolean {
  return redisAvailable && Boolean(client) && client!.status === "ready";
}

export async function connectRedis(): Promise<boolean> {
  if (!isRedisConfigured()) {
    logger.warn("[Redis] No REDIS_URL configured, cache disabled");
    redisAvailable = false;
    return false;
  }

  if (connectionAttempted && client) {
    return isRedisAvailable();
  }

  connectionAttempted = true;
  const redis = ensureClient();
  if (!redis) return false;

  try {
    await redis.connect();
    await redis.ping();
    redisAvailable = true;
    logger.info("[Redis] Connection verified");
    return true;
  } catch (error) {
    redisAvailable = false;
    logger.warn("[Redis] Connection failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      action: "redis:connect",
      status: "failure",
    });
    return false;
  }
}

export async function getRedis(): Promise<Redis | null> {
  const redis = ensureClient();
  if (!redis) return null;
  if (!connectionAttempted) {
    await connectRedis();
  }
  return isRedisAvailable() ? redis : null;
}

export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit().catch(() => {});
    client = null;
    redisAvailable = false;
  }
}

export async function redisHealthCheck(): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;
  try {
    const result = await redis.ping();
    return result === "PONG";
  } catch {
    return false;
  }
}
