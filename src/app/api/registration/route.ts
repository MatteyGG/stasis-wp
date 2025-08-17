import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt-ts";


export async function POST(req: Request) {

  const body = await req.json();
  console.log(body);
  const prisma = new PrismaClient();
  const { gameID, username, email, password, army, nation } = body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return Response.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        gameID: gameID,
        username: username,
        email: email,
        password: hashedPassword,
        army: army,
        nation: nation
      },
    });

    try
    {
      await prisma.player.update({
        where: { id: Number(gameID) },
        data: {
          onSite: true
        }
      })
    }
    catch (error)
    {
      console.log('Нет в базе', error)
    }

    console.log("User created:", newUser);
    await prisma.$disconnect();
    return Response.json(
      { user: newUser, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Something went wrong:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
