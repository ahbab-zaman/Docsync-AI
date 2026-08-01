import { NextResponse } from "next/server";
import { healthCheck } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
  const start = Date.now();
  const ok = await healthCheck();

  logger.info("Database health check", {
    action: "checks:database",
    durationMs: Date.now() - start,
    status: ok ? "success" : "failure",
  });

  return NextResponse.json(
    {
      status: ok ? "ok" : "error",
      service: "database",
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
