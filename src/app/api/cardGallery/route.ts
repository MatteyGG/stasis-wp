import { PrismaClient } from "@prisma/client";

export async function PUT(req : Request) {
  const prisma = new PrismaClient();

  const array = await prisma.wiki.findMany();

  console.log(array);

  await prisma.$disconnect();
  return Response.json(
    { array }
  );
}
