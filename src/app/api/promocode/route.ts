import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sendText = async (chatId: string, text: string) => {
  const data = {
    method: "sendMessage",
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
  };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const json = await response.json();
    console.log("Promocode message sent:", json);
  } catch (error) {
    console.error("Error sending promocode message:", error);
  }
};

function formatDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const promocodes = await prisma.promocode.findMany();

    await prisma.$disconnect();

    return NextResponse.json({ data: promocodes });
  } catch (error) {
    console.error("Error getting promocodes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, until } = body;

    const newPromocode = await prisma.promocode.create({
      data: {
        code,
        until: new Date(until),
      },
    });

    // Отправляем уведомление в Telegram
    await sendText(
      process.env.TELEGRAM_CHAT_ID || "",
      ` <b>В игру добавлен новый промокод</b>\n\n` +
        `Код: <code>${newPromocode.code}</code>\n` +
        `Действует до: <b>${
          newPromocode.until ? formatDate(newPromocode.until) : "не указано"
        }</b>\n\n` +
        `🔗 <a href="https://stasis-wp.ru/promocodes">Введите промокод здесь</a>`
    );

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
  } finally {
    await prisma.$disconnect();
  }
}
