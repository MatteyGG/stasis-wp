import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const pageid = req.url.split("/").pop();

  const markdown = await prisma.wiki.findUnique({
    where: { pageId: pageid },
  });
  await prisma.$disconnect();

  if (!markdown) {
    return new Response(null, { status: 404 });
  }
  return new Response(JSON.stringify(markdown), { status: 200 });
}

export async function PATCH(req: NextRequest) {
  const pageid = req.url.split("/").pop();
  const { published } = await req.json();

  const markdown = await prisma.wiki.update({
    where: { pageId: pageid },
    data: { published },
  });
  await prisma.$disconnect();

  if (!markdown) {
    return new Response(null, { status: 404 });
  }
  return new Response(JSON.stringify(markdown), { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const pageid = req.url.split("/").pop();

  const markdown = await prisma.wiki.delete({
    where: { pageId: pageid },
  });
  await prisma.$disconnect();

  if (!markdown) {
    return new Response(null, { status: 404 });
  }
  return new Response(JSON.stringify(markdown), { status: 200 });
}

