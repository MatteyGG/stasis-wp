import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user || user.password !== body.password) {
      // Handle invalid login
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    // Handle successful login
    return Response.json({ message: "Login successful" });
  } catch (error) {
    // Handle server error
    console.error("An error occurred during login:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
