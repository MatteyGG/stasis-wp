import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  try {
    const { id, ...data } = await req.json();

    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

