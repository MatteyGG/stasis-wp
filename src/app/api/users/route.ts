import { prisma } from "../../prisma";
export async function GET(request: any) {
  const user_array = await prisma.user.findMany({
    where: { role: { equals: "user" } },
  });
  console.log(user_array);

  return Response.json({ user_array });
}
