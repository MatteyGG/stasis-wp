import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();
    const { status, players, map, link } = body;

    const newC4 = await prisma.c4.upsert({
      where: {
        id: 1,
      },
      update: {
        status,
        players,
        map,
        link,
      },
      create: {
        id: 1,
        status,
        players,
        map,
        link,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json(
      { c4: newC4, message: "C4 created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating C4:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const prisma = new PrismaClient();

  try {
    let c4 = await prisma.c4.findUnique({
      where: {
        id: 1,
      },
    });

    if (!c4) {
      c4 = await prisma.c4.create({
        data: {
          id: 1,
          status: "defaultStatus",
          players: "50",
          map: "defaultMap",
          link: "defaultLink",
        },
      });
    }

    await prisma.$disconnect();

    return NextResponse.json(
      { c4 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting C4:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

