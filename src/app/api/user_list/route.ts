import { NextResponse } from "next/server";
import { prisma } from "../../prisma";


export async function GET() {
    const user_array = await prisma.user.findMany();
  return NextResponse.json({ users: user_array });
}

export const POST = async (req: Request) => {
  try {
    const { id, gameID, ...data } = await req.json();
    console.log(id, gameID, data);
    const response = await prisma.user.updateMany({
      where: {
        id: id ? id : undefined,
        gameID: {
          in: gameID,
        },
      },
      data,
    });

    console.log(response);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
    );
  }
};

export const DELETE = async (req: Request) => {
  console.log("DELETE request received");
  try {
    const { GameId } = await req.json();
    console.log("Parsed GameId:", GameId);
    
    if (!GameId) {
      console.log("No GameId provided");
      return NextResponse.json(
        { error: "You need to provide an id to delete" },
        { status: 400 }
      );
    }

    const response = await prisma.user.delete({
      where: {
        gameID: GameId,
      },
    });

    console.log("User deleted successfully:", response);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
};
