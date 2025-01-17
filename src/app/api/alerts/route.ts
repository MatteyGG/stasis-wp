import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const types: { [key: string]: string } = {
  info: "сообщение",
  warning: "предупреждение",
  error: "выговор",
  success: "поощрение",
};

 const sendText = async (chatId: string, text: string) => {
   const data = {
     method: "sendMessage",
     chat_id: chatId,
     text: text,
     parse_mode: "HTML",
   };

   const options: RequestInit = {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(data),
   };

   try {
     const response = await fetch(
       `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`,
       options
     );
     const data = await response.json();
     console.log("Message sent:", data);
   } catch (error) {
     console.error("Error sending message:", error);
   }
 };

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
      const userinfo = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          tgref: true,
          username: true,
        },
      });
      if (!userinfo) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      sendText(
        "-1002488337672",
        `${userinfo.tgref ? `@${userinfo.tgref.split("/").pop()}` : ""} \nИгрок ${
          userinfo.username
        } получил ${types[type] || "сообщение"}: ${message}`
      );
    }


    const newAlerts = await prisma.alert.createMany({
      data: users.map((userId) => ({
        type,
        message,
        userId,
      })),
    });

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
