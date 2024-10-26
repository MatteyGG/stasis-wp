import { prisma } from "../../prisma";
import { NextResponse } from 'next/server';

export async function GET() {
  const user_array = await prisma.user.findMany({
    where: { role: { equals: "user" } },
  });
  console.log(user_array);

  return NextResponse.json({ user_array });
}