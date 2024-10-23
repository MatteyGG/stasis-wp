import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
    const body = await req.json();
  console.log(body);

  const prisma = new PrismaClient();

  try {
    const response = await prisma.wiki.create({
      data: {
        autor: body.autor,
        title: body.title,
        category: body.category,
        short: body.short,
        md: body.markdown,
        scr: body.image
      }
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