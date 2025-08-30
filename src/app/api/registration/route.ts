import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt-ts";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { gameID, username, email, password } = body;

  try {
    // Проверяем существование пользователя с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { message: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Проверяем существование игрока в базе
    let player = await prisma.player.findUnique({
      where: { id: gameID },
    });

    // Если игрока нет в базе, получаем данные из API Warpath
    if (!player) {
      // Запрос к Warpath API
      const warpathResponse = await fetch(`https://yx.dmzgame.com/intl_warpath/pid_detail?pid=${gameID}&page=1&perPage=1`);
      
      if (!warpathResponse.ok) {
        return Response.json(
          { message: "Игрок не найден в игре" },
          { status: 404 }
        );
      }

      const warpathData = await warpathResponse.json();

      if (!warpathData.Data || warpathData.Data.length === 0) {
        return Response.json(
          { message: "Игрок не найден в игре" },
          { status: 404 }
        );
      }

      const rawPlayer = warpathData.Data[0];
      console.log(rawPlayer);
      
      // Создаем игрока с данными из API
      player = await prisma.player.create({
        data: {
          id: gameID,
          warpathId: rawPlayer.pid,
          username: rawPlayer.nick,
          ally: rawPlayer.gnick,
          power: rawPlayer.power,
          kill: rawPlayer.sumkill,
          die: rawPlayer.die,
          kd: rawPlayer.sumkill / rawPlayer.die,
          resourceCollection: rawPlayer.caiji,
          techPower: rawPlayer.powers.tech,
          airPower: rawPlayer.powers.army_air,
          navyPower: rawPlayer.powers.army_navy,
          groundPower: rawPlayer.powers.army_ground,

          onSite: true
        }
      });
    } else {
      // Обновляем существующего игрока
      await prisma.player.update({
        where: { id: gameID },
        data: { onSite: true }
      });
    }

    // Создаем пользователя
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        gameID,
        username,
        email,
        password: hashedPassword,
      },
    });

    return Response.json(
      { user: newUser, message: "Пользователь успешно создан" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}