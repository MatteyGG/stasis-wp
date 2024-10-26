import { prisma } from "../../prisma";
export async function GET(req: Request) {
  const user_array = await prisma.user.findMany({
    where: { id: { equals: req.params.id } },
  });
  console.log(user_array);

  return Response.json({ user_array });
}