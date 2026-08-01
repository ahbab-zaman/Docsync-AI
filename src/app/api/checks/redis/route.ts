import { NextResponse } from "next/server";
import { redisHealthCheck } from "@/lib/redis";
import { logger } from "@/lib/logger";

export async function GET() {
  const start = Date.now();
  const ok = await redisHealthCheck();

  logger.info("Redis health check", {
    action: "checks:redis",
    durationMs: Date.now() - start,
    status: ok ? "success" : "failure",
  });

  return NextResponse.json(
    {
      status: ok ? "ok" : "error",
      service: "redis",
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
