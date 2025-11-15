// app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1 as result`;

    return NextResponse.json({
      status: "ok",
      db: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Healthcheck error:", error);
    return NextResponse.json(
      {
        status: "error",
        db: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
