import { NextResponse } from "next/server";
import { snapshotMetrics } from "@/lib/metrics";

export async function GET() {
  return NextResponse.json(snapshotMetrics());
}
