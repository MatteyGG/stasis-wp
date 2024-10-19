import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
    const body = await req.json();
  console.log(body);

  const prisma = new PrismaClient();

  try {
    const response = await prisma.wiki.create({
      data: {
        md: body.markdown
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