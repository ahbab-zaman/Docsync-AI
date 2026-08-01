import { NextResponse } from "next/server";
import { healthCheck } from "@/lib/db";
import { redisHealthCheck } from "@/lib/redis";
import { logger } from "@/lib/logger";

export async function GET() {
  const start = Date.now();

  const [db, redis] = await Promise.all([
    healthCheck(),
    redisHealthCheck(),
  ]);

  const status = db && redis ? "healthy" : "degraded";

  logger.info("Health check", {
    action: "health",
    durationMs: Date.now() - start,
    status: status === "healthy" ? "success" : "failure",
  });

  return NextResponse.json(
    {
      status,
      services: {
        database: db ? "up" : "down",
        redis: redis ? "up" : "down",
      },
      timestamp: new Date().toISOString(),
    },
    { status: status === "healthy" ? 200 : 503 }
  );
}
