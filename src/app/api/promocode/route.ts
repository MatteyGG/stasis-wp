import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const promocodes = await prisma.promocode.findMany();

    await prisma.$disconnect();

    return NextResponse.json(
      { data: promocodes }
    );
  } catch (error) {
    console.error("Error getting promocodes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();
    const { code, until } = body;

    const newPromocode = await prisma.promocode.create({
      data: {
        code: code,
        until: new Date(until),

      },
    });

    await prisma.$disconnect();

    return NextResponse.json(
      { promocode: newPromocode, message: "Promocode created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating promocode:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

