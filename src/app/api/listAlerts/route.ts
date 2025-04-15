import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const alerts_array = await prisma.alert.findMany();
  return NextResponse.json({ alerts: alerts_array });
}
