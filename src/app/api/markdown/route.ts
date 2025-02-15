import { prisma } from "@/app/prisma";
export async function POST(req: Request) {
  const body = await req.json();
  const { pageId, title, short, markdown, category, image, imageAlt } = body;


  try {
    const response = await prisma.wiki.upsert({
      where: { pageId: pageId },
      update: {
        title: title,
        short: short,
        md: markdown,
        scr: image,
        alt: imageAlt,
        category: category,
      },
      create: {
        title: title,
        short: short,
        md: markdown,
        scr: image,
        alt: imageAlt,
        category: category,
      },
    });
    console.log(response);
    return Response.json({ response });
  } catch (error) {
    console.error(error);
    return Response.json({ error });
  } finally {
    await prisma.$disconnect();
  }
}
