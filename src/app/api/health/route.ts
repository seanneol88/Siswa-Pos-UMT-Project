import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "siswa-pos-web",
    timestamp: new Date().toISOString(),
  });
}
