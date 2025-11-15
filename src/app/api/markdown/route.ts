import { prisma } from "@/lib/prisma";
import { sendTextByTelegram } from "@/lib/sendTextByTelegram";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, short, markdown, category, image, imageAlt, pageId, tags } =
      body;

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
    const encodedCategory = encodeURIComponent(category);
    const articleLink = `https://stasis-wp.ru/wiki/${encodedCategory}/${newArticle.pageId}`;
    const message =
      `📝 <b>Новая статья!</b>\n\n` +
      `📌 <b>${title}</b>\n` +
      `${short ? `📰 ${short}\n` : ""}` +
      `🏷️ Категория: <b>${category}</b>\n` +
      `🔗 <a href="${articleLink}">Читать</a>`;

    await sendTextByTelegram(
      message,
      { photo: image }
    );

    return Response.json(newArticle);
  } catch (error) {
    console.error("Error saving article:", error);
    return Response.json({ error: "Failed to save article" }, { status: 500 });
  }
}
