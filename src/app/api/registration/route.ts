import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt-ts";


export async function POST(req: Request) {

  const body = await req.json();
  console.log(body);
  const prisma = new PrismaClient();
  const { username, email, password, army, nation } = body;

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
        username: username,
        email: email,
        password: hashedPassword,
        army: army,
        nation: nation
      },
    });

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
