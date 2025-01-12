import { NextResponse } from "next/server";
import { prisma } from "../../prisma";


export async function GET() {
    const user_array = await prisma.user.findMany();
  return NextResponse.json({ users: user_array });
}

export const POST = async (req: Request) => {
  try {
    const { id, gameID, ...data } = await req.json();

    await prisma.user.updateMany({
      where: {
        id: id ? id : undefined,
        gameID: gameID ? gameID : undefined,
      },
      data,
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
    );
  }
};

