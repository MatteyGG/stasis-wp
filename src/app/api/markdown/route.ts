import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pageId, title, short, markdown, category, image, imageAlt } = body;

  try {
    let response;
    if (pageId) {
      response = await prisma.wiki.update({
        where: { pageId: pageId },
        data: {
          title: title,
          short: short,
          md: markdown,
          scr: image,
          alt: imageAlt,
          category: category,
        },
      });
    } else {
      response = await prisma.wiki.create({
        data: {
          title: title,
          short: short,
          md: markdown,
          scr: image,
          alt: imageAlt,
          category: category,
        },
      });
    }
    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  } finally {
    await prisma.$disconnect();
  }
}

