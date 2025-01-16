import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, userId, message } = body;

    let users;
    if (userId === "all") {
      const allUsers = await prisma.user.findMany();
      users = allUsers.map((user) => user.id);
    } else {
      users = [userId];
    }

    const newAlerts = await prisma.alert.createMany({
      data: users.map((userId) => ({
        type,
        message,
        userId,
      })),
    });

    for (const user of users) {
      sendText('-1002488337672', message);
    }

   

    await prisma.$disconnect();

    return NextResponse.json(
      { alerts: newAlerts, message: "Alerts created successfully" },
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
