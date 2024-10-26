import { prisma } from "../../prisma";
export async function GET() {
  const user_array = await prisma.user.findMany({
    where: { role: { equals: "user" } },
  });
  console.log(user_array);

  return Response.json({ user_array });
}
