import { NextResponse } from "next/server";
import { prisma } from "../../prisma";

export async function GET() {
  const alerts_array = await prisma.alert.findMany();
  console.log(alerts_array)
  return NextResponse.json({ alerts: alerts_array });
}
