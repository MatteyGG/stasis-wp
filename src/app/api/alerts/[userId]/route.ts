import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: NextRequest) {
  const userId = req.url.split("/").pop();
  const prisma = new PrismaClient();

  const alerts = await prisma.alert.findMany({
    where: userId ? { userId: userId } : undefined,
  });
  if (!alerts) {
    return NextResponse.error();
  }
  return NextResponse.json(alerts);
}