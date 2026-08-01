import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3002";

export async function GET() {
  const start = Date.now();
  let ok = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${SOCKET_URL}/health`, {
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    clearTimeout(timeout);
    ok = res.ok;
  } catch {
    ok = false;
  }

  logger.info("Socket health check", {
    action: "checks:socket",
    durationMs: Date.now() - start,
    status: ok ? "success" : "failure",
  });

  return NextResponse.json(
    {
      status: ok ? "ok" : "error",
      service: "socket",
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
