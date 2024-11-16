import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();
    const { type, userId, message } = body;

    const newAlert = await prisma.alert.create({
      data: {
        type: type,
        message: message,
        user: {
          connect: { id: userId },
        },
      },
    });

    await prisma.$disconnect();

    return NextResponse.json(
      { alert: newAlert, message: "Alert created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}