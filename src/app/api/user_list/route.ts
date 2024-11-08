import { NextResponse } from "next/server";
import { prisma } from "../../prisma";


export async function GET() {
    const user_array = await prisma.user.findMany();
  return NextResponse.json({ users: user_array });
}
