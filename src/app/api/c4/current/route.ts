import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const c4 = await prisma.c4.findFirst({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    return NextResponse.json(c4 || { status: 'none' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { status: 'none', error: 'Database unavailable' },
      { status: 500 }
    );
  }
}