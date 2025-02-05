import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: NextRequest) {
  const pageid = req.url.split("/").pop();
  const prisma = new PrismaClient();

  const markdown = await prisma.wiki.findUnique({
    where: { pageId: pageid },
  });
  await prisma.$disconnect();

  if (!markdown) {
    return new Response(null, { status: 404 });
  }
  return new Response(JSON.stringify(markdown), { status: 200 });
}

