import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const types: { [key: string]: string } = {
  info: "начал сбор",
  warning: "бьет тревогу",
  officer: "вызывает офицера",
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
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/`,
      options
    );
    const data = await response.json();
    console.log("Message sent:", data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, userId } = body;

  const userinfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      tgref: true,
      username: true,
    },
  });
  if (!userinfo) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  sendText(
    process.env.TELEGRAM_CHAT_ID || "",
    `${
      type === "officer" && userinfo.tgref
        ? `@${userinfo.tgref.split("/").pop()}`
        : ""
    } \nИгрок ${userinfo.username} ${types[type] || "данные потеряны"}`
  );

  return NextResponse.json(
    { alerts: "Tg alert sent", message: "Alerts created successfully" },
    { status: 201 }
  );
}


