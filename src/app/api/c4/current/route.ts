import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const c4 = await prisma.c4.findFirst({
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return NextResponse.json(c4 || { status: "none" });
}
