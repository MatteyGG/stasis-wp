// app/api/c4/start/route.ts

import { lastDate } from "@/lib/getDate";
import { prisma } from "@/lib/prisma";
import { WarpathPlayer } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { map } = await req.json();
  
  try {
    const date = await lastDate();
    const url = `https://yx.dmzgame.com/intl_warpath/rank_pid?day=${date}&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Warpath API error");
    
    const data = await response.json();
    
    // Фильтрация игроков нужного альянса
    const targetAlliance = "ST";
    const stPlayers = data.Data
      .filter((p: WarpathPlayer) => p.gnick === targetAlliance)
      .map((p: WarpathPlayer) => ({
        warpathId: p.pid,
        username: p.nick,
        ally: p.gnick,
        power: p.maxpower,
        kill: p.sumkill,
        die: p.die,
        kd: parseFloat((p.sumkill / (p.die || 1)).toFixed(2)),
        resourceCollection: BigInt(p.caiji || 0),
      }));

    // Создаем новое событие C4
    const newC4 = await prisma.c4.create({
      data: {
        id: `c4_${Date.now()}`,
        map,
        status: "active",
        startedAt: new Date(),
      },
    });

    // Создаем снапшоты и статистику
    const statisticsData = [];
    
    for (const player of stPlayers) {
      // Проверяем существование игрока в базе
      const existingPlayer = await prisma.player.findUnique({
        where: { warpathId: player.warpathId }
      });

      // Создаем снапшот
      await prisma.playerSnapshot.create({
        data: {
          warpathId: player.warpathId,
          playerId: existingPlayer?.id || null,
          c4Id: newC4.id,
          username: player.username,
          power: player.power,
          kill: player.kill,
          die: player.die,
          kd: player.kd,
          resourceCollection: player.resourceCollection,
        }
      });

      // Подготавливаем данные для статистики
      statisticsData.push({
        c4Id: newC4.id,
        warpathId: player.warpathId,
        username: player.username,
        startPower: player.power,
        startKill: player.kill,
        startDie: player.die,
        startKd: player.kd,
        startResourceCollection: player.resourceCollection,
        playerId: existingPlayer?.id || null
      });
    }

    // Создаем записи статистики
    await prisma.c4Statistic.createMany({
      data: statisticsData
    });

    return NextResponse.json({ ...newC4, playersCount: stPlayers.length });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to start C4: " + (error as Error).message },
      { status: 500 }
    );
  }
}