import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, short, markdown, category, image, imageAlt, pageId, tags } = body;

    // Если pageId указан, обновляем существующую статью
    if (pageId) {
      const updatedArticle = await prisma.wiki.update({
        where: { pageId },
        data: {
          title,
          short,
          md: markdown,
          category,
          scr: image,
          alt: imageAlt,
          tags: tags || [],
        },
      });

      return Response.json(updatedArticle);
    }

    // Создаем новую статью
    const newArticle = await prisma.wiki.create({
      data: {
        title,
        short,
        md: markdown,
        category,
        scr: image,
        alt: imageAlt,
        pageId: Math.random().toString(36).substring(2, 10), // Генерируем случайный pageId
        tags: tags || [],
      },
    });

    return Response.json(newArticle);
  } catch (error) {
    console.error("Error saving article:", error);
    return Response.json({ error: "Failed to save article" }, { status: 500 });
  }
}